import type { ActionFunction, LoaderFunction } from "react-router";
import { resolveDataScopeFromRequest } from "~/utils/account.server";
import {
  listCompetitions,
  getCompetitionById,
  createCompetition,
  updateCompetition,
  deleteCompetition,
} from "~/utils/database.server";
import {
  competitionCreateApiSchema,
  competitionUpdateApiSchema,
  parsePayload,
} from "~/utils/schemas.server";

// GET /api/competitions        → list all competitions
// GET /api/competitions?id=xxx → get a single competition by ID
export const loader: LoaderFunction = async ({ request }) => {
  await resolveDataScopeFromRequest(request);
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (id) {
    const competition = await getCompetitionById(Number(id));
    if (!competition) return Response.json({ error: "not-found" }, { status: 404 });
    return Response.json(competition);
  }

  const competitions = await listCompetitions();
  return Response.json(competitions);
};

// POST   → create competition
// PATCH  → update competition (requires ?id=xxx)
// DELETE → delete competition (requires ?id=xxx)
export const action: ActionFunction = async ({ request }) => {
  const scope = await resolveDataScopeFromRequest(request);
  const method = request.method.toUpperCase();
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (method === "POST") {
    const raw = await request.json();
    const parsed = parsePayload(competitionCreateApiSchema, raw);
    if (!parsed.success) return parsed.response;
    const competition = await createCompetition(parsed.data.name);
    return Response.json(competition, { status: 201 });
  }

  if (method === "PATCH") {
    if (!id) return Response.json({ error: "missing id query param" }, { status: 400 });
    const raw = await request.json();
    const parsed = parsePayload(competitionUpdateApiSchema, raw);
    if (!parsed.success) return parsed.response;
    const competition = await updateCompetition(Number(id), parsed.data.name);
    if (!competition) return Response.json({ error: "not-found" }, { status: 404 });
    return Response.json(competition);
  }

  if (method === "DELETE") {
    if (!id) return Response.json({ error: "missing id query param" }, { status: 400 });
    const deleted = await deleteCompetition(Number(id));
    if (!deleted) return Response.json({ error: "not-found" }, { status: 404 });
    return Response.json({ ok: true });
  }

  return Response.json({ error: "method-not-allowed" }, { status: 405 });
};
