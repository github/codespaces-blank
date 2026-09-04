import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRotateLeft, faPenToSquare, faTrophy } from "@fortawesome/free-solid-svg-icons";
import { faCalendarDays, faHouse, faUser } from "@fortawesome/free-regular-svg-icons";

interface TrackerHeaderProps {
  mobileMatchTitle: string;
  desktopMatchTitle: string;
  championship: string;
  matchDayLabel: string;
  formattedMatchDate: string;
  field: string;
  referee: string;
  onEditPreparation: () => void;
  onResetToInitialState: () => void;
}

export default function TrackerHeader({
  mobileMatchTitle,
  desktopMatchTitle,
  championship,
  matchDayLabel,
  formattedMatchDate,
  field,
  referee,
  onEditPreparation,
  onResetToInitialState,
}: TrackerHeaderProps) {
  return (
    <>
      <h1 className="leading-[0.95] font-bold tracking-[-0.03em] text-4xl text-center text-white">
        <span className="lg:hidden">{mobileMatchTitle}</span>
        <span className="hidden lg:inline">{desktopMatchTitle}</span>
      </h1>
      <p className="text-foreground max-w-3xl text-base font-light text-white text-balance sm:text-lg text-center mx-auto">
        <FontAwesomeIcon icon={faTrophy} className="sm:mr-1 mr-2" />
        {championship} {matchDayLabel && <> — {matchDayLabel}</>}
        <FontAwesomeIcon icon={faCalendarDays} className="sm:ml-2 sm:mr-1 ml-4 mr-2" />{" "}
        {formattedMatchDate || ""}
        <FontAwesomeIcon icon={faHouse} className="sm:ml-2 sm:mr-1 ml-4 mr-2" />{" "}
        {field || "—"}
        <FontAwesomeIcon icon={faUser} className="sm:ml-2 sm:mr-1 ml-4 mr-2" />{" "}
        {referee || "—"}
        <button
          type="button"
          className="group sp-button sp-button-md sp-button-yellow ml-4 md:ml-2"
          onClick={onEditPreparation}
          aria-label="Modifier la préparation"
          title="Modifier la préparation"
        >
          <FontAwesomeIcon icon={faPenToSquare} className="sm:mr-2" />
          <span className="hidden sm:inline">Modifier</span>
        </button>
        <button
          type="button"
          className="group sp-button sp-button-md sp-button-red ml-2"
          onClick={onResetToInitialState}
          aria-label="Réinitialiser"
          title="Réinitialiser"
        >
          <FontAwesomeIcon icon={faArrowRotateLeft} className="sm:mr-2" />
          <span className="hidden sm:inline">Réinitialiser</span>
        </button>
      </p>
      <div className="max-w-3xl mx-auto mb-8"></div>
    </>
  );
}
