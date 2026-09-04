import { v4 as uuidv4 } from "uuid";
import type { Team, Player, CompositionEntry, Roster, PlayerPosition } from "~/types/tracker";

function sortEntriesByNumber(entries: CompositionEntry[]): CompositionEntry[] {
    return [...entries].sort((firstEntry, secondEntry) => firstEntry.number - secondEntry.number);
}

// Roster Operations
export function createNewRoster(
    name: string,
    category: 'Top 14' | 'Pro D2' | 'Elite 1' | 'Women\'s Six Nations' | 'World Series',
    nickname?: string,
    color?: string,
    logo?: string,
    coach?: string,
    president?: string,
    founded_in?: number,
    titlesText?: string,
    gender?: 'male' | 'female'
): Roster {
    return {
        id: uuidv4(),
        name,
        nickname,
        color,
        logo,
        coach,
        president,
        players: [],
        category,
        gender,
        founded_in,
        titles: titlesText
            ? titlesText.split("\n").filter((l) => l.trim()).map((line) => {
                const parts = line.trim().split(/\s+/);
                const yearStr = parts[parts.length - 1];
                const year = parseInt(yearStr, 10);
                if (parts.length >= 3 && !isNaN(year)) {
                    return { competition: parts.slice(0, -2).join(" "), ranking: parts[parts.length - 2], year };
                }
                return { competition: line.trim(), ranking: "", year: 0 };
            })
            : undefined,
    };
}

export function deleteRosterFromList(rosters: Roster[], rosterId: string): Roster[] {
    return rosters.filter((r) => r.id !== rosterId);
}

export function deleteTeamsFromRoster(teams: Team[], rosterId: string): Team[] {
    return teams.filter((t) => t.rosterId !== rosterId);
}

// Player Operations
export function addPlayerToRosterList(roster: Roster, player: Player): Roster {
    return {
        ...roster,
        players: [...(roster.players || []), player],
    };
}

export function deletePlayerFromRoster(roster: Roster, playerId: string): Roster {
    return {
        ...roster,
        players: (roster.players || []).filter(p => p.id !== playerId),
    };
}

export function updatePlayerInRoster(
    roster: Roster,
    playerId: string,
    updates: {
        name: string;
        positions?: PlayerPosition[];
        photoUrl?: string;
        nationality?: string;
        club?: string;
        nationalRosterId?: string;
    }
): Roster {
    return {
        ...roster,
        players: (roster.players || []).map(p =>
            p.id === playerId ? { ...p, ...updates } : p
        ),
    };
}

export function createPlayerFromNames(
    first: string,
    last: string,
    positions?: PlayerPosition[],
    photoUrl?: string,
    nationality?: string,
    club?: string
): Player {
    const name = `${first} ${last}`.trim();
    return {
        id: uuidv4(),
        name,
        positions: positions && positions.length > 0 ? positions : undefined,
        photoUrl: photoUrl?.trim() ? photoUrl.trim() : undefined,
        nationality: nationality?.trim() ? nationality.trim() : undefined,
        club: club?.trim() ? club.trim() : undefined,
    };
}

export function parsePlayerName(name: string): { first: string; last: string } {
    const [first, ...lastParts] = name.split(' ');
    return {
        first: first || '',
        last: lastParts.join(' '),
    };
}

// Team Operations
export function createTeam(name: string, rosterId: string, nickname?: string, color?: string, logo?: string): Team {
    return {
        id: `${name}`.replace(/\s+/g, "_"),
        name,
        nickname,
        color,
        logo,
        rosterId,
        captainPlayerId: null,
        starters: [],
        substitutes: [],
    };
}

export function deleteTeamFromList(teams: Team[], teamId: string): Team[] {
    return teams.filter((t) => t.id !== teamId);
}

export function updateTeamInList(teams: Team[], updatedTeam: Team): Team[] {
    return teams.map((t) => (t.id === updatedTeam.id ? updatedTeam : t));
}

export function deletePlayerFromTeamData(team: Team, playerId: string): Team {
    return {
        ...team,
        captainPlayerId: team.captainPlayerId === playerId ? null : team.captainPlayerId,
        starters: team.starters.filter(e => e.player.id !== playerId),
        substitutes: team.substitutes.filter(e => e.player.id !== playerId),
    };
}

export function addPlayerToTeamData(team: Team, player: Player, number: number): Team {
    const isStarter = number <= 15;
    const entry: CompositionEntry = { player, number };
    const starters = isStarter ? sortEntriesByNumber([...team.starters, entry]) : team.starters;
    const substitutes = !isStarter ? sortEntriesByNumber([...team.substitutes, entry]) : team.substitutes;
    return {
        ...team,
        starters,
        substitutes,
    };
}

export function addMultiplePlayersToTeam(team: Team, players: Player[], playerNumbers: Record<string, number>): Team {
    let newStarters = [...team.starters];
    let newSubstitutes = [...team.substitutes];

    players.forEach(player => {
        const number = playerNumbers[player.id] || 1;
        const entry: CompositionEntry = { player, number };
        if (number <= 15) {
            newStarters.push(entry);
        } else {
            newSubstitutes.push(entry);
        }
    });

    return {
        ...team,
        starters: sortEntriesByNumber(newStarters),
        substitutes: sortEntriesByNumber(newSubstitutes),
    };
}

// Import/Export
export function importTeamFromJSON(jsonString: string, rosterId: string, rosterName: string, matchDay?: number, nickname?: string, color?: string, logo?: string): Team {
    const data = JSON.parse(jsonString);
    
    if (!Array.isArray(data.starters)) {
        throw new Error("JSON invalide : il manque des titulaires");
    }

    const name = `${rosterName}${matchDay ? ` J${matchDay}` : ""}`;
    const id = `${name}_${matchDay || "?"}`.replace(/\s+/g, "_");

    return {
        id,
        name,
        nickname,
        color,
        logo,
        rosterId,
        starters: data.starters.map((p: any, idx: number) => ({
            player: { id: p.id || uuidv4(), name: p.name },
            number: idx + 1,
        })),
        substitutes: Array.isArray(data.substitutes)
            ? data.substitutes.map((p: any, idx: number) => ({
                player: { id: p.id || uuidv4(), name: p.name },
                number: 16 + idx,
            }))
            : [],
    };
}

// Selection Management
export function updatePlayerSelection(selectedIds: Set<string>, playerId: string): Set<string> {
    const newSet = new Set(selectedIds);
    if (newSet.has(playerId)) {
        newSet.delete(playerId);
    } else {
        newSet.add(playerId);
    }
    return newSet;
}

export function updatePlayerNumber(playerNumbers: Record<string, number>, playerId: string, number: number): Record<string, number> {
    return { ...playerNumbers, [playerId]: number };
}

// View Helpers
export function getTeamPlayers(team: Team): Player[] {
    return team.starters.map(e => e.player).concat(
        team.substitutes.map(e => e.player)
    );
}

export function getRosterOrTeamPlayers(rosters: Roster[], teams: Team[], viewTeamId: string | null, activeRosterId: string | null): Player[] {
    if (viewTeamId) {
        const team = teams.find(t => t.id === viewTeamId);
        return team ? getTeamPlayers(team) : [];
    }
    
    const roster = rosters.find(r => r.id === activeRosterId);
    return roster?.players || [];
}
