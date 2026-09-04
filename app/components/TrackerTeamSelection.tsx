interface TeamOption {
  id: string;
  name: string;
}

interface Props {
  teamsForDay: TeamOption[];
  team1Id: string;
  team2Id: string;
  onTeam1Change: (teamId: string) => void;
  onTeam2Change: (teamId: string) => void;
  onSave: () => void;
  saveMessage: string;
}

export default function TrackerTeamSelection({
  teamsForDay,
  team1Id,
  team2Id,
  onTeam1Change,
  onTeam2Change,
  onSave,
  saveMessage,
}: Props) {
  return (
    <section className="space-y-2">
      {teamsForDay.length === 0 ? (
        <p className="text-sm text-gray-600">Aucune composition pour cette journée.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="sp-input-shell">
              <label className="sp-input-label" htmlFor="team1Select">Équipe 1</label>
              <select
                id="team1Select"
                className="sp-input-control"
                value={team1Id}
                onChange={(e) => onTeam1Change(e.target.value)}
              >
                <option value="">-- Équipe 1 --</option>
                {teamsForDay.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="sp-input-shell">
              <label className="sp-input-label" htmlFor="team2Select">Équipe 2</label>
              <select
                id="team2Select"
                className="sp-input-control"
                value={team2Id}
                onChange={(e) => onTeam2Change(e.target.value)}
              >
                <option value="">-- Équipe 2 --</option>
                {teamsForDay.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {team1Id && team2Id && team1Id === team2Id && (
            <p className="text-sm text-red-600">Équipe 1 et Équipe 2 doivent être différentes.</p>
          )}

          <button
            className="sp-button sp-button-md sp-button-full sp-button-green"
            onClick={onSave}
            disabled={!team1Id || !team2Id || team1Id === team2Id}
          >
            Valider
          </button>

          {saveMessage && (
            <p className={`text-sm ${saveMessage.includes("✓") ? "text-green-700" : "text-red-600"}`}>
              {saveMessage}
            </p>
          )}
        </>
      )}
    </section>
  );
}
