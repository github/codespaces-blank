import { getDb } from '$lib/db/client';
import { getLucia } from '$lib/auth/lucia';
import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { adminRoles, users } from '$lib/db/schema';
import { sequence } from '@sveltejs/kit/hooks';

/** Inject DB + resolve Lucia session on every request */
const handleDb: Handle = async ({ event, resolve }) => {
	// Inject DB (reads env from platform or process.env)
	const envVars = event.platform?.env;
	const db = getDb(
		envVars
			? { TURSO_URL: envVars.TURSO_URL, TURSO_AUTH_TOKEN: envVars.TURSO_AUTH_TOKEN }
			: undefined
	);
	event.locals.db = db;

	// Resolve session
	const lucia = getLucia(db);
	const sessionId = event.cookies.get(lucia.sessionCookieName);

	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await lucia.validateSession(sessionId);

	if (session && session.fresh) {
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}
	if (!session) {
		const blankCookie = lucia.createBlankSessionCookie();
		event.cookies.set(blankCookie.name, blankCookie.value, {
			path: '.',
			...blankCookie.attributes
		});
	}

	event.locals.user = user;
	event.locals.session = session;

	return resolve(event);
};

/** Guard /admin/* routes */
const handleAdminGuard: Handle = async ({ event, resolve }) => {
	const path = event.url.pathname;

	if (!path.startsWith('/admin')) return resolve(event);

	const user = event.locals.user;
	if (!user) throw redirect(303, `/auth/login?next=${encodeURIComponent(path)}`);
	if (!user.isStaff) throw redirect(303, '/');

	// Block inactive users everywhere
	if (!user.isActive) throw redirect(303, '/blocked');

	// 2FA check for admin routes (bypass setup + verify pages)
	const is2FAExempt =
		path === '/admin/setup-2fa' ||
		path === '/admin/verify-otp' ||
		path.startsWith('/admin/setup-2fa') ||
		path.startsWith('/admin/verify-otp');

	if (!is2FAExempt && !event.locals.session?.isTwoFactorVerified) {
		throw redirect(303, '/admin/verify-otp');
	}

	return resolve(event);
};

/** Guard authenticated user routes */
const handleAuthGuard: Handle = async ({ event, resolve }) => {
	const path = event.url.pathname;
	const publicPaths = ['/auth/', '/r/', '/blocked'];
	const isPublic = publicPaths.some((p) => path.startsWith(p)) || path === '/';

	if (!isPublic) return resolve(event);

	const user = event.locals.user;
	if (user && !user.isActive && path !== '/blocked') {
		throw redirect(303, '/blocked');
	}

	return resolve(event);
};

export const handle = sequence(handleDb, handleAdminGuard, handleAuthGuard);
