import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod';
import { matches } from '$lib/db/schema';
import { nanoid } from '$lib/server/utils';
import { desc } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	const allMatches = await locals.db
		.select()
		.from(matches)
		.orderBy(desc(matches.createdAt));

	return { matches: allMatches };
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const fd = await request.formData();
		const schema = z.object({
			title: z.string().min(3),
			description: z.string().optional(),
			minBet: z.coerce.number().min(1),
			maxBet: z.coerce.number().min(1),
			houseEdge: z.coerce.number().min(0).max(50),
			startsAt: z.string(),
			bettingClosesAt: z.string()
		});

		const parsed = schema.safeParse({
			title: fd.get('title'),
			description: fd.get('description'),
			minBet: fd.get('minBet'),
			maxBet: fd.get('maxBet'),
			houseEdge: fd.get('houseEdge'),
			startsAt: fd.get('startsAt'),
			bettingClosesAt: fd.get('bettingClosesAt')
		});

		if (!parsed.success) return fail(400, { error: 'Validation failed' });

		const { title, description, minBet, maxBet, houseEdge, startsAt, bettingClosesAt } = parsed.data;

		await locals.db.insert(matches).values({
			id: nanoid(),
			title,
			description,
			minBet,
			maxBet,
			houseEdge,
			status: 'open',
			createdBy: locals.user!.id,
			startsAt,
			bettingClosesAt
		});

		return { created: true };
	}
};
