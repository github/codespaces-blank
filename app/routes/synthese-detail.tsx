import { Link, useLoaderData } from "react-router";
import { useLayoutEffect, useState } from "react";
import type { Event } from "~/types/tracker";
import { exportSummaryToPdf } from "~/utils/EventUtils";
import { useTeams } from "~/context/TeamsContext";
import EventsList from "~/components/EventsList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faDownload } from "@fortawesome/free-solid-svg-icons";
import { getSummaryById } from "~/utils/database.server";
import { resolveDataScopeFromRequest } from "~/utils/account.server";
import {
    displayTeamName as displayEventTeamName,
    formatEventTimeline,
    formatSummaryStatLabel,
    getEventLabel,
    isCardEvent,
} from "~/utils/eventPresentation";

interface StoredSummary {
    id: string;
    createdAt: string;
    currentTime: number;
    summary: Record<string, number>;
    events: Event[];
    teams?: Array<{ id: string; name: string }>;
    matchDay?: number;
    matchDate?: string;
    matchField?: string;
    matchReferee?: string;
}

export async function loader({ request, params }: { request: Request; params: { summaryId?: string } }) {
    const summaryId = params.summaryId;
    if (!summaryId) {
        throw new Response("Not Found", { status: 404 });
    }

    const scope = await resolveDataScopeFromRequest(request);
    const summary = (await getSummaryById(summaryId, scope.scopeId)) as StoredSummary | null;
    if (!summary) {
        throw new Response("Not Found", { status: 404 });
    }

    if (!scope.setCookieHeader) {
        return summary;
    }

    return Response.json(summary, {
        headers: {
            "Set-Cookie": scope.setCookieHeader,
        },
    });
}

export function meta() {
    return [{ title: "Synthèse" }];
}

function FormattedDateTime({ dateString }: { dateString: string }) {
    const [formatted, setFormatted] = useState("");

    useLayoutEffect(() => {
        const date = new Date(dateString);
        setFormatted(date.toLocaleString("fr-FR"));
    }, [dateString]);

    return <span suppressHydrationWarning>{formatted}</span>;
}

