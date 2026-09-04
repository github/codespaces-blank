import { useState } from "react";
import { useTeams } from "~/context/TeamsContext";
import type { Championship } from "~/types/tracker";
import {
  TOP14_CLUBS_2026_2027,
  PROD2_CLUBS_2026_2027,
  ELITE1_CLUBS_2025_2026,
  type ClubInfo,
} from "~/utils/clubs";

export function meta() {
  return [{ title: "Classements" }];
}

const STANDINGS_BY_CHAMPIONSHIP: Partial<Record<Championship, ClubInfo[]>> = {
  "Top 14": TOP14_CLUBS_2026_2027,
  "Pro D2": PROD2_CLUBS_2026_2027,
  "Elite 1": ELITE1_CLUBS_2025_2026,
};

const CHAMPIONSHIP_OPTIONS: Championship[] = ["Top 14", "Pro D2", "Elite 1"];

function getRankStyle(rank: number): string {
  if (rank <= 2) return "text-yellow-400 font-bold";
  if (rank <= 6) return "text-green-400 font-semibold";
  if (rank >= 13) return "text-red-400";
  return "text-neutral-300";
}

function ColorDot({ color }: { color: string }) {
  return (
    <span
      className="inline-block w-3 h-3 rounded-full border border-white/20 shrink-0"
      style={{ backgroundColor: color }}
    />
  );
}

export default function StandingsPage() {
  const { championship: contextChampionship } = useTeams();

  const defaultChampionship: Championship =
    CHAMPIONSHIP_OPTIONS.includes(contextChampionship as Championship)
      ? (contextChampionship as Championship)
      : "Top 14";

  const [selected, setSelected] = useState<Championship>(defaultChampionship);

  const clubs = STANDINGS_BY_CHAMPIONSHIP[selected] ?? [];

  const totalClubs = clubs.length;

  return (
    <main className="sp-page">
      <div className="mx-auto w-full max-w-2xl px-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Classement
          </h1>
          {/* Sélecteur de championnat */}
          <div className="flex items-center gap-1 flex-wrap">
            {CHAMPIONSHIP_OPTIONS.map((champ) => (
              <button
                key={champ}
                onClick={() => setSelected(champ)}
                className={`px-3 py-1.5 rounded border text-sm font-medium transition-colors ${
                  selected === champ
                    ? "border-blue-500 bg-blue-500/20 text-blue-300"
                    : "border-neutral-700 bg-neutral-900 text-neutral-300 hover:bg-neutral-800"
                }`}
              >
                {champ === "Women's Six Nations" ? "W6N" : champ}
              </button>
            ))}
          </div>
        </div>

        {/* Saison */}
        <p className="text-xs text-neutral-500 mb-4">
          Saison 2026/2027 — données statiques (mise à jour dynamique à venir)
        </p>

        {clubs.length === 0 ? (
          <p className="text-neutral-400 text-sm">
            Aucun classement disponible pour {selected}.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-neutral-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-500 text-xs uppercase">
                  <th className="py-2 px-3 text-left w-8">#</th>
                  <th className="py-2 px-3 text-left">Club</th>
                  <th className="py-2 px-3 text-right w-12">Pts</th>
                </tr>
              </thead>
              <tbody>
                {clubs.map((club, idx) => {
                  const rank = club.currentRanking ?? idx + 1;
                  const isPlayoff = rank <= 6;
                  const isReleg = rank >= totalClubs - 1;
                  return (
                    <tr
                      key={club.name}
                      className={`border-b border-neutral-800/60 transition-colors hover:bg-neutral-800/40 ${
                        idx % 2 === 0 ? "bg-neutral-900/30" : ""
                      }`}
                    >
                      <td className={`py-2.5 px-3 tabular-nums ${getRankStyle(rank)}`}>
                        {rank}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <ColorDot color={club.color} />
                          <span className="text-white font-medium">{club.name}</span>
                          <span className="text-neutral-500 text-xs ml-1">{club.nickname}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-right tabular-nums font-semibold text-neutral-200">
                        {club.currentPoints ?? "—"}
                        {isPlayoff && rank <= 2 && (
                          <span className="ml-1.5 text-[10px] text-yellow-500 font-normal">↑</span>
                        )}
                        {isReleg && (
                          <span className="ml-1.5 text-[10px] text-red-500 font-normal">↓</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Légende */}
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-neutral-500">
          <span><span className="text-yellow-400 font-semibold">↑</span> Top 2 — phase finale</span>
          <span><span className="text-green-400">6 premiers</span> — qualifiés playoffs</span>
          <span><span className="text-red-400">↓</span> Zone relégation</span>
        </div>
      </div>
    </main>
  );
}
