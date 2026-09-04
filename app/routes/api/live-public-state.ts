import type { LoaderFunction } from "react-router";
import { getLiveAvailability, getLiveMatchByPublicSlug } from "~/utils/database.server";

export const loader: LoaderFunction = async ({ params }) => {
  const publicSlug = params.publicSlug;

  if (!publicSlug) {
    throw new Response("Not Found", { status: 404 });
  }

  const match = await getLiveMatchByPublicSlug(publicSlug);
  if (!match || !match.state) {
    throw new Response("Not Found", { status: 404 });
  }

  const availability = getLiveAvailability(match);
  if (availability === "expired") {
    throw new Response("Live session expired", { status: 410 });
  }

  return {
    ok: true,
    updatedAt: match.updatedAt,
    availability,
    state: match.state,
  };
};
