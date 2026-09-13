import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod';
import { users, wallets, referrals } from '$lib/db/schema';
import { eq, count } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(303, '/auth/login');

	const [wallet] = await locals.db
		.select()
		.from(wallets)
		.where(eq(wallets.userId, locals.user.id))
		.limit(1);

	const [refCount] = await locals.db
		.select({ count: count() })
		.from(referrals)
		.where(eq(referrals.referrerId, locals.user.id));

	const [user] = await locals.db.select().from(users).where(eq(users.id, locals.user.id)).limit(1);

	return {
		wallet,
		user,
		referralCount: refCount?.count ?? 0,
		appUrl: process.env.APP_URL ?? 'http://localhost:5173'
	};
};

export const actions: Actions = {
	update: async ({ request, locals }) => {
		if (!locals.user) throw redirect(303, '/auth/login');
		const fd = await request.formData();
		const schema = z.object({
			phone: z.string().optional(),
			upiId: z.string().optional()
		});
		const parsed = schema.safeParse({ phone: fd.get('phone'), upiId: fd.get('upiId') });
		if (!parsed.success) return fail(400, { error: 'Invalid input' });

		await locals.db
			.update(users)
			.set({ phone: parsed.data.phone, upiId: parsed.data.upiId })
			.where(eq(users.id, locals.user.id));

		return { success: true };
	}
};
