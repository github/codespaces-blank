import type { Championship } from "~/types/tracker";

export interface ClubInfo {
  name: string;
  nickname: string;
  color: string;
  category: Championship;
  currentRanking?: number;
  currentPoints?: number;
}

/** Classement Top 14 — saison 2025/2026 (source : L'Équipe, 10 juin 2026) */
export const TOP14_CLUBS_2025_2026: ClubInfo[] = [
  { name: "Stade Toulousain Rugby Féminin",     nickname: "TLS",  color: "#B3151B", category: "Top 14", currentRanking: 1,  currentPoints: 86 },
  { name: "Montpellier HR",       nickname: "MHR",  color: "#001F5B", category: "Top 14", currentRanking: 2,  currentPoints: 82 },
  { name: "Stade Français Paris", nickname: "SFP",  color: "#E63946", category: "Top 14", currentRanking: 3,  currentPoints: 79 },
  { name: "Section Paloise",      nickname: "PAU",  color: "#007F3B", category: "Top 14", currentRanking: 4,  currentPoints: 78 },
  { name: "Racing 92",            nickname: "R92",  color: "#1E90FF", category: "Top 14", currentRanking: 5,  currentPoints: 74 },
  { name: "Stade Rochelais",      nickname: "LRO",  color: "#FFD700", category: "Top 14", currentRanking: 6,  currentPoints: 72 },
  { name: "ASM Clermont",         nickname: "ASM",  color: "#FFCC00", category: "Top 14", currentRanking: 7,  currentPoints: 71 },
  { name: "Union Bordeaux-Bègles",nickname: "UBB",  color: "#3A7D44", category: "Top 14", currentRanking: 8,  currentPoints: 70 },
  { name: "RC Toulon",            nickname: "RCT",  color: "#CC0000", category: "Top 14", currentRanking: 9,  currentPoints: 59 },
  { name: "Castres Olympique",    nickname: "CO",   color: "#003087", category: "Top 14", currentRanking: 10, currentPoints: 55 },
  { name: "LOU Rugby",            nickname: "LOU",  color: "#C8102E", category: "Top 14", currentRanking: 11, currentPoints: 53 },
  { name: "Aviron Bayonnais",     nickname: "AB",   color: "#007FFF", category: "Top 14", currentRanking: 12, currentPoints: 51 },
  { name: "USA Perpignan",        nickname: "USAP", color: "#CE1126", category: "Top 14", currentRanking: 13, currentPoints: 29 },
  { name: "US Montauban",         nickname: "USM",  color: "#0047AB", category: "Top 14", currentRanking: 14, currentPoints: 7  },
];

/** Classement Top 14 — saison 2026/2027 */
export const TOP14_CLUBS_2026_2027: ClubInfo[] = [
  { name: "Aviron Bayonnais",          nickname: "AB",   color: "#007FFF", category: "Top 14", currentRanking: 1 },
  { name: "Union Bordeaux-Bègles",     nickname: "UBB",  color: "#3A7D44", category: "Top 14", currentRanking: 2 },
  { name: "Castres Olympique",         nickname: "CO",   color: "#003087", category: "Top 14", currentRanking: 3 },
  { name: "ASM Clermont",              nickname: "ASM",  color: "#FFCC00", category: "Top 14", currentRanking: 4 },
  { name: "Stade Rochelais",           nickname: "LRO",  color: "#FFD700", category: "Top 14", currentRanking: 5 },
  { name: "LOU Rugby",                 nickname: "LOU",  color: "#C8102E", category: "Top 14", currentRanking: 6 },
  { name: "Montpellier Hérault Rugby", nickname: "MHR",  color: "#001F5B", category: "Top 14", currentRanking: 7 },
  { name: "Stade Français Paris",      nickname: "SFP",  color: "#E63946", category: "Top 14", currentRanking: 8 },
  { name: "Section Paloise",           nickname: "PAU",  color: "#007F3B", category: "Top 14", currentRanking: 9 },
  { name: "USA Perpignan",             nickname: "USAP", color: "#CE1126", category: "Top 14", currentRanking: 10 },
  { name: "Racing 92",                 nickname: "R92",  color: "#1E90FF", category: "Top 14", currentRanking: 11 },
  { name: "RC Toulon",                 nickname: "RCT",  color: "#CC0000", category: "Top 14", currentRanking: 12 },
  { name: "Stade Toulousain",          nickname: "ST",   color: "#B3151B", category: "Top 14", currentRanking: 13 },
  { name: "RC Vannes",                 nickname: "RCV",  color: "#CC0000", category: "Top 14", currentRanking: 14 },
];

