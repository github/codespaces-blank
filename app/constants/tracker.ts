export const COMMAND_TYPES = [
  "Essai",
  "Transformation",
  "Transformation manquée",
  "Pénalité réussie",
  "Drop",
  "Essai de pénalité",
  "Pénalité manquée",
  "Carton jaune",
  "Carton rouge",
  "Carton orange",
  "Changement",
  "Saignement",
  "Blessure",
  "Arbitrage Vidéo",
] as const;

export type TrackerActionTab = "events" | "stats" | "teams" | "notes";

export const ACTION_TABS: ReadonlyArray<{ id: TrackerActionTab; label: string }> = [
  { id: "events", label: "Événements" },
  { id: "stats", label: "Statistiques" },
  { id: "teams", label: "Équipes" },
  { id: "notes", label: "Notes" },
];
