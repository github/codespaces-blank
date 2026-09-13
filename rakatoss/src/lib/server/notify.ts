import { eq } from 'drizzle-orm';
import { notifications } from '$lib/db/schema';
import { nanoid } from '$lib/server/utils';
import type { Db } from '$lib/db/client';
import type { Notification } from '$lib/db/schema';

type NotifyInput = {
	userId: string;
	title: string;
	body: string;
	kind?: 'info' | 'success' | 'warning' | 'system';
	link?: string;
};

export async function createNotification(db: Db, input: NotifyInput): Promise<Notification> {
	const [n] = await db
		.insert(notifications)
		.values({
			id: nanoid(),
			userId: input.userId,
			title: input.title,
			body: input.body,
			kind: input.kind ?? 'info',
			link: input.link
		})
		.returning();
	return n;
}

export async function markRead(db: Db, notificationId: string, userId: string) {
	await db
		.update(notifications)
		.set({ isRead: true })
		.where(eq(notifications.id, notificationId));
}

export async function markAllRead(db: Db, userId: string) {
	await db
		.update(notifications)
		.set({ isRead: true })
		.where(eq(notifications.userId, userId));
}

export async function getUnreadCount(db: Db, userId: string): Promise<number> {
	const rows = await db
		.select()
		.from(notifications)
		.where(eq(notifications.userId, userId));
	return rows.filter((n) => !n.isRead).length;
}
