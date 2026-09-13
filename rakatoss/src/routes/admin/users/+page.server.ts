import type { PageServerLoad } from './$types';
import { users, wallets } from '$lib/db/schema';
import { eq, like, desc } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals, url }) => {
	const q = url.searchParams.get('q') ?? '';

	const rows = await locals.db
		.select({ user: users, wallet: wallets })
		.from(users)
		.leftJoin(wallets, eq(wallets.userId, users.id))
		.where(q ? like(users.username, `%${q}%`) : undefined)
		.orderBy(desc(users.createdAt))
		.limit(50);

	return { users: rows, q };
};
