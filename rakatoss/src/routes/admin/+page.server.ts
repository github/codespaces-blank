import type { PageServerLoad } from './$types';
import { users, wallets, deposits, withdrawals, matches, bets, tickets } from '$lib/db/schema';
import { eq, sql, and, gte, desc } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	const db = locals.db;

	// KPI queries
	const [totalUsersRow] = await db.select({ count: sql<number>`count(*)` }).from(users);
	const [openMatchesRow] = await db
		.select({ count: sql<number>`count(*)` })
		.from(matches)
		.where(eq(matches.status, 'open'));
	const [pendingDepositsRow] = await db
		.select({ count: sql<number>`count(*)` })
		.from(deposits)
		.where(eq(deposits.status, 'submitted'));
	const [pendingWithdrawalsRow] = await db
		.select({ count: sql<number>`count(*)` })
		.from(withdrawals)
		.where(eq(withdrawals.status, 'pending'));
	const [openTicketsRow] = await db
		.select({ count: sql<number>`count(*)` })
		.from(tickets)
		.where(eq(tickets.status, 'open'));

	// Total coins in circulation
	const [coinsRow] = await db.select({ total: sql<number>`sum(balance)` }).from(wallets);

	// Recent 7 days — daily bets
	const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
	const dailyBets = await db
		.select({
			day: sql<string>`date(placed_at)`,
			count: sql<number>`count(*)`,
			total: sql<number>`sum(amount)`
		})
		.from(bets)
		.where(gte(bets.placedAt, sevenDaysAgo))
		.groupBy(sql`date(placed_at)`)
		.orderBy(sql`date(placed_at)`);

	return {
		kpis: {
			totalUsers: Number(totalUsersRow?.count ?? 0),
			openMatches: Number(openMatchesRow?.count ?? 0),
			pendingDeposits: Number(pendingDepositsRow?.count ?? 0),
			pendingWithdrawals: Number(pendingWithdrawalsRow?.count ?? 0),
			openTickets: Number(openTicketsRow?.count ?? 0),
			coinsInCirculation: Number(coinsRow?.total ?? 0)
		},
		dailyBets
	};
};
