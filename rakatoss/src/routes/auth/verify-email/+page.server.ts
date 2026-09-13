import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { eq } from 'drizzle-orm';
import { emailVerifications, users } from '$lib/db/schema';
import { getLucia } from '$lib/auth/lucia';

export const load: PageServerLoad = async ({ url, locals, cookies }) => {
	const token = url.searchParams.get('token');
	if (!token) return { error: 'Missing token.' };

	const db = locals.db;
	const [ev] = await db
		.select()
		.from(emailVerifications)
		.where(eq(emailVerifications.token, token))
		.limit(1);

	if (!ev) return { error: 'Invalid or expired link.' };
	if (ev.usedAt) return { error: 'Link already used.' };
	if (new Date(ev.expiresAt) < new Date()) return { error: 'Link expired. Request a new one.' };

	// Mark used + verify user
	await db
		.update(emailVerifications)
		.set({ usedAt: new Date().toISOString() })
		.where(eq(emailVerifications.id, ev.id));

	await db.update(users).set({ emailVerified: true }).where(eq(users.id, ev.userId));

	// Auto-login
	const lucia = getLucia(db);
	const session = await lucia.createSession(ev.userId, { is_two_factor_verified: false });
	const cookie = lucia.createSessionCookie(session.id);
	cookies.set(cookie.name, cookie.value, { path: '.', ...cookie.attributes });

	throw redirect(303, '/?verified=1');
};
