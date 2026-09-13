import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { eq } from 'drizzle-orm';
import { users } from '$lib/db/schema';
import { getLucia } from '$lib/auth/lucia';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(303, '/auth/login');
	if (locals.session?.isTwoFactorVerified) throw redirect(303, '/admin');

	const [user] = await locals.db.select().from(users).where(eq(users.id, locals.user.id)).limit(1);
	const needs2FASetup = !user?.totpSecret;

	if (needs2FASetup) throw redirect(303, '/admin/setup-2fa');

	return {};
};

export const actions: Actions = {
	default: async ({ request, locals, cookies }) => {
		if (!locals.user || !locals.session) return fail(401, { error: 'Not logged in' });

		const fd = await request.formData();
		const code = fd.get('code')?.toString() ?? '';

		const [user] = await locals.db.select().from(users).where(eq(users.id, locals.user.id)).limit(1);
		if (!user?.totpSecret) throw redirect(303, '/admin/setup-2fa');

		// Decrypt secret and verify TOTP
		try {
			const { verifyTOTP } = await import('@oslojs/otp');
			const { decryptSecret } = await import('$lib/server/totp');
			const secret = decryptSecret(user.totpSecret);
			const valid = verifyTOTP(secret, 30, 6, code);
			if (!valid) return fail(400, { error: 'Invalid code. Try again.' });
		} catch (e) {
			return fail(400, { error: 'Verification failed.' });
		}

		// Update session to mark 2FA verified
		const lucia = getLucia(locals.db);
		await lucia.invalidateSession(locals.session.id);
		const newSession = await lucia.createSession(locals.user.id, { is_two_factor_verified: true });
		const cookie = lucia.createSessionCookie(newSession.id);
		cookies.set(cookie.name, cookie.value, { path: '.', ...cookie.attributes });

		throw redirect(303, '/admin');
	}
};
