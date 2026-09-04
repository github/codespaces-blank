import type React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";

interface TeamOption {
  id: string;
  name: string;
  nickname?: string;
}

interface TrackerSetupWizardProps {
  championship: string;
  matchDayLabel: string;
  hasActiveRoster: boolean;
  teamsForDay: TeamOption[];
  team1Id: string;
  team2Id: string;
  matchDateInput: string;
  fieldInput: string;
  refereeInput: string;
  top14StadiumOptions: readonly string[];
  setupCanSubmit: boolean;
  saveMessage: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onTeam1Change: (nextTeamId: string) => void;
  onTeam2Change: (nextTeamId: string) => void;
  onMatchDateInputChange: (value: string) => void;
  onFieldInputChange: (value: string) => void;
  onRefereeInputChange: (value: string) => void;
  getDisplayTeamLabel: (team: { name: string; nickname?: string }) => string;
}

export default function TrackerSetupWizard({
  championship,
  matchDayLabel,
  hasActiveRoster,
  teamsForDay,
  team1Id,
  team2Id,
  matchDateInput,
  fieldInput,
  refereeInput,
  top14StadiumOptions,
  setupCanSubmit,
  saveMessage,
  onSubmit,
  onTeam1Change,
  onTeam2Change,
  onMatchDateInputChange,
  onFieldInputChange,
  onRefereeInputChange,
  getDisplayTeamLabel,
}: TrackerSetupWizardProps) {
  return (
    <main className="sp-page min-h-0 space-y-5 pb-10">
      <h1 className="leading-[0.95] font-bold tracking-[-0.03em] text-4xl text-center text-white">
        Préparation du tracker
      </h1>
      <p className="text-foreground max-w-3xl text-base font-light text-white text-balance sm:text-lg text-center mx-auto">
        <FontAwesomeIcon icon={faTrophy} className="sm:mr-1 mr-2" />
        {championship} {matchDayLabel && <> — {matchDayLabel}</>}
      </p>

      {!hasActiveRoster && (
        <p className="text-red-600 text-center">
          Aucun effectif actif. Allez sur la page « Effectifs » pour en sélectionner un ou en créer un.
        </p>
      )}

      <form
        className="mx-auto mb-0 w-full max-w-sm space-y-1.5 px-2 text-left sm:w-11/12 md:w-full lg:mb-0"
        onSubmit={onSubmit}
      >
        <div className="sp-input-shell">
          <label className="sp-input-label" htmlFor="trackerTeam1Select">
            Équipe 1
          </label>
          <select
            id="trackerTeam1Select"
            className="sp-input-control"
            value={team1Id}
            onChange={(e) => onTeam1Change(e.target.value)}
          >
            <option value="">-- Équipe 1 --</option>
            {teamsForDay.map((team) => (
              <option key={team.id} value={team.id}>
                {getDisplayTeamLabel(team)}
              </option>
            ))}
          </select>
        </div>

        <div className="sp-input-shell">
          <label className="sp-input-label" htmlFor="trackerTeam2Select">
            Équipe 2
          </label>
          <select
            id="trackerTeam2Select"
            className="sp-input-control"
            value={team2Id}
            onChange={(e) => onTeam2Change(e.target.value)}
          >
            <option value="">-- Équipe 2 --</option>
            {teamsForDay.map((team) => (
              <option key={team.id} value={team.id}>
                {getDisplayTeamLabel(team)}
              </option>
            ))}
          </select>
        </div>

        <div className="sp-input-shell">
          <label className="sp-input-label" htmlFor="trackerMatchDateInput">
            Date du match
          </label>
          <input
            id="trackerMatchDateInput"
            type="date"
            value={matchDateInput}
            onChange={(event) => onMatchDateInputChange(event.target.value)}
            className="sp-input-control"
          />
        </div>

        <div className="sp-input-shell">
          <label className="sp-input-label" htmlFor="trackerFieldInput">
            Terrain
          </label>
          <select
            id="trackerFieldInput"
            value={fieldInput}
            onChange={(event) => onFieldInputChange(event.target.value)}
            className="sp-input-control"
          >
            <option value="">Selectionner un stade</option>
            {top14StadiumOptions.map((stadium) => (
              <option key={stadium} value={stadium}>
                {stadium}
              </option>
            ))}
          </select>
        </div>

        <div className="sp-input-shell">
          <label className="sp-input-label" htmlFor="trackerRefereeInput">
            Arbitre
          </label>
          <input
            id="trackerRefereeInput"
            value={refereeInput}
            onChange={(event) => onRefereeInputChange(event.target.value)}
            placeholder="Nom de l'arbitre"
            className="sp-input-control"
          />
        </div>

        {team1Id && team2Id && team1Id === team2Id && (
          <p className="text-sm text-red-600">Équipe 1 et Équipe 2 doivent être différentes.</p>
        )}

        {teamsForDay.length === 0 && (
          <p className="text-sm text-gray-600">Aucune composition pour cette journée.</p>
        )}

        <button
          type="submit"
          className="sp-button sp-button-md sp-button-full sp-button-blue"
          disabled={!setupCanSubmit || teamsForDay.length === 0}
        >
          Valider et ouvrir le tracker
        </button>

        {saveMessage && (
          <p className={`text-sm ${saveMessage.includes("✓") ? "text-green-400" : "text-red-500"}`}>
            {saveMessage}
          </p>
        )}
      </form>
    </main>
  );
}
