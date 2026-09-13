import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { getLucia } from '$lib/auth/lucia';

export const actions: Actions = {
	default: async ({ locals, cookies }) => {
		if (!locals.session) throw redirect(303, '/');

		const lucia = getLucia(locals.db);
		await lucia.invalidateSession(locals.session.id);
		const blank = lucia.createBlankSessionCookie();
		cookies.set(blank.name, blank.value, { path: '.', ...blank.attributes });

		throw redirect(303, '/');
	}
};
