import type { ActionFunction, LoaderFunction } from "react-router";
import crypto from "crypto";
import { resolveDataScopeFromRequest } from "~/utils/account.server";
import {
    deleteSummary,
    insertSummary,
    listSummaries,
    getRostersStateForAccount,
    saveRostersStateForAccount,
    type StoredSummary,
} from "~/utils/database.server";
import { updatePlayerStatsFromEvents } from "~/utils/PlayerStatsSync";
import type { Roster, Event } from "~/types/tracker";
import { summaryCreateSchema, summaryDeleteSchema, parsePayload } from "~/utils/schemas.server";

interface SummariesData {
    summaries: StoredSummary[];
}

export const loader: LoaderFunction = async ({ request }) => {
    const scope = await resolveDataScopeFromRequest(request);
    const payload: SummariesData = { summaries: await listSummaries(scope.scopeId) };

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
        const parsed = parsePayload(summaryCreateSchema, raw);
        if (!parsed.success) return parsed.response;
        const payload = parsed.data;

        const summary: StoredSummary = {
            accountId: scope.scopeId,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            currentTime: payload.currentTime,
            summary: payload.summary,
            events: payload.events,
            teams: payload.teams,
            matchDay: payload.matchDay,
            matchDate: payload.matchDate,
            matchField: payload.matchField,
            matchReferee: payload.matchReferee,
        };
        await insertSummary(summary);

        // Update player stats from events
        try {
            const rostersState = await getRostersStateForAccount(scope.scopeId);
            const rosters = rostersState.rosters;
            
            // Type guard: verify rosters is an array before processing
            if (Array.isArray(rosters)) {
                const events = payload.events as Event[] | unknown;
                const eventsArray = Array.isArray(events) ? events : [];
                const teams = payload.teams || [];
                
                const updatedRosters = updatePlayerStatsFromEvents(
                    rosters as Roster[],
                    eventsArray as Event[],
                    teams
                );
                
                await saveRostersStateForAccount(scope.scopeId, {
                    ...rostersState,
                    rosters: updatedRosters,
                });
            }
        } catch (error) {
            // Log error but don't fail the summary save
            console.error("Error updating player stats:", error);
        }

        if (!scope.setCookieHeader) {
            return { ok: true, id: summary.id };
        }
        return Response.json(
            { ok: true, id: summary.id },
            {
                headers: {
                    "Set-Cookie": scope.setCookieHeader,
                },
            }
        );
    }

    if (request.method === "DELETE") {
        const raw = await request.json();
        const parsed = parsePayload(summaryDeleteSchema, raw);
        if (!parsed.success) return parsed.response;
        await deleteSummary(parsed.data.id, scope.scopeId);

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