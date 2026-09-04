import type { Route } from "./+types/well-known-devtools";

export function loader({}: Route.LoaderArgs) {
    return new Response("{}", {
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
        },
    });
}

export default function WellKnownDevtoolsRoute() {
    return null;
}
