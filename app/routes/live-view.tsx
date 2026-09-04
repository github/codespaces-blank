import { useEffect, useRef, useState } from "react";
import { useLoaderData } from "react-router";
import Scoreboard from "~/components/Scoreboard";
import type { LiveSnapshot, LiveStreamMessage } from "~/types/live";
import type { Team } from "~/types/tracker";
import { formatTime } from "~/utils/TimeUtils";
import { getLiveMatchByPublicSlug } from "~/utils/database.server";
import {
  displayTeamName,
  formatEventTimeline,
  formatStatLabel,
  formatSummaryStatLabel,
  getEventLabel,
  isCardEvent,
} from "~/utils/eventPresentation";

function renderSummaryEvent(event: LiveSnapshot["events"][number]) {
  if (!event.summaryTable) {
    return (
      <>
        {formatEventTimeline(event)} - <strong>{event.summary}</strong>
      </>
    );
  }

  const [leftTeam, rightTeam] = event.summaryTable.teams;
  const rowCount = Math.max(leftTeam.stats.length, rightTeam.stats.length);

  return (
    <div className="w-full space-y-2">
      <div>
        {formatEventTimeline(event)} - <strong>{event.summaryTable.halfLabel}</strong>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm border border-neutral-700 rounded">
          <thead>
            <tr className="bg-neutral-900">
              <th className="w-1/2 px-2 py-1 text-left border-b border-neutral-700">{leftTeam.teamName}</th>
              <th className="w-1/2 px-2 py-1 text-left border-b border-neutral-700">{rightTeam.teamName}</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rowCount }).map((_, idx) => {
              const leftStat = leftTeam.stats[idx];
              const rightStat = rightTeam.stats[idx];
              return (
                <tr key={idx} className="border-b border-neutral-800 last:border-b-0">
                  <td className="px-2 py-1">
                    {leftStat ? (
                      <>
                        <span>{formatSummaryStatLabel(leftStat.label, leftStat.value)}: </span>
                        <span className="font-bold text-green-400">{leftStat.value}</span>
                      </>
                    ) : "-"}
                  </td>
                  <td className="px-2 py-1">
                    {rightStat ? (
                      <>
                        <span>{formatSummaryStatLabel(rightStat.label, rightStat.value)}: </span>
                        <span className="font-bold text-blue-400">{rightStat.value}</span>
                      </>
                    ) : "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export async function loader({ params }: { params: { publicSlug?: string } }) {
  const publicSlug = params.publicSlug;
  if (!publicSlug) {
    throw new Response("Not Found", { status: 404 });
  }

  const liveMatch = await getLiveMatchByPublicSlug(publicSlug);
  if (!liveMatch) {
    throw new Response("Not Found", { status: 404 });
  }

  return { publicSlug };
}

export function meta() {
  return [{ title: "Live Match" }];
}

type LiveAvailability = "active" | "closed" | "expired";

function StatusBadge({ availability }: { availability: LiveAvailability }) {
  if (availability === "closed") {
    return <span className="sp-badge sp-badge-amber">Live terminé</span>;
  }

  if (availability === "expired") {
    return <span className="sp-badge sp-badge-neutral">Session expirée</span>;
  }

  return <span className="sp-badge sp-badge-emerald">Live actif</span>;
}

export default function LiveViewPage() {
  const { publicSlug } = useLoaderData<typeof loader>();
  const [snapshot, setSnapshot] = useState<LiveSnapshot | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string>("");
  const [availability, setAvailability] = useState<LiveAvailability>("active");
  const [isLoading, setIsLoading] = useState(true);
  const [isNewEventHighlighted, setIsNewEventHighlighted] = useState(false);
  const [unseenCount, setUnseenCount] = useState(0);
  const [recentCount, setRecentCount] = useState(0);
  const prevEventCountRef = useRef(-1);
  const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recentTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTabVisibleRef = useRef(typeof document !== "undefined" ? !document.hidden : true);

  useEffect(() => {
    let mounted = true;

    fetch(`/api/live/${publicSlug}/state`)
      .then(async (r) => {
        if (r.status === 410) {
          return { availability: "expired" as LiveAvailability };
        }
        if (!r.ok) return null;
        return r.json();
      })
      .then((data: { state?: LiveSnapshot; updatedAt?: string; availability?: LiveAvailability } | null) => {
        if (!mounted || !data) return;
        if (data.availability) {
          setAvailability(data.availability);
        }
        if (!data.state || !data.updatedAt) return;
        setSnapshot(data.state);
        setUpdatedAt(data.updatedAt);
        if (prevEventCountRef.current === -1) {
          prevEventCountRef.current = data.state.events.length;
        }
      })
      .catch(() => {
        // Keep UI state as-is when initial fetch fails.
      })
      .finally(() => {
        if (mounted) {
          setIsLoading(false);
        }
      });

    const source = new EventSource(`/api/live/${publicSlug}/stream`);
    source.onmessage = (message) => {
      const parsed = JSON.parse(message.data) as LiveStreamMessage;
      if (parsed.type !== "snapshot") return;
      if (parsed.availability) {
        setAvailability(parsed.availability);
      } else if (parsed.payload.matchEnded) {
        setAvailability("closed");
      }
      setSnapshot(parsed.payload);
      setUpdatedAt(parsed.updatedAt);

      const newCount = parsed.payload.events.length;
      if (prevEventCountRef.current === -1) {
        // Premier message SSE = baseline, pas de highlight
        prevEventCountRef.current = newCount;
      } else if (newCount > prevEventCountRef.current) {
        const delta = newCount - prevEventCountRef.current;
        const isVisited = isTabVisibleRef.current && document.hasFocus();

        if (!isVisited) {
          setUnseenCount((c) => c + delta);
        }

        setRecentCount((c) => c + delta);
        if (recentTimerRef.current) clearTimeout(recentTimerRef.current);
        recentTimerRef.current = setTimeout(() => {
          if (mounted) setRecentCount(0);
        }, 8000);

        setIsNewEventHighlighted(true);
        if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
        highlightTimerRef.current = setTimeout(() => {
          if (mounted) setIsNewEventHighlighted(false);
        }, 8000);
        prevEventCountRef.current = newCount;
      } else {
        prevEventCountRef.current = newCount;
      }
    };

    source.onerror = () => {
      source.close();
    };

    return () => {
      mounted = false;
      source.close();
      if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
      if (recentTimerRef.current) clearTimeout(recentTimerRef.current);
    };
  }, [publicSlug]);

  useEffect(() => {
    const handleVisibility = () => {
      isTabVisibleRef.current = !document.hidden;
      if (!document.hidden) setUnseenCount(0);
    };
    const handleFocus = () => {
      isTabVisibleRef.current = !document.hidden;
      setUnseenCount(0);
    };
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", handleFocus);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  useEffect(() => {
    const base = "Live Match";
    const badgeCount = unseenCount > 0 ? unseenCount : recentCount;
    if (badgeCount > 0) {
      const label = badgeCount > 1 ? "nouvelles actions" : "nouvelle action";
      document.title = `(${badgeCount}) ${label} | ${base}`;
    } else {
      document.title = base;
    }
    return () => { document.title = base; };
  }, [unseenCount, recentCount]);

  if (!snapshot && isLoading) {
    return (
      <main className="sp-page space-y-4">
        <h1 className="text-3xl font-bold">Feuille de match en direct</h1>
        <p className="text-sm text-neutral-400">Chargement du direct...</p>
      </main>
    );
  }

  if (!snapshot && availability === "expired") {
    return (
      <main className="sp-page space-y-4">
        <h1 className="text-3xl font-bold">Feuille de match en direct</h1>
        <StatusBadge availability={availability} />
        <p className="text-sm text-neutral-300">Cette session de diffusion n'est plus disponible.</p>
      </main>
    );
  }

  if (!snapshot) {
    return (
      <main className="sp-page space-y-4">
        <h1 className="text-3xl font-bold">Feuille de match en direct</h1>
        <StatusBadge availability={availability} />
        <p className="text-sm text-neutral-300">Le live n'est pas accessible pour le moment.</p>
      </main>
    );
  }

  const mainTimerText = snapshot.matchEnded ? "Match terminé" : formatTime(snapshot.currentTime);
  const teams: Team[] = snapshot.teams.map((team) => ({
    id: team.id,
    name: team.name,
    nickname: team.nickname,
    rosterId: "live",
    starters: [],
    substitutes: [],
  }));
  const liveEvents = [...snapshot.events].reverse();
  const teamStats = [
    { label: "Pénalité", values: snapshot.penalties },
    { label: "En-avant", values: snapshot.enAvant },
    { label: "Touche perdue", values: snapshot.touchePerdue },
    { label: "Mêlée perdue", values: snapshot.meleePerdue },
    { label: "Turnover", values: snapshot.turnover || [0, 0] },
    { label: "Jeu au pied", values: snapshot.jeuAuPied || [0, 0] },
  ];

  return (
    <main className="sp-page space-y-6">
      <h1 className="text-3xl font-bold text-center">Feuille de match en direct</h1>
      <div className="text-center">
        <StatusBadge availability={availability} />
      </div>
      {updatedAt && <p className="text-center text-sm text-neutral-400">Mise à jour: {new Date(updatedAt).toLocaleTimeString("fr-FR")}</p>}

      <Scoreboard
        teams={teams}
        scores={snapshot.scores}
        mainTimerText={mainTimerText}
        currentTime={snapshot.currentTime}
        events={snapshot.events}
      />

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Événements</h2>
        {snapshot.events.length === 0 ? (
          <p>Aucune action enregistrée.</p>
        ) : (
          <div className="max-h-[28rem] overflow-y-auto pr-1">
            <ul className="space-y-1">
              {liveEvents.map((event, index) => (
                <li key={`${event.time}-${index}`} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-white">
                  <span className={`min-w-0 break-words${index === 0 && isNewEventHighlighted ? " new-event-flash" : ""}`}>
                    {event.summary ? (
                      renderSummaryEvent(event)
                    ) : (
                      <>
                        {formatEventTimeline(event)} - {getEventLabel(event)}
                        {event.type !== "Arbitrage Vidéo" && event.player && (
                          <>
                            {isCardEvent(event.type) ? " pour " : " de "}
                            <strong>{event.player.name}</strong>
                          </>
                        )}
                        {event.team && ` ${displayTeamName(event.team)}`}
                        {event.playerOut && event.playerIn && (
                          <>
                            {" — "}
                            <strong>{event.playerOutNumber ? `#${event.playerOutNumber} ` : ""}{event.playerOut.name}</strong>
                            {" → "}
                            <strong>{event.playerInNumber ? `#${event.playerInNumber} ` : ""}{event.playerIn.name}</strong>
                          </>
                        )}
                        {event.concussion && " 🚨 commotion"}
                      </>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
      
      <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {teams.slice(0, 2).map((team, teamIdx) => (
          <div key={team.id} className="sp-panel-compact space-y-3">
            <h3 className="text-sm sm:text-base font-semibold text-center text-white">
              {team.nickname || team.name.replace(/\s+J\d+$/, "")}
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {teamStats.map((stat) => (
                <div key={`${team.id}-${stat.label}`} className="rounded border border-neutral-800 bg-neutral-950 p-2 text-center">
                  {(() => {
                    const statValue = stat.values[teamIdx] || 0;
                    return (
                      <>
                  <p className="text-2xl leading-none text-white font-bold">
                    {statValue}
                  </p>
                  <p className="mt-1 text-[11px] sm:text-xs text-neutral-300 font-light">
                    {formatStatLabel(stat.label, statValue)}
                  </p>
                      </>
                    );
                  })()}
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
