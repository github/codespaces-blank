import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faListCheck, faUsers } from "@fortawesome/free-solid-svg-icons";
import { faClipboard } from "@fortawesome/free-regular-svg-icons";
import CommandPanel from "~/components/CommandPanel";
import EventForm from "~/components/EventForm";
import TrackerStatsPanel from "~/components/TrackerStatsPanel";
import TrackerTeamsPanel from "~/components/TrackerTeamsPanel";
import TrackerNotesPanel from "~/components/TrackerNotesPanel";
import { ACTION_TABS } from "~/constants/tracker";
import type { TrackerActionTab } from "~/constants/tracker";
import type { Event, Team } from "~/types/tracker";

interface TrackerActionWorkspaceProps {
  actionTab: TrackerActionTab;
  onActionTabChange: (tab: TrackerActionTab) => void;
  activeCommand: string | null;
  onActiveCommandChange: (command: string | null) => void;
  commandTypes: readonly string[];
  team1Id: string;
  team2Id: string;
  selectedTeams: Team[];
  time: number;
  currentHalf: 1 | 2;
  events: Event[];
  onAddEvent: (event: Event) => void;
  getDisplayTeamLabel: (team: { name: string; nickname?: string }) => string;
  displayedPenalties: number[];
  displayedEnAvant: number[];
  teamTouchePerdue: number[];
  teamMeleePerdue: number[];
  teamTurnover: number[];
  teamJeuAuPied: number[];
  adjustPenalties: (teamIndex: number, delta: number) => void;
  adjustEnAvant: (teamIndex: number, delta: number) => void;
  adjustTouchePerdue: (teamIndex: number, delta: number) => void;
  adjustMeleePerdue: (teamIndex: number, delta: number) => void;
  adjustTurnover: (teamIndex: number, delta: number) => void;
  adjustJeuAuPied: (teamIndex: number, delta: number) => void;
}

export default function TrackerActionWorkspace({
  actionTab,
  onActionTabChange,
  activeCommand,
  onActiveCommandChange,
  commandTypes,
  team1Id,
  team2Id,
  selectedTeams,
  time,
  currentHalf,
  events,
  onAddEvent,
  getDisplayTeamLabel,
  displayedPenalties,
  displayedEnAvant,
  teamTouchePerdue,
  teamMeleePerdue,
  teamTurnover,
  teamJeuAuPied,
  adjustPenalties,
  adjustEnAvant,
  adjustTouchePerdue,
  adjustMeleePerdue,
  adjustTurnover,
  adjustJeuAuPied,
}: TrackerActionWorkspaceProps) {
  const tabIconById = {
    events: faListCheck,
    stats: faChartLine,
    teams: faUsers,
    notes: faClipboard,
  } as const;

  function handleTabClick(tabId: TrackerActionTab) {
    onActionTabChange(tabId);
    if (tabId !== "events") {
      onActiveCommandChange(null);
    }
  }

  return (
    <>
      <section className="space-y-2">
        <div className="flex items-center gap-2">
          {ACTION_TABS.map((tab) => (
            <button
              key={tab.id}
              className={`px-2 sm:px-3 py-2 rounded border text-sm font-medium transition-colors ${
                actionTab === tab.id
                  ? "border-blue-500 bg-blue-500/20 text-blue-300"
                  : "border-neutral-700 bg-neutral-900 text-neutral-300 hover:bg-neutral-800"
              }`}
              onClick={() => handleTabClick(tab.id)}
            >
              <FontAwesomeIcon icon={tabIconById[tab.id]} className="sm:mr-1" />
              <span className="hidden sm:inline"> {tab.label}</span>
            </button>
          ))}
        </div>
      </section>

      {actionTab === "teams" && (
        <section className="space-y-3">
          <TrackerTeamsPanel
            selectedTeams={selectedTeams}
            events={events}
            getDisplayTeamLabel={getDisplayTeamLabel}
          />
        </section>
      )}

      {actionTab === "notes" && (
        <section className="space-y-3">
          <TrackerNotesPanel />
        </section>
      )}

      {actionTab === "stats" && (
        <section className="space-y-3">
          <h3 className="font-semibold text-center">Statistiques</h3>
          {selectedTeams.length !== 2 ? (
            <p className="text-sm text-gray-500 text-center">
              Sélectionne et valide deux équipes pour afficher les statistiques.
            </p>
          ) : (
            <TrackerStatsPanel
              selectedTeams={selectedTeams}
              getDisplayTeamLabel={getDisplayTeamLabel}
              displayedPenalties={displayedPenalties}
              displayedEnAvant={displayedEnAvant}
              teamTouchePerdue={teamTouchePerdue}
              teamMeleePerdue={teamMeleePerdue}
              teamTurnover={teamTurnover}
              teamJeuAuPied={teamJeuAuPied}
              adjustPenalties={adjustPenalties}
              adjustEnAvant={adjustEnAvant}
              adjustTouchePerdue={adjustTouchePerdue}
              adjustMeleePerdue={adjustMeleePerdue}
              adjustTurnover={adjustTurnover}
              adjustJeuAuPied={adjustJeuAuPied}
            />
          )}
        </section>
      )}

      {actionTab === "events" && (
        <>
          <CommandPanel
            types={commandTypes}
            onSelect={(type) => onActiveCommandChange(type)}
          />

          {activeCommand && team1Id && team2Id && team1Id !== team2Id && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
              onClick={() => onActiveCommandChange(null)}
            >
              <div onClick={(event) => event.stopPropagation()}>
                <EventForm
                  type={activeCommand}
                  teams={selectedTeams}
                  currentTime={time}
                  currentHalf={currentHalf}
                  onSubmit={onAddEvent}
                  onCancel={() => onActiveCommandChange(null)}
                />
              </div>
            </div>
          )}
          {activeCommand && (!team1Id || !team2Id || team1Id === team2Id) && (
            <p className="text-sm text-red-600">
              Sélectionne deux équipes différentes pour enregistrer un événement.
            </p>
          )}
        </>
      )}
    </>
  );
}
