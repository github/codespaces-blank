import type { ActionFunction, LoaderFunction } from "react-router";
import { resolveDataScopeFromRequest } from "~/utils/account.server";
import {
  listPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer,
} from "~/utils/database.server";
import {
  playerCreateApiSchema,
  playerUpdateApiSchema,
  parsePayload,
} from "~/utils/schemas.server";

// GET /api/players          → list all players for the current account
// GET /api/players?id=xxx   → get a single player by ID
export const loader: LoaderFunction = async ({ request }) => {
  const scope = await resolveDataScopeFromRequest(request);
  const url = new URL(request.url);
  const playerId = url.searchParams.get("id");

  if (playerId) {
    const player = await getPlayerById(scope.scopeId, playerId);
    if (!player) return Response.json({ error: "not-found" }, { status: 404 });
    return Response.json(player);
  }

  const players = await listPlayers(scope.scopeId);
  return Response.json(players);
};

// POST   → create player
// PATCH  → update player (requires ?id=xxx)
// DELETE → delete player (requires ?id=xxx)
export const action: ActionFunction = async ({ request }) => {
  const scope = await resolveDataScopeFromRequest(request);
  const method = request.method.toUpperCase();
  const url = new URL(request.url);
  const playerId = url.searchParams.get("id");

  if (method === "POST") {
    const raw = await request.json();
    const parsed = parsePayload(playerCreateApiSchema, raw);
    if (!parsed.success) return parsed.response;
    const player = await createPlayer(scope.scopeId, parsed.data);
    return Response.json(player, { status: 201 });
  }

  if (method === "PATCH") {
    if (!playerId) return Response.json({ error: "missing id query param" }, { status: 400 });
    const raw = await request.json();
    const parsed = parsePayload(playerUpdateApiSchema, raw);
    if (!parsed.success) return parsed.response;
    const player = await updatePlayer(scope.scopeId, playerId, parsed.data);
    if (!player) return Response.json({ error: "not-found" }, { status: 404 });
    return Response.json(player);
  }

  if (method === "DELETE") {
    if (!playerId) return Response.json({ error: "missing id query param" }, { status: 400 });
    const deleted = await deletePlayer(scope.scopeId, playerId);
    if (!deleted) return Response.json({ error: "not-found" }, { status: 404 });
    return Response.json({ ok: true });
  }

  return Response.json({ error: "method-not-allowed" }, { status: 405 });
};
