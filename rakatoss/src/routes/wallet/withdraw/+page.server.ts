import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod';
import { wallets, withdrawals } from '$lib/db/schema';
import { debit } from '$lib/server/wallet';
import { nanoid, genRef } from '$lib/server/utils';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(303, '/auth/login');
	const [wallet] = await locals.db
		.select()
		.from(wallets)
		.where(eq(wallets.userId, locals.user.id))
		.limit(1);
	return { balance: wallet?.balance ?? 0 };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (!locals.user) throw redirect(303, '/auth/login');

		const fd = await request.formData();
		const schema = z.object({
			coins: z.coerce.number().min(10, 'Minimum withdrawal is 10 coins'),
			upiId: z.string().min(5, 'Enter valid UPI ID')
		});
		const parsed = schema.safeParse({ coins: fd.get('coins'), upiId: fd.get('upiId') });
		if (!parsed.success) {
			const errors = parsed.error.flatten().fieldErrors;
			return fail(400, { errors });
		}

		const { coins, upiId } = parsed.data;
		const db = locals.db;

		// Deduct coins upfront (refunded if rejected)
		try {
			await debit(db, locals.user.id, coins, `Withdrawal request: ${coins} coins to ${upiId}`);
		} catch (e: any) {
			return fail(400, { errors: { coins: [e.message] } });
		}

		const coinRate = 1; // ₹1 per coin
		await db.insert(withdrawals).values({
			id: nanoid(),
			ref: genRef(),
			userId: locals.user.id,
			coins,
			rupeeAmount: coins * coinRate,
			upiId
		});

		return { success: true };
	}
};
