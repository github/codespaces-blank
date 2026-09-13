import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod';
import { deposits, wallets } from '$lib/db/schema';
import { nanoid, genRef } from '$lib/server/utils';
import { getBonusCoins } from '$lib/server/bonus';
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
	default: async ({ request, locals, platform }) => {
		if (!locals.user) throw redirect(303, '/auth/login');

		const fd = await request.formData();
		const schema = z.object({ amount: z.coerce.number().min(50, 'Minimum deposit ₹50') });
		const parsed = schema.safeParse({ amount: fd.get('amount') });
		if (!parsed.success) {
			return fail(400, { error: parsed.error.flatten().fieldErrors.amount?.[0] });
		}

		const { amount } = parsed.data;
		const upiId = platform?.env?.UPI_ID ?? process.env.UPI_ID ?? 'rakatoss@upi';
		const coinRate = parseFloat(platform?.env?.COIN_RUPEE_RATE ?? '1');
		const coins = amount * coinRate;
		const bonusCoins = await getBonusCoins(locals.db, amount);
		const ref = genRef();

		await locals.db.insert(deposits).values({
			id: nanoid(),
			ref,
			userId: locals.user.id,
			rupeeAmount: amount,
			coins,
			bonusCoins
		});

		throw redirect(303, `/wallet/deposit/${ref}`);
	}
};
