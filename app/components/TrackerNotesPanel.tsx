import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPen } from "@fortawesome/free-solid-svg-icons";

const NOTES_STORAGE_KEY = "sidepitcher.tracker.notes";

export default function TrackerNotesPanel() {
  const [notes, setNotes] = useState("");
  const [editing, setEditing] = useState(true);

  // Charge les notes sauvegardées au montage
  useEffect(() => {
    const saved = window.localStorage.getItem(NOTES_STORAGE_KEY);
    if (saved) {
      setNotes(saved);
      setEditing(false);
    }
  }, []);

  function handleValidate() {
    window.localStorage.setItem(NOTES_STORAGE_KEY, notes);
    setEditing(false);
  }

  function handleEdit() {
    setEditing(true);
  }

  return (
    <div className="sp-panel space-y-3">
      <h3 className="font-semibold text-sm text-center">Notes</h3>

      {editing ? (
        <>
          <textarea
            className="sp-input-control w-full min-h-[10rem] max-h-[50vh] resize-y text-sm"
            placeholder="Une note par ligne…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            autoFocus
          />
          <div className="flex justify-end">
            <button
              className="sp-button sp-button-sm sp-button-blue"
              onClick={handleValidate}
            >
              <FontAwesomeIcon icon={faCheck} className="mr-1" />
              Valider
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="rounded bg-neutral-900 px-3 py-2 text-sm text-neutral-200 min-h-[5rem] max-h-[50vh] overflow-y-auto">
            {notes ? (
              <ul className="list-disc list-inside space-y-1">
                {notes.split("\n").filter((line) => line.trim()).map((line, i) => (
                  <li key={i}>{line.trim()}</li>
                ))}
              </ul>
            ) : (
              <span className="text-neutral-500 italic">Aucune note.</span>
            )}
          </div>
          <div className="flex justify-end">
            <button
              className="sp-button sp-button-sm sp-button-neutral"
              onClick={handleEdit}
            >
              <FontAwesomeIcon icon={faPen} className="mr-1" />
              Modifier
            </button>
          </div>
        </>
      )}
    </div>
  );
}