import type { LoaderFunction } from "react-router";
import { getConnectedAccountFromRequest } from "~/utils/account.server";
import { getSlowQueries, getIndexUsage, getTableSizes } from "~/utils/database.server";

// GET /api/admin/db-stats — admin-only performance dashboard
export const loader: LoaderFunction = async ({ request }) => {
  const account = await getConnectedAccountFromRequest(request);
  if (!account?.isAdmin) {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }

  const url = new URL(request.url);
  const section = url.searchParams.get("section");

  if (section === "slow-queries") {
    const limit = Math.min(Number(url.searchParams.get("limit")) || 20, 100);
    const queries = await getSlowQueries(limit);
    return Response.json({ slowQueries: queries });
  }

  if (section === "index-usage") {
    const indexes = await getIndexUsage();
    return Response.json({ indexUsage: indexes });
  }

  if (section === "table-sizes") {
    const sizes = await getTableSizes();
    return Response.json({ tableSizes: sizes });
  }

  // Return all sections
  const [slowQueries, indexUsage, tableSizes] = await Promise.all([
    getSlowQueries(20),
    getIndexUsage(),
    getTableSizes(),
  ]);

  return Response.json({ slowQueries, indexUsage, tableSizes });
};
