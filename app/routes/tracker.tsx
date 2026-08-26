import { useCallback, useEffect, useState, useMemo } from "react";
import type { Route } from "./+types/tracker";
import type { Event } from "~/types/tracker";
import type { LiveSnapshot } from "~/types/live";

import TimerControls from "~/components/TimerControls";
import EventsList from "~/components/EventsList";
import Summary from "~/components/Summary";
import Scoreboard from "~/components/Scoreboard";
import TrackerSetupWizard from "~/components/TrackerSetupWizard";
import TrackerMatchInfoEditor from "~/components/TrackerMatchInfoEditor";
import TrackerHeader from "~/components/TrackerHeader";
import TrackerLivePanel from "~/components/TrackerLivePanel";
import TrackerActionWorkspace from "~/components/TrackerActionWorkspace";
import { ACTION_TABS, COMMAND_TYPES } from "~/constants/tracker";
import type { TrackerActionTab } from "~/constants/tracker";
import { useTeams } from "~/context/TeamsContext";
import { useAccount } from "~/context/AccountContext";
import { useTrackerClock } from "~/hooks/useTrackerClock";
import { useTrackerEvents } from "~/hooks/useTrackerEvents";
import { useTrackerStats } from "~/hooks/useTrackerStats";
import { useTrackerSetup } from "~/hooks/useTrackerSetup";
import { useTrackerContextReset } from "~/hooks/useTrackerContextReset";
import { useTrackerMatchPresentation } from "~/hooks/useTrackerMatchPresentation";
import { useLiveBroadcast } from "~/hooks/useLiveBroadcast";
import { buildStatsSummaryEvent } from "~/utils/trackerSummaryEvent";
import { ProD2_Stadiums_2026_2027, Top14_Stadiums_2026_2027 } from "~/utils/stadiums";
import TrackerMatchEvents from "~/components/TrackerMatchEvents";
import TrackerMatchTimeline from "~/components/TrackerMatchTimeline";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Match Reporter" }];
}

