import type { Event } from "~/types/tracker";

interface TrackerMatchEventsProps {
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
        normalizedType === "transformation" ||
        normalizedType.includes("pénalité") ||
        normalizedType.includes("drop") ||
        normalizedType.includes("carton")
    );
}

function getEventMinuteLabel(event: Event): string {
    if (typeof event.timelineMinute === "number") {
        const additional = event.timelineAdditionalMinute || 0;
        const seconds = event.timelineSecond ?? (event.time % 60);
        const absoluteMinute = event.timelineMinute + additional;
        const roundedMinute = seconds > 0 ? absoluteMinute + 1 : absoluteMinute;
        return `${roundedMinute}'`;
    }
    return `${Math.ceil(event.time / 60)}'`;
}

function formatPlayerDisplayName(fullName: string): string {
    const parts = fullName.trim().split(/\s+/).filter(Boolean);
    if (parts.length <= 1) return fullName;
    const [firstName, ...lastNameParts] = parts;
    return `${firstName.charAt(0).toUpperCase()}. ${lastNameParts.join(" ")}`;
}

function formatEventLine(event: Event): string {
    const minute = getEventMinuteLabel(event);
    const playerName = event.player?.name;

    if (playerName) {
        return `${formatPlayerDisplayName(playerName)} (${minute})`;
    }

    if (event.team?.nickname || event.team?.name) {
        const teamName = event.team.nickname || event.team.name.replace(/\s+J\d+$/, "");
        return `${teamName} (${minute})`;
    }

    return `${event.type} (${minute})`;
}

function formatTryLines(events: Event[]): string[] {
    const tryMinutesByPlayer = new Map<string, string[]>();
    const penaltyTryLines: string[] = [];

    for (const event of events) {
        if (event.type === "Essai" && event.player?.name) {
            const current = tryMinutesByPlayer.get(event.player.name) || [];
            current.push(getEventMinuteLabel(event));
            tryMinutesByPlayer.set(event.player.name, current);
            continue;
        }

        if (event.type === "Essai de pénalité") {
            penaltyTryLines.push(`Essai de pénalité (${getEventMinuteLabel(event)})`);
        }
    }

    return [
        ...Array.from(tryMinutesByPlayer.entries()).map(([playerName, minutes]) =>
            `${formatPlayerDisplayName(playerName)} (${minutes.join(", ")})`
        ),
        ...penaltyTryLines,
    ];
}

function renderTwoColumnsBlock(
    label: string,
    leftLines: string[],
    rightLines: string[],
    team1Label: string,
    team2Label: string
) {
    if (leftLines.length === 0 && rightLines.length === 0) {
        return null;
    }

    return (
        <section className="space-y-1.5">
            <p className="text-base text-neutral-300 text-center">{label}</p>
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 min-w-0 text-left">
                    {leftLines.map((line, index) => (
                        <p key={`left-${label}-${index}`} className="text-xs text-neutral-300 break-words">
                            {line}
                        </p>
                    ))}
                </div>
                <div className="space-y-1 min-w-0 text-right">
                    {rightLines.map((line, index) => (
                        <p key={`right-${label}-${index}`} className="text-xs text-neutral-300 break-words">
                            {line}
                        </p>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default function TrackerMatchEvents({ events, team1Id, team2Id, team1Label = "Équipe 1", team2Label = "Équipe 2" }: TrackerMatchEventsProps) {
    const trackedEvents = events.filter((event) => isTrackedMatchEvent(event.type));

    if (trackedEvents.length === 0) {
        return null;
    }

    const tryEvents = trackedEvents.filter((event) => event.type === "Essai" || event.type === "Essai de pénalité");
    const transformationEvents = trackedEvents.filter((event) => event.type.trim().toLowerCase() === "transformation");
    const penaltyEvents = trackedEvents.filter((event) => event.type.toLowerCase().includes("pénalité"));
    const dropEvents = trackedEvents.filter((event) => event.type === "Drop");
    const cardEvents = trackedEvents.filter((event) => event.type.toLowerCase().includes("carton"));

    const team1TryLines = formatTryLines(tryEvents.filter((event) => event.team?.id === team1Id));
    const team2TryLines = formatTryLines(tryEvents.filter((event) => event.team?.id === team2Id));

    const team1TransformationLines = transformationEvents
        .filter((event) => event.team?.id === team1Id)
        .map((event) => formatEventLine(event));
    const team2TransformationLines = transformationEvents
        .filter((event) => event.team?.id === team2Id)
        .map((event) => formatEventLine(event));

    const team1PenaltyLines = penaltyEvents
        .filter((event) => event.team?.id === team1Id)
        .map((event) => formatEventLine(event));
    const team2PenaltyLines = penaltyEvents
        .filter((event) => event.team?.id === team2Id)
        .map((event) => formatEventLine(event));

    const team1DropLines = dropEvents
        .filter((event) => event.team?.id === team1Id)
        .map((event) => formatEventLine(event));
    const team2DropLines = dropEvents
        .filter((event) => event.team?.id === team2Id)
        .map((event) => formatEventLine(event));

    const team1CardLines = cardEvents
        .filter((event) => event.team?.id === team1Id)
        .map((event) => formatEventLine(event));
    const team2CardLines = cardEvents
        .filter((event) => event.team?.id === team2Id)
        .map((event) => formatEventLine(event));

    return (
      <section className="sp-panel-compact space-y-2">
        {renderTwoColumnsBlock("Essais", team1TryLines, team2TryLines, team1Label, team2Label)}
        {renderTwoColumnsBlock("Transformations", team1TransformationLines, team2TransformationLines, team1Label, team2Label)}
        {renderTwoColumnsBlock("Pénalités", team1PenaltyLines, team2PenaltyLines, team1Label, team2Label)}
        {renderTwoColumnsBlock("Drops", team1DropLines, team2DropLines, team1Label, team2Label)}
        {renderTwoColumnsBlock("Cartons", team1CardLines, team2CardLines, team1Label, team2Label)}
      </section>
    );
}