export default function SyntheseDetailPage() {
    const summary = useLoaderData<typeof loader>();
    const { teams: allTeams } = useTeams();
    const STAT_LABEL_ORDER = [
        "Essais",
        "Pénalités",
        "En-avants",
        "Touches perdues",
        "Mêlées perdues",
        "Turnovers",
        "Jeu au pied",
    ];
    const displayTeamName = (name: string) => name.replace(/\s+J\d+$/, "");
    const getTeamsLabel = () => {
        const storedTeams: Array<{ id: string; name: string }> = summary.teams || [];
        let teamsLabel = "";
        if (storedTeams.length > 0) {
            const names = storedTeams.map((team) => displayTeamName(team.name));
            if (names.length >= 2) teamsLabel = `${names[0]} vs ${names[1]}`;
            else if (names.length === 1) teamsLabel = names[0];
        } else {
            const names: string[] = [];
            for (const event of summary.events) {
                if (!event.team?.name) continue;
                const cleaned = displayTeamName(event.team.name);
                if (!names.includes(cleaned)) {
                    names.push(cleaned);
                }
                if (names.length === 2) break;
            }
            if (names.length === 0 && summary.matchDay) {
                const fallback: string[] = [];
                for (const team of allTeams) {
                    if (!team.name.includes(`J${summary.matchDay}`)) continue;
                    const cleaned = displayTeamName(team.name);
                    if (!fallback.includes(cleaned)) {
                        fallback.push(cleaned);
                    }
                    if (fallback.length === 2) break;
                }
                if (fallback.length === 1) teamsLabel = fallback[0];
                else if (fallback.length >= 2) teamsLabel = `${fallback[0]} vs ${fallback[1]}`;
                else teamsLabel = "Match";
            } else if (names.length === 0) {
                teamsLabel = "Match";
            } else if (names.length === 1) teamsLabel = names[0];
            else teamsLabel = `${names[0]} vs ${names[1]}`;
        }
        
        if (summary.matchDay) {
            return `J${summary.matchDay} - ${teamsLabel}`;
        }
        return teamsLabel;
    };

    const getOrderedTeams = () => {
        const storedTeams = summary.teams || [];
        if (storedTeams.length >= 2) {
            return storedTeams.slice(0, 2).map((team) => ({ id: team.id, name: displayTeamName(team.name) }));
        }

        const inferred: Array<{ id: string; name: string }> = [];
        for (const event of summary.events) {
            if (!event.team?.id || !event.team.name) continue;
            if (inferred.some((team) => team.id === event.team?.id)) continue;
            inferred.push({ id: event.team.id, name: displayTeamName(event.team.name) });
            if (inferred.length === 2) break;
        }

        if (inferred.length >= 2) {
            return inferred;
        }

        if (summary.matchDay) {
            const fallback: Array<{ id: string; name: string }> = [];
            for (const team of allTeams) {
                if (!team.name.includes(`J${summary.matchDay}`)) continue;
                if (fallback.some((entry) => entry.id === team.id)) continue;
                fallback.push({ id: team.id, name: displayTeamName(team.name) });
                if (fallback.length === 2) break;
            }
            return fallback;
        }

        return inferred;
    };

    const orderedTeams = getOrderedTeams();

    const getSummaryByTeam = () => {
        if (orderedTeams.length < 2) return null;

        const counters = [new Map<string, number>(), new Map<string, number>()];

        summary.events.forEach((event) => {
            if (!event.team?.id) return;
            if (event.type === "Récapitulatif" || event.summaryTable || event.summary) return;

            const teamIndex = orderedTeams.findIndex((team) => team.id === event.team?.id);
            if (teamIndex === -1) return;

            const current = counters[teamIndex].get(event.type) || 0;
            counters[teamIndex].set(event.type, current + 1);
        });

        return {
            leftTeam: {
                teamName: orderedTeams[0].name,
                values: counters[0],
            },
            rightTeam: {
                teamName: orderedTeams[1].name,
                values: counters[1],
            },
        };
    };

    const getTeamStatsByHalf = () => {
        if (orderedTeams.length < 2) return null;

        type StatHalfValue = { mt1: number; mt2: number };
        const teamStats = [new Map<string, StatHalfValue>(), new Map<string, StatHalfValue>()];

        const ensureStat = (teamIndex: number, label: string) => {
            const current = teamStats[teamIndex].get(label);
            if (current) return current;
            const next = { mt1: 0, mt2: 0 };
            teamStats[teamIndex].set(label, next);
            return next;
        };

        summary.events.forEach((event) => {
            if ((event.type === "Essai" || event.type === "Essai de pénalité") && event.team?.id) {
                const teamIndex = orderedTeams.findIndex((team) => team.id === event.team?.id);
                if (teamIndex === -1) return;

                const half = event.timelineHalf || (event.time >= 40 * 60 ? 2 : 1);
                const tries = ensureStat(teamIndex, "Essais");
                if (half === 1) tries.mt1 += 1;
                else tries.mt2 += 1;
            }
        });

        summary.events.forEach((event) => {
            if (event.type !== "Récapitulatif" || !event.summaryTable) return;

            const half = event.summaryTable.halfLabel.toUpperCase().includes("2") ? 2 : 1;
            event.summaryTable.teams.slice(0, 2).forEach((team, teamIndex) => {
                team.stats.forEach((stat) => {
                    const values = ensureStat(teamIndex, stat.label);
                    if (half === 1) values.mt1 = stat.value;
                    else values.mt2 = stat.value;
                });
            });
        });

        const sortStats = (entries: Array<[string, StatHalfValue]>) => {
            return entries.sort((first, second) => {
                const firstIndex = STAT_LABEL_ORDER.indexOf(first[0]);
                const secondIndex = STAT_LABEL_ORDER.indexOf(second[0]);

                if (firstIndex === -1 && secondIndex === -1) {
                    return first[0].localeCompare(second[0], "fr", { sensitivity: "base" });
                }
                if (firstIndex === -1) return 1;
                if (secondIndex === -1) return -1;
                return firstIndex - secondIndex;
            });
        };

        return {
            leftTeam: {
                teamName: orderedTeams[0].name,
                stats: sortStats(Array.from(teamStats[0].entries())),
            },
            rightTeam: {
                teamName: orderedTeams[1].name,
                stats: sortStats(Array.from(teamStats[1].entries())),
            },
        };
    };

    const recapStats = getTeamStatsByHalf();
    const summaryByTeam = getSummaryByTeam();
    const factEvents = summary.events.filter((event) => !(event.type === "Récapitulatif" || event.summaryTable || event.summary));
    const timelineEvents = [...summary.events].reverse();
    const leftTeamId = orderedTeams[0]?.id;
    const rightTeamId = orderedTeams[1]?.id;
    const getPluralReferenceValue = (values: { mt1: number; mt2: number }) => Math.max(values.mt1, values.mt2);

    const scorePointsByType: Record<string, number> = {
        "Essai": 5,
        "Essai de pénalité": 7,
        "Transformation": 2,
        "Pénalité réussie": 3,
        "Drop": 3,
    };

    const getScoreByTeam = (onlyFirstHalf: boolean) => {
        if (orderedTeams.length < 2) return [0, 0] as const;

        const scores = [0, 0];
        summary.events.forEach((event) => {
            const points = scorePointsByType[event.type] || 0;
            if (!points || !event.team?.id) return;

            const teamIndex = orderedTeams.findIndex((team) => team.id === event.team?.id);
            if (teamIndex === -1) return;

            if (onlyFirstHalf) {
                const isFirstHalf =
                    event.timelineHalf === 1 ||
                    (event.timelineHalf == null && event.time < 40 * 60);
                if (!isFirstHalf) return;
            }

            scores[teamIndex] += points;
        });

        return [scores[0], scores[1]] as const;
    };

    const [finalScoreLeft, finalScoreRight] = getScoreByTeam(false);
    const [halfScoreLeft, halfScoreRight] = getScoreByTeam(true);
    const finalScoreText = orderedTeams.length >= 2
        ? `${orderedTeams[0].name} ${finalScoreLeft} - ${finalScoreRight} ${orderedTeams[1].name}`
        : `${finalScoreLeft} - ${finalScoreRight}`;
    const halfTimeScoreText = `${halfScoreLeft} - ${halfScoreRight}`;
    const summaryMatchDate = summary.matchDate
        ? new Date(`${summary.matchDate}T00:00:00`).toLocaleDateString("fr-FR")
        : null;

    return (
      <main className="sp-page space-y-4">
        <p className="text-sm text-gray-700 mb-2">
          Date: <FormattedDateTime dateString={summary.createdAt} />
        </p>

        <Link to="/syntheses" className="text-white text-base">
          <FontAwesomeIcon icon={faArrowLeft} className="mr-1" />
          Retour aux synthèses
        </Link>
        <br />
        <br />
        <button
          className="sp-button sp-button-md sp-button-neutral w-full sm:w-auto"
          onClick={() =>
            exportSummaryToPdf(
              summary.events,
              summary.currentTime,
              summary.summary,
              {
                title: `Synthèse - ${getTeamsLabel()}`,
                fileName: getTeamsLabel(),
                layout: {
                  dateLine: `Date: ${new Date(summary.createdAt).toLocaleString("fr-FR")}${summaryMatchDate ? ` | Match: ${summaryMatchDate}` : ""}${summary.matchField ? ` | Terrain: ${summary.matchField}` : ""}${summary.matchReferee ? ` | Arbitre: ${summary.matchReferee}` : ""}`,
                  scoreLine: `${finalScoreText}\n${halfTimeScoreText}`,
                  resumeColumns: summaryByTeam
                    ? [
                        {
                          title: summaryByTeam.leftTeam.teamName,
                          lines:
                            Array.from(
                              summaryByTeam.leftTeam.values.entries(),
                            ).map(([type, count]) => `${type}: ${count}`) || [],
                        },
                        {
                          title: summaryByTeam.rightTeam.teamName,
                          lines:
                            Array.from(
                              summaryByTeam.rightTeam.values.entries(),
                            ).map(([type, count]) => `${type}: ${count}`) || [],
                        },
                      ]
                    : undefined,
                  statsColumns: recapStats
                    ? [
                        {
                          title: recapStats.leftTeam.teamName,
                          lines: recapStats.leftTeam.stats.map(
                            ([label, values]) =>
                              `${formatSummaryStatLabel(label, getPluralReferenceValue(values))}: ${values.mt1} -> ${values.mt2}`,
                          ),
                        },
                        {
                          title: recapStats.rightTeam.teamName,
                          lines: recapStats.rightTeam.stats.map(
                            ([label, values]) =>
                              `${formatSummaryStatLabel(label, getPluralReferenceValue(values))}: ${values.mt1} -> ${values.mt2}`,
                          ),
                        },
                      ]
                    : undefined,
                  factsTitle: "Faits de match",
                  factLines: factEvents.map((event) => {
                    let line = `${formatEventTimeline(event)} - ${getEventLabel(event)}`;

                    if (event.type !== "Arbitrage Vidéo" && event.player) {
                      line += `${isCardEvent(event.type) ? " pour " : " de "}${event.player.name}`;
                    }
                    if (event.team) {
                      line += ` ${displayEventTeamName(event.team)}`;
                    }
                    if (event.playerOut && event.playerIn) {
                      line += ` - ${event.playerOutNumber ? `#${event.playerOutNumber} ` : ""}${event.playerOut.name}`;
                      line += ` -> ${event.playerInNumber ? `#${event.playerInNumber} ` : ""}${event.playerIn.name}`;
                    }
                    if (event.concussion) {
                      line += " - commotion";
                    }

                    return line;
                  }),
                },
              },
            )
          }
        >
          <FontAwesomeIcon icon={faDownload} className="mr-2" />
          Télécharger PDF
        </button>
        <h1 className="text-2xl text-center font-bold">{finalScoreText}</h1>
        <h3 className="text-xl text-center font-semibold">
          <span className="block text-base font-medium text-gray-300">
            ({halfTimeScoreText})
          </span>
        </h3>

        {(summaryMatchDate || summary.matchField || summary.matchReferee) && (
          <p className="text-sm text-white mb-2 text-center">
            {` Terrain: ${summary.matchField || "—"}`}
            {` | Arbitre: ${summary.matchReferee || "—"}`}
          </p>
        )}

        <section className="space-y-2">
          <h2 className="font-semibold">Résumé</h2>
          {!summaryByTeam ? (
            <p className="text-sm text-gray-600">
              Résumé par équipe indisponible.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-white">
              <div className="border border-neutral-700 bg-neutral-900 rounded p-3">
                <h3 className="font-semibold text-center mb-2">
                  {summaryByTeam.leftTeam.teamName}
                </h3>
                {summaryByTeam.leftTeam.values.size === 0 ? (
                  <p className="text-sm text-gray-400">
                    Aucun événement d'équipe.
                  </p>
                ) : (
                  <ul className="space-y-1 text-sm">
                    {Array.from(summaryByTeam.leftTeam.values.entries()).map(
                      ([type, count]) => (
                        <li key={`summary-left-${type}`}>
                          <span>{type}: </span>
                          <span className="font-bold text-green-400">
                            {count}
                          </span>
                        </li>
                      ),
                    )}
                  </ul>
                )}
              </div>
              <div className="border border-neutral-700 bg-neutral-900 rounded p-3">
                <h3 className="font-semibold mb-2">
                  {summaryByTeam.rightTeam.teamName}
                </h3>
                {summaryByTeam.rightTeam.values.size === 0 ? (
                  <p className="text-sm text-gray-400">
                    Aucun événement d'équipe.
                  </p>
                ) : (
                  <ul className="space-y-1 text-sm">
                    {Array.from(summaryByTeam.rightTeam.values.entries()).map(
                      ([type, count]) => (
                        <li key={`summary-right-${type}`}>
                          <span>{type}: </span>
                          <span className="font-bold text-blue-400">
                            {count}
                          </span>
                        </li>
                      ),
                    )}
                  </ul>
                )}
              </div>
            </div>
          )}
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold">Statistiques équipes</h2>
          {!recapStats ? (
            <p className="text-sm text-gray-600">
              Statistiques par équipe indisponibles.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-white">
              <div className="border border-neutral-700 bg-neutral-900 rounded p-3">
                <h3 className="font-semibold text-center mb-2">
                  {recapStats.leftTeam.teamName}
                </h3>
                <ul className="space-y-1 text-sm">
                  {recapStats.leftTeam.stats.map(([label, values], idx) => (
                    <li key={`left-${idx}`}>
                      <span>
                        {formatSummaryStatLabel(
                          label,
                          getPluralReferenceValue(values),
                        )}
                        :{" "}
                      </span>
                      <span className="font-bold text-green-400">
                        {values.mt1} -&gt; {values.mt2}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border border-neutral-700 bg-neutral-900 rounded p-3">
                <h3 className="font-semibold text-center mb-2">
                  {recapStats.rightTeam.teamName}
                </h3>
                <ul className="space-y-1 text-sm">
                  {recapStats.rightTeam.stats.map(([label, values], idx) => (
                    <li key={`right-${idx}`}>
                      <span>
                        {formatSummaryStatLabel(
                          label,
                          getPluralReferenceValue(values),
                        )}
                        :{" "}
                      </span>
                      <span className="font-bold text-blue-400">
                        {values.mt1} -&gt; {values.mt2}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold">Faits de match</h2>
          {timelineEvents.length === 0 ? (
            <p className="text-sm text-gray-600">Aucun événement.</p>
          ) : (
            <EventsList
              events={timelineEvents}
              showKickoff={false}
              leftTeamId={leftTeamId}
              rightTeamId={rightTeamId}
              allowRemove={false}
              showSummaryTables={false}
              remove={() => {}}
            />
          )}
        </section>
      </main>
    );
}
