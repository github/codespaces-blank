import { Link, useParams } from "react-router";
import type { Route } from "./+types/roster-profile";
import { useMemo, useState } from "react";
import { useTeams } from "~/context/TeamsContext";
import { toShortId, findFullId } from "~/utils/shortId";
import { parsePlayerName } from "~/utils/RosterUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCrown, faPlus, faSync, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { getFlagUrl } from "~/utils/countries";
import { faPenToSquare as faPenToSquareRegular } from "@fortawesome/free-regular-svg-icons";
import { CURRENT_SEASON, type MatchFixture, type PlayerPosition, type Result, type Title } from "~/types/tracker";

export function meta({ params }: Route.MetaArgs) {
  return [{ title: "Vue effectif" }];
}

function getPreviousSeason(season: string): string {
  const [start, end] = season.split("/").map((part) => parseInt(part, 10));
  if (!Number.isFinite(start) || !Number.isFinite(end)) return season;
  return `${start - 1}/${end - 1}`;
}

const PREVIOUS_SEASON = getPreviousSeason(CURRENT_SEASON);

function getRosterBackPath(rosterId: string | null | undefined): string {
  if (!rosterId) return "/roster";
  return `/r/${toShortId(rosterId)}`;
}

function getPlayerProfilePath(rosterId: string | null | undefined, playerId: string): string {
  if (!rosterId) return "/roster";
  return `/r/${toShortId(rosterId)}/p/${toShortId(playerId)}`;
}

function findOpponentRoster(
  rosters: { id: string; name: string; category?: string }[],
  opponentName: string,
  competition: string | undefined
) {
  const candidates = rosters.filter(
    (item) => item.name.trim().toLowerCase() === opponentName.trim().toLowerCase()
  );
  if (candidates.length === 0) return null;
  if (candidates.length === 1) return candidates[0];
  return candidates.find((item) => item.category === competition) ?? candidates[0];
}


function getSortableFirstName(fullName: string): string {
  const { first, last } = parsePlayerName(fullName.trim());
  return (first || last).trim();
}

const POSITION_PRIORITY: PlayerPosition[] = [
  "première ligne",
  "talonneur",
  "deuxième ligne",
  "troisième ligne",
  "demi de mêlée",
  "demi d'ouverture",
  "centre",
  "ailier",
  "arrière",
];

function getPositionRank(positions?: PlayerPosition[]): number {
  if (!positions || positions.length === 0) return POSITION_PRIORITY.length;
  const rankedPositions = positions
    .map((position) => POSITION_PRIORITY.indexOf(position))
    .filter((index) => index >= 0);
  return rankedPositions.length > 0 ? Math.min(...rankedPositions) : POSITION_PRIORITY.length;
}

function comparePlayersByPositionThenName(
  firstPlayer: { name: string; positions?: PlayerPosition[] },
  secondPlayer: { name: string; positions?: PlayerPosition[] }
): number {
  const firstRank = getPositionRank(firstPlayer.positions);
  const secondRank = getPositionRank(secondPlayer.positions);
  if (firstRank !== secondRank) return firstRank - secondRank;

  const firstFirstName = getSortableFirstName(firstPlayer.name);
  const secondFirstName = getSortableFirstName(secondPlayer.name);
  const firstNameComparison = firstFirstName.localeCompare(secondFirstName, "fr", { sensitivity: "base" });
  if (firstNameComparison !== 0) return firstNameComparison;

  return firstPlayer.name.localeCompare(secondPlayer.name, "fr", { sensitivity: "base" });
}

