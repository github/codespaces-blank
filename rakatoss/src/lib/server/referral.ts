import { eq, and } from 'drizzle-orm';
import { referrals, deposits } from '$lib/db/schema';
import { credit } from '$lib/server/wallet';
import { createNotification } from '$lib/server/notify';
import type { Db } from '$lib/db/client';

const REFERRAL_BONUS = parseInt(process.env.REFERRAL_BONUS_COINS ?? '20', 10);

/**
 * Called when admin confirms a deposit.
 * If this is the referred user's first confirmed deposit, credit the referrer.
 */
export async function payReferralBonusIfEligible(db: Db, userId: string) {
	// Find if this user was referred by someone
	const [referral] = await db
		.select()
		.from(referrals)
		.where(and(eq(referrals.referredId, userId), eq(referrals.bonusPaid, false)))
		.limit(1);

	if (!referral) return;

	// Check this is the first confirmed deposit for referred user
	const confirmedDeposits = await db
		.select()
		.from(deposits)
		.where(and(eq(deposits.userId, userId), eq(deposits.status, 'confirmed')));

	if (confirmedDeposits.length !== 1) return; // Only on the very first

	// Credit referrer
	await credit(
		db,
		referral.referrerId,
		REFERRAL_BONUS,
		`Referral bonus — invited a friend who made their first deposit`
	);

	// Mark bonus paid
	await db.update(referrals).set({ bonusPaid: true }).where(eq(referrals.id, referral.id));

	// Notify referrer
	await createNotification(db, {
		userId: referral.referrerId,
		title: 'Referral Bonus! 🎉',
		body: `You earned ${REFERRAL_BONUS} coins for referring a friend who made their first deposit.`,
		kind: 'success',
		link: '/wallet/history'
	});
}
