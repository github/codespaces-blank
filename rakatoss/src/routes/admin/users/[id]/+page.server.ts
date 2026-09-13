import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { users, wallets, bets, matches, deposits, withdrawals, transactions } from '$lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { credit, debit } from '$lib/server/wallet';
import { createNotification } from '$lib/server/notify';

export const load: PageServerLoad = async ({ params, locals }) => {
	const db = locals.db;
	const [user] = await db.select().from(users).where(eq(users.id, params.id)).limit(1);
	if (!user) throw error(404, 'User not found');

	const [wallet] = await db.select().from(wallets).where(eq(wallets.userId, user.id)).limit(1);

	const userBets = await db
		.select({ bet: bets, match: matches })
		.from(bets)
		.leftJoin(matches, eq(bets.matchId, matches.id))
		.where(eq(bets.userId, user.id))
		.orderBy(desc(bets.placedAt))
		.limit(20);

	const userDeposits = await db
		.select()
		.from(deposits)
		.where(eq(deposits.userId, user.id))
		.orderBy(desc(deposits.requestedAt))
		.limit(10);

	const userWithdrawals = await db
		.select()
		.from(withdrawals)
		.where(eq(withdrawals.userId, user.id))
		.orderBy(desc(withdrawals.requestedAt))
		.limit(10);

	const txs = await db
		.select()
		.from(transactions)
		.where(eq(transactions.walletId, wallet?.id ?? ''))
		.orderBy(desc(transactions.createdAt))
		.limit(20);

	return { targetUser: user, wallet, bets: userBets, deposits: userDeposits, withdrawals: userWithdrawals, transactions: txs };
};

export const actions: Actions = {
	block: async ({ params, locals }) => {
		await locals.db.update(users).set({ isActive: false }).where(eq(users.id, params.id));
		return { success: true };
	},
	unblock: async ({ params, locals }) => {
		await locals.db.update(users).set({ isActive: true }).where(eq(users.id, params.id));
		return { success: true };
	},
	add_coins: async ({ request, params, locals }) => {
		const fd = await request.formData();
		const amount = parseFloat(fd.get('amount')?.toString() ?? '0');
		const reason = fd.get('reason')?.toString() ?? 'Admin credit';
		if (amount <= 0) return fail(400, { error: 'Invalid amount' });

		await credit(locals.db, params.id, amount, `Admin: ${reason}`, locals.user!.id);
		await createNotification(locals.db, {
			userId: params.id,
			title: '🪙 Coins Added',
			body: `${amount} coins were added to your wallet by admin. Reason: ${reason}`,
			kind: 'info'
		});
		return { success: true };
	},
	deduct_coins: async ({ request, params, locals }) => {
		const fd = await request.formData();
		const amount = parseFloat(fd.get('amount')?.toString() ?? '0');
		const reason = fd.get('reason')?.toString() ?? 'Admin debit';
		if (amount <= 0) return fail(400, { error: 'Invalid amount' });

		try {
			await debit(locals.db, params.id, amount, `Admin: ${reason}`, locals.user!.id);
		} catch (e: any) {
			return fail(400, { error: e.message });
		}
		return { success: true };
	}
};
