import type { ActionFunction, LoaderFunction } from "react-router";
import { resolveDataScopeFromRequest } from "~/utils/account.server";
import {
    getRostersStateForAccount,
    saveRostersStateForAccount,
    type RosterStatePayload,
} from "~/utils/database.server";
import { rosterStatePayloadSchema, parsePayload } from "~/utils/schemas.server";

export const loader: LoaderFunction = async ({ request }) => {
    const scope = await resolveDataScopeFromRequest(request);
    const payload = await getRostersStateForAccount(scope.scopeId);

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
    const raw = await request.json();
    const parsed = parsePayload(rosterStatePayloadSchema, raw);
    if (!parsed.success) return parsed.response;
    await saveRostersStateForAccount(scope.scopeId, parsed.data as RosterStatePayload);

    if (!scope.setCookieHeader) {
        return null;
    }

    return Response.json(
        { ok: true },
        {
            headers: {
                "Set-Cookie": scope.setCookieHeader,
            },
        }
    );
};

