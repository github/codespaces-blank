import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { eq } from 'drizzle-orm';
import { matches, bets } from '$lib/db/schema';
import { settleMatch, cancelMatch, getPoolTotals } from '$lib/server/match';

export const load: PageServerLoad = async ({ params, locals }) => {
	const [match] = await locals.db.select().from(matches).where(eq(matches.id, params.id)).limit(1);
	if (!match) throw error(404, 'Match not found');

	const pool = await getPoolTotals(locals.db, match.id);
	const allBets = await locals.db.select().from(bets).where(eq(bets.matchId, match.id));

	return { match, pool, bets: allBets };
};

export const actions: Actions = {
	lock: async ({ params, locals }) => {
		await locals.db.update(matches).set({ status: 'locked' }).where(eq(matches.id, params.id));
		return { success: true };
	},
	settle_heads: async ({ params, locals }) => {
		try {
			await settleMatch(locals.db, params.id, 'heads');
		} catch (e: any) {
			return fail(400, { error: e.message });
		}
		return { success: true };
	},
	settle_tails: async ({ params, locals }) => {
		try {
			await settleMatch(locals.db, params.id, 'tails');
		} catch (e: any) {
			return fail(400, { error: e.message });
		}
		return { success: true };
	},
	cancel: async ({ params, locals }) => {
		try {
			await cancelMatch(locals.db, params.id);
		} catch (e: any) {
			return fail(400, { error: e.message });
		}
		return { success: true };
	}
};