const TRACKER_ACTION_TAB_STORAGE_KEY = "sidepitcher.tracker.actionTab";
export default function Tracker() {
    const { account } = useAccount();
    const {
        time,
        setTime,
        running,
        setRunning,
        currentHalf,
        setCurrentHalf,
        manualTimeInput,
        setManualTimeInput,
        matchEnded,
        setMatchEnded,
        formatTime,
        getDisplayTimes,
        adjustTime,
        applyManualTime,
        resetClock,
    } = useTrackerClock();
    const { rosters, teams, activeRosterId, matchDay, championship, sport } = useTeams();
    
    const activeRoster = useMemo(() => rosters.find((r) => r.id === activeRosterId) ?? null, [rosters, activeRosterId]);
    
    const [activeCommand, setActiveCommand] = useState<string | null>(null);
    const [actionTab, setActionTab] = useState<TrackerActionTab>("events");
    const [savedTrackingSignature, setSavedTrackingSignature] = useState<string | null>(null);
    const [kickoffShown, setKickoffShown] = useState(false);

    const {
      team1Id,
      setTeam1Id,
      team2Id,
      setTeam2Id,
      field,
      fieldInput,
      setFieldInput,
      matchDate,
      matchDateInput,
      setMatchDateInput,
      referee,
      refereeInput,
      setRefereeInput,
      showMatchInfoEditor,
      setShowMatchInfoEditor,
      saveMessage,
      isTrackerReady,
      setIsTrackerReady,
      setupCanSubmit,
      applyMatchInfo,
      syncRefereeFromEvent,
      handleSetupSubmit,
      resetMatchInfo,
      resetPreparationState,
    } = useTrackerSetup({
      championship,
      matchDay,
    });

    const {
      matchDayLabel,
      teamsForDay,
      selectedTeams,
      getDisplayTeamLabel,
      mobileMatchTitle,
      desktopMatchTitle,
      formattedMatchDate,
    } = useTrackerMatchPresentation({
      rosters,
      teams,
      matchDay,
      team1Id,
      team2Id,
      matchDate,
    });

    const selectedTeamIds = useMemo(() => [team1Id, team2Id], [team1Id, team2Id]);
    const stadiumOptions = useMemo(() => {
      const defaultStadiums: readonly string[] = championship === "Pro D2"
        ? ProD2_Stadiums_2026_2027
        : Top14_Stadiums_2026_2027;
      if (!fieldInput || defaultStadiums.includes(fieldInput)) {
        return defaultStadiums;
      }
      return [fieldInput, ...defaultStadiums] as const;
    }, [championship, fieldInput]);

    const {
        events,
        addEvent,
        removeEvent,
        resetEvents,
        matchFactsEvents,
        computeScores,
        computeBonuses,
    } = useTrackerEvents({
        selectedTeamIds,
        selectedTeamsCount: selectedTeams.length,
    });


    const {
        teamPenalties,
        manualPenaltyAdjustments,
        teamEnAvant,
        manualEnAvantAdjustments,
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
        getDisplayedPenalties,
        getDisplayedEnAvant,
        resetStats,
        hasStatsContent,
    } = useTrackerStats(events, selectedTeamIds);

    useEffect(() => {
        const storedTab = window.localStorage.getItem(TRACKER_ACTION_TAB_STORAGE_KEY);
      const tabIds = ACTION_TABS.map((tab) => tab.id);
      if (storedTab && tabIds.includes(storedTab as TrackerActionTab)) {
        setActionTab(storedTab as TrackerActionTab);
        }
    }, []);

    useEffect(() => {
        window.localStorage.setItem(TRACKER_ACTION_TAB_STORAGE_KEY, actionTab);
    }, [actionTab]);

    useEffect(() => {
        const knownRef = events.find((event) => event.ref)?.ref;
      if (knownRef) {
        syncRefereeFromEvent(knownRef);
      }
    }, [events, syncRefereeFromEvent]);

    function resetTrackerInfos() {
        resetEvents();
        resetClock();
        setActiveCommand(null);
        resetStats();
        clearLiveState();
        setSavedTrackingSignature(null);
      setKickoffShown(false);
      resetMatchInfo();
    }

    useTrackerContextReset({
      matchDay,
      championship,
      sport,
      onContextChangeReset: resetTrackerInfos,
    });

// timer interval
    useEffect(() => {
        let handle: number;
        if (running) {
            handle = window.setInterval(() => setTime((t) => t + 1), 1000);
        }
        return () => {
            if (handle) window.clearInterval(handle);
        };
    }, [running]);

    function handleAddEvent(event: Event) {
        addEvent({ ...event, ref: referee.trim() || undefined });
        setActiveCommand(null);
    }

    function addStatsSummary(halfLabel: string) {
        if (selectedTeams.length !== 2) return;
      const scores = computeScores();
      const summaryEvent = buildStatsSummaryEvent({
        halfLabel,
        halfScore: [scores[0] || 0, scores[1] || 0],
        time,
        currentHalf,
        team1Name: getDisplayTeamLabel(selectedTeams[0]),
        team2Name: getDisplayTeamLabel(selectedTeams[1]),
        displayedPenalties: getDisplayedPenalties(),
        displayedEnAvant: getDisplayedEnAvant(),
        teamTouchePerdue,
        teamMeleePerdue,
        teamTurnover,
        teamJeuAuPied,
      });

      handleAddEvent(summaryEvent);
    }

    const hasTrackingContent =
        time !== 0 ||
        running ||
        currentHalf !== 1 ||
        matchEnded ||
        events.length > 0 ||
        field.trim().length > 0 ||
        referee.trim().length > 0 ||
        hasStatsContent;

    const getTrackingSignature = useCallback(() => {
        return JSON.stringify({
            time,
            running,
            currentHalf,
            matchEnded,
            events,
            field,
            referee,
            matchDate,
            teamPenalties,
            manualPenaltyAdjustments,
            teamEnAvant,
            manualEnAvantAdjustments,
            teamTouchePerdue,
            teamMeleePerdue,
            teamTurnover,
            teamJeuAuPied,
        });
    }, [
        time,
        running,
        currentHalf,
        matchEnded,
        events,
        field,
        referee,
        matchDate,
        teamPenalties,
        manualPenaltyAdjustments,
        teamEnAvant,
        manualEnAvantAdjustments,
        teamTouchePerdue,
        teamMeleePerdue,
        teamTurnover,
        teamJeuAuPied,
    ]);

    function handleResetTracker() {
        const currentSignature = getTrackingSignature();
        const hasUnsavedSynthesis = hasTrackingContent && savedTrackingSignature !== currentSignature;

        if (hasUnsavedSynthesis) {
            const confirmed = window.confirm(
                "La synthèse n'est pas sauvegardée. Voulez-vous réinitialiser quand même ?"
            );
            if (!confirmed) return;
        }

        // Match user expectation: fully reinitialize the page state.
        window.location.reload();
    }

    const buildLiveSnapshot = useCallback((): LiveSnapshot => {
        const displayedPenalties = getDisplayedPenalties();
        const displayedEnAvant = getDisplayedEnAvant();

        return {
            currentTime: time,
            running,
            currentHalf,
            matchEnded,
            events,
            teams: selectedTeams.map((team) => ({ id: team.id, name: team.name, nickname: team.nickname })),
            team1Id,
            team2Id,
            scores: computeScores(),
            penalties: displayedPenalties,
            enAvant: displayedEnAvant,
            touchePerdue: teamTouchePerdue,
            meleePerdue: teamMeleePerdue,
            turnover: teamTurnover,
            jeuAuPied: teamJeuAuPied,
        };
    }, [
        currentHalf,
        events,
        matchEnded,
        running,
        selectedTeams,
        team1Id,
        team2Id,
        teamEnAvant,
        teamMeleePerdue,
        teamPenalties,
        teamTouchePerdue,
        teamTurnover,
        teamJeuAuPied,
        time,
        manualEnAvantAdjustments,
        manualPenaltyAdjustments,
    ]);

    const {
        canPublishLive,
        liveBusy,
        liveMessage,
        livePublicSlug,
        liveViewerUrl,
        activateLivePublic,
        copyLiveViewerUrl,
        closeLivePublic,
        clearLiveState,
    } = useLiveBroadcast({
        selectedTeamsCount: selectedTeams.length,
        team1Id,
        team2Id,
        championship,
        matchDay,
        buildLiveSnapshot,
    });

    function handleTeam1Change(nextTeamId: string) {
        if (nextTeamId !== team1Id) {
            resetTrackerInfos();
        }
        setTeam1Id(nextTeamId);
    }

    function handleTeam2Change(nextTeamId: string) {
        if (nextTeamId !== team2Id) {
            resetTrackerInfos();
        }
        setTeam2Id(nextTeamId);
    }

    function handleResetToInitialState() {
      const confirmed = window.confirm(
        "Revenir à l'état initial ? Cela effacera la préparation et les données du tracker en cours."
      );
      if (!confirmed) return;

      resetTrackerInfos();
      resetPreparationState();
    }

    if (!isTrackerReady) {
        return (
          <TrackerSetupWizard
            championship={championship}
            matchDayLabel={matchDayLabel}
            hasActiveRoster={!!activeRoster}
            teamsForDay={teamsForDay}
            team1Id={team1Id}
            team2Id={team2Id}
            matchDateInput={matchDateInput}
            fieldInput={fieldInput}
            refereeInput={refereeInput}
            top14StadiumOptions={stadiumOptions}
            setupCanSubmit={setupCanSubmit}
            saveMessage={saveMessage}
            onSubmit={handleSetupSubmit}
            onTeam1Change={handleTeam1Change}
            onTeam2Change={handleTeam2Change}
            onMatchDateInputChange={setMatchDateInput}
            onFieldInputChange={setFieldInput}
            onRefereeInputChange={setRefereeInput}
            getDisplayTeamLabel={getDisplayTeamLabel}
          />
        );
    }

    return (
      <main className="sp-page min-h-0 space-y-6 pb-40 xl:pb-10">
        <TrackerHeader
          mobileMatchTitle={mobileMatchTitle}
          desktopMatchTitle={desktopMatchTitle}
          championship={championship}
          matchDayLabel={matchDayLabel}
          formattedMatchDate={formattedMatchDate}
          field={field}
          referee={referee}
          onEditPreparation={() => setIsTrackerReady(false)}
          onResetToInitialState={handleResetToInitialState}
        />

        <TrackerMatchInfoEditor
          isOpen={showMatchInfoEditor}
          matchDateInput={matchDateInput}
          fieldInput={fieldInput}
          refereeInput={refereeInput}
          stadiumOptions={stadiumOptions}
          onClose={() => setShowMatchInfoEditor(false)}
          onSave={() => applyMatchInfo()}
          onMatchDateInputChange={setMatchDateInput}
          onFieldInputChange={setFieldInput}
          onRefereeInputChange={setRefereeInput}
        />

        <TrackerLivePanel
          isVisible={!!account}
          livePublicSlug={livePublicSlug}
          liveViewerUrl={liveViewerUrl}
          canPublishLive={canPublishLive}
          liveBusy={liveBusy}
          liveMessage={liveMessage}
          onActivateLivePublic={activateLivePublic}
          onCopyLiveViewerUrl={copyLiveViewerUrl}
          onCloseLivePublic={closeLivePublic}
        />

        {/* scoreboard showing teams, computed score and timers */}
        {(() => {
          const times = getDisplayTimes();
          const mainTimerText = matchEnded
            ? "Match terminé"
            : formatTime(times.mainTime);
          const secondaryTimerText =
            matchEnded || times.secondaryTime === null
              ? undefined
              : formatTime(times.secondaryTime);
          const scores = computeScores();
          return (
            <Scoreboard
              teams={selectedTeams}
              scores={scores}
              bonuses={computeBonuses(scores)}
              mainTimerText={mainTimerText}
              secondaryTimerText={secondaryTimerText}
              currentTime={time}
              events={events}
            />
          );
        })()}

        <TimerControls
          time={time}
          running={running}
          onStartStop={() =>
            setRunning((currentRunning) => {
              const nextRunning = !currentRunning;
              if (
                !currentRunning &&
                nextRunning &&
                time === 0 &&
                !kickoffShown
              ) {
                setKickoffShown(true);
              }
              return nextRunning;
            })
          }
          onAdjust={adjustTime}
          onReset={handleResetTracker}
          manualTimeInput={manualTimeInput}
          onManualTimeInputChange={setManualTimeInput}
          onApplyManualTime={applyManualTime}
          currentHalf={currentHalf}
          matchEnded={matchEnded}
          onSetFirstHalf={() => {
            setCurrentHalf(1);
            setTime(0);
            setRunning(false);
          }}
          onSetSecondHalf={() => {
            addStatsSummary("MT1");
            setCurrentHalf(2);
            setTime(40 * 60);
            setRunning(false);
          }}
          onEndMatch={() => {
            addStatsSummary("MT2");
            setMatchEnded(true);
            setRunning(false);
          }}
        />
        <TrackerMatchTimeline
          events={events}
          team1Id={team1Id}
          team2Id={team2Id}
          team1Label={
            selectedTeams[0]
              ? getDisplayTeamLabel(selectedTeams[0])
              : "Équipe 1"
          }
          team2Label={
            selectedTeams[1]
              ? getDisplayTeamLabel(selectedTeams[1])
              : "Équipe 2"
          }
        />
        {/* à voir si ce n'est pas trop redondant
        <TrackerMatchEvents
          events={events}
          team1Id={team1Id}
          team2Id={team2Id}
          team1Label={selectedTeams[0] ? getDisplayTeamLabel(selectedTeams[0]) : "Équipe 1"}
          team2Label={selectedTeams[1] ? getDisplayTeamLabel(selectedTeams[1]) : "Équipe 2"}
        />*/}
        <TrackerActionWorkspace
          actionTab={actionTab}
          onActionTabChange={setActionTab}
          activeCommand={activeCommand}
          onActiveCommandChange={setActiveCommand}
          commandTypes={[...COMMAND_TYPES]}
          team1Id={team1Id}
          team2Id={team2Id}
          selectedTeams={selectedTeams}
          time={time}
          currentHalf={currentHalf}
          events={events}
          onAddEvent={handleAddEvent}
          getDisplayTeamLabel={getDisplayTeamLabel}
          displayedPenalties={getDisplayedPenalties()}
          displayedEnAvant={getDisplayedEnAvant()}
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

        <section className="space-y-2">
          <h2 className="font-semibold">Faits de match</h2>
          <div className="max-h-[28rem] overflow-y-auto pr-1">
            <EventsList
              events={matchFactsEvents}
              showKickoff={kickoffShown}
              leftTeamId={team1Id || undefined}
              rightTeamId={team2Id || undefined}
              remove={(displayIndex) =>
                removeEvent(events.length - 1 - displayIndex)
              }
            />
          </div>
        </section>

        <Summary
          events={events}
          currentTime={time}
          teams={selectedTeams}
          matchDay={typeof matchDay === "number" ? matchDay : undefined}
          matchDate={matchDate || undefined}
          matchField={field || undefined}
          matchReferee={referee || undefined}
          onSaved={() => setSavedTrackingSignature(getTrackingSignature())}
        />
      </main>
    );
}
