import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { eq } from 'drizzle-orm';
import { users } from '$lib/db/schema';

export const load: PageServerLoad = async ({ params, locals }) => {
	// Validate referral code exists
	const [user] = await locals.db
		.select()
		.from(users)
		.where(eq(users.referralCode, params.code))
		.limit(1);

	if (user) {
		throw redirect(303, `/auth/register?ref=${params.code}`);
	}

	throw redirect(303, '/auth/register');
};
