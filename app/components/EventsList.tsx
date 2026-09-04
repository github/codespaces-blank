import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useRef, useEffect, useState } from "react";
import type { Event } from "~/types/tracker";
import {
  displayTeamName,
  formatEventTimeline,
  formatSummaryStatLabel,
  getEventLabel,
  isCardEvent,
} from "~/utils/eventPresentation";

interface Props {
  events: Event[];
  showKickoff: boolean;
  leftTeamId?: string;
  rightTeamId?: string;
  allowRemove?: boolean;
  showSummaryTables?: boolean;
  remove: (index: number) => void;
}

export default function EventsList({ events, showKickoff, leftTeamId, rightTeamId, allowRemove = true, showSummaryTables = true, remove }: Props) {
  const prevCountRef = useRef(events.length);
  // flashGeneration est un timestamp (Date.now()) non-null pendant 8 s après l'ajout d'un événement.
  // Pendant ce temps, le premier élément (idx === 0) reçoit l'animation "new-event-flash".
  // On utilise idx === 0 car matchFactsEvents est triée du plus récent au plus ancien :
  // le dernier événement ajouté est toujours à l'index 0.
  const [flashGeneration, setFlashGeneration] = useState<number | null>(null);

  useEffect(() => {
    const currentCount = events.length;
    if (currentCount > prevCountRef.current) {
      const gen = Date.now();
      setFlashGeneration(gen);
      const timer = setTimeout(() => setFlashGeneration(null), 8000);
      prevCountRef.current = currentCount;
      return () => clearTimeout(timer);
    }
    prevCountRef.current = currentCount;
  }, [events.length]);

  if (events.length === 0 && !showKickoff) {
    return <p>Aucune action enregistrée.</p>;
  }

  const timelineItems = [
    ...events.map((event) => ({ kind: "event" as const, event })),
    ...(showKickoff ? [{ kind: "kickoff" as const }] : []),
  ];

  function isHalfTimeSummaryEvent(event: Event): boolean {
    const label = event.summaryTable?.halfLabel?.toLowerCase() || "";
    return label.includes("mt1") || label.includes("mi-temps") || label.includes("mi temps");
  }

  function isFullTimeSummaryEvent(event: Event): boolean {
    const label = event.summaryTable?.halfLabel?.toLowerCase() || "";
    return label.includes("mt2") || label.includes("fin de match");
  }

  function getHalfTimeBannerText(event: Event): string {
    const score = event.summaryTable?.halfScore;
    return `Mi-temps${score ? ` ${score}` : ""}`;
  }

  function getFullTimeBannerText(event: Event): string {
    const score = event.summaryTable?.halfScore;
    return `Fin de match${score ? ` ${score}` : ""}`;
  }

  function renderSummaryEvent(event: Event, suppressHeader = false) {
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
        {!suppressHeader && (
          <div>
            {formatEventTimeline(event)} - <strong>{event.summaryTable.halfLabel}</strong>
          </div>
        )}
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

  function getMinuteBadgeClass(event: Event): string {
    const type = event.type.toLowerCase();
    if (type.includes("essai")) return "bg-emerald-600";
    if (type.includes("transformation")) return "bg-blue-600";
    if (type.includes("pénalité") || type.includes("drop")) return "bg-indigo-600";
    if (type.includes("carton rouge")) return "bg-red-600";
    if (type.includes("carton jaune")) return "bg-amber-500 text-black";
    if (type.includes("carton orange")) return "bg-orange-500 text-black";
    return "bg-neutral-700";
  }

  function renderEventContent(event: Event) {
    if (event.summary) {
      return renderSummaryEvent(event);
    }

    return (
      <>
        <div className="text-xs uppercase tracking-wide text-neutral-400">{getEventLabel(event)}</div>
        <div className="text-sm text-white break-words">
          {event.type !== "Arbitrage Vidéo" && event.player && (
            <>
              {isCardEvent(event.type) ? "Pour " : "De "}
              <strong>{event.player.name}</strong>
            </>
          )}
          {event.team && ` ${displayTeamName(event.team)}`}
          {event.playerOut && event.playerIn && (
            <>
              {" — "}
              <strong>{event.playerOutNumber ? `#${event.playerOutNumber} ` : ""}{event.playerOut.name}</strong>
              {" -> "}
              <strong>{event.playerInNumber ? `#${event.playerInNumber} ` : ""}{event.playerIn.name}</strong>
            </>
          )}
          {event.concussion && " commotion"}
        </div>
      </>
    );
  }

  function isEventOnLeft(event: Event, fallbackIndex: number): boolean {
    const eventTeamId = event.team?.id;
    if (eventTeamId && leftTeamId && eventTeamId === leftTeamId) return true;
    if (eventTeamId && rightTeamId && eventTeamId === rightTeamId) return false;
    return fallbackIndex % 2 === 0;
  }

  return (
    <ul className="relative space-y-3">
      <div className="pointer-events-none absolute left-4 top-0 bottom-0 w-px bg-neutral-700 sm:left-1/2 sm:-translate-x-1/2" />

      {timelineItems.map((item, idx) => {
        if (item.kind === "kickoff") {
          return (
            <li key="kickoff" className="relative">
              <div className="w-full rounded border border-blue-400/70 bg-indigo-700 px-3 py-2 text-center text-lg uppercase font-semibold text-white">
                Coup d'envoi !
              </div>
            </li>
          );
        }

        const event = item.event;
        const eventIndex = idx;
        const isHalfTimeSummary = Boolean(event.summaryTable && isHalfTimeSummaryEvent(event));
        const isFullTimeSummary = Boolean(event.summaryTable && isFullTimeSummaryEvent(event));
        const isLeft = isEventOnLeft(event, eventIndex);
        const flashClass = eventIndex === 0 && flashGeneration !== null ? " new-event-flash" : "";
        const minute = formatEventTimeline(event);

        if (isHalfTimeSummary || isFullTimeSummary) {
          return (
            <li key={idx} className="relative space-y-2">
              <div
                className={
                  isFullTimeSummary
                    ? "w-full rounded border border-red-400/70 bg-red-700 px-3 py-2 text-center text-lg uppercase font-semibold tracking-wide text-white shadow-sm"
                    : "w-full rounded border border-neutral-200 bg-white px-3 py-2 text-center text-lg uppercase font-semibold tracking-wide text-black shadow-sm"
                }
              >
                {isHalfTimeSummary ? getHalfTimeBannerText(event) : getFullTimeBannerText(event)}
              </div>

              {showSummaryTables && (
                <div className="relative">
                  <div className={`absolute left-1/2 -top-2 z-10 -translate-x-1/2 rounded px-2 py-0.5 text-[10px] font-bold text-white ${getMinuteBadgeClass(event)}`}>
                    {minute}
                  </div>
                  <article className={`w-full rounded border border-neutral-700 bg-neutral-900 p-3 pt-5 pr-12 relative${flashClass}`}>
                    {allowRemove && (
                      <button className="sp-button sp-button-xs sp-button-red absolute right-2 top-2" onClick={() => remove(eventIndex)}>
                        <FontAwesomeIcon icon={faTrashCan} />
                      </button>
                    )}
                    {renderSummaryEvent(event, true)}
                  </article>
                </div>
              )}
            </li>
          );
        }

        return (
          <li key={idx} className="relative">
            <div className="sm:hidden relative pl-10">
              <div className={`absolute left-[2px] top-2 z-10 rounded px-2 py-0.5 text-[10px] font-bold text-white ${getMinuteBadgeClass(event)}`}>
                {minute}
              </div>
              <article className={`rounded border border-neutral-700 bg-neutral-900 p-3 pr-12 relative${flashClass}`}>
                {allowRemove && (
                  <button className="sp-button sp-button-xs sp-button-red absolute right-2 top-2" onClick={() => remove(eventIndex)}>
                    <FontAwesomeIcon icon={faTrashCan} />
                  </button>
                )}
                {renderEventContent(event)}
              </article>
            </div>

            <div className="hidden sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-start sm:gap-4">
              <div className={`${isLeft ? "block" : "invisible"}`}>
                <article className={`rounded border border-neutral-700 bg-neutral-900 p-3 pr-12 relative${flashClass}`}>
                  {allowRemove && (
                    <button className="sp-button sp-button-xs sp-button-red absolute right-2 top-2" onClick={() => remove(eventIndex)}>
                      <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                  )}
                  {renderEventContent(event)}
                </article>
              </div>

              <div className="relative z-10 flex w-14 justify-center pt-1">
                <div className={`rounded px-2 py-0.5 text-[10px] font-bold text-white ${getMinuteBadgeClass(event)}`}>
                  {minute}
                </div>
              </div>

              <div className={`${isLeft ? "invisible" : "block"}`}>
                <article className={`rounded border border-neutral-700 bg-neutral-900 p-3 pr-12 relative${flashClass}`}>
                  {allowRemove && (
                    <button className="sp-button sp-button-xs sp-button-red absolute right-2 top-2" onClick={() => remove(eventIndex)}>
                      <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                  )}
                  {renderEventContent(event)}
                </article>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
