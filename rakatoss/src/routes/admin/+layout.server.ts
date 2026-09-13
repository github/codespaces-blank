import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { adminRoles, users } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	// hooks.server.ts already handles the /admin guard
	const user = locals.user!;

	let roles = null;
	if (!user.isSuperadmin) {
		const [r] = await locals.db
			.select()
			.from(adminRoles)
			.where(eq(adminRoles.userId, user.id))
			.limit(1);
		roles = r ?? null;
	}

	return { adminUser: user, roles };
};
