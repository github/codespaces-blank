import { formatTimelineMoment } from "~/utils/TimeUtils";

type EventTeam = {
  name: string;
  nickname?: string;
};

type TimelineEvent = {
  time: number;
  type: string;
  videoReason?: string;
  timelineMinute?: number;
  timelineAdditionalMinute?: number;
  timelineSecond?: number;
  timelineHalf?: 1 | 2;
};

export const EVENT_ICONS: Record<string, string> = {
  "Essai": "🏉",
  "Transformation": "🎯",
  "Transformation manquée": "❌",
  "Pénalité réussie": "✅",
  "Pénalité manquée": "❌",
  "Drop": "🦶",
  "Essai de pénalité": "🏉✅",
  "Carton jaune": "🟨",
  "Carton rouge": "🟥",
  "Carton orange": "🟧",
  "Changement": "🔁",
  "Saignement": "🩸",
  "Blessure": "🩹",
  "Arbitrage Vidéo": "📺",
  "Récapitulatif": "📝",
};

export function isCardEvent(type: string): boolean {
  return type === "Carton jaune" || type === "Carton rouge" || type === "Carton orange";
}

export function displayTeamName(team?: EventTeam | null): string {
  if (!team) return "";
  return team.nickname || team.name.replace(/\s+J\d+$/, "");
}

export function formatEventTimeline(event: TimelineEvent): string {
  if (typeof event.timelineMinute === "number") {
    return formatTimelineMoment(
      event.timelineMinute,
      event.timelineAdditionalMinute || 0,
      event.timelineSecond || 0,
      event.timelineHalf
    );
  }

  const minute = Math.floor(event.time / 60);
  const second = event.time % 60;
  return formatTimelineMoment(minute, 0, second);
}

export function getEventLabel(event: Pick<TimelineEvent, "type" | "videoReason">): string {
  const icon = EVENT_ICONS[event.type] || "📍";
  if (event.type === "Arbitrage Vidéo") {
    return `${icon} ${event.type}${event.videoReason ? ` (${event.videoReason})` : ""}`;
  }
  return `${icon} ${event.type}`;
}

export function formatSummaryStatLabel(label: string, value: number): string {
  const forms: Record<string, { singular: string; plural: string }> = {
    "Essai": { singular: "Essai", plural: "Essais" },
    "Pénalité": { singular: "Pénalité", plural: "Pénalités" },
    "En-avant": { singular: "En-avant", plural: "En-avants" },
    "Touche volée": { singular: "Touche volée", plural: "Touches volées" },
    "Touche perdue": { singular: "Touche perdue", plural: "Touches perdues" },
    "Mêlée gagnée": { singular: "Mêlée gagnée", plural: "Mêlées gagnées" },
    "Mêlée perdue": { singular: "Mêlée perdue", plural: "Mêlées perdues" },
    "Turnover": { singular: "Turnover", plural: "Turnovers" },
    "Offload": { singular: "Offload", plural: "Offloads" },
    "Jeu au pied": { singular: "Jeu au pied", plural: "Jeux au pied" },
  };

  const form = forms[label];
  if (!form) return label;
  return value === 1 ? form.singular : form.plural;
}

export function formatStatLabel(label: string, value: number): string {
  const forms: Record<string, { singular: string; plural: string }> = {
    "Pénalité": { singular: "Pénalité", plural: "Pénalités" },
    "En Avant": { singular: "En-avant", plural: "En-avants" },
    "En-avant": { singular: "En-avant", plural: "En-avants" },
    "Touche Perdue": { singular: "Touche perdue", plural: "Touches perdues" },
    "Touche perdue": { singular: "Touche perdue", plural: "Touches perdues" },
    "Mêlée Perdue": { singular: "Mêlée perdue", plural: "Mêlées perdues" },
    "Mêlée perdue": { singular: "Mêlée perdue", plural: "Mêlées perdues" },
    "Turnover": { singular: "Turnover", plural: "Turnovers" },
    "Jeu au pied": { singular: "Jeu au pied", plural: "Jeux au pied" },
  };

  const form = forms[label];
  if (!form) return label;
  return value === 1 ? form.singular : form.plural;
}