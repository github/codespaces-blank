import type { RequestHandler } from './$types';
import { getPoolTotals } from '$lib/server/match';
import { eq } from 'drizzle-orm';
import { matches } from '$lib/db/schema';

export const GET: RequestHandler = async ({ params, locals }) => {
	const matchId = params.id;

	const stream = new ReadableStream({
		async start(controller) {
			const send = (data: object) => {
				controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
			};

			// Send initial pool
			try {
				const pool = await getPoolTotals(locals.db, matchId);
				send(pool);
			} catch {
				controller.close();
				return;
			}

			// Poll every 5 seconds
			const interval = setInterval(async () => {
				try {
					const [match] = await locals.db
						.select()
						.from(matches)
						.where(eq(matches.id, matchId))
						.limit(1);

					if (!match || match.status === 'settled' || match.status === 'cancelled') {
						controller.close();
						clearInterval(interval);
						return;
					}

					const pool = await getPoolTotals(locals.db, matchId);
					send(pool);
				} catch {
					controller.close();
					clearInterval(interval);
				}
			}, 5000);

			// Cleanup when client disconnects
			// (Cloudflare Workers will handle connection closing)
		},
		cancel() {
			// Connection closed by client
		}
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache, no-transform',
			Connection: 'keep-alive',
			'X-Accel-Buffering': 'no'
		}
	});
};
