import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleStop, faClipboard, faEye } from "@fortawesome/free-regular-svg-icons";

interface TrackerLivePanelProps {
  isVisible: boolean;
  livePublicSlug: string | null;
  liveViewerUrl: string;
  canPublishLive: boolean;
  liveBusy: boolean;
  liveMessage: string;
  onActivateLivePublic: () => void;
  onCopyLiveViewerUrl: () => void;
  onCloseLivePublic: () => void;
}

export default function TrackerLivePanel({
  isVisible,
  livePublicSlug,
  liveViewerUrl,
  canPublishLive,
  liveBusy,
  liveMessage,
  onActivateLivePublic,
  onCopyLiveViewerUrl,
  onCloseLivePublic,
}: TrackerLivePanelProps) {
  if (!isVisible) return null;

  return (
    <section className="sp-panel-compact space-y-2">
      <p className="text-sm text-neutral-300">Diffusion externe en lecture seule</p>
      {!livePublicSlug ? (
        <button
          className="sp-button sp-button-md sp-button-full sp-button-indigo"
          onClick={onActivateLivePublic}
          disabled={!canPublishLive || liveBusy}
        >
          <FontAwesomeIcon icon={faEye} className="sm:mr-2" />
          {liveBusy ? "Activation..." : "Activer le live public"}
        </button>
      ) : (
        <>
          <p className="text-xs break-all text-neutral-200">{liveViewerUrl}</p>
          <button
            className="sp-button sp-button-md sp-button-full sp-button-blue"
            onClick={onCopyLiveViewerUrl}
          >
            <FontAwesomeIcon icon={faClipboard} className="sm:mr-2" />
            Copier le lien spectateur
          </button>
          <button
            className="sp-button sp-button-md sp-button-full sp-button-red"
            onClick={onCloseLivePublic}
            disabled={liveBusy}
          >
            <FontAwesomeIcon icon={faCircleStop} className="sm:mr-2" />
            Arrêter le live
          </button>
        </>
      )}
      {!canPublishLive && !livePublicSlug && (
        <p className="text-xs text-neutral-400">Sélectionne deux équipes différentes pour activer le live.</p>
      )}
      {liveMessage && <p className="text-sm text-green-700">{liveMessage}</p>}
    </section>
  );
}
