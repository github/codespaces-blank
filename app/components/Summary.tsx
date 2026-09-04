import { faCopy, faDownload, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import type { Event, Team } from "~/types/tracker";
import { buildEventSummary, exportSummaryToClipboard, exportSummaryToPdf } from "~/utils/EventUtils";

interface Props {
    events: Event[];
    currentTime: number;
    teams: Team[];
    matchDay?: number;
    matchDate?: string;
    matchField?: string;
    matchReferee?: string;
    onSaved?: () => void;
}

export default function Summary({ events, currentTime, teams, matchDay, matchDate, matchField, matchReferee, onSaved }: Props) {
    const summary = buildEventSummary(events);
    const [saveMessage, setSaveMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
    const [saving, setSaving] = useState(false);
    const teamLabel = teams.length >= 2
        ? `${teams[0].name.replace(/\s+J\d+$/, "")} vs ${teams[1].name.replace(/\s+J\d+$/, "")}`
        : teams.length === 1
            ? teams[0].name.replace(/\s+J\d+$/, "")
            : "Match";
    const summaryTitle = matchDay ? `J${matchDay} - ${teamLabel}` : teamLabel;

    async function saveSummary() {
        setSaving(true);
        setSaveMessage(null);
        try {
            const res = await fetch("/api/summaries", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentTime,
                    summary,
                    events,
                    teams: teams.map((team) => ({ id: team.id, name: team.name })),
                    matchDay,
                    matchDate,
                    matchField,
                    matchReferee,
                }),
            });
            if (!res.ok) {
                setSaveMessage({ type: "error", text: "Impossible de sauvegarder la synthèse." });
                return;
            }
            onSaved?.();
            setSaveMessage({ type: "success", text: "Synthèse sauvegardée." });
            setTimeout(() => setSaveMessage(null), 3000);
        } catch {
            setSaveMessage({ type: "error", text: "Erreur réseau. Réessayez." });
        } finally {
            setSaving(false);
        }
    }

    return (
        <section className="space-y-2">
            <div className="mt-2 flex flex-col justify-center sm:flex-row gap-2">
                <button
                    className="sp-button sp-button-md sp-button-green w-full sm:w-auto"
                    onClick={saveSummary}
                    disabled={saving}
                >
                    <FontAwesomeIcon icon={faFloppyDisk} className="mr-2" />
                    {saving ? "Sauvegarde..." : "Sauvegarder la synthèse"}
                </button>
                <button
                    className="sp-button sp-button-md sp-button-indigo w-full sm:w-auto"
                    onClick={() => exportSummaryToClipboard(events, currentTime, summary)}
                >
                    <FontAwesomeIcon icon={faCopy} className="mr-2" />
                    Copier la synthèse
                </button>
                <button
                    className="sp-button sp-button-md sp-button-neutral w-full sm:w-auto"
                    onClick={() =>
                        exportSummaryToPdf(events, currentTime, summary, {
                            title: `Synthèse - ${summaryTitle}`,
                            fileName: summaryTitle,
                        })
                    }
                >
                    <FontAwesomeIcon icon={faDownload} className="mr-2" />
                    Télécharger PDF
                </button>
            </div>
            {saveMessage && (
                <p className={`text-sm text-center ${saveMessage.type === "error" ? "text-red-400" : "text-emerald-400"}`}>
                    {saveMessage.text}
                </p>
            )}
        </section>
    );
}
