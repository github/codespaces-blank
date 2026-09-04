import React, { useState } from "react";
import type { Team, Player } from "~/types/tracker";
import { addStarterToTeam, addSubstituteToTeam, removePlayerFromTeam } from "~/utils/TeamEditorUtils";

interface Props {
    team: Team;
    rosterPlayers: Player[];
    onChange: (team: Team) => void;
    onClose: () => void;
}

export default function TeamEditor({ team, rosterPlayers, onChange, onClose }: Props) {
    const [newPlayerId, setNewPlayerId] = useState("");
    const [newPlayerNumber, setNewPlayerNumber] = useState(1);
    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [feedbackType, setFeedbackType] = useState<"success" | "error" | null>(null);

    const allEntries = [...team.starters, ...team.substitutes];
    const existingPlayerIds = new Set(allEntries.map((entry) => entry.player.id));
    const availablePlayers = rosterPlayers.filter((player) => !existingPlayerIds.has(player.id));

    function clearFeedback() {
        if (!feedbackMessage) return;
        setFeedbackMessage("");
        setFeedbackType(null);
    }

    function addPlayer() {
        if (!newPlayerId) {
            setFeedbackType("error");
            setFeedbackMessage("Sélectionne un joueur avant de valider.");
            return;
        }
        if (newPlayerNumber < 1 || newPlayerNumber > 23) {
            setFeedbackType("error");
            setFeedbackMessage("Le numéro doit être compris entre 1 et 23.");
            return;
        }
        if (existingPlayerIds.has(newPlayerId)) {
            setFeedbackType("error");
            setFeedbackMessage("Ce joueur est déjà dans la composition.");
            return;
        }
        const player = rosterPlayers.find((p) => p.id === newPlayerId);
        if (!player) {
            setFeedbackType("error");
            setFeedbackMessage("Joueur introuvable dans le roster.");
            return;
        }

        // Auto-classify based on number: 1-15 = starters, 16-23 = substitutes
        const isStarter = newPlayerNumber >= 1 && newPlayerNumber <= 15;
        const updated = isStarter
            ? addStarterToTeam(team, player, newPlayerNumber)
            : addSubstituteToTeam(team, player, newPlayerNumber);

        onChange(updated);
        setNewPlayerId("");
        setNewPlayerNumber(1);
        setFeedbackType("success");
        setFeedbackMessage("Joueur ajouté à la composition.");
    }

    function removePlayer(id: string) {
        const updated = removePlayerFromTeam(team, id);
        onChange(updated);
    }

    return (
        <div className="space-y-4 mt-2 border p-3 rounded bg-gray-90">
            {/* Add player form */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Ajouter un joueur</h4>
                    <button
                        className="sp-button sp-button-sm sp-button-light"
                        onClick={onClose}
                    >
                        Fermer
                    </button>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <input
                        type="number"
                        className="border p-2 w-full sm:w-24"
                        min={1}
                        max={23}
                        placeholder="Numéro"
                        value={newPlayerNumber}
                        onChange={(e) => {
                            clearFeedback();
                            setNewPlayerNumber(Number(e.target.value));
                        }}
                    />
                    <select
                        className="border p-2 flex-1"
                        value={newPlayerId}
                        onChange={(e) => {
                            clearFeedback();
                            setNewPlayerId(e.target.value);
                        }}
                    >
                        <option value="">-- Sélectionner un joueur --</option>
                        {availablePlayers.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                    <button
                        className="sp-button sp-button-sm sp-button-blue w-full sm:w-auto"
                        onClick={addPlayer}
                        disabled={availablePlayers.length === 0}
                    >
                        Ajouter
                    </button>
                </div>
                {feedbackMessage && (
                    <p
                        className={`mt-2 text-sm ${
                            feedbackType === "success" ? "text-green-700" : "text-red-600"
                        }`}
                    >
                        {feedbackMessage}
                    </p>
                )}
            </div>

            {/* Display composition */}
            <div>
                <h4 className="font-semibold mb-2">Composition</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Starters */}
                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Titulaires (1-15)</p>
                        <ul className="space-y-1">
                            {team.starters.map((entry) => (
                                <li key={entry.player.id} className="flex items-center gap-2 text-sm">
                                    <span className="font-semibold w-6">{entry.number}</span>
                                    <span className="flex-1">{entry.player.name}</span>
                                    <button
                                        className="sp-button sp-button-xs sp-button-red"
                                        onClick={() => removePlayer(entry.player.id)}
                                    >
                                        ✖
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Substitutes */}
                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Remplaçants (16-23)</p>
                        <ul className="space-y-1">
                            {team.substitutes.map((entry) => (
                                <li key={entry.player.id} className="flex items-center gap-2 text-sm">
                                    <span className="font-semibold w-6">{entry.number}</span>
                                    <span className="flex-1">{entry.player.name}</span>
                                    <button
                                        className="sp-button sp-button-xs sp-button-red"
                                        onClick={() => removePlayer(entry.player.id)}
                                    >
                                        ✖
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
