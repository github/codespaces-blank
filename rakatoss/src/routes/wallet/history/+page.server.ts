import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { transactions, wallets } from '$lib/db/schema';
import { desc, eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.user) throw redirect(303, '/auth/login');

	const page = parseInt(url.searchParams.get('page') ?? '1', 10);
	const limit = 20;
	const offset = (page - 1) * limit;

	const [wallet] = await locals.db
		.select()
		.from(wallets)
		.where(eq(wallets.userId, locals.user.id))
		.limit(1);

	const txs = await locals.db
		.select()
		.from(transactions)
		.where(eq(transactions.walletId, wallet?.id ?? ''))
		.orderBy(desc(transactions.createdAt))
		.limit(limit + 1)
		.offset(offset);

	const hasNext = txs.length > limit;

	return {
		transactions: txs.slice(0, limit),
		balance: wallet?.balance ?? 0,
		page,
		hasNext,
		hasPrev: page > 1
	};
};
