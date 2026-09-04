import { useEffect, useMemo, useState } from "react";
import type { Event } from "~/types/tracker";

export function useTrackerStats(events: Event[], selectedTeamIds: string[]) {
  const [teamPenalties, setTeamPenalties] = useState<number[]>([0, 0]);
  const [manualPenaltyAdjustments, setManualPenaltyAdjustments] = useState<number[]>([0, 0]);
  const [teamEnAvant, setTeamEnAvant] = useState<number[]>([0, 0]);
  const [manualEnAvantAdjustments, setManualEnAvantAdjustments] = useState<number[]>([0, 0]);
  const [teamTouchePerdue, setTeamTouchePerdue] = useState<number[]>([0, 0]);
  const [teamMeleePerdue, setTeamMeleePerdue] = useState<number[]>([0, 0]);
  const [teamTurnover, setTeamTurnover] = useState<number[]>([0, 0]);
  const [teamJeuAuPied, setTeamJeuAuPied] = useState<number[]>([0, 0]);

  function getSelectedTeamIndex(teamId?: string): number {
    if (!teamId) return -1;
    return selectedTeamIds.findIndex((id) => id === teamId);
  }

  useEffect(() => {
    const counts = [0, 0];
    events.forEach((e) => {
      if (e.type !== "Pénalité" || !e.team) return;
      const idx = getSelectedTeamIndex(e.team.id);
      if (idx !== -1) counts[idx]++;
    });
    setTeamPenalties(counts);
  }, [events, selectedTeamIds]);

  useEffect(() => {
    const counts = [0, 0];
    events.forEach((e) => {
      if (e.type !== "En-avant" || !e.team) return;
      const idx = getSelectedTeamIndex(e.team.id);
      if (idx !== -1) counts[idx]++;
    });
    setTeamEnAvant(counts);
  }, [events, selectedTeamIds]);

  function adjustPenalties(idx: number, delta: number) {
    setManualPenaltyAdjustments((prev) => {
      const copy = [...prev];
      copy[idx] = (copy[idx] || 0) + delta;
      return copy;
    });
  }

  function adjustEnAvant(idx: number, delta: number) {
    setManualEnAvantAdjustments((prev) => {
      const copy = [...prev];
      copy[idx] = (copy[idx] || 0) + delta;
      return copy;
    });
  }

  function adjustTouchePerdue(idx: number, delta: number) {
    setTeamTouchePerdue((prev) => {
      const copy = [...prev];
      copy[idx] = Math.max(0, (copy[idx] || 0) + delta);
      return copy;
    });
  }

  function adjustMeleePerdue(idx: number, delta: number) {
    setTeamMeleePerdue((prev) => {
      const copy = [...prev];
      copy[idx] = Math.max(0, (copy[idx] || 0) + delta);
      return copy;
    });
  }

  function adjustTurnover(idx: number, delta: number) {
    setTeamTurnover((prev) => {
      const copy = [...prev];
      copy[idx] = Math.max(0, (copy[idx] || 0) + delta);
      return copy;
    });
  }

  function adjustJeuAuPied(idx: number, delta: number) {
    setTeamJeuAuPied((prev) => {
      const copy = [...prev];
      copy[idx] = Math.max(0, (copy[idx] || 0) + delta);
      return copy;
    });
  }

  function getDisplayedPenalties(): number[] {
    return teamPenalties.map((count, idx) => Math.max(0, count + (manualPenaltyAdjustments[idx] || 0)));
  }

  function getDisplayedEnAvant(): number[] {
    return teamEnAvant.map((count, idx) => Math.max(0, count + (manualEnAvantAdjustments[idx] || 0)));
  }

  function resetStats() {
    setTeamPenalties([0, 0]);
    setManualPenaltyAdjustments([0, 0]);
    setTeamEnAvant([0, 0]);
    setManualEnAvantAdjustments([0, 0]);
    setTeamTouchePerdue([0, 0]);
    setTeamMeleePerdue([0, 0]);
    setTeamTurnover([0, 0]);
    setTeamJeuAuPied([0, 0]);
  }

  const hasStatsContent = useMemo(
    () =>
      teamPenalties.some((value) => value !== 0) ||
      manualPenaltyAdjustments.some((value) => value !== 0) ||
      teamEnAvant.some((value) => value !== 0) ||
      manualEnAvantAdjustments.some((value) => value !== 0) ||
      teamTouchePerdue.some((value) => value !== 0) ||
      teamMeleePerdue.some((value) => value !== 0) ||
      teamTurnover.some((value) => value !== 0) ||
      teamJeuAuPied.some((value) => value !== 0),
    [
      teamPenalties,
      manualPenaltyAdjustments,
      teamEnAvant,
      manualEnAvantAdjustments,
      teamTouchePerdue,
      teamMeleePerdue,
      teamTurnover,
      teamJeuAuPied,
    ]
  );

  return {
    teamPenalties,
    manualPenaltyAdjustments,
    teamEnAvant,
    manualEnAvantAdjustments,
    teamTouchePerdue,
    teamMeleePerdue,
    teamTurnover,
    teamJeuAuPied,
    adjustPenalties,
    adjustEnAvant,
    adjustTouchePerdue,
    adjustMeleePerdue,
    adjustTurnover,
    adjustJeuAuPied,
    getDisplayedPenalties,
    getDisplayedEnAvant,
    resetStats,
    hasStatsContent,
  };
}
