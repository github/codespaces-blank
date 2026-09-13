import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod';
import { and, eq } from 'drizzle-orm';
import { matches, bets, wallets } from '$lib/db/schema';
import { debit } from '$lib/server/wallet';
import { createNotification } from '$lib/server/notify';
import { nanoid } from '$lib/server/utils';
import { getPoolTotals } from '$lib/server/match';

export const load: PageServerLoad = async ({ params, locals }) => {
	const [match] = await locals.db
		.select()
		.from(matches)
		.where(eq(matches.id, params.id))
		.limit(1);

	if (!match) throw error(404, 'Match not found');

	const pool = await getPoolTotals(locals.db, match.id);

	let userBet = null;
	let walletBalance = 0;
	if (locals.user) {
		const [bet] = await locals.db
			.select()
			.from(bets)
			.where(and(eq(bets.userId, locals.user.id), eq(bets.matchId, match.id)))
			.limit(1);
		userBet = bet ?? null;

		const [wallet] = await locals.db
			.select()
			.from(wallets)
			.where(eq(wallets.userId, locals.user.id))
			.limit(1);
		walletBalance = wallet?.balance ?? 0;
	}

	return { match, pool, userBet, walletBalance };
};

export const actions: Actions = {
	bet: async ({ request, params, locals }) => {
		if (!locals.user) throw redirect(303, '/auth/login');

		const fd = await request.formData();
		const schema = z.object({
			side: z.enum(['heads', 'tails']),
			amount: z.coerce.number().positive()
		});

		const parsed = schema.safeParse({ side: fd.get('side'), amount: fd.get('amount') });
		if (!parsed.success) return fail(400, { error: 'Invalid bet data' });

		const { side, amount } = parsed.data;
		const db = locals.db;

		const [match] = await db.select().from(matches).where(eq(matches.id, params.id)).limit(1);
		if (!match) return fail(404, { error: 'Match not found' });
		if (match.status !== 'open') return fail(400, { error: 'Betting is closed for this match' });
		if (amount < match.minBet) return fail(400, { error: `Minimum bet is ${match.minBet} coins` });
		if (amount > match.maxBet) return fail(400, { error: `Maximum bet is ${match.maxBet} coins` });

		// Check if already bet
		const [existing] = await db
			.select()
			.from(bets)
			.where(and(eq(bets.userId, locals.user.id), eq(bets.matchId, match.id)))
			.limit(1);
		if (existing) return fail(400, { error: 'You already placed a bet on this match' });

		// Deduct coins
		try {
			await debit(db, locals.user.id, amount, `Bet on match: ${match.title} (${side})`);
		} catch (e: any) {
			return fail(400, { error: e.message });
		}

		await db.insert(bets).values({
			id: nanoid(),
			userId: locals.user.id,
			matchId: match.id,
			side,
			amount
		});

		return { success: true };
	}
};
