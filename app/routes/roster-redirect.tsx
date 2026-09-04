import { useEffect, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router";
import type { Route } from "./+types/roster-redirect";
import { useTeams } from "~/context/TeamsContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export function meta({}: Route.MetaArgs) {
    return [{ title: "Redirection roster" }];
}

function getRosterIdFromParam(rosterSlugId: string | undefined): string | null {
    if (!rosterSlugId) return null;
    const idx = rosterSlugId.lastIndexOf("_");
    if (idx === -1) return rosterSlugId;
    return rosterSlugId.slice(idx + 1);
}

function getRosterPath(category: "Top 14" | "Pro D2" | "Elite 1" | "Women's Six Nations" | "World Series" | undefined, name: string, id: string) {
    let championshipSlug: string;
    if (category === "Pro D2") championshipSlug = "prod2";
    else if (category === "Elite 1") championshipSlug = "elite1";
    else if (category === "Women's Six Nations") championshipSlug = "w6n";
    else if (category === "World Series") championshipSlug = "world-series";
    else championshipSlug = "top14";
    const slug = name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");
    return `/roster/${championshipSlug}/${slug}_${id}`;
}

export default function RosterRedirectPage() {
    const navigate = useNavigate();
    const { rosterSlugId } = useParams();
    const { rosters } = useTeams();

    const rosterId = getRosterIdFromParam(rosterSlugId);
    const roster = useMemo(
        () => rosters.find((item) => item.id === rosterId) ?? null,
        [rosters, rosterId]
    );

    useEffect(() => {
        if (!roster) return;
        navigate(getRosterPath(roster.category, roster.name, roster.id), { replace: true });
    }, [navigate, roster]);

    if (rosters.length === 0) {
        return (
            <main className="sp-page space-y-4">
                <p className="text-sm text-neutral-400">Chargement de l'effectif...</p>
                <Link to="/roster" className="sp-link-muted">
                    <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
                    Retour aux effectifs
                </Link>
            </main>
        );
    }

    if (!roster) {
        return (
            <main className="sp-page space-y-4">
                <h1 className="text-xl font-bold">Effectif introuvable</h1>
                <p className="text-sm text-neutral-300">Cet effectif n'existe pas ou a été supprimé.</p>
                <Link to="/roster" className="sp-link-muted">
                    <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
                    Retour aux effectifs
                </Link>
            </main>
        );
    }

    return (
        <main className="sp-page space-y-4">
            <p className="text-sm text-neutral-400">Redirection en cours...</p>
        </main>
    );
}
