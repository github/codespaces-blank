import { faRepeat } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { CompositionEntry, Event, Team } from "~/types/tracker";
import { formatEventTimeline } from "~/utils/eventPresentation";

interface Props {
  selectedTeams: Team[];
  events: Event[];
  getDisplayTeamLabel: (team: { name: string; nickname?: string }) => string;
}

interface SubstitutionInfo {
  playerInName: string;
  playerInNumber?: number;
  initialMinuteLabel: string;
  isTemporary: boolean;
}

function getEventMinuteLabel(event: Event): string {
  return formatEventTimeline(event);
}

/**
 * Vérifie si deux changements sont l'inverse l'un de l'autre : A → B suivi de B → A.
 * C'est le cas d'un remplacement temporaire (protocolaire commotion / saignement),
 * où le joueur sorti revient ensuite sur le terrain.
 */
function isInverseSubstitution(first: Event, second: Event): boolean {
  return (
    first.type === "Changement" &&
    second.type === "Changement" &&
    !!first.team?.id &&
    first.team.id === second.team?.id &&
    !!first.playerOut?.id &&
    !!first.playerIn?.id &&
    first.playerOut.id === second.playerIn?.id &&
    first.playerIn.id === second.playerOut?.id
  );
}

export default function TrackerTeamsPanel({ selectedTeams, events, getDisplayTeamLabel }: Props) {
  if (selectedTeams.length !== 2) {
    return (
      <p className="text-sm text-gray-500 text-center">
        Sélectionne et valide deux équipes pour afficher les compositions.
      </p>
    );
  }

  // Construit une map playerOut.id → infos de remplacement pour une équipe donnée.
  // Pour chaque changement, on cherche :
  //   - un changement précédent inverse → ce changement est le "retour" (temporaire)
  //   - un changement suivant inverse   → ce changement est le "départ" initial (temporaire)
  // Si aucun inverse n'existe, c'est un remplacement définitif.
  // Dans les deux cas, la minute affichée est celle du premier changement (le départ initial).
  function getSubstitutionsByTeam(team: Team): Map<string, SubstitutionInfo> {
    const map = new Map<string, SubstitutionInfo>();
    for (let index = 0; index < events.length; index += 1) {
      const event = events[index];
      if (event.type === "Changement" && event.team?.id === team.id && event.playerOut && event.playerIn) {
        // Cherche un changement précédent qui serait l'inverse de cet événement
        let previousInverseIndex: number | null = null;
        for (let prevIndex = index - 1; prevIndex >= 0; prevIndex -= 1) {
          if (isInverseSubstitution(event, events[prevIndex])) {
            previousInverseIndex = prevIndex;
            break;
          }
        }

        // Si aucun précédent inverse, cherche un changement suivant inverse
        let nextInverseIndex: number | null = null;
        if (previousInverseIndex === null) {
          for (let laterIndex = index + 1; laterIndex < events.length; laterIndex += 1) {
            if (isInverseSubstitution(event, events[laterIndex])) {
              nextInverseIndex = laterIndex;
              break;
            }
          }
        }

        const isTemporary = previousInverseIndex !== null || nextInverseIndex !== null;
        // On affiche la minute du premier départ (pas du retour)
        const initialEvent = previousInverseIndex !== null ? events[previousInverseIndex] : event;

        map.set(event.playerOut.id, {
          playerInName: event.playerIn.name,
          playerInNumber: event.playerInNumber,
          initialMinuteLabel: getEventMinuteLabel(initialEvent),
          isTemporary,
        });
      }
    }
    return map;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {selectedTeams.map((team) => {
        const substitutions = getSubstitutionsByTeam(team);
        const starters = [...team.starters].sort((a, b) => a.number - b.number);
        const substitutes = [...team.substitutes].sort((a, b) => a.number - b.number);

        return (
          <section key={team.id} className="sp-panel space-y-3">
            <h3 className="font-semibold text-sm text-center">{getDisplayTeamLabel(team)}</h3>

            {starters.length === 0 && substitutes.length === 0 ? (
              <p className="text-xs text-neutral-400 text-center">Aucun joueur dans la composition.</p>
            ) : (
              <>
                {starters.length > 0 && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-500 mb-1">Titulaires</p>
                    <ul className="space-y-1">
                      {starters.map((entry) => (
                        <PlayerRow
                          key={entry.player.id}
                          entry={entry}
                          substitution={substitutions.get(entry.player.id)}
                        />
                      ))}
                    </ul>
                  </div>
                )}

                {substitutes.length > 0 && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-500 mb-1">Remplaçants</p>
                    <ul className="space-y-1">
                      {substitutes.map((entry) => (
                        <PlayerRow
                          key={entry.player.id}
                          entry={entry}
                          substitution={substitutions.get(entry.player.id)}
                        />
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </section>
        );
      })}
    </div>
  );
}

function PlayerRow({
  entry,
  substitution,
}: {
  entry: CompositionEntry;
  substitution?: SubstitutionInfo;
}) {
  return (
    <li className="text-sm">
      <div className={`flex items-center gap-2 ${substitution && !substitution.isTemporary ? "text-neutral-500 line-through" : "text-neutral-200"}`}>
        <span className="w-6 shrink-0 text-right text-xs text-neutral-400 no-underline" style={{ textDecoration: "none" }}>
          {entry.number}
        </span>
        <span>{entry.player.name}</span>
      </div>
      {substitution && (
        <div className="flex items-center gap-2 pl-8 text-xs text-sky-300 mt-0.5">
          {substitution.isTemporary ? (
            <>
              <span className="shrink-0 text-neutral-400">{substitution.initialMinuteLabel}</span>
              <span>
                {substitution.playerInNumber != null ? `${substitution.playerInNumber} · ` : ""}
                {substitution.playerInName} (temporaire)
              </span>
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faRepeat} className="shrink-0" />
              <span>
                {substitution.playerInNumber != null ? `${substitution.playerInNumber} · ` : ""}
                {substitution.playerInName}
              </span>
            </>
          )}
        </div>
      )}
    </li>
  );
}
