import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { users, wallets, referrals, emailVerifications } from '$lib/db/schema';
import { nanoid, genReferralCode, genRef } from '$lib/server/utils';
import { getLucia } from '$lib/auth/lucia';
import { sendEmail, verifyEmailHtml } from '$lib/server/email';
import { hashPassword } from '$lib/server/password';

const registerSchema = z.object({
	username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, underscores'),
	email: z.string().email(),
	password: z.string().min(8, 'At least 8 characters'),
	ref: z.string().optional()
});

export const load: PageServerLoad = async ({ locals, url }) => {
	if (locals.user) throw redirect(303, '/');
	return { ref: url.searchParams.get('ref') ?? '' };
};

export const actions: Actions = {
	default: async ({ request, locals, cookies, platform }) => {
		const fd = await request.formData();
		const raw = {
			username: fd.get('username'),
			email: fd.get('email'),
			password: fd.get('password'),
			ref: fd.get('ref') ?? ''
		};

		const parsed = registerSchema.safeParse(raw);
		if (!parsed.success) {
			const errors = parsed.error.flatten().fieldErrors;
			return fail(400, { errors, values: raw });
		}

		const { username, email, password, ref } = parsed.data;
		const db = locals.db;

		// Check unique
		const existing = await db
			.select()
			.from(users)
			.where(eq(users.email, email.toLowerCase()));
		if (existing.length > 0) return fail(400, { errors: { email: ['Email already registered'] }, values: raw });

		const existingUser = await db
			.select()
			.from(users)
			.where(eq(users.username, username));
		if (existingUser.length > 0) return fail(400, { errors: { username: ['Username taken'] }, values: raw });

		// Hash password (PBKDF2 via WebCrypto — works on Cloudflare Workers + Node)
		const passwordHash = await hashPassword(password);

		// Find referrer
		let referrerId: string | undefined;
		if (ref) {
			const [referrer] = await db.select().from(users).where(eq(users.referralCode, ref)).limit(1);
			if (referrer) referrerId = referrer.id;
		}

		const userId = nanoid();
		const walletId = nanoid();

		await db.insert(users).values({
			id: userId,
			username,
			email: email.toLowerCase(),
			passwordHash,
			referralCode: genReferralCode(),
			referredBy: referrerId
		});

		await db.insert(wallets).values({
			id: walletId,
			userId
		});

		// Store referral link
		if (referrerId) {
			await db.insert(referrals).values({
				id: nanoid(),
				referrerId,
				referredId: userId
			});
		}

		// Send email verification
		const token = genRef() + nanoid();
		const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
		await db.insert(emailVerifications).values({
			id: nanoid(),
			userId,
			token,
			expiresAt
		});

		const appUrl = platform?.env?.APP_URL ?? 'http://localhost:5173';
		const verifyUrl = `${appUrl}/auth/verify-email?token=${token}`;

		try {
			const apiKey = platform?.env?.BREVO_API_KEY ?? process.env.BREVO_API_KEY ?? '';
			if (apiKey) {
				await sendEmail({ to: email, subject: 'Verify your Rakatoss account', html: verifyEmailHtml(username, verifyUrl) }, apiKey);
			}
		} catch {
			// Non-fatal — user can request resend
		}

		return { success: true, message: 'Account created! Check your email to verify.' };
	}
};
