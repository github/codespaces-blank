import type { LoaderFunction } from "react-router";
import { getLiveAvailability, getLiveMatchByPublicSlug } from "~/utils/database.server";
import { subscribeToLiveMatch } from "~/utils/live-broker.server";

function encodeSse(data: unknown): Uint8Array {
  const text = `data: ${JSON.stringify(data)}\n\n`;
  return new TextEncoder().encode(text);
}

function encodeSseText(data: unknown): string {
  return `data: ${JSON.stringify(data)}\n\n`;
}

export const loader: LoaderFunction = async ({ params, request }) => {
  const publicSlug = params.publicSlug;
  if (!publicSlug) {
    throw new Response("Not Found", { status: 404 });
  }

  const match = await getLiveMatchByPublicSlug(publicSlug);
  if (!match || !match.state) {
    throw new Response("Not Found", { status: 404 });
  }

  const availability = getLiveAvailability(match);
  if (availability === "expired") {
    throw new Response("Live session expired", { status: 410 });
  }

  if (availability === "closed") {
    const payload = {
      type: "snapshot",
      payload: match.state,
      updatedAt: match.updatedAt,
      availability,
    };
    return new Response(encodeSseText(payload), {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  }

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(
        encodeSse({
          type: "snapshot",
          payload: match.state,
          updatedAt: match.updatedAt,
          availability,
        })
      );

      const unsubscribe = subscribeToLiveMatch(publicSlug, ({ payload, updatedAt }) => {
        controller.enqueue(
          encodeSse({
            type: "snapshot",
            payload,
            updatedAt,
            availability: payload.matchEnded ? "closed" : "active",
          })
        );
      });

      const heartbeat = setInterval(() => {
        controller.enqueue(new TextEncoder().encode(`: keepalive ${Date.now()}\n\n`));
      }, 25000);

      request.signal.addEventListener("abort", () => {
        clearInterval(heartbeat);
        unsubscribe();
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
};
