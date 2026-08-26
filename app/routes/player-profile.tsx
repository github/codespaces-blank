import { Link, useNavigate, useParams } from "react-router";
import type { Route } from "./+types/player-profile";
import { useEffect, useMemo, useState } from "react";
import { useTeams } from "~/context/TeamsContext";
import { toShortId, findFullId } from "~/utils/shortId";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { COUNTRIES, getFlagUrl, getCountryByCode } from "~/utils/countries";
import type { PlayerStats } from "~/types/tracker";
import { getCompetitionGender, getCompetitionScope } from "~/types/tracker";
import { TOP14_CLUBS_2025_2026, PROD2_CLUBS_2025_2026, ELITE1_CLUBS_2025_2026 } from "~/utils/clubs";
import { updatePlayerInRoster, addPlayerToRosterList, deletePlayerFromRoster, deletePlayerFromTeamData } from "~/utils/RosterUtils";

function sanitizeStat(value: unknown): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.floor(n);
}

function sanitizeRate(value: unknown): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

function buildStats(playerStats: PlayerStats | undefined, matchs2526: number, titularisations2526: number): PlayerStats {
  return {
    points: sanitizeStat(playerStats?.points),
    essais: sanitizeStat(playerStats?.essais),
    pied: sanitizeStat(playerStats?.pied),
    tauxTransfo: sanitizeRate(playerStats?.tauxTransfo),
    cartons: sanitizeStat(playerStats?.cartons),
    drops: sanitizeStat(playerStats?.drops),
    matchs2526: sanitizeStat(playerStats?.matchs2526 ?? matchs2526),
    titularisations2526: sanitizeStat(playerStats?.titularisations2526 ?? titularisations2526),
  };
}

export function meta({ params }: Route.MetaArgs) {
  const playerId = params.playerId;
  return [{ title: playerId ? "Profil joueur" : "Joueur" }];
}



function getRosterBackPath(rosterId: string | null | undefined): string {
  if (!rosterId) return "/roster";
  return `/r/${rosterId}`;
}

function normalizeClubEntityName(name: string | null | undefined): string {
  const value = (name ?? "").trim();
  if (!value) return "";
  // Rétro-compatibilité : ancienne valeur persistée sans le suffixe officiel
  if (value === "Stade Toulousain") return "Stade Toulousain Rugby Féminin";
  return value;
}

function resolveRosterGender(roster: { category?: string; gender?: "male" | "female" }): "masculine" | "feminine" | "mixed" {
  if (!roster.category) return "mixed";
  const competitionGender = getCompetitionGender(roster.category);
  if (competitionGender !== "mixed") return competitionGender;
  if (roster.gender === "female") return "feminine";
  if (roster.gender === "male") return "masculine";
  return "mixed";
}

