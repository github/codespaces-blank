import crypto from "crypto";
import type { ActionFunction } from "react-router";
import type { LiveSnapshot } from "~/types/live";
import { createLiveMatch } from "~/utils/database.server";
import { liveMatchCreateSchema, parsePayload } from "~/utils/schemas.server";
import { resolveDataScopeFromRequest } from "~/utils/account.server";

function createPublicSlug() {
  return crypto.randomBytes(10).toString("hex");
}

function createAdminToken() {
  return crypto.randomBytes(24).toString("hex");
}

function toMatchDay(value: unknown): number | undefined {
  const num = Number(value);
  return Number.isNaN(num) ? undefined : num;
}

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== "POST") {
    return { ok: false };
  }

  await resolveDataScopeFromRequest(request);

  const raw = await request.json();
  const parsed = parsePayload(liveMatchCreateSchema, raw);
  if (!parsed.success) return parsed.response;
  const payload = parsed.data;

  const record = await createLiveMatch({
    id: crypto.randomUUID(),
    publicSlug: createPublicSlug(),
    adminToken: createAdminToken(),
    championship: payload.championship,
    matchDay: toMatchDay(payload.matchDay),
    state: payload.state as LiveSnapshot,
  });

  return {
    ok: true,
    matchId: record.id,
    publicSlug: record.publicSlug,
    adminToken: record.adminToken,
    expiresAt: record.expiresAt,
  };
};
