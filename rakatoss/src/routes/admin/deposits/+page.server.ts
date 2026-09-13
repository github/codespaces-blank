import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { deposits, users } from '$lib/db/schema';
import { and, desc, eq } from 'drizzle-orm';
import { credit } from '$lib/server/wallet';
import { createNotification } from '$lib/server/notify';
import { payReferralBonusIfEligible } from '$lib/server/referral';

export const load: PageServerLoad = async ({ locals, url }) => {
	const status = url.searchParams.get('status') ?? 'submitted';

	const rows = await locals.db
		.select({ deposit: deposits, user: users })
		.from(deposits)
		.leftJoin(users, eq(deposits.userId, users.id))
		.where(status === 'all' ? undefined : eq(deposits.status, status as any))
		.orderBy(desc(deposits.requestedAt));

	return { deposits: rows, filterStatus: status };
};

export const actions: Actions = {
	confirm: async ({ request, locals }) => {
		const fd = await request.formData();
		const depositId = fd.get('depositId')?.toString();
		if (!depositId) return fail(400, { error: 'Missing deposit ID' });

		const db = locals.db;
		const [dep] = await db.select().from(deposits).where(eq(deposits.id, depositId)).limit(1);
		if (!dep) return fail(404, { error: 'Deposit not found' });
		if (dep.status !== 'submitted') return fail(400, { error: 'Deposit already processed' });

		const totalCoins = dep.coins + dep.bonusCoins;
		await credit(db, dep.userId, totalCoins, `Deposit confirmed (₹${dep.rupeeAmount}${dep.bonusCoins > 0 ? ` + ${dep.bonusCoins} bonus` : ''})`, locals.user!.id);

		await db
			.update(deposits)
			.set({ status: 'confirmed', confirmedAt: new Date().toISOString(), confirmedBy: locals.user!.id })
			.where(eq(deposits.id, depositId));

		await createNotification(db, {
			userId: dep.userId,
			title: '✅ Deposit Confirmed',
			body: `Your deposit of ₹${dep.rupeeAmount} has been confirmed. ${totalCoins} coins added to your wallet.`,
			kind: 'success',
			link: '/wallet/history'
		});

		// Check referral bonus
		await payReferralBonusIfEligible(db, dep.userId);

		return { success: true };
	},
	reject: async ({ request, locals }) => {
		const fd = await request.formData();
		const depositId = fd.get('depositId')?.toString();
		const adminNote = fd.get('adminNote')?.toString() ?? '';
		if (!depositId) return fail(400, { error: 'Missing deposit ID' });

		const db = locals.db;
		const [dep] = await db.select().from(deposits).where(eq(deposits.id, depositId)).limit(1);
		if (!dep) return fail(404, { error: 'Not found' });

		await db
			.update(deposits)
			.set({ status: 'rejected', adminNote })
			.where(eq(deposits.id, depositId));

		await createNotification(db, {
			userId: dep.userId,
			title: '❌ Deposit Rejected',
			body: `Your deposit of ₹${dep.rupeeAmount} was rejected.${adminNote ? ' Reason: ' + adminNote : ''}`,
			kind: 'warning',
			link: '/wallet/history'
		});

		return { success: true };
	}
};
