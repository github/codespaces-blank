import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { users } from '$lib/db/schema';
import { getLucia } from '$lib/auth/lucia';
import { verifyPassword } from '$lib/server/password';

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1)
});

export const load: PageServerLoad = async ({ locals, url }) => {
	if (locals.user) throw redirect(303, url.searchParams.get('next') ?? '/');
	return { next: url.searchParams.get('next') ?? '/' };
};

export const actions: Actions = {
	default: async ({ request, locals, cookies, url }) => {
		const fd = await request.formData();
		const raw = { email: fd.get('email'), password: fd.get('password') };
		const next = fd.get('next')?.toString() ?? '/';

		const parsed = loginSchema.safeParse(raw);
		if (!parsed.success) return fail(400, { error: 'Invalid credentials', email: raw.email });

		const { email, password } = parsed.data;
		const db = locals.db;

		const [user] = await db
			.select()
			.from(users)
			.where(eq(users.email, email.toLowerCase()))
			.limit(1);

		if (!user) return fail(400, { error: 'Invalid email or password', email });

		if (!user.isActive) return fail(403, { error: 'Account is suspended. Contact support.', email });

		// Verify password
		const valid = await verifyPassword(password, user.passwordHash);

		if (!valid) return fail(400, { error: 'Invalid email or password', email });

		if (!user.emailVerified) {
			return fail(400, { error: 'Please verify your email first. Check your inbox.', email });
		}

		const lucia = getLucia(db);
		const session = await lucia.createSession(user.id, { is_two_factor_verified: false });
		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies.set(sessionCookie.name, sessionCookie.value, { path: '.', ...sessionCookie.attributes });

		// Redirect admins to 2FA verify
		if (user.isStaff) {
			throw redirect(303, '/admin/verify-otp');
		}

		throw redirect(303, next.startsWith('/') ? next : '/');
	}
};
