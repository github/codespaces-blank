import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { bets, matches } from '$lib/db/schema';
import { desc, eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.user) throw redirect(303, '/auth/login');

	const page = parseInt(url.searchParams.get('page') ?? '1', 10);
	const limit = 20;
	const offset = (page - 1) * limit;

	const rows = await locals.db
		.select({ bet: bets, match: matches })
		.from(bets)
		.leftJoin(matches, eq(bets.matchId, matches.id))
		.where(eq(bets.userId, locals.user.id))
		.orderBy(desc(bets.placedAt))
		.limit(limit + 1)
		.offset(offset);

	return {
		bets: rows.slice(0, limit),
		page,
		hasNext: rows.length > limit,
		hasPrev: page > 1
	};
};
