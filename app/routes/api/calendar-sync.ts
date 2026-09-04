import type { ActionFunction } from "react-router";
import { resolveDataScopeFromRequest } from "~/utils/account.server";
import {
  getRostersStateForAccount,
  saveRostersStateForAccount,
} from "~/utils/database.server";
import { buildCalendarForTeam } from "~/utils/ical.server";
import { validateIcsUrl } from "~/utils/url-validation";
import { CURRENT_SEASON } from "~/types/tracker";

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const scope = await resolveDataScopeFromRequest(request);
  const body = await request.json();
  const { rosterId, icsUrl, season } = body as {
    rosterId?: string;
    icsUrl?: string;
    season?: string;
  };

  if (!rosterId || !icsUrl) {
    return Response.json(
      { error: "rosterId and icsUrl are required" },
      { status: 400 },
    );
  }

  // SSRF protection
  const urlCheck = validateIcsUrl(icsUrl);
  if (!urlCheck.ok) {
    return Response.json({ error: urlCheck.reason }, { status: 400 });
  }

  const targetSeason = season || CURRENT_SEASON;
  const payload = await getRostersStateForAccount(scope.scopeId);
  const roster = payload.rosters.find((r) => r.id === rosterId);

  if (!roster) {
    return Response.json({ error: "Roster not found" }, { status: 404 });
  }

  const fixtures = await buildCalendarForTeam(icsUrl, roster.name);

  // Ensure seasons object exists
  if (!roster.seasons) roster.seasons = {};
  if (!roster.seasons[targetSeason]) {
    roster.seasons[targetSeason] = { players: roster.players ?? [] };
  }
  roster.seasons[targetSeason].calendar = fixtures;

  await saveRostersStateForAccount(scope.scopeId, payload);

  const headers: HeadersInit = {};
  if (scope.setCookieHeader) {
    headers["Set-Cookie"] = scope.setCookieHeader;
  }

  return Response.json(
    { ok: true, matchCount: fixtures.length, season: targetSeason },
    { headers },
  );
};
