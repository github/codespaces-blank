import { eq, sql } from 'drizzle-orm';
import { wallets, transactions } from '$lib/db/schema';
import type { Db } from '$lib/db/client';
import { nanoid } from '$lib/server/utils';

export async function credit(
	db: Db,
	userId: string,
	amount: number,
	description: string,
	adminId?: string
) {
	if (amount <= 0) throw new Error('Amount must be positive');

	// Atomic: UPDATE balance = balance + amount, get new balance
	await db
		.update(wallets)
		.set({
			balance: sql`${wallets.balance} + ${amount}`,
			totalDeposited: sql`${wallets.totalDeposited} + ${amount}`,
			updatedAt: sql`(datetime('now'))`
		})
		.where(eq(wallets.userId, userId));

	const [wallet] = await db.select().from(wallets).where(eq(wallets.userId, userId)).limit(1);
	if (!wallet) throw new Error('Wallet not found');

	await db.insert(transactions).values({
		id: nanoid(),
		walletId: wallet.id,
		kind: 'credit',
		amount,
		balanceAfter: wallet.balance,
		description,
		adminId
	});

	return wallet.balance;
}

export async function debit(
	db: Db,
	userId: string,
	amount: number,
	description: string,
	adminId?: string
) {
	if (amount <= 0) throw new Error('Amount must be positive');

	const [wallet] = await db.select().from(wallets).where(eq(wallets.userId, userId)).limit(1);
	if (!wallet) throw new Error('Wallet not found');
	if (wallet.balance < amount) throw new Error('Insufficient balance');

	await db
		.update(wallets)
		.set({
			balance: sql`${wallets.balance} - ${amount}`,
			totalWithdrawn: sql`${wallets.totalWithdrawn} + ${amount}`,
			updatedAt: sql`(datetime('now'))`
		})
		.where(eq(wallets.userId, userId));

	const [updated] = await db.select().from(wallets).where(eq(wallets.userId, userId)).limit(1);

	await db.insert(transactions).values({
		id: nanoid(),
		walletId: wallet.id,
		kind: 'debit',
		amount,
		balanceAfter: updated!.balance,
		description,
		adminId
	});

	return updated!.balance;
}

export async function getBalance(db: Db, userId: string): Promise<number> {
	const [wallet] = await db.select().from(wallets).where(eq(wallets.userId, userId)).limit(1);
	return wallet?.balance ?? 0;
}
