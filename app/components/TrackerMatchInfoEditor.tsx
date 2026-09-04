import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

interface TrackerMatchInfoEditorProps {
  isOpen: boolean;
  matchDateInput: string;
  fieldInput: string;
  refereeInput: string;
  stadiumOptions: readonly string[];
  onClose: () => void;
  onSave: () => void;
  onMatchDateInputChange: (value: string) => void;
  onFieldInputChange: (value: string) => void;
  onRefereeInputChange: (value: string) => void;
}

export default function TrackerMatchInfoEditor({
  isOpen,
  matchDateInput,
  fieldInput,
  refereeInput,
  stadiumOptions,
  onClose,
  onSave,
  onMatchDateInputChange,
  onFieldInputChange,
  onRefereeInputChange,
}: TrackerMatchInfoEditorProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={onClose}>
      <div className="sp-panel-compact w-full max-w-lg space-y-3" onClick={(event) => event.stopPropagation()}>
        <h2 className="text-base font-semibold">Infos du match</h2>
        <div className="space-y-2 text-left">
          <div className="sp-input-shell">
            <label className="sp-input-label" htmlFor="matchDateInput">
              Date du match
            </label>
            <input
              id="matchDateInput"
              type="date"
              value={matchDateInput}
              onChange={(event) => onMatchDateInputChange(event.target.value)}
              className="sp-input-control"
            />
          </div>
          <div className="sp-input-shell">
            <label className="sp-input-label" htmlFor="fieldInput">
              Terrain
            </label>
            <select
              id="fieldInput"
              value={fieldInput}
              onChange={(event) => onFieldInputChange(event.target.value)}
              className="sp-input-control"
            >
              <option value="">Selectionner un stade</option>
              {stadiumOptions.map((stadium) => (
                <option key={stadium} value={stadium}>
                  {stadium}
                </option>
              ))}
            </select>
          </div>
          <div className="sp-input-shell">
            <label className="sp-input-label" htmlFor="refereeInput">
              Arbitre
            </label>
            <input
              id="refereeInput"
              value={refereeInput}
              onChange={(event) => onRefereeInputChange(event.target.value)}
              placeholder="Nom de l'arbitre"
              className="sp-input-control"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:justify-end">
          <button type="button" className="sp-button sp-button-md sp-button-neutral" onClick={onClose}>
            Annuler
          </button>
          <button type="button" className="sp-button sp-button-md sp-button-blue" onClick={onSave}>
            <FontAwesomeIcon icon={faCheck} className="sm:mr-2" />
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}
