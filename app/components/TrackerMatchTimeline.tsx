import type { Event } from "~/types/tracker";
import { EVENT_ICONS } from "~/utils/eventPresentation";

interface TrackerMatchTimelineProps {
    events: Event[];
    team1Id: string;
    team2Id: string;
    team1Label?: string;
    team2Label?: string;
}

function isTrackedMatchEvent(type: string): boolean {
    const normalizedType = type.trim().toLowerCase();
    return (
        normalizedType.includes("essai") ||
    normalizedType.includes("transformation") ||
        normalizedType.includes("pénalité") ||
        normalizedType.includes("drop") ||
        normalizedType.includes("carton")
    );
}

function getEventAbsoluteMinute(event: Event): number {
    if (typeof event.timelineMinute === "number") {
        const additional = event.timelineAdditionalMinute || 0;
        const seconds = event.timelineSecond ?? (event.time % 60);
        const baseMinute = event.timelineMinute + additional;
        return seconds > 0 ? baseMinute + 1 : baseMinute;
    }

    return Math.ceil(event.time / 60);
}

function getEventIcon(type: string): string {
  return EVENT_ICONS[type] || "⚪";
}

export default function TrackerMatchTimeline({
    events,
    team1Id,
    team2Id,
    team1Label = "Équipe 1",
    team2Label = "Équipe 2",
}: TrackerMatchTimelineProps) {
    const trackedEvents = events
        .filter((event) => isTrackedMatchEvent(event.type))
        .filter((event) => event.team?.id === team1Id || event.team?.id === team2Id);

    if (trackedEvents.length === 0) {
        return null;
    }

    const maxMinute = Math.max(80, ...trackedEvents.map((event) => getEventAbsoluteMinute(event)));

    const positionedEvents = trackedEvents.map((event) => {
        const minute = getEventAbsoluteMinute(event);
        const ratio = Math.max(0, Math.min(1, minute / maxMinute));
        return {
            event,
            minute,
            side: event.team?.id === team1Id ? "top" : "bottom",
            leftPercent: ratio * 100,
        } as const;
    });

    const minuteMarkers = Array.from(
        positionedEvents.reduce((acc, item) => {
            const key = `${item.side}-${item.minute}`;
            if (!acc.has(key)) {
                acc.set(key, {
                    minute: item.minute,
                    leftPercent: item.leftPercent,
                    side: item.side,
                });
            }
            return acc;
        }, new Map<string, { minute: number; leftPercent: number; side: "top" | "bottom" }>()).values()
    )
        .sort((a, b) => a.minute - b.minute);

    const laneCounter = new Map<string, number>();
    const timelineNodes = positionedEvents.map((item) => {
        const clusterKey = `${item.side}-${item.minute}`;
        const lane = laneCounter.get(clusterKey) || 0;
        laneCounter.set(clusterKey, lane + 1);
        return { ...item, lane };
    });

    return (
      <section className="sp-panel-compact space-y-2">
        <div className="text-sm font-semibold text-white">Timeline</div>

        <div className="relative overflow-x-auto pb-1">
          <div className="relative h-40 min-w-[560px]">
            <div className="grid h-full grid-cols-[4.5rem_1fr] gap-2">
              <div className="relative">
                <div className="absolute left-0 top-[28%] -translate-y-1/2 text-left text-xs font-semibold text-white">
                  {team1Label}
                </div>
                <div className="absolute left-0 top-[72%] -translate-y-1/2 text-left text-xs font-semibold text-white">
                  {team2Label}
                </div>
              </div>

              <div className="relative">
                <div className="absolute left-0 right-0 top-1/2 h-px bg-neutral-600" />

                <div
                  className="absolute rounded bg-white px-1.5 py-0.5 text-[10px] font-bold text-black"
                  style={{
                    left: "0",
                    top: "calc(50% - 9px)",
                    transform: "translateX(-112%)",
                  }}
                >
                  KO
                </div>

                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded bg-white px-1.5 py-0.5 text-[10px] font-bold text-black">
                  MT
                </div>
                <div
                  className="absolute rounded bg-white px-1.5 py-0.5 text-[10px] font-bold text-black"
                  style={{
                    right: "0",
                    top: "calc(50% - 9px)",
                    transform: "translateX(112%)",
                  }}
                >
                  FT
                </div>

                {minuteMarkers
                  .filter((marker) => marker.side === "top")
                  .map((marker) => (
                    <div
                      key={`minute-top-${marker.minute}`}
                      className="absolute z-20 -translate-x-1/2 text-center text-[10px] font-semibold text-white"
                      style={{
                        left: `${marker.leftPercent}%`,
                        top: "calc(50% - 16px)",
                      }}
                    >
                      {marker.minute}'
                    </div>
                  ))}

                {minuteMarkers
                  .filter((marker) => marker.side === "bottom")
                  .map((marker) => (
                    <div
                      key={`minute-bottom-${marker.minute}`}
                      className="absolute z-20 -translate-x-1/2 text-center text-[10px] font-semibold text-white"
                      style={{
                        left: `${marker.leftPercent}%`,
                        top: "calc(50% + 10px)",
                      }}
                    >
                      {marker.minute}'
                    </div>
                  ))}

                {timelineNodes.map((node, index) => {
                  const isTop = node.side === "top";
                  const laneOffset = node.lane * 20;
                  const topPosition = isTop
                    ? `calc(50% - ${36 + laneOffset}px)`
                    : `calc(50% + ${30 + laneOffset}px)`;
                  return (
                    <div
                      key={`${node.event.type}-${node.minute}-${index}`}
                      className="absolute -translate-x-1/2"
                      style={{
                        left: `${node.leftPercent}%`,
                        top: topPosition,
                      }}
                    >
                      <div className="text-sm leading-4 text-center">
                        {getEventIcon(node.event.type)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
}
