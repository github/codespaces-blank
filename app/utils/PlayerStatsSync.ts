import type { Event, Roster, Player, PlayerStats } from "~/types/tracker";

/**
 * Updates player stats in rosters based on match events
 * 
 * Note: Stats are CUMULATIVE - each time a match is saved, stats are added.
 * The tauxTransfo (transformation success rate) is recalculated based on all
 * successful transformations (pied) and transformation attempts in the match.
 */
export function updatePlayerStatsFromEvents(
  rosters: Roster[],
  events: Event[],
  teams: Array<{ id: string; name: string }>
): Roster[] {
  if (!events || events.length === 0) return rosters;
  if (!Array.isArray(rosters)) return rosters;

  // Update rosters with event-based stats
  const updatedRosters = rosters.map((roster) => {
    if (!roster.players || !Array.isArray(roster.players)) {
      return roster;
    }

    const updatedPlayers = roster.players.map((player) => {
      // Initialize stats from existing player data
      const playerStats: PlayerStats = {
        points: player.stats?.points || 0,
        essais: player.stats?.essais || 0,
        pied: player.stats?.pied || 0,
        tauxTransfo: player.stats?.tauxTransfo || 0,
        cartons: player.stats?.cartons || 0,
        drops: player.stats?.drops || 0,
        matchs2526: player.stats?.matchs2526 || 0,
        titularisations2526: player.stats?.titularisations2526 || 0,
      };

      // Count relevant event types for this match
      let transformationsInMatch = 0;
      let transformationAttemptsInMatch = 0;

      // Process all events involving this player
      events.forEach((event) => {
        if (!event.player || event.player.id !== player.id) return;

        switch (event.type) {
          case "Essai":
            playerStats.essais += 1;
            playerStats.points += 5;
            break;
          case "Transformation":
            transformationsInMatch += 1;
            transformationAttemptsInMatch += 1;
            playerStats.pied += 1;
            playerStats.points += 2;
            break;
          case "Transformation manquée":
            transformationAttemptsInMatch += 1;
            break;
          case "Drop":
            playerStats.drops += 1;
            playerStats.points += 3;
            break;
          case "Pénalité réussie":
            playerStats.points += 3;
            break;
          case "Carton jaune":
          case "Carton rouge":
          case "Carton orange":
            playerStats.cartons += 1;
            break;
          // Note: "Essai de pénalité", "Pénalité manquée", "Changement", "Saignement", "Blessure", "Arbitrage Vidéo" don't affect stats
        }
      });

      // Recalculate transformation success rate based on cumulative data
      // Only recalculate if there were transformations in this match
      if (transformationAttemptsInMatch > 0) {
        // This recalculates the rate based on current match only
        // A more accurate approach would track total attempts historically, but we only have this match's data
        playerStats.tauxTransfo = Math.round(
          (transformationsInMatch / transformationAttemptsInMatch) * 100
        );
      }

      return {
        ...player,
        stats: playerStats,
      };
    });

    return {
      ...roster,
      players: updatedPlayers,
    };
  });

  return updatedRosters;
}
