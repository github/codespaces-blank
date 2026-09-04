import { useState } from "react";
import { Link, useLoaderData } from "react-router";
import { getConnectedAccountFromRequest, listAdminAccounts } from "~/utils/account.server";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faChevronLeft } from "@fortawesome/free-solid-svg-icons";

interface AdminAccountItem {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export function meta() {
  return [{ title: "Administration comptes" }];
}

export async function loader({ request }: { request: Request }) {
  const account = await getConnectedAccountFromRequest(request);
  if (!account) {
    throw new Response("Unauthorized", { status: 401 });
  }
  if (!account.isAdmin) {
    throw new Response("Forbidden", { status: 403 });
  }

  const accounts = await listAdminAccounts();
  return {
    adminId: account.id,
    accounts,
  };
}

export default function AdminAccountsPage() {
  const data = useLoaderData<typeof loader>();
  const [accounts, setAccounts] = useState<AdminAccountItem[]>(() => data.accounts ?? []);
  const [passwordDraft, setPasswordDraft] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<"pending" | "approved">("pending");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const pendingAccounts = accounts.filter((item) => !item.isApproved);
  const approvedAccounts = accounts.filter((item) => item.isApproved);
  const visibleAccounts = activeTab === "pending" ? pendingAccounts : approvedAccounts;

  async function refreshAccounts() {
    const response = await fetch("/api/admin/accounts");
    const payload = (await response.json()) as { accounts?: AdminAccountItem[] };
    setAccounts(payload.accounts ?? []);
  }

  async function updateAccount(item: AdminAccountItem) {
    setBusy(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/admin/accounts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountId: item.id,
          name: item.name,
          email: item.email,
          isAdmin: item.isAdmin,
          isApproved: item.isApproved,
          password: passwordDraft[item.id]?.trim() ? passwordDraft[item.id] : undefined,
        }),
      });
      const payload = (await response.json()) as { ok?: boolean };
      if (!response.ok || !payload.ok) {
        setError("Impossible de mettre à jour ce compte.");
        return;
      }

      await refreshAccounts();
      setPasswordDraft((prev) => ({ ...prev, [item.id]: "" }));
      setMessage("Compte mis à jour.");
    } catch {
      setError("Impossible de mettre à jour ce compte.");
    } finally {
      setBusy(false);
    }
  }

  async function deleteAccount(accountId: string) {
    if (accountId === data.adminId) {
      setError("Impossible de supprimer votre propre compte admin.");
      return;
    }

    const confirmed = window.confirm("Supprimer ce compte ?");
    if (!confirmed) return;

    setBusy(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/admin/accounts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId }),
      });
      const payload = (await response.json()) as { ok?: boolean };
      if (!response.ok || !payload.ok) {
        setError("Impossible de supprimer ce compte.");
        return;
      }

      await refreshAccounts();
      setMessage("Compte supprimé.");
    } catch {
      setError("Impossible de supprimer ce compte.");
    } finally {
      setBusy(false);
    }
  }

  async function approveAccount(item: AdminAccountItem) {
    setBusy(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/admin/accounts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountId: item.id,
          isApproved: true,
        }),
      });
      const payload = (await response.json()) as { ok?: boolean };
      if (!response.ok || !payload.ok) {
        setError("Impossible de valider ce compte.");
        return;
      }

      await refreshAccounts();
      setMessage("Compte validé avec succès.");
    } catch {
      setError("Impossible de valider ce compte.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="sp-page space-y-4">
      <h1 className="text-2xl font-bold">Administration des comptes</h1>
      <p className="text-sm text-neutral-300">Visible uniquement pour le compte admin connecté.</p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("pending")}
          className={`px-3 py-2 rounded border text-sm font-medium transition-colors ${
            activeTab === "pending"
              ? "border-amber-500 bg-amber-500/20 text-amber-300"
              : "border-neutral-700 bg-neutral-900 text-neutral-300 hover:bg-neutral-800"
          }`}
        >
          À valider ({pendingAccounts.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("approved")}
          className={`px-3 py-2 rounded border text-sm font-medium transition-colors ${
            activeTab === "approved"
              ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
              : "border-neutral-700 bg-neutral-900 text-neutral-300 hover:bg-neutral-800"
          }`}
        >
          Validés ({approvedAccounts.length})
        </button>
      </div>

      <ul className="space-y-3">
        {visibleAccounts.map((item) => (
          <li key={item.id} className="sp-panel-compact space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs text-neutral-400">ID: {item.id}</p>
              <span
                className={`text-xs px-2 py-1 rounded-full border ${
                  item.isApproved
                    ? "bg-emerald-900/50 text-emerald-300 border-emerald-700"
                    : "bg-amber-900/50 text-amber-300 border-amber-700"
                }`}
              >
                {item.isApproved ? "Validé" : "En attente"}
              </span>
            </div>
            <div className="sp-input-shell">
              <label className="sp-input-label" htmlFor={`adminName-${item.id}`}>Nom</label>
              <input
                id={`adminName-${item.id}`}
                type="text"
                value={item.name}
                onChange={(event) =>
                  setAccounts((prev) =>
                    prev.map((entry) =>
                      entry.id === item.id ? { ...entry, name: event.target.value } : entry
                    )
                  )
                }
                className="sp-input-control"
              />
            </div>
            <div className="sp-input-shell">
              <label className="sp-input-label" htmlFor={`adminEmail-${item.id}`}>Email</label>
              <input
                id={`adminEmail-${item.id}`}
                type="email"
                value={item.email}
                onChange={(event) =>
                  setAccounts((prev) =>
                    prev.map((entry) =>
                      entry.id === item.id ? { ...entry, email: event.target.value } : entry
                    )
                  )
                }
                className="sp-input-control"
              />
            </div>
            <div className="sp-input-shell">
              <label className="sp-input-label" htmlFor={`adminPassword-${item.id}`}>Nouveau mot de passe</label>
              <input
                id={`adminPassword-${item.id}`}
                type="password"
                value={passwordDraft[item.id] ?? ""}
                onChange={(event) =>
                  setPasswordDraft((prev) => ({
                    ...prev,
                    [item.id]: event.target.value,
                  }))
                }
                placeholder="Optionnel"
                className="sp-input-control"
              />
            </div>
            <label className="text-sm flex items-center gap-2">
              <input
                type="checkbox"
                checked={item.isAdmin}
                onChange={(event) =>
                  setAccounts((prev) =>
                    prev.map((entry) =>
                      entry.id === item.id ? { ...entry, isAdmin: event.target.checked } : entry
                    )
                  )
                }
              />
              Admin
            </label>
            <div className="flex gap-2">
              {item.isApproved && (
                <button
                  onClick={() => updateAccount(item)}
                  disabled={busy}
                  className="sp-button sp-button-sm sp-button-amber flex-1"
                >
                  Mettre à jour
                </button>
              )}
              {!item.isApproved && (
                <button
                  onClick={() => approveAccount(item)}
                  disabled={busy}
                  className="sp-button sp-button-sm sp-button-emerald flex-1"
                >
                  Valider le compte
                </button>
              )}
              <button
                onClick={() => deleteAccount(item.id)}
                disabled={busy || item.id === data.adminId}
                className="sp-button sp-button-sm sp-button-red flex-1"
              >
                Supprimer
              </button>
            </div>
          </li>
        ))}
      </ul>

      {visibleAccounts.length === 0 && (
        <p className="text-sm text-neutral-400">
          {activeTab === "pending" ? "Aucun compte en attente de validation." : "Aucun compte validé."}
        </p>
      )}

      {message && <p className="text-sm text-green-400">{message}</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}

      <Link to="/account" className="sp-link-muted">
        <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
        Retour aux réglages
      </Link>
    </main>
  );
}