export default function PlayerProfilePage() {
  const navigate = useNavigate();
  const { rosterId: shortRosterId, playerId: shortPlayerId } = useParams();
  const { rosters, teams, setRosters, setTeams } = useTeams();
  
  // Convert short IDs to full IDs
  const rosterId = useMemo(
    () => findFullId(shortRosterId, rosters),
    [shortRosterId, rosters]
  );
  const playerId = useMemo(
    () => findFullId(shortPlayerId, rosters.flatMap(r => r.players)),
    [shortPlayerId, rosters]
  );
  const [isEditingStats, setIsEditingStats] = useState(false);
  const [statsMessage, setStatsMessage] = useState("");
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [infoClubDraft, setInfoClubDraft] = useState("");
  const [infoNationalityDraft, setInfoNationalityDraft] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [selectedNationalRosterId, setSelectedNationalRosterId] = useState("");
  const [nationalRosterMessage, setNationalRosterMessage] = useState("");
  const [statsDraft, setStatsDraft] = useState<PlayerStats>({
    points: 0,
    essais: 0,
    pied: 0,
    tauxTransfo: 0,
    cartons: 0,
    drops: 0,
    matchs2526: 0,
    titularisations2526: 0,
  });
  const [statsSeasonTab, setStatsSeasonTab] = useState<"2026/2027" | "2025/2026">("2026/2027");

  const roster = useMemo(
    () => rosters.find((item) => item.id === rosterId) ?? null,
    [rosters, rosterId]
  );

  const player = useMemo(
    () => roster?.players.find((item) => item.id === playerId) ?? null,
    [roster?.players, playerId]
  );

  const playerCompositions = useMemo(() => {
    if (!roster || !player) return [];

    return teams
      .filter((team) => team.rosterId === roster.id)
      .flatMap((team) => {
        const entries = [...team.starters, ...team.substitutes];
        return entries
          .filter((entry) => entry.player.id === player.id)
          .map((entry) => ({
            teamId: team.id,
            teamName: team.name,
            number: entry.number,
            isCaptain: team.captainPlayerId === player.id,
          }));
      })
      .sort((first, second) => first.number - second.number);
  }, [teams, roster, player]);

  const computedMatchs2526 = playerCompositions.length;
  const computedTitularisations2526 = useMemo(
    () => teams.filter((team) => team.rosterId === roster?.id).filter((team) => team.starters.some((entry) => entry.player.id === player?.id)).length,
    [teams, roster?.id, player?.id]
  );

  const effectiveStats = useMemo(
    () => buildStats(player?.stats, computedMatchs2526, computedTitularisations2526),
    [player?.stats, computedMatchs2526, computedTitularisations2526]
  );

  useEffect(() => {
    setStatsDraft(effectiveStats);
  }, [effectiveStats]);

  function updateDraftNumber<K extends keyof PlayerStats>(key: K, value: string) {
    setStatsDraft((current) => ({
      ...current,
      [key]: key === "tauxTransfo" ? sanitizeRate(value) : sanitizeStat(value),
    }));
  }

  function saveStats() {
    if (!roster || !player) return;
    const nextStats = buildStats(statsDraft, computedMatchs2526, computedTitularisations2526);
    const updatedRosters = rosters.map((item) => {
      if (item.id !== roster.id) return item;
      return {
        ...item,
        players: item.players.map((p) => (p.id === player.id ? { ...p, stats: nextStats } : p)),
      };
    });
    setRosters(updatedRosters);
    setStatsMessage("Statistiques mises à jour.");
    setIsEditingStats(false);
  }

  const isInternational = getCompetitionScope(roster?.category) === 'international';
  const rosterGender = roster ? resolveRosterGender(roster) : 'masculine';

  // National rosters compatible with this player's gender (for club selector)
  const nationalClubRosters = useMemo(() => {
    if (!roster) return [];
    return rosters.filter((r) =>
      r.id !== roster.id &&
      r.category &&
      getCompetitionScope(r.category) === 'national' &&
      (resolveRosterGender(r) === 'mixed' || resolveRosterGender(r) === rosterGender)
    ).sort((a, b) => a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' }));
  }, [rosters, roster, rosterGender]);

  // State stores the roster ID (not name) for reliable matching
  const [infoClubRosterId, setInfoClubRosterId] = useState("");

  // National roster matching the player's club (gender-aware)
  const clubLinkedNationalRoster = useMemo(() => {
    if (!player?.club || !roster) return null;
    const club = normalizeClubEntityName(player.club);
    // For international rosters: find the national roster with this name, filtered by gender
    if (isInternational) {
      return rosters.find((r) =>
        normalizeClubEntityName(r.name) === club &&
        r.id !== rosterId &&
        getCompetitionScope(r.category) === 'national' &&
        (resolveRosterGender(r) === rosterGender || resolveRosterGender(r) === 'mixed')
      ) ?? null;
    }
    return null;
  }, [rosters, player?.club, roster, rosterId, isInternational, rosterGender]);

  const isAlreadyInClubRoster = clubLinkedNationalRoster
    ? clubLinkedNationalRoster.players.some((p) => p.id === player?.id)
    : false;

  const nationalRostersForPlayer = useMemo(() => {
    if (!player) return [];
    return rosters
      .filter(
        (r) =>
          r.category &&
          getCompetitionScope(r.category) === "national" &&
          r.players.some((p) => p.id === player.id),
      )
      .sort((a, b) => a.name.localeCompare(b.name, "fr", { sensitivity: "base" }));
  }, [rosters, player]);

  function syncToClubRoster() {
    if (!player || !clubLinkedNationalRoster || isAlreadyInClubRoster) return;
    const updatedRoster = addPlayerToRosterList(clubLinkedNationalRoster, { ...player });
    setRosters((prev) => prev.map((r) => r.id === updatedRoster.id ? updatedRoster : r));
    setNationalRosterMessage(`${player.name} ajouté·e à ${clubLinkedNationalRoster.name}.`);
  }

  // Tous les effectifs internationaux auxquels appartient ce joueur
  const internationalRostersForPlayer = useMemo(() => {
    if (!player) return [];
    return rosters.filter((r) =>
      r.category &&
      getCompetitionScope(r.category) === 'international' &&
      r.players.some((p) => p.id === player.id)
    ).sort((a, b) => a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' }));
  }, [rosters, player]);

  function formatRosterLabel(r: typeof rosters[number]): string {
    return r.category === 'World Series' ? `${r.name} 7` : r.name;
  }

  const availableInternationalRosters = useMemo(() => {
    if (!player || isInternational) return [];
    return rosters.filter((r) =>
      r.id !== rosterId &&
      r.category &&
      getCompetitionScope(r.category) === 'international' &&
      (resolveRosterGender(r) === 'mixed' || resolveRosterGender(r) === rosterGender) &&
      !r.players.some((p) => p.id === player.id)
    ).sort((a, b) => a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' }));
  }, [rosters, player, rosterId, rosterGender, isInternational]);

  function addToInternationalRoster() {
    if (!player || !selectedNationalRosterId) return;
    const targetRoster = rosters.find((r) => r.id === selectedNationalRosterId);
    if (!targetRoster) return;
    const updatedRoster = addPlayerToRosterList(targetRoster, { ...player });
    setRosters((prev) => prev.map((r) => r.id === updatedRoster.id ? updatedRoster : r));
    setSelectedNationalRosterId("");
    setNationalRosterMessage(`${player.name} ajouté·e à ${targetRoster.name}.`);
  }

  function removeFromRoster(targetRosterId: string) {
    if (!player) return;
    const targetRoster = rosters.find((r) => r.id === targetRosterId);
    if (!targetRoster) return;

    const confirmed = window.confirm(
      `Retirer ${player.name} de l'effectif \"${targetRoster.name}\" ?`,
    );
    if (!confirmed) return;

    const updatedTargetRoster = deletePlayerFromRoster(targetRoster, player.id);
    const updatedRosters = rosters.map((r) =>
      r.id === targetRoster.id ? updatedTargetRoster : r,
    );
    const updatedTeams = teams.map((team) =>
      team.rosterId === targetRoster.id
        ? deletePlayerFromTeamData(team, player.id)
        : team,
    );

    setRosters(updatedRosters);
    setTeams(updatedTeams);
    setInfoMessage("");
    setNationalRosterMessage(`${player.name} retiré·e de ${targetRoster.name}.`);

    if (targetRoster.id === roster?.id) {
      navigate(getRosterBackPath(toShortId(targetRoster.id)));
    }
  }

  function saveInfo() {
    if (!roster || !player) return;
    const normalizedClubName = normalizeClubEntityName(infoClubDraft) || undefined;
    const normalizedNationality = infoNationalityDraft.trim().toLowerCase() || undefined;
    const selectedNationalRoster =
      isInternational && infoClubRosterId
        ? rosters.find(
            (r) =>
              r.id === infoClubRosterId &&
              r.category &&
              getCompetitionScope(r.category) === "national",
          )
        : null;
    const inferredNationalRoster =
      isInternational && normalizedClubName
        ? rosters.find(
            (r) =>
              r.category &&
              getCompetitionScope(r.category) === "national" &&
              normalizeClubEntityName(r.name) === normalizedClubName &&
              (resolveRosterGender(r) === rosterGender || resolveRosterGender(r) === "mixed"),
          )
        : null;
    const resolvedNationalRosterId =
      (selectedNationalRoster?.id ?? inferredNationalRoster?.id) || undefined;
    const updatedRoster = updatePlayerInRoster(roster, player.id, {
      name: player.name,
      positions: player.positions,
      photoUrl: player.photoUrl,
      nationality: normalizedNationality,
      club: normalizedClubName,
      nationalRosterId: resolvedNationalRosterId,
    });
    const playerWithClub = updatedRoster.players.find((p) => p.id === player.id);
    const previousNationalRosterIds = new Set(
      nationalRostersForPlayer.map((r) => r.id),
    );

    setRosters((prev) =>
      prev.map((r) => {
        if (r.id === roster.id) return updatedRoster;
        if (!isInternational || getCompetitionScope(r.category) !== "national") return r;

        const hasPlayer = r.players.some((p) => p.id === player.id);
        const shouldHavePlayer = !!resolvedNationalRosterId && r.id === resolvedNationalRosterId;

        if (hasPlayer && !shouldHavePlayer) {
          return deletePlayerFromRoster(r, player.id);
        }
        if (!hasPlayer && shouldHavePlayer && playerWithClub) {
          return addPlayerToRosterList(r, playerWithClub);
        }
        return r;
      }),
    );

    setIsEditingInfo(false);
    if (isInternational) {
      if (resolvedNationalRosterId) {
        const linkedRosterName = rosters.find((r) => r.id === resolvedNationalRosterId)?.name ?? "l'effectif national";
        setInfoMessage(`Profil mis à jour. ${player.name} est lié·e à ${linkedRosterName}.`);
      } else if (previousNationalRosterIds.size > 0) {
        setInfoMessage("Profil mis à jour. Liaison avec l'effectif national supprimée.");
      } else {
        setInfoMessage("Profil mis à jour.");
      }
      return;
    }
    setInfoMessage("Profil mis à jour.");
  }

  const backPath = getRosterBackPath(rosterId ? toShortId(rosterId) : undefined);

  if (!roster || !player) {
    return (
      <main className="sp-page space-y-4">
        <h1 className="text-2xl font-bold">Profil joueur introuvable</h1>
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
        <h1 className="text-2xl font-bold">{player.name}</h1>
        <p className="text-sm text-neutral-400">Effectif: {roster.name}</p>
        <Link to={backPath} className="sp-link-muted">
          <FontAwesomeIcon icon={faArrowLeft} className="text-xs mr-1" />
          Retour à l'effectif
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:items-start">
        <section className="sp-panel space-y-3 md:col-span-2">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-semibold">Informations</h2>
            {!isEditingInfo ? (
              <button
                type="button"
                className="sp-button sp-button-xs sp-button-indigo"
                onClick={() => {
                  // Pre-select the current club roster if one matches
                  const currentClubRoster = nationalClubRosters.find(
                    (r) =>
                      normalizeClubEntityName(r.name) ===
                      normalizeClubEntityName(player.club),
                  );
                  setInfoClubRosterId(currentClubRoster?.id ?? "");
                  setInfoClubDraft(normalizeClubEntityName(player.club));
                  setInfoNationalityDraft((player.nationality ?? "").toLowerCase());
                  setIsEditingInfo(true);
                  setInfoMessage("");
                }}
              >
                <FontAwesomeIcon icon={faPenToSquare} className="mr-1" />
                Modifier
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="sp-button sp-button-xs sp-button-blue"
                  onClick={saveInfo}
                >
                  Enregistrer
                </button>
                <button
                  type="button"
                  className="sp-button sp-button-xs sp-button-light"
                  onClick={() => setIsEditingInfo(false)}
                >
                  Annuler
                </button>
              </div>
            )}
          </div>
          {infoMessage && (
            <p className="text-xs text-emerald-400">{infoMessage}</p>
          )}
          {!isEditingInfo && internationalRostersForPlayer.length > 0 && (
            <p className="text-sm text-neutral-200">
              <strong>
                Sélection{internationalRostersForPlayer.length > 1 ? "s" : ""} :
              </strong>
              {internationalRostersForPlayer.map((r, i) => (
                <span key={r.id} className="text-sm text-neutral-200">
                  {i > 0 ? ", " : " "}{formatRosterLabel(r)}
                </span>
              ))}
            </p>
          )}
          {isEditingInfo && (nationalRostersForPlayer.length > 0 || internationalRostersForPlayer.length > 0) && (
            <div className="space-y-3 rounded border border-neutral-700 bg-neutral-900/40 p-3">
              <h3 className="text-sm font-semibold text-neutral-200">
                Gérer les effectifs
              </h3>
              {!isInternational && availableInternationalRosters.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-neutral-200">
                    <strong>Ajouter à une sélection internationale :</strong>
                  </p>
                  <div className="sp-row-responsive">
                    <div className="sp-input-shell w-full flex-1 min-w-0 sm:min-w-[12rem]">
                      <label className="sp-input-label" htmlFor="nationalRosterSelectInline">
                        Sélection
                      </label>
                      <select
                        id="nationalRosterSelectInline"
                        className="sp-input-control"
                        value={selectedNationalRosterId}
                        onChange={(e) => {
                          setSelectedNationalRosterId(e.target.value);
                          setNationalRosterMessage("");
                        }}
                      >
                        <option value="">— Choisir une sélection —</option>
                        {availableInternationalRosters.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                            {r.category ? ` (${r.category})` : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="button"
                      className="sp-button sp-button-sm sp-button-blue w-full sm:w-auto"
                      disabled={!selectedNationalRosterId}
                      onClick={addToInternationalRoster}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
              )}
              {isInternational && clubLinkedNationalRoster && !isAlreadyInClubRoster && (
                <div className="space-y-2">
                  <p className="text-sm text-neutral-200">
                    <strong>Effectif national lié :</strong> {clubLinkedNationalRoster.name}
                  </p>
                  <button
                    type="button"
                    className="sp-button sp-button-sm sp-button-blue"
                    onClick={syncToClubRoster}
                  >
                    Ajouter à {clubLinkedNationalRoster.name}
                  </button>
                </div>
              )}
              {!isInternational && nationalRostersForPlayer.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-wide text-neutral-400">
                    Effectif{nationalRostersForPlayer.length > 1 ? "s" : ""} nationa{nationalRostersForPlayer.length > 1 ? "ux" : "l"}
                  </p>
                  <div className="space-y-2">
                    {nationalRostersForPlayer.map((linkedRoster) => (
                      <div
                        key={linkedRoster.id}
                        className="flex items-center justify-between gap-3 rounded border border-neutral-800 bg-neutral-950/40 px-3 py-2"
                      >
                        <span className="text-sm text-neutral-200">{linkedRoster.name}</span>
                        <button
                          type="button"
                          className="sp-button sp-button-xs sp-button-light"
                          onClick={() => removeFromRoster(linkedRoster.id)}
                        >
                          Retirer
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {internationalRostersForPlayer.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-wide text-neutral-400">
                    Sélection{internationalRostersForPlayer.length > 1 ? "s" : ""} internationale{internationalRostersForPlayer.length > 1 ? "s" : ""}
                  </p>
                  <div className="space-y-2">
                    {internationalRostersForPlayer.map((linkedRoster) => (
                      <div
                        key={linkedRoster.id}
                        className="flex items-center justify-between gap-3 rounded border border-neutral-800 bg-neutral-950/40 px-3 py-2"
                      >
                        <span className="text-sm text-neutral-200">{formatRosterLabel(linkedRoster)}</span>
                        <button
                          type="button"
                          className="sp-button sp-button-xs sp-button-light"
                          onClick={() => removeFromRoster(linkedRoster.id)}
                        >
                          Retirer
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <p className="text-sm text-neutral-200">
            <strong>Poste{player.positions && player.positions.length > 1 ? "s" : ""} :</strong>{" "}
            {player.positions && player.positions.length > 0
              ? player.positions.join(" / ")
              : "Non renseignés"}
          </p>
          <p className="text-sm text-neutral-200">
            <strong>Nationalité : </strong>
            {isEditingInfo ? (
              <select
                className="sp-input-control"
                value={infoNationalityDraft}
                onChange={(e) => setInfoNationalityDraft(e.target.value)}
              >
                <option value="">— Non renseignée —</option>
                {COUNTRIES.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            ) : player.nationality ? (
              (() => {
                const country = getCountryByCode(player.nationality);
                return (
                  <span className="inline-flex items-center gap-1.5">
                    <img
                      src={getFlagUrl(player.nationality)}
                      alt={country?.name ?? player.nationality}
                      width={16}
                      height={12}
                      className="inline-block"
                    />
                    {country?.name ?? player.nationality}
                  </span>
                );
              })()
            ) : (
              <span className="text-neutral-500 italic">Non renseignée</span>
            )}
          </p>
          <p className="text-sm text-neutral-200">
            <strong>Club : </strong>
            {isEditingInfo && isInternational ? (
              <select
                className="sp-input-control"
                value={infoClubRosterId}
                onChange={(e) => {
                  setInfoClubRosterId(e.target.value);
                  const r = nationalClubRosters.find(
                    (r) => r.id === e.target.value,
                  );
                  setInfoClubDraft(r?.name ?? "");
                }}
              >
                <option value="">— Non renseigné —</option>
                {nationalClubRosters.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                    {r.category && r.category !== roster.category
                      ? ` (${r.category})`
                      : ""}
                  </option>
                ))}
              </select>
            ) : isEditingInfo ? (
              <input
                className="sp-input-control"
                value={infoClubDraft}
                onChange={(e) => setInfoClubDraft(e.target.value)}
                placeholder="Nom du club"
              />
            ) : (
              <span>
                {player.club ? (
                  normalizeClubEntityName(player.club)
                ) : (
                  <span className="text-neutral-500 italic">Non renseigné</span>
                )}
              </span>
            )}
          </p>
        </section>

        {player.photoUrl && (
          <aside className="md:col-span-1 md:justify-self-end w-full md:w-auto">
            <img
              src={player.photoUrl}
              alt={`Photo de ${player.name}`}
              className="mx-auto md:mx-0 h-auto w-full max-w-[10rem] md:max-w-full rounded-md border border-neutral-700 bg-neutral-900/40 object-cover"
            />
          </aside>
        )}
      </div>

      <section className="sp-panel space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-semibold">Stats joueur</h2>
          {!isEditingStats ? (
            <button
              type="button"
              className="sp-button sp-button-xs sp-button-indigo"
              onClick={() => {
                setStatsDraft(effectiveStats);
                setIsEditingStats(true);
                setStatsMessage("");
              }}
            >
              Modifier
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="sp-button sp-button-xs sp-button-blue"
                onClick={saveStats}
              >
                Enregistrer
              </button>
              <button
                type="button"
                className="sp-button sp-button-xs sp-button-light"
                onClick={() => {
                  setStatsDraft(effectiveStats);
                  setIsEditingStats(false);
                }}
              >
                Annuler
              </button>
            </div>
          )}
        </div>
        {statsMessage && (
          <p className="text-xs text-emerald-400">{statsMessage}</p>
        )}
        <nav className="flex gap-1 border-b border-neutral-700 pb-0">
          {(["2026/2027", "2025/2026"] as const).map((season) => (
            <button
              key={season}
              type="button"
              className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                statsSeasonTab === season
                  ? "border-b-2 border-sky-500 text-sky-400"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
              onClick={() => setStatsSeasonTab(season)}
            >
              {season}
            </button>
          ))}
        </nav>
        {statsSeasonTab === "2026/2027" ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="sp-input-shell">
            <label className="sp-input-label" htmlFor="playerStatsPoints">
              Points
            </label>
            <input
              id="playerStatsPoints"
              type="number"
              min={0}
              className="sp-input-control"
              value={isEditingStats ? statsDraft.points : effectiveStats.points}
              onChange={(event) =>
                updateDraftNumber("points", event.target.value)
              }
              disabled={!isEditingStats}
            />
          </div>
          <div className="sp-input-shell">
            <label className="sp-input-label" htmlFor="playerStatsEssais">
              Essais
            </label>
            <input
              id="playerStatsEssais"
              type="number"
              min={0}
              className="sp-input-control"
              value={isEditingStats ? statsDraft.essais : effectiveStats.essais}
              onChange={(event) =>
                updateDraftNumber("essais", event.target.value)
              }
              disabled={!isEditingStats}
            />
          </div>
          <div className="sp-input-shell">
            <label className="sp-input-label" htmlFor="playerStatsPied">
              Pied
            </label>
            <input
              id="playerStatsPied"
              type="number"
              min={0}
              className="sp-input-control"
              value={isEditingStats ? statsDraft.pied : effectiveStats.pied}
              onChange={(event) =>
                updateDraftNumber("pied", event.target.value)
              }
              disabled={!isEditingStats}
            />
          </div>
          <div className="sp-input-shell">
            <label className="sp-input-label" htmlFor="playerStatsTauxTransfo">
              Taux de transfo (%)
            </label>
            <input
              id="playerStatsTauxTransfo"
              type="number"
              min={0}
              max={100}
              className="sp-input-control"
              value={
                isEditingStats
                  ? statsDraft.tauxTransfo
                  : effectiveStats.tauxTransfo
              }
              onChange={(event) =>
                updateDraftNumber("tauxTransfo", event.target.value)
              }
              disabled={!isEditingStats}
            />
          </div>
          <div className="sp-input-shell">
            <label className="sp-input-label" htmlFor="playerStatsCartons">
              Cartons
            </label>
            <input
              id="playerStatsCartons"
              type="number"
              min={0}
              className="sp-input-control"
              value={
                isEditingStats ? statsDraft.cartons : effectiveStats.cartons
              }
              onChange={(event) =>
                updateDraftNumber("cartons", event.target.value)
              }
              disabled={!isEditingStats}
            />
          </div>
          <div className="sp-input-shell">
            <label className="sp-input-label" htmlFor="playerStatsDrops">
              Drops
            </label>
            <input
              id="playerStatsDrops"
              type="number"
              min={0}
              className="sp-input-control"
              value={isEditingStats ? statsDraft.drops : effectiveStats.drops}
              onChange={(event) =>
                updateDraftNumber("drops", event.target.value)
              }
              disabled={!isEditingStats}
            />
          </div>
        </div>
        ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="sp-input-shell">
            <label className="sp-input-label" htmlFor="playerStatsMatchs2526">
              Matchs 25-26
            </label>
            <input
              id="playerStatsMatchs2526"
              type="number"
              min={0}
              className="sp-input-control"
              value={
                isEditingStats
                  ? statsDraft.matchs2526
                  : effectiveStats.matchs2526
              }
              onChange={(event) =>
                updateDraftNumber("matchs2526", event.target.value)
              }
              disabled={!isEditingStats}
            />
          </div>
          <div className="sp-input-shell">
            <label
              className="sp-input-label"
              htmlFor="playerStatsTitularisations2526"
            >
              Titularisations 25-26
            </label>
            <input
              id="playerStatsTitularisations2526"
              type="number"
              min={0}
              className="sp-input-control"
              value={
                isEditingStats
                  ? statsDraft.titularisations2526
                  : effectiveStats.titularisations2526
              }
              onChange={(event) =>
                updateDraftNumber("titularisations2526", event.target.value)
              }
              disabled={!isEditingStats}
            />
          </div>
        </div>
        )}
        {statsSeasonTab === "2025/2026" && (
        <p className="text-xs text-neutral-500">
          Valeur initiale automatique: Matchs 25-26 et Titularisations 25-26
          sont préremplis depuis les compositions, puis restent modifiables
          manuellement.
        </p>
        )}
      </section>

      <section className="sp-panel space-y-3">
        <h2 className="font-semibold">Compositions</h2>
        {playerCompositions.length === 0 ? (
          <p className="text-sm text-neutral-400">
            Aucune composition pour ce joueur.
          </p>
        ) : (
          <ul
            className={`space-y-2 ${playerCompositions.length > 4 ? "max-h-56 overflow-y-auto pr-1" : ""}`}
          >
            {playerCompositions.map((entry) => (
              <li
                key={`${entry.teamId}-${entry.number}`}
                className="rounded border border-neutral-700 bg-neutral-800/40 px-3 py-2 text-sm text-neutral-200"
              >
                {entry.teamName} - #{entry.number}
                {entry.isCaptain ? " (Capitaine)" : ""}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

