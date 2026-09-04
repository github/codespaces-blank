import { Link, useLoaderData } from "react-router";
import {
  getRostersStateForAccount,
  listMatchDaySelections,
  listSummaries,
} from "~/utils/database.server";
import { requireAdmin, resolveDataScopeFromRequest } from "~/utils/account.server";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft} from "@fortawesome/free-solid-svg-icons";

export function meta() {
  return [{ title: "Diagnostic DB" }];
}

export async function loader({ request }: { request: Request }) {
  await requireAdmin(request);
  const scope = await resolveDataScopeFromRequest(request);
  const rostersState = await getRostersStateForAccount(scope.scopeId);
  const selections = await listMatchDaySelections(scope.scopeId);
  const summaries = await listSummaries(scope.scopeId);

  const payload = {
    rostersCount: Array.isArray(rostersState.rosters) ? rostersState.rosters.length : 0,
    teamsCount: Array.isArray(rostersState.teams) ? rostersState.teams.length : 0,
    scopeId: scope.scopeId,
    scopeLabel: scope.isAnonymous ? "Session anonyme (24h)" : scope.account?.name ?? "Compte",
    activeRosterId: rostersState.activeRosterId,
    matchDay: rostersState.matchDay ?? "",
    sport: rostersState.sport ?? "Rugby",
    championship: rostersState.championship ?? "Top 14",
    selectionsCount: selections.length,
    summariesCount: summaries.length,
    selectionsPreview: selections.slice(0, 20),
    summariesPreview: summaries.slice(0, 20).map((item) => ({
      id: item.id,
      createdAt: item.createdAt,
      matchDay: item.matchDay,
      teams: item.teams ?? [],
      eventsCount: Array.isArray(item.events) ? item.events.length : 0,
    })),
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

function JsonBlock({ value }: { value: unknown }) {
  return (
    <pre className="text-xs overflow-x-auto bg-neutral-950 border border-neutral-700 rounded p-3">
      {JSON.stringify(value, null, 2)}
    </pre>
  );
}

export default function AdminDbPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <main className="sp-page space-y-4">
      <h1 className="text-2xl font-bold">Diagnostic base de données</h1>
      <p className="text-sm text-gray-300">
        Page de lecture seule pour vérifier les données PostgreSQL (Render).
      </p>

      <section className="space-y-2">
        <h2 className="font-semibold">Scope des données</h2>
        <ul className="text-sm space-y-1">
          <li>Libellé : {data.scopeLabel}</li>
          <li className="break-all">ID: {data.scopeId}</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold">État des effectifs</h2>
        <ul className="text-sm space-y-1">
          <li>Effectifs : {data.rostersCount}</li>
          <li>Équipes composées : {data.teamsCount}</li>
          <li>Effectif actif : {data.activeRosterId || "(aucun)"}</li>
          <li>Journée : {data.matchDay || "(vide)"}</li>
          <li>Sport: {data.sport}</li>
          <li>Championnat: {data.championship}</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold">Sélections match sauvegardées ({data.selectionsCount})</h2>
        <JsonBlock value={data.selectionsPreview} />
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold">Synthèses sauvegardées ({data.summariesCount})</h2>
        <JsonBlock value={data.summariesPreview} />
      </section>

      <Link to="/" className="text-white text-base underline">
        <FontAwesomeIcon icon={faArrowLeft} className="text-xs mr-1" />
        Retour à l'accueil
      </Link>
    </main>
  );
}
