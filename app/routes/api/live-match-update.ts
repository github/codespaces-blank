import type { ActionFunction } from "react-router";
import type { LiveSnapshot } from "~/types/live";
import { updateLiveMatchState } from "~/utils/database.server";
import { publishLiveMatch } from "~/utils/live-broker.server";
import { liveMatchUpdateSchema, parsePayload } from "~/utils/schemas.server";

export const action: ActionFunction = async ({ request, params }) => {
  if (request.method !== "PATCH") {
    return { ok: false };
  }

  const matchId = params.matchId;
  const adminToken = request.headers.get("x-live-admin-token");

  if (!matchId || !adminToken) {
    return { ok: false, error: "missing credentials" };
  }

  const raw = await request.json();
  const parsed = parsePayload(liveMatchUpdateSchema, raw);
  if (!parsed.success) return parsed.response;

  const updated = await updateLiveMatchState({
    matchId,
    adminToken,
    state: parsed.data.state as LiveSnapshot,
  });

  if (!updated.record) {
    return { ok: false, error: updated.error ?? "update-failed" };
  }

  if (updated.record.state) {
    publishLiveMatch(updated.record.publicSlug, {
      payload: updated.record.state,
      updatedAt: updated.record.updatedAt,
    });
  }

  return {
    ok: true,
    updatedAt: updated.record.updatedAt,
    closedAt: updated.record.closedAt,
  };
};
