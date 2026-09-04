import { useTeams } from "~/context/TeamsContext";
import { useAccount } from "~/context/AccountContext";
import logoSP from "~/assets/images/logo match reporter.png";
import { useState } from "react";
import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";

export const worldSeriesStages = [
  "Dubai", "Cape Town", "Singapour", "Perth",
  "Vancouver", "New York", "Hong Kong", "Valladolid", "Bordeaux",
] as const;

export function Welcome() {
  const { account, connected, logout } = useAccount();
  const { matchDay, season, sport, championship, setMatchDay, setSeason, setSport, setChampionship } = useTeams();
  const [successMessage, setSuccessMessage] = useState("");
  const [accountMessage, setAccountMessage] = useState("");

  const sportOptions = ["Rugby", "Football"] as const;
  const championshipOptions = ["Top 14", "Pro D2", "Elite 1", "Women's Six Nations", "World Series"] as const;
  const seasonOptions = ["2026/2027", "2025/2026", "2024/2025", "2023/2024"] as const;

  const isWorldSeries = championship === "World Series";

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSuccessMessage("Formulaire validé avec succès.");
  }

  async function handleLogout() {
    try {
      await logout();
      setAccountMessage("Déconnexion effectuée.");
    } catch {
      setAccountMessage("Impossible de se déconnecter.");
    }
  }

  return (
    <main className="relative flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden px-4 pt-4 pb-[calc(6.5rem+env(safe-area-inset-bottom))] sm:pt-5 sm:pb-[calc(6.75rem+env(safe-area-inset-bottom))] lg:pt-6 xl:pt-8">
      <div className="absolute inset-x-4 top-4 z-20 flex flex-row items-start justify-between gap-2">
        {!connected && (
          <p className="w-fit max-w-[55%] rounded border border-amber-700/60 bg-amber-900/40 px-3 py-1 text-[11px] text-amber-200">
            Mode invité: les données sont conservées 24h.
          </p>
        )}
        <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
          {connected && account ? (
              <button
                type="button"
                onClick={handleLogout}
                className="sp-button sp-button-xs sp-button-red"
              >
                Déconnexion
              </button>
          ) : (
            <>
              <Link
                to="/account#switch-account"
                className="sp-button sp-button-xs sp-button-blue"
              >
                Se connecter
              </Link>
              <Link
                to="/account#create-account"
                className="sp-button sp-button-xs sp-button-green"
              >
                <FontAwesomeIcon icon={faCircleUser} className="sm:mr-2" />
                Créer un compte
              </Link>
            </>
          )}
        </div>
      </div>
      <div className="flex w-full flex-1 flex-col items-center justify-center gap-3 min-h-0">
        <header className="flex w-full flex-col items-center gap-3 pt-0 sm:pt-1 lg:pt-2">
            <div className="mx-auto w-full max-w-[720px] px-2 sm:px-3 lg:max-w-[820px]">
            <img
              src={logoSP}
              alt="Sidepitcher Logo"
              className="mx-auto block w-full max-h-[13vh] object-contain sm:max-h-[15vh] lg:max-h-[17vh]"
            />
          </div>
          {/* reglages de journee/championnat */}
          <form className="mx-auto mb-0 w-full max-w-sm space-y-1.5 px-2 text-left sm:w-11/12 md:w-full lg:mb-0" onSubmit={handleSubmit}>
            <div className="sp-input-shell">
              <label className="sp-input-label" htmlFor="sportSelect">Sport</label>
              <select
                id="sportSelect"
                className="sp-input-control"
                value={sport}
                onChange={(e) =>
                  setSport(e.target.value as "Rugby" | "Football")
                }
              >
                {sportOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="sp-input-shell">
              <label className="sp-input-label" htmlFor="championshipSelect">Championnat</label>
              <select
                id="championshipSelect"
                className="sp-input-control"
                value={championship}
                onChange={(e) => {
                  setChampionship(e.target.value as "Top 14" | "Pro D2" | "Elite 1" | "Women's Six Nations" | "World Series");
                  setMatchDay("");
                }}
              >
                {championshipOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            {isWorldSeries ? (
              <div className="sp-input-shell">
                <label className="sp-input-label" htmlFor="worldSeriesStageSelect">Étape</label>
                <select
                  id="worldSeriesStageSelect"
                  className="sp-input-control"
                  value={matchDay}
                  onChange={(e) => setMatchDay(e.target.value)}
                >
                  <option value="">— Sélectionner une étape —</option>
                  {worldSeriesStages.map((stage) => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="sp-input-shell">
                <label className="sp-input-label" htmlFor="matchDayInput">Journée</label>
                <input
                  id="matchDayInput"
                  type="text"
                  className="sp-input-control"
                  value={matchDay}
                  onChange={(e) => setMatchDay(e.target.value)}
                  placeholder="ex. 1"
                />
              </div>
            )}
            <div className="sp-input-shell">
              <label className="sp-input-label" htmlFor="seasonSelect">Saison</label>
              <select
                id="seasonSelect"
                className="sp-input-control"
                value={season}
                onChange={(e) => setSeason(e.target.value)}
              >
                {seasonOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="sp-button sp-button-md sp-button-full sp-button-blue"
            >
              Valider
            </button>
            {successMessage && <p className="text-sm text-green-400">{successMessage}</p>}
            {accountMessage && <p className="text-sm text-neutral-300">{accountMessage}</p>}
          </form>
        </header>
      </div>
      <footer className="shrink-0 px-4 pt-2 pb-1 text-center text-[10px] uppercase tracking-wide text-neutral-600 sm:pt-3">
          © {new Date().getFullYear()} Match Reporter
      </footer>
    </main>
  );
};
