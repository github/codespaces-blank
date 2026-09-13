import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod';
import { eq, and } from 'drizzle-orm';
import { deposits } from '$lib/db/schema';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user) throw redirect(303, '/auth/login');

	const [deposit] = await locals.db
		.select()
		.from(deposits)
		.where(and(eq(deposits.ref, params.ref), eq(deposits.userId, locals.user.id)))
		.limit(1);

	if (!deposit) throw error(404, 'Deposit not found');

	return {
		deposit,
		upiId: (import.meta.env?.UPI_ID as string) ?? 'rakatoss@upi'
	};
};

export const actions: Actions = {
	submit: async ({ request, params, locals, platform }) => {
		if (!locals.user) throw redirect(303, '/auth/login');

		const fd = await request.formData();
		const schema = z.object({ upiRef: z.string().min(6, 'Enter valid UTR/transaction ID') });
		const parsed = schema.safeParse({ upiRef: fd.get('upiRef') });
		if (!parsed.success) return fail(400, { error: parsed.error.flatten().fieldErrors.upiRef?.[0] });

		// TODO: Cloudinary screenshot upload (handled client-side in the form)
		const screenshotUrl = fd.get('screenshotUrl')?.toString() ?? null;

		await locals.db
			.update(deposits)
			.set({ upiRef: parsed.data.upiRef, screenshotUrl, status: 'submitted' })
			.where(and(eq(deposits.ref, params.ref), eq(deposits.userId, locals.user.id)));

		return { submitted: true };
	}
};
