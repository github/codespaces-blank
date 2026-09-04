import { useEffect, useMemo, useRef, useState } from "react";
import type React from "react";

const TRACKER_MATCH_INFO_STORAGE_KEY = "sidepitcher.tracker.matchInfo";

interface TrackerMatchInfo {
  field: string;
  referee: string;
  matchDate: string;
}

function getTodayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

interface UseTrackerSetupParams {
  championship: string;
  matchDay: string | number;
}

export function useTrackerSetup({ championship, matchDay }: UseTrackerSetupParams) {
  const [team1Id, setTeam1Id] = useState<string>("");
  const [team2Id, setTeam2Id] = useState<string>("");

  const [field, setField] = useState<string>("");
  const [fieldInput, setFieldInput] = useState<string>("");
  const [matchDate, setMatchDate] = useState<string>(getTodayIsoDate());
  const [matchDateInput, setMatchDateInput] = useState<string>(getTodayIsoDate());
  const [referee, setReferee] = useState<string>("");
  const [refereeInput, setRefereeInput] = useState<string>("");

  const [showMatchInfoEditor, setShowMatchInfoEditor] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string>("");
  const [isTrackerReady, setIsTrackerReady] = useState(false);
  const didInitialAutoOpenRef = useRef(false);

  useEffect(() => {
    const storedRaw = window.localStorage.getItem(TRACKER_MATCH_INFO_STORAGE_KEY);
    if (!storedRaw) return;

    try {
      const stored = JSON.parse(storedRaw) as Partial<TrackerMatchInfo>;
      const storedField = (stored.field || "").trim();
      const storedReferee = (stored.referee || "").trim();
      const storedDate = (stored.matchDate || "").trim();

      setField(storedField);
      setFieldInput(storedField);
      setReferee(storedReferee);
      setRefereeInput(storedReferee);
      setMatchDate(storedDate || getTodayIsoDate());
      setMatchDateInput(storedDate || getTodayIsoDate());
    } catch {
      setField("");
      setFieldInput("");
      setReferee("");
      setRefereeInput("");
      setMatchDate(getTodayIsoDate());
      setMatchDateInput(getTodayIsoDate());
    }
  }, []);

  useEffect(() => {
    if (!championship || !matchDay) return;

    const matchDayNum = typeof matchDay === "number" ? matchDay : parseInt(matchDay, 10);
    if (isNaN(matchDayNum)) return;

    let cancelled = false;

    fetch(`/api/match-day-teams?championship=${encodeURIComponent(championship)}&matchDay=${matchDayNum}`)
      .then((response) => response.json())
      .then((data) => {
        if (cancelled) return;
        const saved = data?.selection as { team1Id?: string; team2Id?: string } | null;
        if (!saved?.team1Id || !saved?.team2Id) {
          setTeam1Id("");
          setTeam2Id("");
          return;
        }
        setTeam1Id(saved.team1Id);
        setTeam2Id(saved.team2Id);
      })
      .catch(() => {
        if (cancelled) return;
        setTeam1Id("");
        setTeam2Id("");
      });

    return () => {
      cancelled = true;
    };
  }, [championship, matchDay]);

  useEffect(() => {
    if (didInitialAutoOpenRef.current || isTrackerReady) return;
    const teamsReady = !!team1Id && !!team2Id && team1Id !== team2Id;
    const infosReady = !!matchDate && !!field.trim() && !!referee.trim();
    if (teamsReady && infosReady) {
      setIsTrackerReady(true);
      didInitialAutoOpenRef.current = true;
    }
  }, [isTrackerReady, team1Id, team2Id, matchDate, field, referee]);

  function applyMatchInfo(options?: { closeEditor?: boolean }): boolean {
    const closeEditor = options?.closeEditor ?? true;
    const nextField = fieldInput.trim();
    const nextReferee = refereeInput.trim();
    const nextDate = matchDateInput || getTodayIsoDate();

    if (!nextField || !nextReferee || !nextDate) {
      setSaveMessage("Renseignez date, terrain et arbitre.");
      return false;
    }

    setField(nextField);
    setReferee(nextReferee);
    setMatchDate(nextDate);

    window.localStorage.setItem(
      TRACKER_MATCH_INFO_STORAGE_KEY,
      JSON.stringify({
        field: nextField,
        referee: nextReferee,
        matchDate: nextDate,
      })
    );

    if (closeEditor) {
      setShowMatchInfoEditor(false);
    }

    return true;
  }

  function syncRefereeFromEvent(nextReferee: string) {
    const trimmedReferee = nextReferee.trim();
    if (!trimmedReferee || trimmedReferee === referee) return;

    setReferee(trimmedReferee);
    setRefereeInput(trimmedReferee);
    window.localStorage.setItem(
      TRACKER_MATCH_INFO_STORAGE_KEY,
      JSON.stringify({
        field,
        referee: trimmedReferee,
        matchDate,
      })
    );
  }

  async function saveTeamSelection(): Promise<boolean> {
    if (!team1Id || !team2Id || !championship || !matchDay) {
      setSaveMessage("Veuillez sélectionner les deux équipes.");
      return false;
    }
    if (team1Id === team2Id) {
      setSaveMessage("Les équipes doivent être différentes.");
      return false;
    }

    try {
      await fetch("/api/match-day-teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          championship,
          matchDay: typeof matchDay === "number" ? matchDay : parseInt(matchDay, 10),
          team1Id,
          team2Id,
        }),
      });

      setSaveMessage("Affiche enregistrée ✓");
      setTimeout(() => setSaveMessage(""), 3000);
      return true;
    } catch {
      setSaveMessage("Erreur lors de la sauvegarde.");
      return false;
    }
  }

  async function handleSetupSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const hasValidMatchInfo = applyMatchInfo({ closeEditor: false });
    if (!hasValidMatchInfo) return;
    const teamsSaved = await saveTeamSelection();
    if (!teamsSaved) return;
    setIsTrackerReady(true);
  }

  function resetMatchInfo() {
    setField("");
    setFieldInput("");
    setReferee("");
    setRefereeInput("");
    const today = getTodayIsoDate();
    setMatchDate(today);
    setMatchDateInput(today);
    window.localStorage.removeItem(TRACKER_MATCH_INFO_STORAGE_KEY);
  }

  function resetPreparationState() {
    setTeam1Id("");
    setTeam2Id("");
    setSaveMessage("");
    setIsTrackerReady(false);
  }

  const setupCanSubmit = useMemo(
    () =>
      !!team1Id &&
      !!team2Id &&
      team1Id !== team2Id &&
      !!matchDateInput &&
      !!fieldInput.trim() &&
      !!refereeInput.trim(),
    [team1Id, team2Id, matchDateInput, fieldInput, refereeInput]
  );

  return {
    team1Id,
    setTeam1Id,
    team2Id,
    setTeam2Id,
    field,
    setField,
    fieldInput,
    setFieldInput,
    matchDate,
    setMatchDate,
    matchDateInput,
    setMatchDateInput,
    referee,
    setReferee,
    refereeInput,
    setRefereeInput,
    showMatchInfoEditor,
    setShowMatchInfoEditor,
    saveMessage,
    setSaveMessage,
    isTrackerReady,
    setIsTrackerReady,
    setupCanSubmit,
    applyMatchInfo,
    syncRefereeFromEvent,
    saveTeamSelection,
    handleSetupSubmit,
    resetMatchInfo,
    resetPreparationState,
  };
}
