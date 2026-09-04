import { useCallback, useMemo, useState } from "react";
import type { Event } from "~/types/tracker";
import { getTimelineSortKey } from "~/utils/TimeUtils";

interface UseTrackerEventsParams {
  selectedTeamIds: string[];
  selectedTeamsCount: number;
}

export function useTrackerEvents({ selectedTeamIds, selectedTeamsCount }: UseTrackerEventsParams) {
  const [events, setEvents] = useState<Event[]>([]);

  const getSelectedTeamIndex = useCallback(
    (teamId?: string): number => {
      if (!teamId) return -1;
      return selectedTeamIds.findIndex((id) => id === teamId);
    },
    [selectedTeamIds]
  );

  const getEventSortKey = useCallback((event: Event): number => {
    if (event.timelineHalf && typeof event.timelineMinute === "number") {
      return getTimelineSortKey({
        half: event.timelineHalf,
        minute: event.timelineMinute,
        additionalMinute: event.timelineAdditionalMinute || 0,
        second: event.timelineSecond || 0,
      });
    }

    return event.time;
  }, []);

  const sortEventsByTimeline = useCallback(
    (list: Event[]): Event[] => {
      return [...list].sort((firstEvent, secondEvent) => {
        const firstSortKey = getEventSortKey(firstEvent);
        const secondSortKey = getEventSortKey(secondEvent);
        if (firstSortKey !== secondSortKey) return firstSortKey - secondSortKey;
        return firstEvent.time - secondEvent.time;
      });
    },
    [getEventSortKey]
  );

  const addEvent = useCallback(
    (event: Event) => {
      setEvents((prev) => sortEventsByTimeline([...prev, event]));
    },
    [sortEventsByTimeline]
  );

  const removeEvent = useCallback((index: number) => {
    setEvents((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const resetEvents = useCallback(() => {
    setEvents([]);
  }, []);

  // Liste inversée pour afficher les événements du plus récent (index 0) au plus ancien.
  // C'est l'ordre utilisé par EventsList pour cibler le flash sur le dernier ajout.
  const matchFactsEvents = useMemo(() => [...events].reverse(), [events]);

  const computeScores = useCallback((): number[] => {
    const points: Record<string, number> = {
      Essai: 5,
      "Essai de pénalité": 7,
      Transformation: 2,
      "Pénalité réussie": 3,
      Drop: 3,
    };

    const base = selectedTeamIds.map(() => 0);
    events.forEach((event) => {
      if (!event.team) return;
      const idx = getSelectedTeamIndex(event.team.id);
      if (idx === -1 || !points[event.type]) return;
      base[idx] += points[event.type] || 0;
    });

    return base.map((value) => Math.max(0, value));
  }, [events, selectedTeamIds, getSelectedTeamIndex]);

  const computeTries = useCallback((): number[] => {
    const tries = selectedTeamIds.map(() => 0);

    events.forEach((event) => {
      if (event.type !== "Essai" && event.type !== "Essai de pénalité") return;
      if (!event.team?.id) return;

      const idx = getSelectedTeamIndex(event.team.id);
      if (idx !== -1) {
        tries[idx] += 1;
      }
    });

    return tries;
  }, [events, selectedTeamIds, getSelectedTeamIndex]);

  const computeBonuses = useCallback(
    (scores: number[]): string[] => {
      if (selectedTeamsCount < 2) return selectedTeamIds.map(() => "");

      const tries = computeTries();
      const bonuses = ["", ""];

      for (let idx = 0; idx < 2; idx++) {
        const opponentIdx = idx === 0 ? 1 : 0;
        const tags: string[] = [];

        // BO (bonification offensive) : au moins 3 essais de plus que l'adversaire
        if ((tries[idx] || 0) - (tries[opponentIdx] || 0) >= 3) {
          tags.push("BO");
        }

        // BD (bonification défensive) : défaite par 5 points ou moins
        const pointsBehind = (scores[opponentIdx] || 0) - (scores[idx] || 0);
        if (pointsBehind > 0 && pointsBehind <= 5) {
          tags.push("BD");
        }

        bonuses[idx] = tags.join(" ");
      }

      return bonuses;
    },
    [computeTries, selectedTeamsCount, selectedTeamIds]
  );

  return {
    events,
    addEvent,
    removeEvent,
    resetEvents,
    matchFactsEvents,
    computeScores,
    computeBonuses,
  };
}
