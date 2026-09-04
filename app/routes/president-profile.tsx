import { Link, useParams } from "react-router";
import { useMemo, useState, type ChangeEvent } from "react";
import { useTeams } from "~/context/TeamsContext";
import { toShortId, findFullId } from "~/utils/shortId";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { getFlagUrl, getCountryByCode, COUNTRIES } from "~/utils/countries";
import type { President } from "~/types/tracker";

export function meta() {
  return [{ title: "Profil président" }];
}

function getRosterBackPath(rosterId: string | null | undefined): string {
  if (!rosterId) return "/roster";
  return `/r/${toShortId(rosterId)}/team`;
}

export default function PresidentProfilePage() {
  const { rosterId: shortRosterId } = useParams();
  const { rosters, setRosters } = useTeams();

  const rosterNames = useMemo(
    () => rosters.map((r) => r.name).filter(Boolean).sort((a, b) => a.localeCompare(b, "fr")),
    [rosters],
  );

  const rosterId = useMemo(
    () => findFullId(shortRosterId, rosters),
    [shortRosterId, rosters],
  );

  const roster = useMemo(
    () => rosters.find((item) => item.id === rosterId) ?? null,
    [rosters, rosterId],
  );

  const presidentData: President | undefined = roster?.presidentData ?? (roster?.president ? { name: roster.president } : undefined);

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<President>({ name: "" });
  const [formMessage, setFormMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  function startEditing() {
    setFormMessage(null);
    setDraft({
      name: presidentData?.name ?? "",
      photoUrl: presidentData?.photoUrl ?? "",
      nationality: presidentData?.nationality ?? "",
      club: presidentData?.club ?? "",
    });
    setIsEditing(true);
  }

  function save() {
    if (!roster) return;
    const trimmedName = draft.name.trim();
    if (!trimmedName) {
      setFormMessage({ type: "error", text: "Le nom est obligatoire." });
      return;
    }
    const updated: President = {
      name: trimmedName,
      photoUrl: draft.photoUrl?.trim() || undefined,
      nationality: draft.nationality || undefined,
      club: draft.club?.trim() || undefined,
    };
    setRosters((current) =>
      current.map((item) =>
        item.id === roster.id
          ? { ...item, president: updated.name, presidentData: updated }
          : item,
      ),
    );
    setIsEditing(false);
    setFormMessage({ type: "success", text: "Président mis à jour." });
    setTimeout(() => setFormMessage(null), 3000);
  }

  async function handlePhotoUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setDraft((d) => ({ ...d, photoUrl: result }));
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  }

  const backPath = getRosterBackPath(rosterId);

  if (!roster) {
    return (
      <main className="sp-page space-y-4">
        <h1 className="text-2xl font-bold">Profil président introuvable</h1>
        <Link to="/roster" className="sp-link-muted">
          <FontAwesomeIcon icon={faArrowLeft} className="text-xs mr-1" />
          Retour aux effectifs
        </Link>
      </main>
    );
  }

  if (!presidentData) {
    return (
      <main className="sp-page space-y-4">
        <h1 className="text-2xl font-bold">Aucun président renseigné</h1>
        <p className="text-sm text-neutral-400">Effectif : {roster.name}</p>
        <Link to={backPath} className="sp-link-muted">
          <FontAwesomeIcon icon={faArrowLeft} className="text-xs mr-1" />
          Retour à l'effectif
        </Link>
      </main>
    );
  }

  return (
    <main className="sp-page space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{presidentData.name}</h1>
        <p className="text-sm text-neutral-400">Président — {roster.name}</p>
        <Link to={backPath} className="sp-link-muted">
          <FontAwesomeIcon icon={faArrowLeft} className="text-xs mr-1" />
          Retour à l'effectif
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:items-start">
        <section className="sp-panel space-y-3 md:col-span-2">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-semibold">Informations</h2>
            {!isEditing && (
              <button
                type="button"
                className="sp-button sp-button-xs sp-button-indigo"
                onClick={startEditing}
              >
                Modifier
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-3">
              <div className="sp-input-shell">
                <label className="sp-input-label" htmlFor="presidentName">Nom</label>
                <input
                  id="presidentName"
                  className="sp-input-control"
                  value={draft.name}
                  onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                />
              </div>
              <div className="sp-input-shell">
                <label className="sp-input-label" htmlFor="presidentNationality">Nationalité</label>
                <select
                  id="presidentNationality"
                  className="sp-input-control"
                  value={draft.nationality ?? ""}
                  onChange={(e) => setDraft((d) => ({ ...d, nationality: e.target.value }))}
                >
                  <option value="">— Non renseignée —</option>
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="sp-input-shell">
                <label className="sp-input-label" htmlFor="presidentClub">Club</label>
                <select
                  id="presidentClub"
                  className="sp-input-control"
                  value={draft.club ?? ""}
                  onChange={(e) => setDraft((d) => ({ ...d, club: e.target.value }))}
                >
                  <option value="">— Non renseigné —</option>
                  {rosterNames.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
              <div className="sp-input-shell">
                <label className="sp-input-label" htmlFor="presidentPhotoUrl">Photo (URL)</label>
                <input
                  id="presidentPhotoUrl"
                  className="sp-input-control"
                  placeholder="https://..."
                  value={draft.photoUrl ?? ""}
                  onChange={(e) => setDraft((d) => ({ ...d, photoUrl: e.target.value }))}
                />
              </div>
              <div className="sp-input-shell">
                <label className="sp-input-label" htmlFor="presidentPhotoFile">Téléverser une photo</label>
                <input
                  id="presidentPhotoFile"
                  type="file"
                  accept="image/*"
                  className="sp-input-control"
                  onChange={handlePhotoUpload}
                />
              </div>
              <div className="flex items-center gap-2">
                <button type="button" className="sp-button sp-button-xs sp-button-blue" onClick={save}>
                  Enregistrer
                </button>
                <button
                  type="button"
                  className="sp-button sp-button-xs sp-button-light"
                  onClick={() => { setIsEditing(false); setFormMessage(null); }}
                >
                  Annuler
                </button>
              </div>
              {formMessage && (
                <p className={`text-sm ${formMessage.type === "error" ? "text-red-400" : "text-emerald-400"}`}>
                  {formMessage.text}
                </p>
              )}
            </div>
          ) : (
            <>
              <p className="text-sm text-neutral-200">
                <strong>Nom :</strong> {presidentData.name}
              </p>
              {presidentData.nationality && (() => {
                const country = getCountryByCode(presidentData.nationality!);
                return (
                  <p className="text-sm text-neutral-200 flex items-center gap-1.5">
                    <strong>Nationalité :</strong>
                    <img
                      src={getFlagUrl(presidentData.nationality!)}
                      alt={country?.name ?? presidentData.nationality!}
                      width={16}
                      height={12}
                      className="inline-block"
                    />
                    {country?.name ?? presidentData.nationality}
                  </p>
                );
              })()}
              <p className="text-sm text-neutral-200">
                <strong>Club :</strong> {presidentData.club || roster.name}
              </p>
            </>
          )}
        </section>

        {presidentData.photoUrl && !isEditing && (
          <aside className="md:col-span-1 md:justify-self-end w-full md:w-auto">
            <img
              src={presidentData.photoUrl}
              alt={`Photo de ${presidentData.name}`}
              className="mx-auto md:mx-0 h-auto w-full max-w-[10rem] md:max-w-full rounded-md border border-neutral-700 bg-neutral-900/40 object-cover"
            />
          </aside>
        )}
      </div>
    </main>
  );
}
