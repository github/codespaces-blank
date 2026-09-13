import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { eq } from 'drizzle-orm';
import { users } from '$lib/db/schema';
import { encryptSecret } from '$lib/server/totp';
import { getLucia } from '$lib/auth/lucia';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(303, '/auth/login');
	if (!locals.user.isStaff) throw redirect(303, '/');

	// Generate TOTP secret
	const { generateTOTPKey } = await import('@oslojs/otp');
	const secretBytes = generateTOTPKey();
	const secret = Buffer.from(secretBytes).toString('base64');

	const appName = 'Rakatoss';
	const otpauthUrl = `otpauth://totp/${encodeURIComponent(appName)}:${encodeURIComponent(locals.user.username)}?secret=${secret}&issuer=${encodeURIComponent(appName)}&algorithm=SHA1&digits=6&period=30`;

	return { otpauthUrl, secret };
};

export const actions: Actions = {
	default: async ({ request, locals, cookies }) => {
		if (!locals.user || !locals.session) return fail(401, { error: 'Not authenticated' });

		const fd = await request.formData();
		const code = fd.get('code')?.toString() ?? '';
		const secret = fd.get('secret')?.toString() ?? '';

		try {
			const { verifyTOTP } = await import('@oslojs/otp');
			const secretBytes = Buffer.from(secret, 'base64');
			const valid = verifyTOTP(new Uint8Array(secretBytes), 30, 6, code);
			if (!valid) return fail(400, { error: 'Invalid code. Scan again and try.', secret });
		} catch {
			return fail(400, { error: 'Verification failed.', secret });
		}

		// Encrypt and save
		const encrypted = encryptSecret(secret);
		await locals.db
			.update(users)
			.set({ totpSecret: encrypted })
			.where(eq(users.id, locals.user.id));

		// Create 2FA-verified session
		const lucia = getLucia(locals.db);
		await lucia.invalidateSession(locals.session.id);
		const newSession = await lucia.createSession(locals.user.id, { is_two_factor_verified: true });
		const cookie = lucia.createSessionCookie(newSession.id);
		cookies.set(cookie.name, cookie.value, { path: '.', ...cookie.attributes });

		throw redirect(303, '/admin');
	}
};
