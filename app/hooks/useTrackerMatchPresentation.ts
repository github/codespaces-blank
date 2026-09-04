import { useCallback, useMemo } from "react";
import type { Team, Roster } from "~/types/tracker";

interface UseTrackerMatchPresentationParams {
  rosters: Roster[];
  teams: Team[];
  matchDay: string;
  team1Id: string;
  team2Id: string;
  matchDate: string;
}

export function useTrackerMatchPresentation({
  rosters,
  teams,
  matchDay,
  team1Id,
  team2Id,
  matchDate,
}: UseTrackerMatchPresentationParams) {
  const normalizedMatchDay = matchDay.trim();
  const parsedMatchDay = normalizedMatchDay.match(/^J?\s*(\d+)$/i);
  const matchDayLabel = parsedMatchDay ? `J${parsedMatchDay[1]}` : normalizedMatchDay;

  const rosterNicknameById = useMemo(
    () => new Map(rosters.map((roster) => [roster.id, roster.nickname || ""])),
    [rosters]
  );

  const rosterNameById = useMemo(
    () => new Map(rosters.map((roster) => [roster.id, roster.name])),
    [rosters]
  );

  const teamsForDay = useMemo(
    () =>
      matchDayLabel
        ? teams
            .filter((team) => team.name.includes(matchDayLabel))
            .map((team) => ({
              ...team,
              nickname: team.nickname || rosterNicknameById.get(team.rosterId) || undefined,
            }))
        : teams.map((team) => ({
            ...team,
            nickname: team.nickname || rosterNicknameById.get(team.rosterId) || undefined,
          })),
    [teams, matchDayLabel, rosterNicknameById]
  );

  const selectedTeams = useMemo(
    () =>
      [teamsForDay.find((team) => team.id === team1Id), teamsForDay.find((team) => team.id === team2Id)].filter(
        Boolean
      ) as Team[],
    [teamsForDay, team1Id, team2Id]
  );

  const getDisplayTeamLabel = useCallback((team: { name: string; nickname?: string }): string => {
    return team.nickname || team.name.replace(/\s+J\d+$/, "");
  }, []);

  const getRosterTeamLabel = useCallback(
    (team: { name: string; rosterId?: string }): string => {
      if (team.rosterId) {
        const rosterName = rosterNameById.get(team.rosterId);
        if (rosterName) return rosterName;
      }
      return team.name.replace(/\s+J\d+$/, "");
    },
    [rosterNameById]
  );

  const mobileMatchTitle =
    selectedTeams.length === 2
      ? `${getDisplayTeamLabel(selectedTeams[0])} v ${getDisplayTeamLabel(selectedTeams[1])}`
      : "Feuille de match";

  const desktopMatchTitle =
    selectedTeams.length === 2
      ? `${getRosterTeamLabel(selectedTeams[0])} v ${getRosterTeamLabel(selectedTeams[1])}`
      : "Feuille de match";

  const formattedMatchDate = matchDate ? new Date(`${matchDate}T00:00:00`).toLocaleDateString("fr-FR") : "";

  return {
    matchDayLabel,
    teamsForDay,
    selectedTeams,
    getDisplayTeamLabel,
    mobileMatchTitle,
    desktopMatchTitle,
    formattedMatchDate,
  };
}
