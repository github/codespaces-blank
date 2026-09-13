import type { LayoutServerLoad } from './$types';
import { notifications } from '$lib/db/schema';
import { eq, and } from 'drizzle-orm';

export const load: LayoutServerLoad = async ({ locals }) => {
	const user = locals.user;
	let unreadCount = 0;

	if (user) {
		const unread = await locals.db
			.select()
			.from(notifications)
			.where(and(eq(notifications.userId, user.id), eq(notifications.isRead, false)));
		unreadCount = unread.length;
	}

	return {
		user,
		unreadCount
	};
};
