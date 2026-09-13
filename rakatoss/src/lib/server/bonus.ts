import { and, gte, lte, or } from 'drizzle-orm';
import { bonusTiers } from '$lib/db/schema';
import type { Db } from '$lib/db/client';

/** Default tiers — loaded at runtime from DB, editable by superadmin */
export const DEFAULT_TIERS = [
	{ minDeposit: 100, maxDeposit: 199, bonusCoins: 5 },
	{ minDeposit: 200, maxDeposit: 499, bonusCoins: 10 },
	{ minDeposit: 500, maxDeposit: 999, bonusCoins: 25 },
	{ minDeposit: 1000, maxDeposit: 2499, bonusCoins: 60 },
	{ minDeposit: 2500, maxDeposit: 4999, bonusCoins: 150 },
	{ minDeposit: 5000, maxDeposit: 9999, bonusCoins: 350 },
	{ minDeposit: 10000, maxDeposit: Infinity, bonusCoins: 750 }
];

export async function getBonusCoins(db: Db, rupeeAmount: number): Promise<number> {
	const tiers = await db.select().from(bonusTiers);

	if (!tiers.length) {
		// fallback to default tiers
		const tier = DEFAULT_TIERS.find(
			(t) => rupeeAmount >= t.minDeposit && rupeeAmount <= t.maxDeposit
		);
		return tier?.bonusCoins ?? 0;
	}

	// find matching tier from DB
	for (const tier of tiers) {
		if (rupeeAmount >= tier.minDeposit && rupeeAmount <= tier.maxDeposit) {
			return tier.bonusCoins;
		}
	}
	return 0;
}

export async function seedDefaultBonusTiers(db: Db) {
	const existing = await db.select().from(bonusTiers);
	if (existing.length > 0) return;

	const { nanoid } = await import('$lib/server/utils');
	await db.insert(bonusTiers).values(
		DEFAULT_TIERS.map((t) => ({
			id: nanoid(),
			minDeposit: t.minDeposit,
			maxDeposit: t.maxDeposit === Infinity ? 9999999 : t.maxDeposit,
			bonusCoins: t.bonusCoins
		}))
	);
}
