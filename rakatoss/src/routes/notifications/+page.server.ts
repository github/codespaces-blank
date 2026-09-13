import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { notifications } from '$lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { markAllRead } from '$lib/server/notify';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(303, '/auth/login');
	const all = await locals.db
		.select()
		.from(notifications)
		.where(eq(notifications.userId, locals.user.id))
		.orderBy(desc(notifications.createdAt))
		.limit(100);
	return { notifications: all };
};

export const actions: Actions = {
	mark_all_read: async ({ locals }) => {
		if (!locals.user) throw redirect(303, '/auth/login');
		await markAllRead(locals.db, locals.user.id);
		return { success: true };
	}
};