/** Classement Pro D2 — saison 2025/2026 (source : L'Équipe, 10 juin 2026) */
export const PROD2_CLUBS_2025_2026: ClubInfo[] = [
  { name: "RC Vannes",             nickname: "RCV",  color: "#CC0000", category: "Pro D2", currentRanking: 1,  currentPoints: 116 },
  { name: "Colomiers Rugby",       nickname: "COL",  color: "#0057A8", category: "Pro D2", currentRanking: 2,  currentPoints: 95  },
  { name: "Provence Rugby",        nickname: "PROV",  color: "#E87722", category: "Pro D2", currentRanking: 3,  currentPoints: 92  },
  { name: "Oyonnax Rugby",         nickname: "OYO",  color: "#004B8D", category: "Pro D2", currentRanking: 4,  currentPoints: 86  },
  { name: "Valence-Romans Drôme",  nickname: "VRDR",  color: "#B22222", category: "Pro D2", currentRanking: 5,  currentPoints: 84  },
  { name: "CA Brive",              nickname: "CAB",  color: "#D4AF37", category: "Pro D2", currentRanking: 6,  currentPoints: 83  },
  { name: "SU Agen",               nickname: "SUA",  color: "#003580", category: "Pro D2", currentRanking: 7,  currentPoints: 72  },
  { name: "FC Grenoble",           nickname: "FCG",  color: "#002D62", category: "Pro D2", currentRanking: 8,  currentPoints: 62  },
  { name: "Soyaux-Angoulême RC",   nickname: "SAXV", color: "#FFFFFF", category: "Pro D2", currentRanking: 9,  currentPoints: 59  },
  { name: "Biarritz Olympique",    nickname: "BO",   color: "#CC0000", category: "Pro D2", currentRanking: 10, currentPoints: 56  },
  { name: "US Dax",                nickname: "USD",  color: "#003087", category: "Pro D2", currentRanking: 11, currentPoints: 55  },
  { name: "AS Béziers Hérault",    nickname: "ASBH", color: "#D21034", category: "Pro D2", currentRanking: 12, currentPoints: 54  },
  { name: "USON Nevers",           nickname: "USON",  color: "#D4A017", category: "Pro D2", currentRanking: 13, currentPoints: 53  },
  { name: "Aurillac Rugby",        nickname: "SAA",  color: "#FF6600", category: "Pro D2", currentRanking: 14, currentPoints: 53  },
  { name: "Stade Montois Rugby",   nickname: "SMR",  color: "#1F4E79", category: "Pro D2", currentRanking: 15, currentPoints: 51  },
  { name: "RC Carcassonne",        nickname: "RCC",  color: "#B22222", category: "Pro D2", currentRanking: 16, currentPoints: 35  },
];

