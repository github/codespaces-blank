import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { withdrawals, users } from '$lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { credit } from '$lib/server/wallet';
import { createNotification } from '$lib/server/notify';

export const load: PageServerLoad = async ({ locals, url }) => {
	const status = url.searchParams.get('status') ?? 'pending';
	const rows = await locals.db
		.select({ wd: withdrawals, user: users })
		.from(withdrawals)
		.leftJoin(users, eq(withdrawals.userId, users.id))
		.where(status === 'all' ? undefined : eq(withdrawals.status, status as any))
		.orderBy(desc(withdrawals.requestedAt));

	return { withdrawals: rows, filterStatus: status };
};

export const actions: Actions = {
	approve: async ({ request, locals }) => {
		const fd = await request.formData();
		const wdId = fd.get('wdId')?.toString();
		if (!wdId) return fail(400, { error: 'Missing ID' });

		await locals.db
			.update(withdrawals)
			.set({ status: 'approved', processedAt: new Date().toISOString(), processedBy: locals.user!.id })
			.where(eq(withdrawals.id, wdId));

		const [wd] = await locals.db.select().from(withdrawals).where(eq(withdrawals.id, wdId)).limit(1);
		if (wd) {
			await createNotification(locals.db, {
				userId: wd.userId,
				title: '✅ Withdrawal Approved',
				body: `Your withdrawal of ${wd.coins} coins (₹${wd.rupeeAmount}) has been approved. Payment will be sent to ${wd.upiId} shortly.`,
				kind: 'success'
			});
		}
		return { success: true };
	},
	mark_paid: async ({ request, locals }) => {
		const fd = await request.formData();
		const wdId = fd.get('wdId')?.toString();
		const upiRefPaid = fd.get('upiRefPaid')?.toString() ?? '';
		if (!wdId) return fail(400, { error: 'Missing ID' });

		await locals.db
			.update(withdrawals)
			.set({ status: 'paid', upiRefPaid })
			.where(eq(withdrawals.id, wdId));

		const [wd] = await locals.db.select().from(withdrawals).where(eq(withdrawals.id, wdId)).limit(1);
		if (wd) {
			await createNotification(locals.db, {
				userId: wd.userId,
				title: '💸 Payment Sent!',
				body: `Your withdrawal of ₹${wd.rupeeAmount} has been paid to ${wd.upiId}.${upiRefPaid ? ' UTR: ' + upiRefPaid : ''}`,
				kind: 'success'
			});
		}
		return { success: true };
	},
	reject: async ({ request, locals }) => {
		const fd = await request.formData();
		const wdId = fd.get('wdId')?.toString();
		const adminNote = fd.get('adminNote')?.toString() ?? '';
		if (!wdId) return fail(400, { error: 'Missing ID' });

		const [wd] = await locals.db.select().from(withdrawals).where(eq(withdrawals.id, wdId)).limit(1);
		if (!wd) return fail(404, { error: 'Not found' });

		// Refund coins
		await credit(locals.db, wd.userId, wd.coins, `Withdrawal rejected — refund: ${wd.coins} coins`, locals.user!.id);

		await locals.db
			.update(withdrawals)
			.set({ status: 'rejected', adminNote })
			.where(eq(withdrawals.id, wdId));

		await createNotification(locals.db, {
			userId: wd.userId,
			title: '❌ Withdrawal Rejected',
			body: `Your withdrawal of ${wd.coins} coins was rejected. Coins refunded.${adminNote ? ' Reason: ' + adminNote : ''}`,
			kind: 'warning'
		});
		return { success: true };
	}
};
