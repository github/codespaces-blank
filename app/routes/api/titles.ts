import type { ActionFunction, LoaderFunction } from "react-router";
import { resolveDataScopeFromRequest } from "~/utils/account.server";
import {
  listTitles,
  getTitleById,
  createTitle,
  updateTitle,
  deleteTitle,
} from "~/utils/database.server";
import {
  titleCreateApiSchema,
  titleUpdateApiSchema,
  parsePayload,
} from "~/utils/schemas.server";

// GET /api/titles        → list all titles for the current account
// GET /api/titles?id=xxx → get a single title by ID
export const loader: LoaderFunction = async ({ request }) => {
  const scope = await resolveDataScopeFromRequest(request);
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (id) {
    const title = await getTitleById(Number(id));
    if (!title) return Response.json({ error: "not-found" }, { status: 404 });
    return Response.json(title);
  }

  const titles = await listTitles(scope.scopeId);
  return Response.json(titles);
};

// POST   → create title
// PATCH  → update title (requires ?id=xxx)
// DELETE → delete title (requires ?id=xxx)
export const action: ActionFunction = async ({ request }) => {
  const scope = await resolveDataScopeFromRequest(request);
  const method = request.method.toUpperCase();
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (method === "POST") {
    const raw = await request.json();
    const parsed = parsePayload(titleCreateApiSchema, raw);
    if (!parsed.success) return parsed.response;
    const title = await createTitle(scope.scopeId, parsed.data);
    return Response.json(title, { status: 201 });
  }

  if (method === "PATCH") {
    if (!id) return Response.json({ error: "missing id query param" }, { status: 400 });
    const raw = await request.json();
    const parsed = parsePayload(titleUpdateApiSchema, raw);
    if (!parsed.success) return parsed.response;
    const title = await updateTitle(Number(id), parsed.data, scope.scopeId);
    if (!title) return Response.json({ error: "not-found" }, { status: 404 });
    return Response.json(title);
  }

  if (method === "DELETE") {
    if (!id) return Response.json({ error: "missing id query param" }, { status: 400 });
    const deleted = await deleteTitle(Number(id), scope.scopeId);
    if (!deleted) return Response.json({ error: "not-found" }, { status: 404 });
    return Response.json({ ok: true });
  }

  return Response.json({ error: "method-not-allowed" }, { status: 405 });
};