/** Classement Pro D2 — saison 2026/2027 */
export const PROD2_CLUBS_2026_2027: ClubInfo[] = [
  { name: "SU Agen",               nickname: "SUA",  color: "#003580", category: "Pro D2", currentRanking: 1 },
  { name: "Soyaux-Angoulême XV",   nickname: "SAXV", color: "#6B1D46", category: "Pro D2", currentRanking: 2 },
  { name: "Stade Aurillacois",     nickname: "SAA",  color: "#002B62", category: "Pro D2", currentRanking: 3 },
  { name: "AS Béziers Hérault",    nickname: "ASBH", color: "#D21034", category: "Pro D2", currentRanking: 4 },
  { name: "Biarritz Olympique PB", nickname: "BO",   color: "#CC0000", category: "Pro D2", currentRanking: 5 },
  { name: "CA Brive",              nickname: "CAB",  color: "#D4AF37", category: "Pro D2", currentRanking: 6 },
  { name: "Colomiers Rugby",       nickname: "COL",  color: "#0057A8", category: "Pro D2", currentRanking: 7 },
  { name: "US Dax",                nickname: "USD",  color: "#003087", category: "Pro D2", currentRanking: 8 },
  { name: "FC Grenoble Rugby",     nickname: "FCG",  color: "#002D62", category: "Pro D2", currentRanking: 9 },
  { name: "US Montauban",          nickname: "USM",  color: "#0047AB", category: "Pro D2", currentRanking: 10 },
  { name: "RC Narbonnais",         nickname: "RCN",  color: "#F36C21", category: "Pro D2", currentRanking: 11 },
  { name: "USON Nevers",           nickname: "USON", color: "#D4A017", category: "Pro D2", currentRanking: 12 },
  { name: "Nissa Rugby",           nickname: "NIS",  color: "#E30613", category: "Pro D2", currentRanking: 13 },
  { name: "Oyonnax Rugby",         nickname: "OYO",  color: "#004B8D", category: "Pro D2", currentRanking: 14 },
  { name: "Provence Rugby",        nickname: "PROV", color: "#E87722", category: "Pro D2", currentRanking: 15 },
  { name: "Valence Romans",         nickname: "VRDR", color: "#B22222", category: "Pro D2", currentRanking: 16 },
];

/** Classement Elite 1 Féminine — saison 2025/2026 (source : Mon Club House FFR, 10 juin 2026) */
export const ELITE1_CLUBS_2025_2026: ClubInfo[] = [
  { name: "ASM Romagnat Rugby Féminin",               nickname: "ASMR", color: "#FFCC00", category: "Elite 1", currentRanking: 1,  currentPoints: 83 },
  { name: "Stade Toulousain Rugby Féminin",           nickname: "STF",  color: "#B3151B", category: "Elite 1", currentRanking: 2,  currentPoints: 82 },
  { name: "Stade Bordelais",                           nickname: "SBF",  color: "#3A7D44", category: "Elite 1", currentRanking: 3,  currentPoints: 73 },
  { name: "Blagnac Sporting Club Rugby",               nickname: "BSC",  color: "#003087", category: "Elite 1", currentRanking: 4,  currentPoints: 52 },
  { name: "Montpellier Hérault Rugby Féminin",         nickname: "MHRF", color: "#001F5B", category: "Elite 1", currentRanking: 5,  currentPoints: 38 },
  { name: "AC Bobigny 93 Rugby",                       nickname: "ACB",  color: "#C8102E", category: "Elite 1", currentRanking: 6,  currentPoints: 36 },
  { name: "FC Grenoble Amazones",                      nickname: "FGA",  color: "#002D62", category: "Elite 1", currentRanking: 7,  currentPoints: 34 },
  { name: "Lyon OU Féminin",                           nickname: "LOUF", color: "#C8102E", category: "Elite 1", currentRanking: 8,  currentPoints: 26 },
  { name: "RC Toulon Provence Méditerranée Féminin",   nickname: "RCTF", color: "#CC0000", category: "Elite 1", currentRanking: 9,  currentPoints: 21 },
  { name: "Stade Villeneuvois Lille Métropole",        nickname: "SVLM", color: "#FFD700", category: "Elite 1", currentRanking: 10, currentPoints: 14 },
];

/** Ensemble de tous les clubs pré-définis, toutes compétitions */
export const ALL_CLUBS: ClubInfo[] = [
  ...TOP14_CLUBS_2026_2027,
  ...TOP14_CLUBS_2025_2026,
  ...PROD2_CLUBS_2026_2027,
  ...PROD2_CLUBS_2025_2026,
  ...ELITE1_CLUBS_2025_2026,
];
