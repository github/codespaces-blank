import type { PageServerLoad } from './$types';
import { matches } from '$lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	const openMatches = await locals.db
		.select()
		.from(matches)
		.where(eq(matches.status, 'open'))
		.orderBy(desc(matches.createdAt));

	return { matches: openMatches };
};
