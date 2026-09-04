import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatStatLabel } from "~/utils/eventPresentation";

interface TeamLike {
  id: string;
  name: string;
  nickname?: string;
}

interface TeamStatConfig {
  label: string;
  values: number[];
  onAdjust: (teamIdx: number, delta: number) => void;
}

interface Props {
  selectedTeams: TeamLike[];
  getDisplayTeamLabel: (team: TeamLike) => string;
  displayedPenalties: number[];
  displayedEnAvant: number[];
  teamTouchePerdue: number[];
  teamMeleePerdue: number[];
  teamTurnover: number[];
  teamJeuAuPied: number[];
  adjustPenalties: (idx: number, delta: number) => void;
  adjustEnAvant: (idx: number, delta: number) => void;
  adjustTouchePerdue: (idx: number, delta: number) => void;
  adjustMeleePerdue: (idx: number, delta: number) => void;
  adjustTurnover: (idx: number, delta: number) => void;
  adjustJeuAuPied: (idx: number, delta: number) => void;
}

export default function TrackerStatsPanel({
  selectedTeams,
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
}: Props) {
  const teamStats: TeamStatConfig[] = [
    {
      label: "Pénalité",
      values: displayedPenalties,
      onAdjust: adjustPenalties,
    },
    {
      label: "En Avant",
      values: displayedEnAvant,
      onAdjust: adjustEnAvant,
    },
    {
      label: "Touche Perdue",
      values: teamTouchePerdue,
      onAdjust: adjustTouchePerdue,
    },
    {
      label: "Mêlée Perdue",
      values: teamMeleePerdue,
      onAdjust: adjustMeleePerdue,
    },
    {
      label: "Turnover",
      values: teamTurnover,
      onAdjust: adjustTurnover,
    },
    {
      label: "Jeu au pied",
      values: teamJeuAuPied,
      onAdjust: adjustJeuAuPied,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {selectedTeams.map((team, teamIdx) => (
        <div key={team.id} className="border border-neutral-700 bg-neutral-900 rounded p-3 space-y-3">
          <h4 className="text-sm sm:text-base font-semibold text-center text-white">
            {getDisplayTeamLabel(team)}
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {teamStats.map((stat) => {
              const statValue = stat.values[teamIdx] || 0;
              return (
                <div key={stat.label} className="rounded p-2 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      className="sp-button sp-button-icon text-neutral-200"
                      onClick={() => stat.onAdjust(teamIdx, -1)}
                      aria-label={`Diminuer ${stat.label}`}
                    >
                      <FontAwesomeIcon icon={faCaretLeft} />
                    </button>
                    <span className="text-2xl leading-none text-white font-bold min-w-8">{statValue}</span>
                    <button
                      className="sp-button sp-button-icon text-neutral-200"
                      onClick={() => stat.onAdjust(teamIdx, 1)}
                      aria-label={`Augmenter ${stat.label}`}
                    >
                      <FontAwesomeIcon icon={faCaretRight} />
                    </button>
                  </div>
                  <p className="mt-1 text-[11px] sm:text-xs text-neutral-300 font-light">
                    {formatStatLabel(stat.label, statValue)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
