import { eq, and, sum } from 'drizzle-orm';
import { matches, bets, wallets } from '$lib/db/schema';
import { credit } from '$lib/server/wallet';
import { createNotification } from '$lib/server/notify';
import type { Db } from '$lib/db/client';

export async function getPoolTotals(db: Db, matchId: string) {
	const allBets = await db
		.select()
		.from(bets)
		.where(and(eq(bets.matchId, matchId), eq(bets.status, 'pending')));

	const heads = allBets.filter((b) => b.side === 'heads').reduce((a, b) => a + b.amount, 0);
	const tails = allBets.filter((b) => b.side === 'tails').reduce((a, b) => a + b.amount, 0);

	return { heads, tails, total: heads + tails };
}

export async function settleMatch(db: Db, matchId: string, winningSide: 'heads' | 'tails') {
	const [match] = await db.select().from(matches).where(eq(matches.id, matchId)).limit(1);
	if (!match) throw new Error('Match not found');
	if (match.status !== 'locked' && match.status !== 'open')
		throw new Error('Match is not in a settleable state');

	const allBets = await db
		.select()
		.from(bets)
		.where(and(eq(bets.matchId, matchId), eq(bets.status, 'pending')));

	const winBets = allBets.filter((b) => b.side === winningSide);
	const loseBets = allBets.filter((b) => b.side !== winningSide);

	const winningPool = winBets.reduce((a, b) => a + b.amount, 0);
	const losingPool = loseBets.reduce((a, b) => a + b.amount, 0);
	const houseCut = (losingPool * match.houseEdge) / 100;
	const prizePool = losingPool - houseCut;

	// Credit winners
	for (const bet of winBets) {
		const payout =
			winningPool > 0
				? bet.amount + (bet.amount / winningPool) * prizePool
				: bet.amount; // edge case: no one else bet

		await db.update(bets).set({ status: 'won', payout }).where(eq(bets.id, bet.id));

		await credit(db, bet.userId, payout, `Won bet on match: ${match.title} (${winningSide})`);

		await createNotification(db, {
			userId: bet.userId,
			title: '🎉 You won!',
			body: `You won ${Math.floor(payout)} coins on "${match.title}". ${winningSide.toUpperCase()} was the winner!`,
			kind: 'success',
			link: `/matches/${matchId}`
		});
	}

	// Mark losing bets
	for (const bet of loseBets) {
		await db.update(bets).set({ status: 'lost', payout: 0 }).where(eq(bets.id, bet.id));

		await createNotification(db, {
			userId: bet.userId,
			title: '😔 Better luck next time',
			body: `Your bet on "${match.title}" lost. ${winningSide.toUpperCase()} won.`,
			kind: 'warning',
			link: `/matches/${matchId}`
		});
	}

	// Update match status
	await db
		.update(matches)
		.set({ status: 'settled', winningSide, settledAt: new Date().toISOString() })
		.where(eq(matches.id, matchId));
}

export async function cancelMatch(db: Db, matchId: string) {
	const [match] = await db.select().from(matches).where(eq(matches.id, matchId)).limit(1);
	if (!match) throw new Error('Match not found');
	if (match.status === 'settled' || match.status === 'cancelled')
		throw new Error('Cannot cancel this match');

	const allBets = await db
		.select()
		.from(bets)
		.where(and(eq(bets.matchId, matchId), eq(bets.status, 'pending')));

	for (const bet of allBets) {
		await db.update(bets).set({ status: 'refunded', payout: bet.amount }).where(eq(bets.id, bet.id));
		await credit(db, bet.userId, bet.amount, `Refund — match cancelled: ${match.title}`);
		await createNotification(db, {
			userId: bet.userId,
			title: 'Match Cancelled — Refund Issued',
			body: `"${match.title}" was cancelled. ${bet.amount} coins refunded to your wallet.`,
			kind: 'system',
			link: `/matches/${matchId}`
		});
	}

	await db.update(matches).set({ status: 'cancelled' }).where(eq(matches.id, matchId));
}
