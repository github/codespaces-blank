import React from "react";
import type { Team, Event } from "~/types/tracker";

interface Props {
  teams: Team[];
  scores: number[];
  bonuses?: string[];
  mainTimerText?: string;
  secondaryTimerText?: string;
  currentTime?: number;
  events?: Event[];
}

export default function Scoreboard({
  teams,
  scores,
  bonuses,
  mainTimerText,
  secondaryTimerText,
  currentTime,
  events,
}: Props) {
  const displayScore = (idx: number) => scores[idx] || 0;
  const displayBonus = (idx: number) => bonuses?.[idx] || "";

  const getTeamColor = (team: Team | undefined): string | undefined => {
    const color = team?.color?.trim();
    if (!color) return undefined;
    return /^#[0-9A-Fa-f]{6}$/.test(color) ? color : undefined;
  };

  const displayTeamName = (team?: Team) => {
    if (!team) return "";
    return team.nickname || team.name.replace(/\s+J\d+$/, "");
  };

  const leftTeamColor = getTeamColor(teams[0]);
  const rightTeamColor = getTeamColor(teams[1]);

  const YELLOW_CARD_DURATION_SECONDS = 10 * 60;
  const activeYellowCardsByTeam = [0, 0];
  const redCardsByTeam = [0, 0];
  const orangeCardsByTeam = [0, 0];

  if (events) {
    for (const event of events) {
      if (!event.team?.id) continue;

      const teamIdx =
        teams[0]?.id && event.team.id === teams[0].id
          ? 0
          : teams[1]?.id && event.team.id === teams[1].id
            ? 1
            : -1;
      if (teamIdx === -1) continue;

      if (event.type === "Carton jaune" && typeof currentTime === "number") {
        const elapsed = currentTime - event.time;
        if (elapsed >= 0 && elapsed < YELLOW_CARD_DURATION_SECONDS) {
          activeYellowCardsByTeam[teamIdx] += 1;
        }
      }

      if (event.type === "Carton rouge") {
        redCardsByTeam[teamIdx] += 1;
      }

      if (event.type === "Carton orange") {
        orangeCardsByTeam[teamIdx] += 1;
      }
    }
  }

  const renderCards = (idx: number) => {
    const yellowCount = activeYellowCardsByTeam[idx] || 0;
    const redCount = redCardsByTeam[idx] || 0;
    const orangeCount = orangeCardsByTeam[idx] || 0;
    if (yellowCount <= 0 && redCount <= 0 && orangeCount <= 0) return null;

    const yellowIconCount = Math.min(yellowCount, 3);
    return (
      <div className="mt-2 flex items-center justify-center gap-1" aria-label={`Cartons: jaunes ${yellowCount}, rouges ${redCount}, oranges ${orangeCount}`}>
        {Array.from({ length: yellowIconCount }).map((_, iconIdx) => (
          <span key={`yellow-card-${idx}-${iconIdx}`} className="text-base sm:text-lg leading-none">🟨</span>
        ))}
        {yellowCount > yellowIconCount && <span className="text-xs sm:text-sm font-bold">+{yellowCount - yellowIconCount}</span>}
        {orangeCount > 0 && <span className="text-base sm:text-lg leading-none">🟧</span>}
        {orangeCount > 1 && <span className="text-xs sm:text-sm font-bold">x{orangeCount}</span>}
        {redCount > 0 && <span className="text-base sm:text-lg leading-none">🟥</span>}
        {redCount > 1 && <span className="text-xs sm:text-sm font-bold">x{redCount}</span>}
      </div>
    );
  };

  return (
    <div className="shadow-lg rounded-lg overflow-hidden flex flex-row items-stretch">
      {/* left team*/}
      <div
        className={`flex-1 text-white p-3 sm:p-6 flex flex-col items-center justify-center ${leftTeamColor ? "" : "bg-blue-700"}`}
        style={leftTeamColor ? { backgroundColor: leftTeamColor } : undefined}
      >
        {teams[0] ? (
          <>
            <div className="text-sm sm:text-lg font-semibold mb-1">{displayTeamName(teams[0])}</div>
            <div className="text-4xl sm:text-6xl font-bold leading-none">{displayScore(0)}</div>
            {renderCards(0)}
            {displayBonus(0) && (
              <div className="mt-2 rounded bg-black/20 px-2 py-1 text-xs font-bold tracking-wide">{displayBonus(0)}</div>
            )}
          </>
        ) : (
          <div className="text-lg italic">Aucune équipe</div>
        )}
      </div>

      {/* timer / center */}
      <div className="bg-gray-900 text-white flex flex-col items-center justify-center px-3 sm:px-8 py-3 sm:py-6 gap-1 sm:gap-2">
        {mainTimerText && (
          <div className="text-xl sm:text-5xl font-mono font-bold text-center break-words leading-none">{mainTimerText}</div>
        )}
        {secondaryTimerText && (
          <div className="text-sm sm:text-2xl font-mono text-yellow-300 text-center break-words">{secondaryTimerText}</div>
        )}
      </div>

      {/* right team */}
      <div
        className={`flex-1 text-white p-3 sm:p-6 flex flex-col items-center justify-center ${rightTeamColor ? "" : "bg-red-700"}`}
        style={rightTeamColor ? { backgroundColor: rightTeamColor } : undefined}
      >
        {teams[1] ? (
          <>
            <div className="text-sm sm:text-lg font-semibold mb-1">{displayTeamName(teams[1])}</div>
            <div className="text-4xl sm:text-6xl font-bold leading-none">{displayScore(1)}</div>
            {renderCards(1)}
            {displayBonus(1) && (
              <div className="mt-2 rounded bg-black/20 px-2 py-1 text-xs font-bold tracking-wide">{displayBonus(1)}</div>
            )}
          </>
        ) : (
          <div className="text-lg italic">Aucune équipe</div>
        )}
      </div>
    </div>
  );
}
