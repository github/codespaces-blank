import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { LiveSnapshot } from "~/types/live";

interface UseLiveBroadcastParams {
  selectedTeamsCount: number;
  team1Id: string;
  team2Id: string;
  championship: string;
  matchDay: string | number;
  buildLiveSnapshot: () => LiveSnapshot;
}

export function useLiveBroadcast({
  selectedTeamsCount,
  team1Id,
  team2Id,
  championship,
  matchDay,
  buildLiveSnapshot,
}: UseLiveBroadcastParams) {
  const [liveMatchId, setLiveMatchId] = useState<string | null>(null);
  const [livePublicSlug, setLivePublicSlug] = useState<string | null>(null);
  const [liveAdminToken, setLiveAdminToken] = useState<string | null>(null);
  const [liveMessage, setLiveMessage] = useState("");
  const [liveBusy, setLiveBusy] = useState(false);
  const publishTimerRef = useRef<number | null>(null);

  const canPublishLive =
    selectedTeamsCount === 2 && Boolean(team1Id) && Boolean(team2Id) && team1Id !== team2Id;

  const liveViewerUrl = useMemo(() => {
    if (!livePublicSlug || typeof window === "undefined") return "";
    return `${window.location.origin}/live/${livePublicSlug}`;
  }, [livePublicSlug]);

  const clearLiveState = useCallback(() => {
    setLiveMatchId(null);
    setLivePublicSlug(null);
    setLiveAdminToken(null);
    setLiveMessage("");
    setLiveBusy(false);
  }, []);

  async function activateLivePublic() {
    if (!canPublishLive) {
      setLiveMessage("Sélectionnez deux équipes différentes pour activer le live.");
      return;
    }

    if (liveMatchId && liveAdminToken && livePublicSlug) {
      setLiveMessage("Le live public est déjà actif.");
      return;
    }

    setLiveBusy(true);
    try {
      const response = await fetch("/api/live-matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          championship,
          matchDay: typeof matchDay === "number" ? matchDay : parseInt(matchDay || "", 10),
          state: buildLiveSnapshot(),
        }),
      });

      const data = await response.json();
      if (!response.ok || !data?.ok) {
        setLiveMessage("Impossible d'activer le live public.");
        return;
      }

      setLiveMatchId(data.matchId);
      setLivePublicSlug(data.publicSlug);
      setLiveAdminToken(data.adminToken);
      setLiveMessage("Live public activé.");
    } catch {
      setLiveMessage("Impossible d'activer le live public.");
    } finally {
      setLiveBusy(false);
    }
  }

  const publishLiveSnapshot = useCallback(async () => {
    if (!liveMatchId || !liveAdminToken || !canPublishLive) return;

    try {
      await fetch(`/api/live-matches/${liveMatchId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-live-admin-token": liveAdminToken,
        },
        body: JSON.stringify({ state: buildLiveSnapshot() }),
      });
    } catch {
      // Keep tracker usable even if publication fails temporarily.
    }
  }, [liveMatchId, liveAdminToken, canPublishLive, buildLiveSnapshot]);

  useEffect(() => {
    if (!liveMatchId || !liveAdminToken || !canPublishLive) return;

    if (publishTimerRef.current) {
      window.clearTimeout(publishTimerRef.current);
    }

    publishTimerRef.current = window.setTimeout(() => {
      void publishLiveSnapshot();
    }, 350);

    return () => {
      if (publishTimerRef.current) {
        window.clearTimeout(publishTimerRef.current);
        publishTimerRef.current = null;
      }
    };
  }, [liveMatchId, liveAdminToken, canPublishLive, publishLiveSnapshot]);

  async function copyLiveViewerUrl() {
    if (!liveViewerUrl) return;
    try {
      await navigator.clipboard.writeText(liveViewerUrl);
      setLiveMessage("Lien spectateur copié.");
    } catch {
      setLiveMessage("Impossible de copier le lien.");
    }
  }

  async function closeLivePublic() {
    if (!liveMatchId || !liveAdminToken) return;

    const confirmed = window.confirm("Fermer la diffusion live pour les spectateurs ?");
    if (!confirmed) return;

    setLiveBusy(true);
    try {
      const response = await fetch(`/api/live-matches/${liveMatchId}/close`, {
        method: "POST",
        headers: {
          "x-live-admin-token": liveAdminToken,
        },
      });
      const data = await response.json();
      if (!response.ok || !data?.ok) {
        setLiveMessage("Impossible de fermer le live.");
        return;
      }

      setLiveMatchId(null);
      setLivePublicSlug(null);
      setLiveAdminToken(null);
      setLiveMessage("Live fermé.");
    } catch {
      setLiveMessage("Impossible de fermer le live.");
    } finally {
      setLiveBusy(false);
    }
  }

  return {
    canPublishLive,
    liveBusy,
    liveMessage,
    livePublicSlug,
    liveViewerUrl,
    activateLivePublic,
    copyLiveViewerUrl,
    closeLivePublic,
    clearLiveState,
  };
}
