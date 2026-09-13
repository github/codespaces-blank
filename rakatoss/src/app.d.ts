// See https://svelte.dev/docs/kit/types#app.d.ts

import type { Db } from '$lib/db/client';

declare global {
	namespace App {
		interface Locals {
			db: Db;
			user: import('lucia').User | null;
			session: import('lucia').Session | null;
		}
		interface Platform {
			env: {
				KV: KVNamespace;
				TURSO_URL: string;
				TURSO_AUTH_TOKEN: string;
				CLOUDINARY_CLOUD_NAME: string;
				CLOUDINARY_API_KEY: string;
				CLOUDINARY_API_SECRET: string;
				BREVO_API_KEY: string;
				UPI_ID: string;
				COIN_RUPEE_RATE: string;
				REFERRAL_BONUS_COINS: string;
				APP_URL: string;
				TOTP_ENCRYPTION_KEY: string;
			};
		}
	}
}

export {};
