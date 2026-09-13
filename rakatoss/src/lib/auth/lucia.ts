import { Lucia } from 'lucia';
import { LibSQLAdapter } from '@lucia-auth/adapter-sqlite';
import type { Db } from '$lib/db/client';
import type { User } from '$lib/db/schema';

let _lucia: ReturnType<typeof initLucia> | null = null;

function initLucia(db: Db) {
	// @ts-expect-error — LibSQLAdapter accepts the drizzle client
	const adapter = new LibSQLAdapter(db.$client, {
		user: 'users',
		session: 'sessions'
	});

	return new Lucia(adapter, {
		sessionCookie: {
			attributes: {
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict'
			}
		},
		sessionExpiresIn: {
			// 7 days
			activePeriod: 1000 * 60 * 60 * 24 * 7,
			idlePeriod: 1000 * 60 * 60 * 24 * 7
		},
		getUserAttributes(attrs) {
			return {
				username: attrs.username,
				email: attrs.email,
				emailVerified: attrs.email_verified,
				isStaff: attrs.is_staff,
				isSuperadmin: attrs.is_superadmin,
				isActive: attrs.is_active,
				referralCode: attrs.referral_code
			};
		}
	});
}

export function getLucia(db: Db) {
	if (!_lucia) _lucia = initLucia(db);
	return _lucia;
}

declare module 'lucia' {
	interface Register {
		Lucia: ReturnType<typeof initLucia>;
		DatabaseUserAttributes: {
			username: string;
			email: string;
			email_verified: boolean;
			is_staff: boolean;
			is_superadmin: boolean;
			is_active: boolean;
			referral_code: string;
		};
		DatabaseSessionAttributes: {
			is_two_factor_verified: boolean;
		};
	}
}
