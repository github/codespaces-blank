import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import type { Team, Player, Event } from "~/types/tracker";
import { createPlayerEvent, createSubstitutionEvent, findPlayerNumberInTeam } from "~/utils/EventUtils";
import { getTimelineMomentFromClock } from "~/utils/TimeUtils";

interface Props {
    type: string;
    teams: Team[];
    onSubmit: (event: Event) => void;
    onCancel: () => void;
    currentTime: number;
    currentHalf: 1 | 2;
}

export default function EventForm({
    type,
    teams,
    onSubmit,
    onCancel,
    currentTime,
    currentHalf,
    }: Props) {
    const [teamIdx, setTeamIdx] = useState(0);
    const [playerId, setPlayerId] = useState("");
    const [concussion, setConcussion] = useState(false);
    const [outPlayerId, setOutPlayerId] = useState("");
    const [inPlayerId, setInPlayerId] = useState("");
    const [videoReason, setVideoReason] = useState<"essai" | "jeu déloyal">("essai");
    const [useManualMoment, setUseManualMoment] = useState(false);
    const [manualHalf, setManualHalf] = useState<1 | 2>(currentHalf);
    const [manualMinute, setManualMinute] = useState("");
    const [manualSecond, setManualSecond] = useState("");
    const [manualAdditionalMinute, setManualAdditionalMinute] = useState("");
    const [timeError, setTimeError] = useState("");

    useEffect(() => {
        // reset when type or teams change
        setPlayerId("");
        setConcussion(false);
        setOutPlayerId("");
        setInPlayerId("");
        setVideoReason("essai");
        setUseManualMoment(false);
        setManualHalf(currentHalf);
        setManualMinute("");
        setManualSecond("");
        setManualAdditionalMinute("");
        setTimeError("");
    }, [type, teams, currentHalf]);

    const team = teams[teamIdx];
    const players: Player[] = team
      ? [
          ...team.starters.map((e) => e.player),
          ...team.substitutes.map((e) => e.player),
        ]
      : [];

        function getPlayerOptionLabel(player: Player): string {
                if (!team) return player.name;
                const number = findPlayerNumberInTeam(team, player.id);
                return number ? `#${number} ${player.name}` : player.name;
        }

    function buildEventTiming(): {
        eventTime: number;
        timelineHalf: 1 | 2;
        timelineMinute: number;
        timelineAdditionalMinute: number;
        timelineSecond: number;
    } | null {
        if (!useManualMoment) {
            const autoMoment = getTimelineMomentFromClock(currentTime, currentHalf);
            return {
                eventTime: currentTime,
                timelineHalf: autoMoment.half,
                timelineMinute: autoMoment.minute,
                timelineAdditionalMinute: autoMoment.additionalMinute,
                timelineSecond: autoMoment.second,
            };
        }

        const parsedMinute = parseInt(manualMinute, 10);
        if (Number.isNaN(parsedMinute) || parsedMinute < 0) {
            setTimeError("Renseigne une minute valide.");
            return null;
        }

        const parsedSecond = manualSecond.trim()
            ? parseInt(manualSecond, 10)
            : 0;

        if (Number.isNaN(parsedSecond) || parsedSecond < 0 || parsedSecond > 59) {
            setTimeError("Les secondes doivent être entre 0 et 59.");
            return null;
        }

        const parsedAdditional = manualAdditionalMinute.trim()
            ? parseInt(manualAdditionalMinute, 10)
            : 0;

        if (Number.isNaN(parsedAdditional) || parsedAdditional < 0) {
            setTimeError("Le temps additionnel doit être positif.");
            return null;
        }

        const timelineMinute = parsedAdditional > 0
            ? (manualHalf === 1 ? 40 : 80)
            : parsedMinute;
        const eventDisplayMinute = timelineMinute + parsedAdditional;

        return {
            eventTime: (eventDisplayMinute * 60) + parsedSecond,
            timelineHalf: manualHalf,
            timelineMinute,
            timelineAdditionalMinute: parsedAdditional,
            timelineSecond: parsedSecond,
        };
    }

    function handleSubmit() {
        const timing = buildEventTiming();
        if (!timing) return;
        setTimeError("");

        if (type === "Arbitrage Vidéo") {
            if (!team) return;
            onSubmit({
                type,
                time: timing.eventTime,
                timelineHalf: timing.timelineHalf,
                timelineMinute: timing.timelineMinute,
                timelineAdditionalMinute: timing.timelineAdditionalMinute,
                timelineSecond: timing.timelineSecond,
                team,
                videoReason,
            });
        } else if (type === "Changement") {
            const playerOut = players.find((p) => p.id === outPlayerId);
            const playerIn = players.find((p) => p.id === inPlayerId);
            const playerOutNumber = team && playerOut ? findPlayerNumberInTeam(team, playerOut.id) : undefined;
            const playerInNumber = team && playerIn ? findPlayerNumberInTeam(team, playerIn.id) : undefined;
            const event = createSubstitutionEvent(
                timing.eventTime,
                team,
                playerOut,
                playerOutNumber,
                playerIn,
                playerInNumber,
                concussion
            );
            onSubmit({
                ...event,
                timelineHalf: timing.timelineHalf,
                timelineMinute: timing.timelineMinute,
                timelineAdditionalMinute: timing.timelineAdditionalMinute,
                timelineSecond: timing.timelineSecond,
            });
        } else {
            const player = players.find((p) => p.id === playerId);
            const playerNumber = team && player ? findPlayerNumberInTeam(team, player.id) : undefined;
            const event = createPlayerEvent(type, timing.eventTime, team, player, playerNumber, concussion);
            onSubmit({
                ...event,
                timelineHalf: timing.timelineHalf,
                timelineMinute: timing.timelineMinute,
                timelineAdditionalMinute: timing.timelineAdditionalMinute,
                timelineSecond: timing.timelineSecond,
            });
        }
    }

    return (
        <div className="p-4 rounded-md bg-neutral-800 text-white w-full max-w-md mx-auto">
        <h3 className="font-bold text-xl text-center mb-4">{type}</h3>
        <div className="space-y-2">
            <div className="rounded p-2 space-y-2 mb-4">
                <label className="leading-none" htmlFor="manualMomentCheckbox">
                    <input
                        id="manualMomentCheckbox"
                        type="checkbox"
                        checked={useManualMoment}
                        onChange={(e) => setUseManualMoment(e.target.checked)}
                        className="mr-2"
                    />
                    Chrono manuel ?
                </label>
                {useManualMoment && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mt-4">
                            <div className="sp-input-shell">
                                <label className="sp-input-label" htmlFor="manualHalfSelect">Mi-temps</label>
                                <select
                                    id="manualHalfSelect"
                                    className="sp-input-control"
                                    value={manualHalf}
                                    onChange={(e) => setManualHalf(Number(e.target.value) as 1 | 2)}
                                >
                                    <option value={1}>MT1</option>
                                    <option value={2}>MT2</option>
                                </select>
                            </div>
                            <div className="sp-input-shell">
                                <label className="sp-input-label" htmlFor="manualMinuteInput">Minute</label>
                                <input
                                    id="manualMinuteInput"
                                    type="number"
                                    min={0}
                                    className="sp-input-control"
                                    placeholder={manualHalf === 1 ? "ex. 37" : "ex. 65"}
                                    value={manualMinute}
                                    onChange={(e) => setManualMinute(e.target.value)}
                                />
                            </div>
                            <div className="sp-input-shell">
                                <label className="sp-input-label" htmlFor="manualSecondInput">Secondes</label>
                                <input
                                    id="manualSecondInput"
                                    type="number"
                                    min={0}
                                    max={59}
                                    className="sp-input-control"
                                    placeholder="ex. 30"
                                    value={manualSecond}
                                    onChange={(e) => setManualSecond(e.target.value)}
                                />
                            </div>
                            <div className="sp-input-shell">
                                <label className="sp-input-label" htmlFor="manualAdditionalInput">Additionnel</label>
                                <input
                                    id="manualAdditionalInput"
                                    type="number"
                                    min={0}
                                    className="sp-input-control"
                                    placeholder={manualHalf === 1 ? "ex. 2 (40'+2)" : "ex. 1 (80'+1)"}
                                    value={manualAdditionalMinute}
                                    onChange={(e) => setManualAdditionalMinute(e.target.value)}
                                />
                            </div>
                        </div>
                    </>
                )}
                {timeError && <p className="text-sm text-red-400">{timeError}</p>}
            </div>
            <div className="sp-input-shell">
                <label className="sp-input-label" htmlFor="teamSelect">Équipe</label>
                <select
                    id="teamSelect"
                    className="sp-input-control"
                    value={teamIdx}
                    onChange={(e) => setTeamIdx(Number(e.target.value))}
                >
                    {teams.map((t, idx) => (
                    <option key={idx} value={idx}>
                        {t.name}
                    </option>
                    ))}
                </select>
            </div>
            {type === "Arbitrage Vidéo" ? (
            <div className="sp-input-shell">
                <label className="sp-input-label" htmlFor="videoReasonSelect">Raison</label>
                <select
                    id="videoReasonSelect"
                    className="sp-input-control"
                    value={videoReason}
                    onChange={(e) => setVideoReason(e.target.value as "essai" | "jeu déloyal")}
                >
                    <option value="essai">essai</option>
                    <option value="jeu déloyal">jeu déloyal</option>
                </select>
            </div>
            ) : type === "Changement" ? (
            <>
                <div className="sp-input-shell">
                <label className="sp-input-label" htmlFor="outPlayerSelect">Sortant</label>
                <select
                    id="outPlayerSelect"
                    className="sp-input-control"
                    value={outPlayerId}
                    onChange={(e) => setOutPlayerId(e.target.value)}
                >
                    <option value="">--</option>
                    {players.map((p) => (
                    <option key={p.id} value={p.id}>
                        {getPlayerOptionLabel(p)}
                    </option>
                    ))}
                </select>
                </div>
                <div className="sp-input-shell">
                <label className="sp-input-label" htmlFor="inPlayerSelect">Entrant</label>
                <select
                    id="inPlayerSelect"
                    className="sp-input-control"
                    value={inPlayerId}
                    onChange={(e) => setInPlayerId(e.target.value)}
                >
                    <option value="">--</option>
                    {players.map((p) => (
                    <option key={p.id} value={p.id}>
                        {getPlayerOptionLabel(p)}
                    </option>
                    ))}
                </select>
                </div>
            </>
            ) : type === "Essai de pénalité" ? null : (
            <div className="sp-input-shell">
                <label className="sp-input-label" htmlFor="playerSelect">Joueur</label>
                <select
                    id="playerSelect"
                    className="sp-input-control"
                    value={playerId}
                    onChange={(e) => setPlayerId(e.target.value)}
                >
                <option value="">--</option>
                {players.map((p) => (
                    <option key={p.id} value={p.id}>
                    {getPlayerOptionLabel(p)}
                    </option>
                ))}
                </select>
            </div>
            )}
            {type === "Blessure" && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="leading-none" htmlFor="concussionCheckbox">
                <input
                id="concussionCheckbox"
                type="checkbox"
                checked={concussion}
                onChange={(e) => setConcussion(e.target.checked)}
                className="mr-1 text-neutral-300"
                />
                Protocole commotion
            </label>
            </div>
            )}
            <div className="flex flex-col justify-center sm:flex-row gap-2 mt-4 w-full">
            <button
                className="sp-button sp-button-sm sp-button-green sm:w-1/2 md:w-1/3"
                onClick={handleSubmit}
            >
                Valider
            </button>
            <button
                className="sp-button sp-button-sm sp-button-light sm:w-1/2 md:w-1/3"
                onClick={onCancel}
            >
                Annuler
            </button>
            </div>
        </div>
        </div>
    );
}
