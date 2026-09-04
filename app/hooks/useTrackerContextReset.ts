import { useEffect, useRef } from "react";

interface UseTrackerContextResetParams {
  matchDay: string | number;
  championship: string;
  sport: string;
  onContextChangeReset: () => void;
}

export function useTrackerContextReset({
  matchDay,
  championship,
  sport,
  onContextChangeReset,
}: UseTrackerContextResetParams) {
  const contextInitializedRef = useRef(false);
  const prevContextRef = useRef<{ matchDay: string | number; championship: string; sport: string } | null>(null);

  useEffect(() => {
    if (!contextInitializedRef.current) {
      // Premier rendu : on mémorise le contexte initial sans réinitialiser.
      contextInitializedRef.current = true;
      prevContextRef.current = { matchDay, championship, sport };
      return;
    }

    const prev = prevContextRef.current;
    if (!prev) {
      prevContextRef.current = { matchDay, championship, sport };
      return;
    }

    const contextChanged =
      prev.matchDay !== matchDay ||
      prev.championship !== championship ||
      prev.sport !== sport;

    // Si matchDay précédent est vide, c'est le chargement initial depuis le serveur,
    // pas un vrai changement de contexte de l'utilisateur.
    if (contextChanged && prev.matchDay !== "") {
      onContextChangeReset();
    }

    prevContextRef.current = { matchDay, championship, sport };
  }, [matchDay, championship, sport, onContextChangeReset]);
}
