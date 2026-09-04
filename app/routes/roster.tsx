import type { Route } from "./+types/roster";
import RosterManager from "~/components/RosterManager";
import { useTeams } from "~/context/TeamsContext";
import { useAccount } from "~/context/AccountContext";

export function meta({}: Route.MetaArgs) {
    return [{ title: "Effectifs" }];
}

export default function RosterPage() {
    const {
        rosters,
        teams,
        activeRosterId,
        setRosters,
        setTeams,
        setActiveRosterId,
        matchDay,
        championship,
    } = useTeams();

    const normalizedMatchDay = matchDay.trim();
    const parsedMatchDay = normalizedMatchDay.match(/^J?\s*(\d+)$/i);
    const matchDayLabel = parsedMatchDay ? `J${parsedMatchDay[1]}` : normalizedMatchDay;

    return (
        <main className="sp-page">
            <h1 className="leading-[0.95] font-bold tracking-[-0.03em] text-4xl text-center text-white">Effectifs</h1>
            <p className="text-foreground max-w-3xl text-base font-light text-white text-balance sm:text-lg text-center mx-auto mb-8">
                {matchDayLabel && <>{matchDayLabel} — </>}
                Championnat : {championship}
            </p>
            <RosterManager
                rosters={rosters}
                teams={teams}
                activeRosterId={activeRosterId}
                setRosters={setRosters}
                setTeams={setTeams}
                setActiveRosterId={setActiveRosterId}
            />
        </main>
    );
}
