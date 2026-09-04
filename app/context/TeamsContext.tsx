import React, { createContext, useContext, useState, useEffect } from "react";
import type { Team, Player, Roster } from "~/types/tracker";
import { CURRENT_SEASON } from "~/types/tracker";
import { v4 as uuidv4 } from "uuid";
import { useAccount } from "~/context/AccountContext";

interface TeamsContextValue {
    rosters: Roster[];
    teams: Team[]; // all teams across rosters
    activeRosterId: string | null;
    matchDay: string;
    season: string;
    sport: 'Rugby' | 'Football';
    championship: 'Top 14' | 'Pro D2' | 'Elite 1' | 'Women\'s Six Nations' | 'World Series';
    setRosters: React.Dispatch<React.SetStateAction<Roster[]>>;
    setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
    setActiveRosterId: React.Dispatch<React.SetStateAction<string | null>>;
    setMatchDay: React.Dispatch<React.SetStateAction<string>>;
    setSeason: React.Dispatch<React.SetStateAction<string>>;
    setSport: React.Dispatch<React.SetStateAction<'Rugby' | 'Football'>>;
    setChampionship: React.Dispatch<React.SetStateAction<'Top 14' | 'Pro D2' | 'Elite 1' | 'Women\'s Six Nations' | 'World Series'>>;
}

const TeamsContext = createContext<TeamsContextValue | null>(null);

export function TeamsProvider({ children }: { children: React.ReactNode }) {
    const { account, loading: accountLoading } = useAccount();
    const [rosters, setRosters] = useState<Roster[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [activeRosterId, setActiveRosterId] = useState<string | null>(null);
    const [matchDay, setMatchDay] = useState<string>('');
    const [season, setSeason] = useState<string>(CURRENT_SEASON);
    const [sport, setSport] = useState<'Rugby' | 'Football'>('Rugby');
    const [championship, setChampionship] = useState<'Top 14' | 'Pro D2' | 'Elite 1' | 'Women\'s Six Nations' | 'World Series'>('Top 14');

    const lastSent = React.useRef<{
        rosters: Roster[];
        teams: Team[];
        activeId: string | null;
        matchDay: string;
        season: string;
        sport: 'Rugby' | 'Football';
        championship: 'Top 14' | 'Pro D2' | 'Elite 1' | 'Women\'s Six Nations' | 'World Series';
    } | null>(null);

  // load from backend on mount
    useEffect(() => {
        if (accountLoading) return;

        lastSent.current = null;
        fetch("/api/rosters")
        .then((r) => r.json())
        .then((data) => {
            setRosters(data.rosters || []);
            setTeams(data.teams || []);
            setActiveRosterId(data.activeRosterId || null);
            setMatchDay(data.matchDay || '');
            setSeason(data.season || CURRENT_SEASON);
            setSport(data.sport || 'Rugby');
            setChampionship(data.championship || 'Top 14');
        })
        .catch(() => {
            // ignore
        });
    }, [account?.id, accountLoading]);

    // sync to backend whenever anything changes
    useEffect(() => {
        if (accountLoading) {
            return;
        }

        if (
        rosters.length === 0 &&
        teams.length === 0 &&
        activeRosterId == null &&
        matchDay === '' &&
        season === CURRENT_SEASON &&
        sport === 'Rugby' &&
        championship === 'Top 14'
        ) {
        return;
        }
        if (
        lastSent.current &&
        lastSent.current.activeId === activeRosterId &&
        lastSent.current.matchDay === matchDay &&
        lastSent.current.season === season &&
        lastSent.current.sport === sport &&
        lastSent.current.championship === championship &&
        JSON.stringify(lastSent.current.rosters) === JSON.stringify(rosters) &&
        JSON.stringify(lastSent.current.teams) === JSON.stringify(teams)
        ) {
        return;
        }

        fetch("/api/rosters", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            rosters,
            teams,
            activeRosterId,
            matchDay,
            season,
            sport,
            championship,
        }),
        })
        .then((res) => {
            if (res.ok) {
                lastSent.current = {
                    rosters,
                    teams,
                    activeId: activeRosterId,
                    matchDay,
                    season,
                    sport,
                    championship,
                };
            } else {
                res.json().then((data) => console.warn("[TeamsContext] sync rejected:", data)).catch(() => {});
            }
        })
        .catch((err) => {
            console.warn("[TeamsContext] sync failed:", err);
        });
    }, [rosters, teams, activeRosterId, matchDay, season, sport, championship, accountLoading]);

    return (
        <TeamsContext.Provider
        value={{
            rosters,
            teams,
            activeRosterId,
            matchDay,
            season,
            sport,
            championship,
            setRosters,
            setTeams,
            setActiveRosterId,
            setMatchDay,
            setSeason,
            setSport,
            setChampionship,
        }}
        >
        {children}
        </TeamsContext.Provider>
    );
}

export function useTeams() {
    const ctx = useContext(TeamsContext);
    if (!ctx) {
        throw new Error("useTeams must be used within a TeamsProvider");
    }
    return ctx;
}
