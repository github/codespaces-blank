import type { ActionFunction, LoaderFunction } from "react-router";
import { resolveDataScopeFromRequest } from "~/utils/account.server";
import {
  listPresidents,
  getPresidentById,
  createPresident,
  updatePresident,
  deletePresident,
} from "~/utils/database.server";
import {
  presidentCreateApiSchema,
  presidentUpdateApiSchema,
  parsePayload,
} from "~/utils/schemas.server";

// GET /api/presidents        → list all presidents
// GET /api/presidents?id=xxx → get a single president by ID
export const loader: LoaderFunction = async ({ request }) => {
  await resolveDataScopeFromRequest(request);
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (id) {
    const president = await getPresidentById(Number(id));
    if (!president) return Response.json({ error: "not-found" }, { status: 404 });
    return Response.json(president);
  }

  const presidents = await listPresidents();
  return Response.json(presidents);
};

// POST   → create president
// PATCH  → update president (requires ?id=xxx)
// DELETE → delete president (requires ?id=xxx)
export const action: ActionFunction = async ({ request }) => {
  const scope = await resolveDataScopeFromRequest(request);
  const method = request.method.toUpperCase();
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (method === "POST") {
    const raw = await request.json();
    const parsed = parsePayload(presidentCreateApiSchema, raw);
    if (!parsed.success) return parsed.response;
    const president = await createPresident(parsed.data, scope.scopeId);
    return Response.json(president, { status: 201 });
  }

  if (method === "PATCH") {
    if (!id) return Response.json({ error: "missing id query param" }, { status: 400 });
    const raw = await request.json();
    const parsed = parsePayload(presidentUpdateApiSchema, raw);
    if (!parsed.success) return parsed.response;
    const president = await updatePresident(Number(id), parsed.data, scope.scopeId);
    if (!president) return Response.json({ error: "not-found" }, { status: 404 });
    return Response.json(president);
  }

  if (method === "DELETE") {
    if (!id) return Response.json({ error: "missing id query param" }, { status: 400 });
    const deleted = await deletePresident(Number(id), scope.scopeId);
    if (!deleted) return Response.json({ error: "not-found" }, { status: 404 });
    return Response.json({ ok: true });
  }

  return Response.json({ error: "method-not-allowed" }, { status: 405 });
};