export default function RosterProfilePage() {
  const { rosterId: shortRosterId } = useParams();
  const { rosters, teams, setRosters } = useTeams();
  const [selectedSeason, setSelectedSeason] = useState(CURRENT_SEASON);

  // Convert short ID to full ID
  const rosterId = useMemo(
    () => findFullId(shortRosterId, rosters),
    [shortRosterId, rosters]
  );

  const roster = useMemo(
    () => rosters.find((item) => item.id === rosterId) ?? null,
    [rosters, rosterId]
  );

  // Available seasons, sorted descending
  const availableSeasons = useMemo(() => {
    if (!roster) return [CURRENT_SEASON];
    const keys = Object.keys(roster.seasons ?? {});
    if (!keys.includes(CURRENT_SEASON)) keys.push(CURRENT_SEASON);
    return keys.sort().reverse();
  }, [roster]);

  const isCurrentSeason = selectedSeason === CURRENT_SEASON;

  const seasonPlayers = useMemo(() => {
    if (!roster) return [];
    if (isCurrentSeason) return roster.players;
    return roster.seasons?.[selectedSeason]?.players ?? [];
  }, [roster, selectedSeason, isCurrentSeason]);

  const seasonCoach = useMemo(() => {
    if (!roster) return undefined;
    if (isCurrentSeason) return roster.coach;
    return roster.seasons?.[selectedSeason]?.coach;
  }, [roster, selectedSeason, isCurrentSeason]);

  const seasonCalendar = useMemo((): MatchFixture[] => {
    if (!roster) return [];
    return roster.seasons?.[selectedSeason]?.calendar ?? [];
  }, [roster, selectedSeason]);

  const previousSeasonRanking = roster?.seasons?.[PREVIOUS_SEASON]?.ranking;
  const previousSeasonPoints = roster?.seasons?.[PREVIOUS_SEASON]?.points;

  const POSITION_TABS = [
    { key: "all", label: "Tous" },
    { key: "avants", label: "Avants", positions: ["première ligne", "talonneur", "deuxième ligne", "troisième ligne"] as PlayerPosition[] },
    { key: "arrieres", label: "Arrières", positions: ["demi de mêlée", "demi d'ouverture", "centre", "ailier", "arrière"] as PlayerPosition[] },
  ] as const;

  const [selectedPositionTab, setSelectedPositionTab] = useState<string>("all");

  const rosterTeams = useMemo(() => {
    if (!roster) return [];
    return teams.filter((item) => item.rosterId === roster.id);
  }, [teams, roster]);

  const sortedPlayers = useMemo(() => {
    if (!roster) return [];

    return [...seasonPlayers].sort(comparePlayersByPositionThenName);
  }, [roster, seasonPlayers]);

  const playerRows = useMemo(() => {
    if (!roster) return [];

    const compositionsByPlayerId = new Map<string, { teamName: string; number: number; role: "Titulaire" | "Remplaçant"; isCaptain: boolean }[]>();

    rosterTeams.forEach((team) => {
      [...team.starters, ...team.substitutes].forEach((entry) => {
        const existing = compositionsByPlayerId.get(entry.player.id) ?? [];
        existing.push({
          teamName: team.name,
          number: entry.number,
          role: entry.number <= 15 ? "Titulaire" : "Remplaçant",
          isCaptain: team.captainPlayerId === entry.player.id,
        });
        compositionsByPlayerId.set(entry.player.id, existing);
      });
    });

    return sortedPlayers.map((player) => ({
      player,
      compositions: (compositionsByPlayerId.get(player.id) ?? []).sort((first, second) => first.number - second.number),
    }));
  }, [sortedPlayers, roster, rosterTeams]);

  const filteredPlayerRows = useMemo(() => {
    if (selectedPositionTab === "all") return playerRows;
    const tab = POSITION_TABS.find((t) => t.key === selectedPositionTab);
    if (!tab || !("positions" in tab)) return playerRows;
    return playerRows.filter((row) =>
      row.player.positions?.some((p) => tab.positions.includes(p)) ?? false,
    );
  }, [playerRows, selectedPositionTab]);

  const [isEditingCoach, setIsEditingCoach] = useState(false);
  const [coachInput, setCoachInput] = useState("");
  const [isEditingPresident, setIsEditingPresident] = useState(false);
  const [presidentInput, setPresidentInput] = useState("");
  const [isEditingFoundedIn, setIsEditingFoundedIn] = useState(false);
  const [foundedInInput, setFoundedInInput] = useState("");
  const [isEditingTitles, setIsEditingTitles] = useState(false);
  const [titlesDraft, setTitlesDraft] = useState<Title[]>([]);
  const [isSyncingCalendar, setIsSyncingCalendar] = useState(false);
  const [calendarSyncResult, setCalendarSyncResult] = useState<string | null>(null);
  const [inlineMessage, setInlineMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [isEditingRanking, setIsEditingRanking] = useState(false);
  const [rankingInput, setRankingInput] = useState("");
  const [pointsInput, setPointsInput] = useState("");
  const [isEditingPreviousRanking, setIsEditingPreviousRanking] = useState(false);
  const [previousRankingInput, setPreviousRankingInput] = useState("");
  const [previousPointsInput, setPreviousPointsInput] = useState("");
  const [isEditingLastFive, setIsEditingLastFive] = useState(false);
  const [lastFiveDraft, setLastFiveDraft] = useState<Result[]>([]);
  const [isEditingSeasonRecord, setIsEditingSeasonRecord] = useState(false);
  const [seasonVInput, setSeasonVInput] = useState("");
  const [seasonDInput, setSeasonDInput] = useState("");
  const [seasonNInput, setSeasonNInput] = useState("");

  function showInlineMessage(type: "error" | "success", text: string) {
    setInlineMessage({ type, text });
    if (type === "success") setTimeout(() => setInlineMessage(null), 3000);
  }

  async function syncCalendar() {
    if (!roster || isSyncingCalendar) return;
    setIsSyncingCalendar(true);
    setCalendarSyncResult(null);
    try {
      const res = await fetch("/api/calendar-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rosterId: roster.id,
          icsUrl: "https://ics.ecal.com/ecal-sub/69cdf65b776b530002545e5e/Ligue%20Nationale%20De%20Rugby.ics",
          season: selectedSeason,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setCalendarSyncResult(`${data.matchCount} match(s) synchronisé(s)`);
        // Reload page data to get updated calendar
        window.location.reload();
      } else {
        setCalendarSyncResult(data.error || "Erreur de synchronisation");
      }
    } catch {
      setCalendarSyncResult("Erreur réseau");
    } finally {
      setIsSyncingCalendar(false);
    }
  }

  function saveCoach() {
    if (!roster) return;
    const name = coachInput.trim() || undefined;
    const names = name ? name.split(",").map((n) => n.trim()).filter(Boolean) : [];
    const rosterClub = roster.name;
    setRosters((current) =>
      current.map((item) =>
        item.id === roster.id
          ? {
              ...item,
              coach: name,
              coachData: names[0]
                ? { ...(item.coachData ?? {}), name: names[0], club: (item.coachData?.club || rosterClub) }
                : undefined,
              coachesData: names.length > 1
                ? names.map((n, i) => ({
                    ...(item.coachesData?.[i] ?? {}),
                    name: n,
                    club: (item.coachesData?.[i]?.club || rosterClub),
                  }))
                : undefined,
            }
          : item,
      ),
    );
    setIsEditingCoach(false);
    showInlineMessage("success", "Entraîneur mis à jour.");
  }

  function savePresident() {
    if (!roster) return;
    const name = presidentInput.trim() || undefined;
    const rosterClub = roster.name;
    setRosters((current) =>
      current.map((item) =>
        item.id === roster.id
          ? {
              ...item,
              president: name,
              presidentData: name
                ? { ...(item.presidentData ?? {}), name, club: (item.presidentData?.club || rosterClub) }
                : undefined,
            }
          : item,
      ),
    );
    setIsEditingPresident(false);
    showInlineMessage("success", "Président mis à jour.");
  }

  function saveFoundedIn() {
    if (!roster) return;
    const parsed = parseInt(foundedInInput, 10);
    const value = Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
    setRosters((current) =>
      current.map((item) =>
        item.id === roster.id ? { ...item, founded_in: value } : item,
      ),
    );
    setIsEditingFoundedIn(false);
    showInlineMessage("success", "Année de fondation mise à jour.");
  }

  function startEditingTitles() {
    setTitlesDraft(roster?.titles ? roster.titles.map((t) => ({ ...t })) : []);
    setIsEditingTitles(true);
  }

  function addTitleRow() {
    setTitlesDraft((prev) => [...prev, { competition: "", ranking: "Vainqueur", year: new Date().getFullYear() }]);
  }

  function removeTitleRow(index: number) {
    setTitlesDraft((prev) => prev.filter((_, i) => i !== index));
  }

  function updateTitleDraft(index: number, field: keyof Title, value: string | number) {
    setTitlesDraft((prev) =>
      prev.map((t, i) => (i === index ? { ...t, [field]: value } : t)),
    );
  }

  function saveTitles() {
    if (!roster) return;
    const cleaned = titlesDraft.filter((t) => t.competition.trim() && t.year > 0);
    setRosters((current) =>
      current.map((item) =>
        item.id === roster.id ? { ...item, titles: cleaned.length > 0 ? cleaned : undefined } : item,
      ),
    );
    setIsEditingTitles(false);
    showInlineMessage("success", "Palmarès mis à jour.");
  }

  function saveRanking() {
    if (!roster) return;
    const ranking = parseInt(rankingInput, 10);
    const points = parseInt(pointsInput, 10);
    setRosters((current) =>
      current.map((item) =>
        item.id === roster.id
          ? {
              ...item,
              currentRanking: Number.isFinite(ranking) && ranking > 0 ? ranking : undefined,
              currentPoints: Number.isFinite(points) && points >= 0 ? points : undefined,
            }
          : item,
      ),
    );
    setIsEditingRanking(false);
    showInlineMessage("success", "Classement mis à jour.");
  }

  function savePreviousSeasonRanking() {
    if (!roster) return;
    const ranking = parseInt(previousRankingInput, 10);
    const points = parseInt(previousPointsInput, 10);
    setRosters((current) =>
      current.map((item) =>
        item.id === roster.id
          ? {
              ...item,
              seasons: {
                ...item.seasons,
                [PREVIOUS_SEASON]: {
                  players: item.seasons?.[PREVIOUS_SEASON]?.players ?? [],
                  coach: item.seasons?.[PREVIOUS_SEASON]?.coach,
                  calendar: item.seasons?.[PREVIOUS_SEASON]?.calendar,
                  ranking: Number.isFinite(ranking) && ranking > 0 ? ranking : undefined,
                  points: Number.isFinite(points) && points >= 0 ? points : undefined,
                },
              },
            }
          : item,
      ),
    );
    setIsEditingPreviousRanking(false);
    showInlineMessage("success", `Classement ${PREVIOUS_SEASON} mis à jour.`);
  }

  function reusePreviousSeasonStats() {
    if (!roster) return;
    const previous = roster.seasons?.[PREVIOUS_SEASON];
    if (!previous || (previous.ranking == null && previous.points == null)) return;
    setRosters((current) =>
      current.map((item) =>
        item.id === roster.id
          ? { ...item, currentRanking: previous.ranking, currentPoints: previous.points }
          : item,
      ),
    );
    showInlineMessage("success", `Statistiques ${PREVIOUS_SEASON} reprises pour ${CURRENT_SEASON}.`);
  }

  function startEditingLastFive() {
    setLastFiveDraft(
      roster?.lastFiveMatches && roster.lastFiveMatches.length > 0
        ? roster.lastFiveMatches.map((r) => ({ ...r }))
        : [],
    );
    setIsEditingLastFive(true);
  }

  function addLastFiveRow() {
    setLastFiveDraft((prev) => [
      ...prev,
      { outcome: "victory", resultText: "", opponent: "" },
    ]);
  }

  function removeLastFiveRow(index: number) {
    setLastFiveDraft((prev) => prev.filter((_, i) => i !== index));
  }

  function updateLastFiveDraft(index: number, field: keyof Result, value: string) {
    setLastFiveDraft((prev) =>
      prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)),
    );
  }

  function saveLastFive() {
    if (!roster) return;
    const cleaned = lastFiveDraft.filter((r) => r.opponent.trim());
    setRosters((current) =>
      current.map((item) =>
        item.id === roster.id
          ? { ...item, lastFiveMatches: cleaned.length > 0 ? cleaned : undefined }
          : item,
      ),
    );
    setIsEditingLastFive(false);
    showInlineMessage("success", "Série mise à jour.");
  }

  function saveSeasonRecord() {
    if (!roster) return;
    const v = parseInt(seasonVInput, 10);
    const d = parseInt(seasonDInput, 10);
    const n = parseInt(seasonNInput, 10);
    const hasValue = [v, d, n].some((x) => Number.isFinite(x) && x >= 0);
    setRosters((current) =>
      current.map((item) =>
        item.id === roster.id
          ? {
              ...item,
              seasonRecord: hasValue
                ? { victories: v || 0, defeats: d || 0, draws: n || 0 }
                : undefined,
            }
          : item,
      ),
    );
    setIsEditingSeasonRecord(false);
    showInlineMessage("success", "Bilan saison mis à jour.");
  }

  function getCoachProfilePath(coachIndex?: number): string {
    if (!rosterId) return "#";
    const base = `/r/${toShortId(rosterId)}/coach`;
    return coachIndex != null && coachIndex > 0 ? `${base}?idx=${coachIndex}` : base;
  }

  function getPresidentProfilePath(): string {
    if (!rosterId) return "#";
    return `/r/${toShortId(rosterId)}/president`;
  }

  const backPath = getRosterBackPath(rosterId);

  if (!roster) {
    return (
      <main className="sp-page space-y-4">
        <h1 className="text-2xl font-bold">Vue effectif introuvable</h1>
        <Link to={backPath} className="sp-link-muted">
          <FontAwesomeIcon icon={faArrowLeft} className="text-xs mr-1" />
          Retour à l'effectif
        </Link>
      </main>
    );
  }

  return (
    <main className="sp-page space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{roster.name}</h1>
        <p className="text-sm text-neutral-400">Vue globale de l'effectif</p>
        <Link to={backPath} className="sp-link-muted">
          <FontAwesomeIcon icon={faArrowLeft} className="text-xs mr-1" />
          Retour à l'effectif
        </Link>{" "}
        {inlineMessage && (
          <p
            className={`text-sm ${inlineMessage.type === "error" ? "text-red-400" : "text-emerald-400"}`}
          >
            {inlineMessage.text}
          </p>
        )}{" "}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:items-start">
        <section className="sp-panel space-y-3 md:col-span-2">
          <h2 className="font-semibold">Informations</h2>
          <p className="text-sm text-neutral-200">
            <strong>Championnat:</strong> <span className="text-neutral-400">{roster.category || "Non renseigné"}</span>
          </p>
          <div className="flex items-center justify-between">
            {isEditingFoundedIn ? (
              <input
                type="number"
                className="sp-input-control flex-1 text-sm border-l-2 border-l-sky-500"
                autoFocus
                min={1800}
                max={new Date().getFullYear()}
                value={foundedInInput}
                onChange={(e) => setFoundedInInput(e.target.value)}
                onBlur={saveFoundedIn}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveFoundedIn();
                  if (e.key === "Escape") setIsEditingFoundedIn(false);
                }}
              />
            ) : (
              <p className="text-sm text-neutral-200">
                <strong>Création :</strong>{" "}
                <span className="text-neutral-400">{roster.founded_in || "Non renseigné"}</span>
              </p>
            )}
            {!isEditingFoundedIn && (
              <button
                type="button"
                className="ml-2 text-neutral-500 hover:text-neutral-300 transition-colors"
                onClick={() => {
                  setFoundedInInput(roster.founded_in?.toString() ?? "");
                  setIsEditingFoundedIn(true);
                }}
                aria-label="Modifier l'année de création"
              >
                <FontAwesomeIcon icon={faPenToSquareRegular} />
              </button>
            )}
          </div>
          <div>
            <div className="flex items-center justify-between">
              {!isEditingTitles ? (
                <p className="text-sm text-neutral-200">
                  <strong>Palmarès :</strong>{" "}
                  <span className="text-neutral-400">{roster.titles && roster.titles.length > 0
                    ? (() => {
                        const grouped = new Map<string, string[]>();
                        for (const t of roster.titles) {
                          const key = `${t.competition} - ${t.ranking}`;
                          const years = grouped.get(key) ?? [];
                          years.push(String(t.year));
                          grouped.set(key, years);
                        }
                        return Array.from(grouped.entries())
                          .map(([key, years]) => `${key} (${years.join(", ")})`)
                          .join(", ");
                      })()
                    : "Non renseigné"}</span>
                </p>
              ) : (
                <p className="text-sm text-neutral-200 font-semibold">
                  Palmarès
                </p>
              )}
              {!isEditingTitles && (
                <button
                  type="button"
                  className="ml-2 text-neutral-500 hover:text-neutral-300 transition-colors"
                  onClick={startEditingTitles}
                  aria-label="Modifier le palmarès"
                >
                  <FontAwesomeIcon icon={faPenToSquareRegular} />
                </button>
              )}
            </div>
            {isEditingTitles && (
              <div className="mt-2 space-y-2">
                {titlesDraft.map((title, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      className="sp-input-control text-sm flex-1"
                      placeholder="Compétition"
                      value={title.competition}
                      onChange={(e) =>
                        updateTitleDraft(index, "competition", e.target.value)
                      }
                    />
                    <select
                      className="sp-input-control text-sm w-32"
                      value={title.ranking}
                      onChange={(e) =>
                        updateTitleDraft(index, "ranking", e.target.value)
                      }
                    >
                      <option value="Vainqueur">Vainqueur</option>
                      <option value="Finaliste">Finaliste</option>
                    </select>
                    <input
                      type="number"
                      className="sp-input-control text-sm w-20"
                      placeholder="Année"
                      value={title.year}
                      onChange={(e) =>
                        updateTitleDraft(
                          index,
                          "year",
                          parseInt(e.target.value, 10) || 0,
                        )
                      }
                    />
                    <button
                      type="button"
                      className="sp-button sp-button-xs sp-button-red sp-button-icon"
                      onClick={() => removeTitleRow(index)}
                      aria-label="Supprimer ce titre"
                    >
                      <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="sp-button sp-button-xs sp-button-blue"
                  onClick={addTitleRow}
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-1" />
                  Ajouter un titre
                </button>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    type="button"
                    className="sp-button sp-button-xs sp-button-blue"
                    onClick={saveTitles}
                  >
                    Enregistrer
                  </button>
                  <button
                    type="button"
                    className="sp-button sp-button-xs sp-button-light"
                    onClick={() => setIsEditingTitles(false)}
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between">
            {isCurrentSeason && isEditingCoach ? (
              <input
                type="text"
                className="sp-input-control flex-1 text-sm border-l-2 border-l-sky-500"
                autoFocus
                value={coachInput}
                onChange={(e) => setCoachInput(e.target.value)}
                onBlur={saveCoach}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveCoach();
                  if (e.key === "Escape") setIsEditingCoach(false);
                }}
              />
            ) : (
              <p className="text-sm text-neutral-200">
                <strong>Entraineur :</strong>{" "}
                <span className="text-neutral-400">{seasonCoach
                  ? (() => {
                      const names = seasonCoach
                        .split(",")
                        .map((n) => n.trim())
                        .filter(Boolean);
                      return names.map((name, idx) => (
                        <span key={name}>
                          {idx > 0 && ", "}
                          <Link
                            to={getCoachProfilePath(idx)}
                            className="text-neutral-400 hover:text-sky-300 underline-offset-2 hover:font-bold"
                          >
                            {name}
                          </Link>
                        </span>
                      ));
                    })()
                  : <span className="text-neutral-400">Non renseigné</span>}</span>
              </p>
            )}
            {isCurrentSeason && !isEditingCoach && (
              <button
                type="button"
                className="ml-2 text-neutral-500 hover:text-neutral-300 transition-colors"
                onClick={() => {
                  setCoachInput(roster.coach || "");
                  setIsEditingCoach(true);
                }}
                aria-label="Modifier l'entraîneur"
              >
                <FontAwesomeIcon icon={faPenToSquareRegular} />
              </button>
            )}
          </div>
          <div className="flex items-center justify-between">
            {isCurrentSeason && isEditingPresident ? (
              <input
                type="text"
                className="sp-input-control flex-1 text-sm border-l-2 border-l-sky-500"
                autoFocus
                value={presidentInput}
                onChange={(e) => setPresidentInput(e.target.value)}
                onBlur={savePresident}
                onKeyDown={(e) => {
                  if (e.key === "Enter") savePresident();
                  if (e.key === "Escape") setIsEditingPresident(false);
                }}
              />
            ) : (
              <p className="text-sm text-neutral-200">
                <strong>Président :</strong>{" "}
                {roster.president ? (
                  <Link
                    to={getPresidentProfilePath()}
                    className="text-neutral-400 hover:text-sky-300 underline-offset-2 hover:font-bold"
                  >
                    {roster.president}
                  </Link>
                ) : (
                  <span className="text-neutral-400">Non renseigné</span>
                )}
              </p>
            )}
            {isCurrentSeason && !isEditingPresident && (
              <button
                type="button"
                className="ml-2 text-neutral-500 hover:text-neutral-300 transition-colors"
                onClick={() => {
                  setPresidentInput(roster.president || "");
                  setIsEditingPresident(true);
                }}
                aria-label="Modifier le président"
              >
                <FontAwesomeIcon icon={faPenToSquareRegular} />
              </button>
            )}
          </div>
          <div className="flex items-center justify-between">
            {isEditingRanking ? (
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="number"
                  className="sp-input-control text-sm w-20 border-l-2 border-l-sky-500"
                  autoFocus
                  min={1}
                  placeholder="Rang"
                  value={rankingInput}
                  onChange={(e) => setRankingInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveRanking();
                    if (e.key === "Escape") setIsEditingRanking(false);
                  }}
                />
                <input
                  type="number"
                  className="sp-input-control text-sm w-20 border-l-2 border-l-sky-500"
                  min={0}
                  placeholder="Points"
                  value={pointsInput}
                  onChange={(e) => setPointsInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveRanking();
                    if (e.key === "Escape") setIsEditingRanking(false);
                  }}
                />
                <button
                  type="button"
                  className="sp-button sp-button-xs sp-button-blue"
                  onClick={saveRanking}
                >
                  Enregistrer
                </button>
                <button
                  type="button"
                  className="sp-button sp-button-xs sp-button-light"
                  onClick={() => setIsEditingRanking(false)}
                >
                  Annuler
                </button>
              </div>
            ) : (
              <p className="text-sm text-neutral-200">
                <strong>Classement:</strong>{" "}
                <span className="text-neutral-400 font-semibold text-base">{roster.currentRanking != null ? `${roster.currentRanking}e` : "Non renseigné"}</span>{" "}
                <span className="text-neutral-400">({roster.currentPoints != null ? `${roster.currentPoints} pts` : "X pts"})</span>
              </p>
            )}
            {isCurrentSeason && !isEditingPreviousRanking && (
              <p className="text-xs text-neutral-500 mt-1 flex items-center gap-2">
                Classement {PREVIOUS_SEASON} :{" "}
                {previousSeasonRanking != null
                  ? `${previousSeasonRanking}e (${previousSeasonPoints != null ? `${previousSeasonPoints} pts` : "X pts"})`
                  : "Non renseigné"}
                <button
                  type="button"
                  className="text-neutral-500 hover:text-neutral-300 transition-colors"
                  onClick={() => {
                    setPreviousRankingInput(previousSeasonRanking?.toString() ?? "");
                    setPreviousPointsInput(previousSeasonPoints?.toString() ?? "");
                    setIsEditingPreviousRanking(true);
                  }}
                  aria-label={`Modifier le classement ${PREVIOUS_SEASON}`}
                >
                  <FontAwesomeIcon icon={faPenToSquareRegular} />
                </button>
                {previousSeasonRanking != null && (
                  <button
                    type="button"
                    className="sp-button sp-button-xs sp-button-light"
                    onClick={reusePreviousSeasonStats}
                  >
                    Réutiliser pour {CURRENT_SEASON}
                  </button>
                )}
              </p>
            )}
            {isCurrentSeason && isEditingPreviousRanking && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-neutral-500">Classement {PREVIOUS_SEASON} :</span>
                <input
                  type="number"
                  className="sp-input-control text-sm w-20 border-l-2 border-l-sky-500"
                  autoFocus
                  min={1}
                  placeholder="Rang"
                  value={previousRankingInput}
                  onChange={(e) => setPreviousRankingInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") savePreviousSeasonRanking();
                    if (e.key === "Escape") setIsEditingPreviousRanking(false);
                  }}
                />
                <input
                  type="number"
                  className="sp-input-control text-sm w-20 border-l-2 border-l-sky-500"
                  min={0}
                  placeholder="Points"
                  value={previousPointsInput}
                  onChange={(e) => setPreviousPointsInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") savePreviousSeasonRanking();
                    if (e.key === "Escape") setIsEditingPreviousRanking(false);
                  }}
                />
                <button
                  type="button"
                  className="sp-button sp-button-xs sp-button-blue"
                  onClick={savePreviousSeasonRanking}
                >
                  Enregistrer
                </button>
                <button
                  type="button"
                  className="sp-button sp-button-xs sp-button-light"
                  onClick={() => setIsEditingPreviousRanking(false)}
                >
                  Annuler
                </button>
              </div>
            )}
            {!isEditingRanking && (
              <button
                type="button"
                className="ml-2 text-neutral-500 hover:text-neutral-300 transition-colors"
                onClick={() => {
                  setRankingInput(roster.currentRanking?.toString() ?? "");
                  setPointsInput(roster.currentPoints?.toString() ?? "");
                  setIsEditingRanking(true);
                }}
                aria-label="Modifier le classement"
              >
                <FontAwesomeIcon icon={faPenToSquareRegular} />
              </button>
            )}
          </div>
          <div>
            <div className="flex items-center justify-between">
              {!isEditingLastFive ? (
                <p className="text-sm text-neutral-200">
                  <strong>Série (5 derniers matchs):</strong>{" "}
                  {roster.lastFiveMatches && roster.lastFiveMatches.length > 0
                    ? (() => {
                        const v = roster.lastFiveMatches.filter((r) => r.outcome === "victory").length;
                        const d = roster.lastFiveMatches.filter((r) => r.outcome === "defeat").length;
                        const n = roster.lastFiveMatches.filter((r) => r.outcome === "draw").length;
                        return (
                          <>
                            {roster.lastFiveMatches.map((r, i) => (
                              <span
                                key={i}
                                className={`inline-block w-5 h-5 rounded text-center text-xs font-bold leading-5 mr-0.5 ${r.outcome === "victory" ? "bg-emerald-600 text-white" : r.outcome === "defeat" ? "bg-red-600 text-white" : "bg-neutral-500 text-white"}`}
                                title={r.resultText || r.opponent}
                              >
                                {r.outcome === "victory" ? "V" : r.outcome === "defeat" ? "D" : "N"}
                              </span>
                            ))}
                          </>
                        );
                      })()
                    : "Non renseigné"}
                </p>
              ) : (
                <p className="text-sm text-neutral-200 font-semibold">Série (5 derniers matchs)</p>
              )}
              {!isEditingLastFive && (
                <button
                  type="button"
                  className="ml-2 text-neutral-500 hover:text-neutral-300 transition-colors"
                  onClick={startEditingLastFive}
                  aria-label="Modifier la série"
                >
                  <FontAwesomeIcon icon={faPenToSquareRegular} />
                </button>
              )}
            </div>
            {isEditingLastFive && (
              <div className="mt-2 space-y-2">
                {lastFiveDraft.map((result, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <select
                      className="sp-input-control text-sm w-28"
                      value={result.outcome}
                      onChange={(e) => updateLastFiveDraft(index, "outcome", e.target.value)}
                    >
                      <option value="victory">Victoire</option>
                      <option value="defeat">Défaite</option>
                      <option value="draw">Nul</option>
                    </select>
                    <input
                      className="sp-input-control text-sm flex-1"
                      placeholder="Adversaire"
                      value={result.opponent}
                      onChange={(e) => updateLastFiveDraft(index, "opponent", e.target.value)}
                    />
                    <input
                      className="sp-input-control text-sm w-36"
                      placeholder="Score (ex: 28-14)"
                      value={result.resultText}
                      onChange={(e) => updateLastFiveDraft(index, "resultText", e.target.value)}
                    />
                    <button
                      type="button"
                      className="sp-button sp-button-xs sp-button-red sp-button-icon"
                      onClick={() => removeLastFiveRow(index)}
                      aria-label="Supprimer ce résultat"
                    >
                      <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                  </div>
                ))}
                {lastFiveDraft.length < 5 && (
                  <button
                    type="button"
                    className="sp-button sp-button-xs sp-button-blue"
                    onClick={addLastFiveRow}
                  >
                    <FontAwesomeIcon icon={faPlus} className="mr-1" />
                    Ajouter un résultat
                  </button>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <button
                    type="button"
                    className="sp-button sp-button-xs sp-button-blue"
                    onClick={saveLastFive}
                  >
                    Enregistrer
                  </button>
                  <button
                    type="button"
                    className="sp-button sp-button-xs sp-button-light"
                    onClick={() => setIsEditingLastFive(false)}
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between">
            {isEditingSeasonRecord ? (
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="number"
                  className="sp-input-control text-sm w-16 border-l-2 border-l-emerald-500"
                  autoFocus
                  min={0}
                  placeholder="V"
                  value={seasonVInput}
                  onChange={(e) => setSeasonVInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveSeasonRecord();
                    if (e.key === "Escape") setIsEditingSeasonRecord(false);
                  }}
                />
                <input
                  type="number"
                  className="sp-input-control text-sm w-16 border-l-2 border-l-red-500"
                  min={0}
                  placeholder="D"
                  value={seasonDInput}
                  onChange={(e) => setSeasonDInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveSeasonRecord();
                    if (e.key === "Escape") setIsEditingSeasonRecord(false);
                  }}
                />
                <input
                  type="number"
                  className="sp-input-control text-sm w-16 border-l-2 border-l-neutral-500"
                  min={0}
                  placeholder="N"
                  value={seasonNInput}
                  onChange={(e) => setSeasonNInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveSeasonRecord();
                    if (e.key === "Escape") setIsEditingSeasonRecord(false);
                  }}
                />
                <button
                  type="button"
                  className="sp-button sp-button-xs sp-button-blue"
                  onClick={saveSeasonRecord}
                >
                  Enregistrer
                </button>
                <button
                  type="button"
                  className="sp-button sp-button-xs sp-button-light"
                  onClick={() => setIsEditingSeasonRecord(false)}
                >
                  Annuler
                </button>
              </div>
            ) : (
              <p className="text-sm text-neutral-200">
                <strong>Matchs:</strong>{" "}
                {roster.seasonRecord
                  ? <span className="text-neutral-400 text-base">{roster.seasonRecord.victories}V {roster.seasonRecord.defeats}D {roster.seasonRecord.draws}N</span>
                  : "Non renseigné"}
              </p>
            )}
            {!isEditingSeasonRecord && (
              <button
                type="button"
                className="ml-2 text-neutral-500 hover:text-neutral-300 transition-colors"
                onClick={() => {
                  setSeasonVInput(roster.seasonRecord?.victories?.toString() ?? "");
                  setSeasonDInput(roster.seasonRecord?.defeats?.toString() ?? "");
                  setSeasonNInput(roster.seasonRecord?.draws?.toString() ?? "");
                  setIsEditingSeasonRecord(true);
                }}
                aria-label="Modifier le bilan saison"
              >
                <FontAwesomeIcon icon={faPenToSquareRegular} />
              </button>
            )}
          </div>
          <p className="text-sm text-neutral-200">
          </p>
        </section>

        {roster.logo && (
          <aside className="md:col-span-1 md:justify-self-end w-full md:w-auto">
            <img
              src={roster.logo}
              alt={`Logo de ${roster.name}`}
              className="mx-auto md:mx-0 h-auto w-full max-w-[12rem] md:max-w-full rounded-md bg-neutral-900/40 object-contain"
            />
          </aside>
        )}
      </div>

      {/* Season tabs */}
      <nav className="flex gap-1 border-b border-neutral-700 pb-0">
        {availableSeasons.map((season) => (
          <button
            key={season}
            className={`px-4 py-2 text-sm font-semibold transition-colors ${
              selectedSeason === season
                ? "border-b-2 border-sky-500 text-sky-400"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
            onClick={() => setSelectedSeason(season)}
          >
            {season}
          </button>
        ))}
      </nav>

      {/* Calendar section */}
      <section className="sp-panel space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Calendrier</h2>
          <div className="flex items-center gap-2">
            {calendarSyncResult && (
              <span className="text-xs text-neutral-400">
                {calendarSyncResult}
              </span>
            )}
            <button
              type="button"
              className="sp-button sp-button-xs sp-button-blue"
              onClick={syncCalendar}
              disabled={isSyncingCalendar}
            >
              <FontAwesomeIcon
                icon={faSync}
                className={`mr-1 ${isSyncingCalendar ? "animate-spin" : ""}`}
              />
              {isSyncingCalendar ? "Sync…" : "Synchroniser"}
            </button>
          </div>
        </div>
        {seasonCalendar.length > 0 ? (
          <div
            className={`overflow-x-auto ${
              seasonCalendar.length > 3 ? "max-h-56 overflow-y-auto" : ""
            }`}
          >
            <table className="w-full text-sm text-left">
              <thead className="sticky top-0 bg-neutral-900">
                <tr className="text-xs text-neutral-400 border-b border-neutral-700">
                  <th className="pb-2 pr-3">Date</th>
                  <th className="pb-2 pr-3">Match</th>
                  <th className="pb-2 pr-3">Compétition</th>
                  <th className="pb-2 pr-3">Lieu</th>
                  <th className="pb-2 text-right">Score</th>
                </tr>
              </thead>
              <tbody>
                {seasonCalendar
                  .slice()
                  .sort((a, b) => a.date.localeCompare(b.date))
                  .map((match, idx) => {
                    const dateStr = match.date
                      ? new Date(match.date).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                        })
                      : "—";
                    const homeTeam = match.isHome
                      ? roster.name
                      : match.opponent;
                    const awayTeam = match.isHome
                      ? match.opponent
                      : roster.name;
                    const hasScore =
                      match.scoreHome != null && match.scoreAway != null;
                    const isCancelled = match.status === "cancelled";
                    const matchCompetition = match.competition || roster.category;
                    const opponentRoster = findOpponentRoster(
                      rosters,
                      match.opponent,
                      matchCompetition
                    );
                    return (
                      <tr
                        key={`${match.date}-${match.opponent}-${idx}`}
                        className={`border-b border-neutral-700/50 ${isCancelled ? "opacity-50 line-through" : ""}`}
                      >
                        <td className="py-1.5 pr-3 text-neutral-300 whitespace-nowrap">
                          {dateStr}
                          {match.time && (
                            <span className="ml-1 text-neutral-500">
                              {match.time}
                            </span>
                          )}
                        </td>
                        <td className="py-1.5 pr-3 text-neutral-200">
                          {match.isHome ? (
                            homeTeam
                          ) : opponentRoster ? (
                            <Link
                              to={getRosterBackPath(opponentRoster.id)}
                              className="hover:text-sky-400 hover:underline"
                            >
                              {homeTeam}
                            </Link>
                          ) : (
                            homeTeam
                          )}{" "}
                          <span className="text-neutral-500">-</span>{" "}
                          {!match.isHome ? (
                            awayTeam
                          ) : opponentRoster ? (
                            <Link
                              to={getRosterBackPath(opponentRoster.id)}
                              className="hover:text-sky-400 hover:underline"
                            >
                              {awayTeam}
                            </Link>
                          ) : (
                            awayTeam
                          )}
                        </td>
                        <td className="py-1.5 pr-3 text-neutral-400">
                          {matchCompetition || "—"}
                        </td>
                        <td className="py-1.5 pr-3 text-neutral-400">
                          {match.location || "—"}
                        </td>
                        <td className="py-1.5 text-right text-neutral-200 whitespace-nowrap">
                          {hasScore
                            ? `${match.scoreHome} - ${match.scoreAway}`
                            : isCancelled
                              ? "Annulé"
                              : "—"}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-neutral-400">
            Aucun match synchronisé. Cliquez sur Synchroniser pour importer le
            calendrier.
          </p>
        )}
      </section>

      {/* Player list with position tabs */}
      <section className="sp-panel space-y-3">
        <h2 className="font-semibold">Joueurs de l'effectif</h2>
        <nav className="flex gap-1 border-b border-neutral-700 pb-0">
          {POSITION_TABS.map((tab) => (
            <button
              key={tab.key}
              className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                selectedPositionTab === tab.key
                  ? "border-b-2 border-sky-500 text-sky-400"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
              onClick={() => setSelectedPositionTab(tab.key)}
            >
              {tab.label}
              <span className="ml-1 text-neutral-500">
                (
                {tab.key === "all"
                  ? playerRows.length
                  : playerRows.filter(
                      (r) =>
                        r.player.positions?.some((p) =>
                          ("positions" in tab ? tab.positions : []).includes(p),
                        ) ?? false,
                    ).length}
                )
              </span>
            </button>
          ))}
        </nav>
        {filteredPlayerRows.length === 0 ? (
          <p className="text-sm text-neutral-400">
            Aucun joueur dans cette catégorie.
          </p>
        ) : (
          <ul
            className={`space-y-2 ${filteredPlayerRows.length > 10 ? "max-h-[32rem] overflow-y-auto pr-1" : ""}`}
          >
            {filteredPlayerRows.map((row) => (
              <li
                key={row.player.id}
                className="rounded border border-neutral-700 bg-neutral-800/40 px-3 py-2 text-sm text-neutral-200"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold truncate">
                      <Link
                        to={getPlayerProfilePath(rosterId, row.player.id)}
                        className="hover:text-sky-300 underline-offset-2 hover:underline"
                      >
                        {row.player.name}
                      </Link>
                    </p>
                    <p className="text-xs text-neutral-400">
                      {row.player.positions && row.player.positions.length > 0
                        ? row.player.positions.join(" / ")
                        : "Postes non renseignes"}
                    </p>
                  </div>
                  <div className="text-right text-xs text-neutral-300 shrink-0">
                    {row.player.nationality && (
                      <img
                        src={getFlagUrl(row.player.nationality)}
                        alt={row.player.nationality}
                        className="inline-block"
                        width={16}
                        height={12}
                      />
                    )}
                  </div>
                </div>
                {row.compositions.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {row.compositions.map((entry) => (
                      <li
                        key={`${row.player.id}-${entry.teamName}-${entry.number}`}
                        className="text-xs text-neutral-300"
                      >
                        {entry.teamName} - #{entry.number} ({entry.role})
                        {entry.isCaptain && (
                          <span className="ml-1 text-sky-300">
                            <FontAwesomeIcon icon={faCrown} className="mr-1" />
                            Capitaine
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
