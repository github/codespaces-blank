import { useState } from "react";

export function useTrackerClock() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [currentHalf, setCurrentHalf] = useState<1 | 2>(1);
  const [manualTimeInput, setManualTimeInput] = useState("");
  const [matchEnded, setMatchEnded] = useState(false);

  function formatTime(sec: number) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  // Retourne deux valeurs d'affichage :
  //   - mainTime    : le temps principal, plafonné à 40 min par mi-temps
  //   - secondaryTime : le temps additionnel si la mi-temps dépasse 40 min (null sinon)
  // La 2e mi-temps commence à partir de 40 min côté chrono interne (time démarre toujours à 0).
  function getDisplayTimes() {
    const HALF_SECONDS = 40 * 60;

    if (currentHalf === 1) {
      const mainTime = Math.min(time, HALF_SECONDS);
      const secondaryTime = time > HALF_SECONDS ? time - HALF_SECONDS : null;
      return { mainTime, secondaryTime };
    }

    const effectiveTime = time - HALF_SECONDS;
    const mainTime = Math.min(effectiveTime, HALF_SECONDS) + HALF_SECONDS;
    const secondaryTime = effectiveTime > HALF_SECONDS ? effectiveTime - HALF_SECONDS : null;
    return { mainTime, secondaryTime };
  }

  function adjustTime(delta: number) {
    setTime((t) => Math.max(0, t + delta));
  }

  function parseManualTime(input: string): number | null {
    const trimmed = input.trim();
    if (!trimmed) return null;

    const parts = trimmed.split(":");
    if (parts.length !== 2) return null;

    const mins = parseInt(parts[0], 10);
    const secs = parseInt(parts[1], 10);
    if (Number.isNaN(mins) || Number.isNaN(secs) || mins < 0 || secs < 0 || secs >= 60) {
      return null;
    }

    return mins * 60 + secs;
  }

  function applyManualTime() {
    const parsedTime = parseManualTime(manualTimeInput);
    if (parsedTime === null) return;

    setTime(parsedTime);
    setManualTimeInput("");
  }

  function resetClock() {
    setTime(0);
    setRunning(false);
    setCurrentHalf(1);
    setMatchEnded(false);
    setManualTimeInput("");
  }

  return {
    time,
    setTime,
    running,
    setRunning,
    currentHalf,
    setCurrentHalf,
    manualTimeInput,
    setManualTimeInput,
    matchEnded,
    setMatchEnded,
    formatTime,
    getDisplayTimes,
    adjustTime,
    applyManualTime,
    resetClock,
  };
}
