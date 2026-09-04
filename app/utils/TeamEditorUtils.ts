import type { Team, Player } from "~/types/tracker";

function sortByNumber<T extends { number: number }>(entries: T[]): T[] {
    return [...entries].sort((firstEntry, secondEntry) => firstEntry.number - secondEntry.number);
}

/**
 * Add a starter player to a team
 */
export function addStarterToTeam(team: Team, player: Player, number: number): Team {
    return {
        ...team,
        starters: sortByNumber([...team.starters, { player, number }]),
    };
}

/**
 * Add a substitute player to a team
 */
export function addSubstituteToTeam(team: Team, player: Player, number: number): Team {
    return {
        ...team,
        substitutes: sortByNumber([...team.substitutes, { player, number }]),
    };
}

/**
 * Remove a player from both starters and substitutes
 */
export function removePlayerFromTeam(team: Team, playerId: string): Team {
    return {
        ...team,
        starters: team.starters.filter((entry) => entry.player.id !== playerId),
        substitutes: team.substitutes.filter((entry) => entry.player.id !== playerId),
    };
}
