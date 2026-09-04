import type { PlayerPosition } from "~/types/tracker";

export interface SquadPlayer {
  name: string;
  positions: PlayerPosition[];
  nationality: string;
  gender: "female";
}

/**
 * XV de France Féminin — effectif saison 2025/2026
 * Source : https://www.ffr.fr/equipe-de-france/rugby-a-xv/xv-france-feminin/joueurs
 * Noms au format « Prénom Nom » (convention de l'application).
 */
export const FRANCE_W6N_SQUAD_2025_2026: SquadPlayer[] = [
  // Piliers — première ligne
  { name: "Makarita Baleinadogo", positions: ["première ligne"], nationality: "FR", gender: "female" },
  { name: "Rose Bernadou",        positions: ["première ligne"], nationality: "FR", gender: "female" },
  { name: "Yllana Brosseau",      positions: ["première ligne"], nationality: "FR", gender: "female" },
  { name: "Annaëlle Deshaye",     positions: ["première ligne"], nationality: "FR", gender: "female" },
  { name: "Assia Khalfaoui",      positions: ["première ligne"], nationality: "FR", gender: "female" },
  // Talonneurs
  { name: "Manon Bigot",          positions: ["talonneur"], nationality: "FR", gender: "female" },
  { name: "Agathe Gérin",         positions: ["talonneur"], nationality: "FR", gender: "female" },
  { name: "Mathilde Lazarko",     positions: ["talonneur"], nationality: "FR", gender: "female" },
  { name: "Elisa Riffonneau",     positions: ["talonneur"], nationality: "FR", gender: "female" },
  // Deuxièmes lignes
  { name: "Cloé Correa",            positions: ["deuxième ligne"], nationality: "FR", gender: "female" },
  { name: "Madoussou Fall Raclot",  positions: ["deuxième ligne"], nationality: "FR", gender: "female" },
  { name: "Manae Feleu",            positions: ["deuxième ligne"], nationality: "FR", gender: "female" },
  { name: "Hina Ikahehegi",         positions: ["deuxième ligne"], nationality: "FR", gender: "female" },
  // Troisièmes lignes (aile + centre)
  { name: "Axelle Berthoumieu",   positions: ["troisième ligne"], nationality: "FR", gender: "female" },
  { name: "Léa Champon",          positions: ["troisième ligne"], nationality: "FR", gender: "female" },
  { name: "Khoudedia Cissokho",   positions: ["troisième ligne"], nationality: "FR", gender: "female" },
  { name: "Charlotte Escudero",   positions: ["troisième ligne"], nationality: "FR", gender: "female" },
  { name: "Marie Morland",        positions: ["troisième ligne"], nationality: "FR", gender: "female" },
  // Demis de mêlée
  { name: "Pauline Bourdon Sansus", positions: ["demi de mêlée"], nationality: "FR", gender: "female" },
  { name: "Alexandra Chambon",      positions: ["demi de mêlée"], nationality: "FR", gender: "female" },
  // Demis d'ouverture
  { name: "Carla Arbez",    positions: ["demi d'ouverture"], nationality: "FR", gender: "female" },
  { name: "Lina Queyroi",   positions: ["demi d'ouverture"], nationality: "FR", gender: "female" },
  { name: "Lina Tuy",       positions: ["demi d'ouverture"], nationality: "FR", gender: "female" },
  // Centres
  { name: "Nassira Konde",      positions: ["centre"], nationality: "FR", gender: "female" },
  { name: "Marine Ménager",     positions: ["centre"], nationality: "FR", gender: "female" },
  { name: "Carla Neisen",       positions: ["centre"], nationality: "FR", gender: "female" },
  { name: "Aubane Rousset",     positions: ["centre"], nationality: "FR", gender: "female" },
  { name: "Gabrielle Vernier",  positions: ["centre"], nationality: "FR", gender: "female" },
  // Ailiers
  { name: "Kelly Arbey",    positions: ["ailier"], nationality: "FR", gender: "female" },
  { name: "Anaïs Grando",   positions: ["ailier"], nationality: "FR", gender: "female" },
  { name: "Joanna Grisez",  positions: ["ailier"], nationality: "FR", gender: "female" },
  { name: "Léa Murie",      positions: ["ailier"], nationality: "FR", gender: "female" },
  // Arrières
  { name: "Pauline Barrat",    positions: ["arrière"], nationality: "FR", gender: "female" },
  { name: "Emilie Boulard",    positions: ["arrière"], nationality: "FR", gender: "female" },
  { name: "Morgane Bourgeois", positions: ["arrière"], nationality: "FR", gender: "female" },
];
