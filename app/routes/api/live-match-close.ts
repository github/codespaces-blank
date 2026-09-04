import type { ActionFunction } from "react-router";
import { closeLiveMatchSession } from "~/utils/database.server";
import { publishLiveMatch } from "~/utils/live-broker.server";

export const action: ActionFunction = async ({ request, params }) => {
  if (request.method !== "POST") {
    return { ok: false, error: "method-not-allowed" };
  }

  const matchId = params.matchId;
  const adminToken = request.headers.get("x-live-admin-token");

  if (!matchId || !adminToken) {
    return { ok: false, error: "missing-credentials" };
  }

  const closed = await closeLiveMatchSession({
    matchId,
    adminToken,
  });

  if (!closed.record) {
    return { ok: false, error: closed.error ?? "close-failed" };
  }

  if (closed.record.state) {
    publishLiveMatch(closed.record.publicSlug, {
      payload: closed.record.state,
      updatedAt: closed.record.updatedAt,
    });
  }

  return {
    ok: true,
    updatedAt: closed.record.updatedAt,
    closedAt: closed.record.closedAt,
  };
};
