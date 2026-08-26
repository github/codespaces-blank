export type Championship = 'Top 14' | 'Pro D2' | 'Elite 1' | "Women's Six Nations" | 'World Series';

export type CompetitionScope = 'national' | 'international';
export type CompetitionGender = 'masculine' | 'feminine' | 'mixed';

export const NATIONAL_CHAMPIONSHIPS: readonly Championship[] = ['Top 14', 'Pro D2', 'Elite 1'] as const;
export const INTERNATIONAL_CHAMPIONSHIPS: readonly Championship[] = ["Women's Six Nations", 'World Series'] as const;

export const MASCULINE_CHAMPIONSHIPS: readonly Championship[] = ['Top 14', 'Pro D2'] as const;
export const FEMININE_CHAMPIONSHIPS: readonly Championship[] = ['Elite 1', "Women's Six Nations"] as const;
export const MIXED_CHAMPIONSHIPS: readonly Championship[] = ['World Series'] as const;

export function getCompetitionScope(championship: string | undefined): CompetitionScope {
    return INTERNATIONAL_CHAMPIONSHIPS.includes(championship as Championship)
        ? 'international'
        : 'national';
}

export function getCompetitionGender(championship: string | undefined): CompetitionGender {
    if (FEMININE_CHAMPIONSHIPS.includes(championship as Championship)) return 'feminine';
    if (MIXED_CHAMPIONSHIPS.includes(championship as Championship)) return 'mixed';
    return 'masculine';
}

export const PLAYER_POSITIONS = [
    "première ligne",
    "talonneur",
    "deuxième ligne",
    "troisième ligne",
    "demi de mêlée",
    "demi d'ouverture",
    "centre",
    "ailier",
    "arrière",
] as const;

export type PlayerPosition = typeof PLAYER_POSITIONS[number];

export interface PlayerStats {
    points: number;
    essais: number;
    pied: number;
    tauxTransfo: number; // 0..100
    cartons: number;
    drops: number;
    matchs2526: number;
    titularisations2526: number;
}

export type PlayerGender = 'male' | 'female';

export interface Player {
    id: string;
    name: string;
    number?: number; // optional jersey number
    positions?: PlayerPosition[];
    photoUrl?: string;
    nationality?: string; // ISO 3166-1 alpha-2 code
    club?: string;
    gender?: PlayerGender;
    stats?: PlayerStats;
    nationalRosterId?: string;        // FK → Roster.id (club national)
    internationalRosterIds?: string[]; // FK[] → Roster.id (sélections internationales — W6N, World Series…)
    rosterIds?: string[];             // tous les effectifs auxquels appartient ce joueur
}

export interface CompositionEntry {
    player: Player;
    number: number; // jersey number
}

export interface Coach {
    name: string;
    photoUrl?: string;
    nationality?: string; // ISO 3166-1 alpha-2 code
    club?: Team["name"];
    federation?: string; // e.g. "FFR"
}

export interface President {
    name: string;
    photoUrl?: string;
    nationality?: string; // ISO 3166-1 alpha-2 code
    club?: Team["name"];
    federation?: string; // e.g. "FFR"
}

export interface Title {
    competition: 'Top 14' | 'Pro D2 | Coupe d\'Europe' | 'Challenge Cup' | 'Elite 1' | 'Six Nations' | "Women's Six Nations" | 'World Series' | 'World Championship' | string;
    ranking: 'Vainqueur' | 'Finaliste' | string;
    year: number;
}

export interface Result {
    outcome: "victory" | "defeat" | "draw";
    resultText: string; // e.g. "Victoire 28-14", "Défaite 10-12", "Nul 21-21"
    opponent: string;
    competition?: string;
    date?: string; // ISO date string (YYYY-MM-DD)
    homeOrAway?: "home" | "away";
}

export interface MatchFixture {
    date: string;           // ISO date string (YYYY-MM-DD)
    time?: string;          // HH:MM
    opponent: string;
    competition?: string;
    isHome: boolean;
    location?: string;
    scoreHome?: number;
    scoreAway?: number;
    status?: "upcoming" | "played" | "cancelled";
}

export interface SeasonData {
    players: Player[];
    coach?: string;
    calendar?: MatchFixture[];
    ranking?: number;  // classement final de la saison
    points?: number;   // points en fin de saison
}

export const CURRENT_SEASON = "2026/2027";

export interface Roster {
    id: string;
    name: string;
    nickname?: string;
    color?: string;
    logo?: string;
    coach?: Coach["name"];
    coachData?: Coach;
    coachesData?: Coach[];  // multi-coach: when coach field contains multiple names separated by comma
    president?: President["name"];
    presidentData?: President;
    players: Player[]; // effectif global (mirrors current season)
    seasons?: Record<string, SeasonData>;
    category?: 'Top 14' | 'Pro D2' | 'Elite 1' | 'Women\'s Six Nations' | 'World Series';
    gender?: PlayerGender;   // précise le genre quand la catégorie ne le détermine pas (ex : World Series)
    founded_in?: number; // year of creation
    titles?: Title[]; // list of titles won
    currentRanking?: number; // current league ranking
    currentPoints?: number; // current league points
    lastFiveMatches?: Result[];
    seasonRecord?: { victories: number; defeats: number; draws: number };
}

export interface Team {
    id: string;              // nouveau : « nomDuRoster_journee »
    name: string;
    nickname?: string;
    color?: string;
    logo?: string;
    rosterId: string;        // which roster this team draws from
    captainPlayerId?: string | null;
    starters: CompositionEntry[]; // numbers 1–15
    substitutes: CompositionEntry[]; // numbers 16–23
}

export interface EventSummaryTableStat {
    label: string;
    value: number;
}

export interface EventSummaryTableTeam {
    teamName: string;
    stats: EventSummaryTableStat[];
}

export interface EventSummaryTable {
    halfLabel: string;
    halfScore?: string;
    teams: [EventSummaryTableTeam, EventSummaryTableTeam];
}

export interface Event {
    type: string;
    time: number; // seconds since match start
    timelineHalf?: 1 | 2;
    timelineMinute?: number;
    timelineAdditionalMinute?: number;
    timelineSecond?: number;
    team?: Team;
    videoReason?: "essai" | "jeu déloyal";
    player?: Player;
    playerNumber?: number;
    ref?: string;
    concussion?: boolean;
    // for substitutions
    playerOut?: Player;
    playerOutNumber?: number;
    playerIn?: Player;
    playerInNumber?: number;
    // for half-time summaries
    summary?: string;
    summaryTable?: EventSummaryTable;
}
