import type { LoaderFunction } from "react-router";
import { resolveDataScopeFromRequest } from "~/utils/account.server";
import {
  searchPlayers,
  searchCoaches,
  searchPresidents,
  searchTitlesByCompetition,
} from "~/utils/database.server";

// GET /api/search?entity=players&q=dupont
// GET /api/search?entity=coaches&q=galthié
// GET /api/search?entity=presidents&q=thomas
// GET /api/search?entity=titles&q=top+14
export const loader: LoaderFunction = async ({ request }) => {
  const scope = await resolveDataScopeFromRequest(request);
  const url = new URL(request.url);
  const entity = url.searchParams.get("entity");
  const q = url.searchParams.get("q")?.trim();

  if (!entity || !q) {
    return Response.json(
      { error: "missing required query params: entity, q" },
      { status: 400 }
    );
  }

  switch (entity) {
    case "players": {
      const results = await searchPlayers(scope.scopeId, q);
      return Response.json({ entity, q, results });
    }
    case "coaches": {
      const results = await searchCoaches(q);
      return Response.json({ entity, q, results });
    }
    case "presidents": {
      const results = await searchPresidents(q);
      return Response.json({ entity, q, results });
    }
    case "titles": {
      const results = await searchTitlesByCompetition(scope.scopeId, q);
      return Response.json({ entity, q, results });
    }
    default:
      return Response.json(
        { error: `unknown entity: ${entity}. Valid: players, coaches, presidents, titles` },
        { status: 400 }
      );
  }
};
