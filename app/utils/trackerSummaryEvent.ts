import type { Event } from "~/types/tracker";
import { getTimelineMomentFromClock } from "~/utils/TimeUtils";

interface BuildStatsSummaryEventParams {
  halfLabel: string;
  halfScore: [number, number];
  time: number;
  currentHalf: 1 | 2;
  team1Name: string;
  team2Name: string;
  displayedPenalties: number[];
  displayedEnAvant: number[];
  teamTouchePerdue: number[];
  teamMeleePerdue: number[];
  teamTurnover: number[];
  teamJeuAuPied: number[];
}

export function buildStatsSummaryEvent({
  halfLabel,
  halfScore,
  time,
  currentHalf,
  team1Name,
  team2Name,
  displayedPenalties,
  displayedEnAvant,
  teamTouchePerdue,
  teamMeleePerdue,
  teamTurnover,
  teamJeuAuPied,
}: BuildStatsSummaryEventParams): Event {
  const summaryMoment = getTimelineMomentFromClock(time, currentHalf);

  const statRows = [
    { label: "Pénalités", left: displayedPenalties[0] || 0, right: displayedPenalties[1] || 0 },
    { label: "En-avants", left: displayedEnAvant[0] || 0, right: displayedEnAvant[1] || 0 },
    { label: "Touches perdues", left: teamTouchePerdue[0] || 0, right: teamTouchePerdue[1] || 0 },
    { label: "Mêlées perdues", left: teamMeleePerdue[0] || 0, right: teamMeleePerdue[1] || 0 },
    { label: "Turnovers", left: teamTurnover[0] || 0, right: teamTurnover[1] || 0 },
    { label: "Jeu au pied", left: teamJeuAuPied[0] || 0, right: teamJeuAuPied[1] || 0 },
  ];

  const summary = `${halfLabel} : ${team1Name} : ${displayedPenalties[0]} pénalités, ${displayedEnAvant[0]} en-avants, ${teamTouchePerdue[0] || 0} touches perdues, ${teamMeleePerdue[0] || 0} mêlées perdues, ${teamTurnover[0] || 0} turnovers, ${teamJeuAuPied[0] || 0} jeux au pied / ${team2Name} : ${displayedPenalties[1]} pénalités, ${displayedEnAvant[1]} en-avants, ${teamTouchePerdue[1] || 0} touches perdues, ${teamMeleePerdue[1] || 0} mêlées perdues, ${teamTurnover[1] || 0} turnovers, ${teamJeuAuPied[1] || 0} jeux au pied`;

  return {
    type: "Récapitulatif",
    time,
    timelineHalf: summaryMoment.half,
    timelineMinute: summaryMoment.minute,
    timelineAdditionalMinute: summaryMoment.additionalMinute,
    timelineSecond: summaryMoment.second,
    summary,
    summaryTable: {
      halfLabel,
      halfScore: `${halfScore[0]} - ${halfScore[1]}`,
      teams: [
        {
          teamName: team1Name,
          stats: statRows.map((row) => ({ label: row.label, value: row.left })),
        },
        {
          teamName: team2Name,
          stats: statRows.map((row) => ({ label: row.label, value: row.right })),
        },
      ],
    },
  };
}
