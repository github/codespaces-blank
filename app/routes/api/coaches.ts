import type { ActionFunction, LoaderFunction } from "react-router";
import { resolveDataScopeFromRequest } from "~/utils/account.server";
import {
  listCoaches,
  getCoachById,
  createCoach,
  updateCoach,
  deleteCoach,
} from "~/utils/database.server";
import {
  coachCreateApiSchema,
  coachUpdateApiSchema,
  parsePayload,
} from "~/utils/schemas.server";

// GET /api/coaches        → list all coaches
// GET /api/coaches?id=xxx → get a single coach by ID
export const loader: LoaderFunction = async ({ request }) => {
  await resolveDataScopeFromRequest(request);
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (id) {
    const coach = await getCoachById(Number(id));
    if (!coach) return Response.json({ error: "not-found" }, { status: 404 });
    return Response.json(coach);
  }

  const coaches = await listCoaches();
  return Response.json(coaches);
};

// POST   → create coach
// PATCH  → update coach (requires ?id=xxx)
// DELETE → delete coach (requires ?id=xxx)
export const action: ActionFunction = async ({ request }) => {
  const scope = await resolveDataScopeFromRequest(request);
  const method = request.method.toUpperCase();
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (method === "POST") {
    const raw = await request.json();
    const parsed = parsePayload(coachCreateApiSchema, raw);
    if (!parsed.success) return parsed.response;
    const coach = await createCoach(parsed.data, scope.scopeId);
    return Response.json(coach, { status: 201 });
  }

  if (method === "PATCH") {
    if (!id) return Response.json({ error: "missing id query param" }, { status: 400 });
    const raw = await request.json();
    const parsed = parsePayload(coachUpdateApiSchema, raw);
    if (!parsed.success) return parsed.response;
    const coach = await updateCoach(Number(id), parsed.data, scope.scopeId);
    if (!coach) return Response.json({ error: "not-found" }, { status: 404 });
    return Response.json(coach);
  }

  if (method === "DELETE") {
    if (!id) return Response.json({ error: "missing id query param" }, { status: 400 });
    const deleted = await deleteCoach(Number(id), scope.scopeId);
    if (!deleted) return Response.json({ error: "not-found" }, { status: 404 });
    return Response.json({ ok: true });
  }

  return Response.json({ error: "method-not-allowed" }, { status: 405 });
};
