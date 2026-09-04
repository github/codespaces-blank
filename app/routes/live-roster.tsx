import { useMemo } from "react";
import { useLoaderData } from "react-router";
import { useTeams } from "~/context/TeamsContext";
import { getLiveMatchByPublicSlug } from "~/utils/database.server";

export async function loader({ params }: { params: { publicSlug?: string } }) {
  const publicSlug = params.publicSlug;
  if (!publicSlug) {
    throw new Response("Not Found", { status: 404 });
  }

  const liveMatch = await getLiveMatchByPublicSlug(publicSlug);
  if (!liveMatch || !liveMatch.state) {
    throw new Response("Not Found", { status: 404 });
  }

  const state = liveMatch.state as { team1Id?: string; team2Id?: string };
  if (!state.team1Id || !state.team2Id) {
    throw new Response("Live state unavailable", { status: 404 });
  }

  return {
    publicSlug,
    team1Id: state.team1Id,
    team2Id: state.team2Id,
  };
}

export function meta() {
  return [{ title: "Effectifs Live" }];
}

export default function LiveRosterPage() {
  const { team1Id, team2Id } = useLoaderData<typeof loader>();
  const { teams } = useTeams();

  const liveTeams = useMemo(() => {
    return [team1Id, team2Id]
      .map((teamId) => teams.find((team) => team.id === teamId))
      .filter(Boolean);
  }, [team1Id, team2Id, teams]);

  return (
    <main className="sp-page space-y-4">
      <h1 className="leading-[0.95] font-bold tracking-[-0.03em] text-4xl text-center text-white">Effectifs</h1>
      {liveTeams.length === 0 ? (
        <p className="text-sm text-neutral-400">Chargement des compositions du match en cours...</p>
      ) : (
        <div className="space-y-4">
          {liveTeams.map((team) => (
            <article key={team!.id} className="sp-panel space-y-3">
              <h2 className="text-lg font-semibold text-white text-center">
                {team!.nickname || team!.name.replace(/\s+J\d+$/, "")}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <section className="space-y-2">
                  <h3 className="text-sm font-semibold text-white">Titulaires</h3>
                  <ul className="space-y-1 text-sm text-neutral-200">
                    {team!.starters
                      .slice()
                      .sort((a, b) => a.number - b.number)
                      .map((entry) => (
                        <li key={`${team!.id}-starter-${entry.player.id}`}>
                          #{entry.number} {entry.player.name}
                        </li>
                      ))}
                  </ul>
                </section>
                <section className="space-y-2">
                  <h3 className="text-sm font-semibold text-white">Remplaçants</h3>
                  <ul className="space-y-1 text-sm text-neutral-200">
                    {team!.substitutes
                      .slice()
                      .sort((a, b) => a.number - b.number)
                      .map((entry) => (
                        <li key={`${team!.id}-sub-${entry.player.id}`}>
                          #{entry.number} {entry.player.name}
                        </li>
                      ))}
                  </ul>
                </section>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
