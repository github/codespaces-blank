import type { ActionFunction, LoaderFunction } from "react-router";
import { resolveDataScopeFromRequest } from "~/utils/account.server";
import {
    getMatchDaySelection,
    listMatchDaySelections,
    saveMatchDaySelection,
} from "~/utils/database.server";
import { matchDayTeamsSchema, parsePayload } from "~/utils/schemas.server";

export const loader: LoaderFunction = async ({ request }) => {
    const scope = await resolveDataScopeFromRequest(request);
    const url = new URL(request.url);
    const championship = url.searchParams.get("championship");
    const matchDay = url.searchParams.get("matchDay");

    if (championship && matchDay) {
        const normalizedMatchDay = parseInt(matchDay, 10);
        if (Number.isNaN(normalizedMatchDay)) {
            return { selection: null };
        }
        const payload = {
            selection: await getMatchDaySelection(
                scope.scopeId,
                championship,
                normalizedMatchDay
            ),
        };

        if (!scope.setCookieHeader) {
            return payload;
        }

        return Response.json(payload, {
            headers: {
                "Set-Cookie": scope.setCookieHeader,
            },
        });
    }

    const payload = { selections: await listMatchDaySelections(scope.scopeId) };

    if (!scope.setCookieHeader) {
        return payload;
    }

    return Response.json(payload, {
        headers: {
            "Set-Cookie": scope.setCookieHeader,
        },
    });
};

export const action: ActionFunction = async ({ request }) => {
    const scope = await resolveDataScopeFromRequest(request);

    if (request.method === "POST") {
        const raw = await request.json();
        const parsed = parsePayload(matchDayTeamsSchema, raw);
        if (!parsed.success) return parsed.response;
        const body = parsed.data;

        await saveMatchDaySelection({
            accountId: scope.scopeId,
            championship: body.championship,
            matchDay: body.matchDay,
            team1Id: body.team1Id,
            team2Id: body.team2Id,
        });
        if (!scope.setCookieHeader) {
            return { ok: true };
        }

        return Response.json(
            { ok: true },
            {
                headers: {
                    "Set-Cookie": scope.setCookieHeader,
                },
            }
        );
    }

    return null;
};
