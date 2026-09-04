import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAccount } from "~/context/AccountContext";

export function meta() {
  return [{ title: "Réglages" }];
}

export default function SettingsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { account, connected, loading, refreshAccount, logout } = useAccount();
  const [authMode, setAuthMode] = useState<"create" | "login">("login");
  const [renameName, setRenameName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profileCurrentPassword, setProfileCurrentPassword] = useState("");
  const [profilePassword, setProfilePassword] = useState("");
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [resetPasswordConfirm, setResetPasswordConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const resetToken = new URLSearchParams(location.search).get("resetToken")?.trim() ?? "";

  useEffect(() => {
    setRenameName(account?.name ?? "");
  }, [account?.id, account?.name]);

  useEffect(() => {
    if (connected) return;
    if (location.hash === "#create-account") {
      setAuthMode("create");
      return;
    }
    if (location.hash === "#reset-password") {
      setAuthMode("login");
      return;
    }
    if (location.hash === "#switch-account") {
      setAuthMode("login");
    }
  }, [connected, location.hash]);

  useEffect(() => {
    setProfileEmail(account?.email ?? "");
    setProfileCurrentPassword("");
    setProfilePassword("");
  }, [account?.id, account?.email]);

  async function createNewAccount() {
    if (!newName.trim() || !newEmail.trim() || !newPassword) {
      setError("Renseigne nom, email et mot de passe.");
      return;
    }

    setBusy(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intent: "create",
          name: newName,
          email: newEmail,
          password: newPassword,
        }),
      });

      const data = (await response.json()) as { ok?: boolean };

      if (!response.ok || !data.ok) {
        setError("Impossible de créer le compte.");
        return;
      }

      await refreshAccount();
      setMessage("Compte créé. En attente de validation par un admin.");
      setNewName("");
      setNewEmail("");
      setNewPassword("");
    } catch {
      setError("Impossible de créer le compte.");
    } finally {
      setBusy(false);
    }
  }

  async function loginAccount() {
    if (!loginEmail.trim() || !loginPassword) {
      setError("Entre ton email et ton mot de passe.");
      return;
    }

    setBusy(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intent: "login",
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) {
        if (data.error === "account-not-approved") {
          setError("Compte en attente de validation admin.");
          return;
        }
        setError("Identifiants invalides.");
        return;
      }

      await refreshAccount();
      setMessage("Connexion réussie.");
      setLoginEmail("");
      setLoginPassword("");
      navigate("/", { replace: true });
    } catch {
      setError("Impossible de se connecter.");
    } finally {
      setBusy(false);
    }
  }

  async function requestPasswordResetEmail() {
    if (!loginEmail.trim()) {
      setError("Entre ton email pour recevoir le lien de reinitialisation.");
      return;
    }

    setBusy(true);
    setError("");
    setMessage("");

    try {
      await fetch("/api/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent: "forgot-password", email: loginEmail }),
      });

      setMessage("Si un compte existe pour cet email, un lien de reinitialisation a ete envoye.");
    } catch {
      setMessage("Si un compte existe pour cet email, un lien de reinitialisation a ete envoye.");
    } finally {
      setBusy(false);
    }
  }

  async function resetPasswordFromToken() {
    if (!resetToken) {
      setError("Lien invalide. Redemande un nouveau lien de reinitialisation.");
      return;
    }
    if (!resetPassword) {
      setError("Entre un nouveau mot de passe.");
      return;
    }
    if (resetPassword !== resetPasswordConfirm) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }

    setBusy(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent: "reset-password", token: resetToken, password: resetPassword }),
      });
      const data = (await response.json()) as { ok?: boolean };
      if (!response.ok || !data.ok) {
        setError("Lien invalide ou expire. Redemande un nouveau lien.");
        return;
      }

      setResetPassword("");
      setResetPasswordConfirm("");
      setMessage("Mot de passe reinitialise. Tu peux te connecter.");
      navigate("/account#switch-account", { replace: true });
    } catch {
      setError("Impossible de reinitialiser le mot de passe.");
    } finally {
      setBusy(false);
    }
  }

  async function renameAccount() {
    if (!renameName.trim()) {
      setError("Entre un nom de compte.");
      return;
    }

    setBusy(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent: "rename", name: renameName }),
      });

      const data = (await response.json()) as { ok?: boolean };
      if (!response.ok || !data.ok) {
        setError("Impossible de renommer le compte.");
        return;
      }

      await refreshAccount();
      setMessage("Nom du compte mis à jour.");
    } catch {
      setError("Impossible de renommer le compte.");
    } finally {
      setBusy(false);
    }
  }

  async function disconnect() {
    try {
      await logout();
      setMessage("Déconnexion effectuée.");
    } catch {
      setError("Impossible de se déconnecter.");
    }
  }

  async function updateProfile() {
    if (!connected || !account) {
      setError("Tu dois être connecté.");
      return;
    }
    if (!profileEmail.trim()) {
      setError("Entre une adresse email valide.");
      return;
    }
    if (profilePassword.trim() && !profileCurrentPassword) {
      setError("Entre ton mot de passe actuel pour définir un nouveau mot de passe.");
      return;
    }

    setBusy(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intent: "update-profile",
          email: profileEmail,
          currentPassword: profileCurrentPassword,
          password: profilePassword.trim() ? profilePassword : undefined,
        }),
      });

      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) {
        setError("Impossible de mettre à jour le profil (email déjà utilisé ou mot de passe invalide).");
        return;
      }

      await refreshAccount();
      setProfileCurrentPassword("");
      setProfilePassword("");
      setMessage("Profil mis à jour.");
    } catch {
      setError("Impossible de mettre à jour le profil.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="sp-page space-y-6">
      <h1 className="leading-[0.95] font-bold tracking-[-0.03em] text-4xl text-center text-white">
        Réglages du compte
      </h1>

      {!connected && (
        <section className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAuthMode("create")}
            className={`px-3 py-2 rounded border text-sm font-medium transition-colors ${authMode === "create" ? "border-green-500 bg-green-500/20 text-green-300" : "border-neutral-700 bg-neutral-900 text-neutral-300 hover:bg-neutral-800"}`}
          >
            Créer un compte
          </button>
          <button
            type="button"
            onClick={() => setAuthMode("login")}
            className={`px-3 py-2 rounded border text-sm font-medium transition-colors ${authMode === "login" ? "border-blue-500 bg-blue-500/20 text-blue-300" : "border-neutral-700 bg-neutral-900 text-neutral-300 hover:bg-neutral-800"}`}
          >
            Se connecter
          </button>
        </section>
      )}

      {connected && (
        <section className="sp-panel space-y-2">
          <h2 className="font-semibold">Compte actif</h2>
          {loading ? (
            <p className="text-sm text-neutral-300">Chargement du compte...</p>
          ) : account ? (
            <>
              <p className="text-sm text-neutral-200">Nom: {account.name}</p>
              <p className="text-sm text-neutral-200">Email: {account.email}</p>
              <p className="text-sm text-neutral-200">Role: {account.isAdmin ? "Admin" : "Utilisateur"}</p>
              <p className="text-xs text-neutral-400 break-all">ID: {account.id}</p>
              <button
                onClick={disconnect}
                className="sp-button sp-button-sm sp-button-red mt-2"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <p className="text-sm text-neutral-300">Aucun compte connecté (mode invité).</p>
          )}
        </section>
      )}

      {connected && (
        <section className="sp-panel space-y-3">
          <h2 className="font-semibold">Profil (email et mot de passe)</h2>
          <div className="sp-input-shell">
            <label className="sp-input-label" htmlFor="profileEmailInput">Adresse email</label>
            <input
              id="profileEmailInput"
              type="email"
              value={profileEmail}
              onChange={(event) => setProfileEmail(event.target.value)}
              className="sp-input-control"
              placeholder="Adresse email"
              disabled={!connected}
            />
          </div>
          <div className="sp-input-shell">
            <label className="sp-input-label" htmlFor="profileCurrentPasswordInput">Mot de passe actuel</label>
            <input
              id="profileCurrentPasswordInput"
              type="password"
              value={profileCurrentPassword}
              onChange={(event) => setProfileCurrentPassword(event.target.value)}
              className="sp-input-control"
              placeholder="Obligatoire pour changer le mot de passe"
              disabled={!connected}
            />
          </div>
          <div className="sp-input-shell">
            <label className="sp-input-label" htmlFor="profilePasswordInput">Nouveau mot de passe</label>
            <input
              id="profilePasswordInput"
              type="password"
              value={profilePassword}
              onChange={(event) => setProfilePassword(event.target.value)}
              className="sp-input-control"
              placeholder="Laisser vide pour conserver"
              disabled={!connected}
            />
          </div>
          <button
            onClick={updateProfile}
            disabled={busy || !connected}
            className="sp-button sp-button-md sp-button-full sp-button-indigo"
          >
            {busy ? "Mise à jour..." : "Mettre à jour le profil"}
          </button>
        </section>
      )}

      {connected && (
        <section id="rename-account" className="sp-panel space-y-3">
          <h2 className="font-semibold">Renommer le compte actif</h2>
          <div className="sp-input-shell">
            <label className="sp-input-label" htmlFor="renameNameInput">Nom du compte</label>
            <input
              id="renameNameInput"
              type="text"
              value={renameName}
              onChange={(event) => setRenameName(event.target.value)}
              className="sp-input-control"
              placeholder="Nom du compte"
            />
          </div>
          <button
            onClick={renameAccount}
            disabled={busy || loading || !connected || !account}
            className="sp-button sp-button-md sp-button-full sp-button-amber"
          >
            {busy ? "Mise à jour..." : "Mettre à jour le nom"}
          </button>
        </section>
      )}

      {!connected && authMode === "create" && (
        <section id="create-account" className="sp-panel space-y-3">
          <h2 className="font-semibold">Créer un compte</h2>
          <div className="sp-input-shell">
            <label className="sp-input-label" htmlFor="newNameInput">Nom d'utilisateur</label>
            <input
              id="newNameInput"
              type="text"
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
              className="sp-input-control"
              placeholder="Nom d'utilisateur"
            />
          </div>
          <div className="sp-input-shell">
            <label className="sp-input-label" htmlFor="newEmailInput">Adresse email</label>
            <input
              id="newEmailInput"
              type="email"
              value={newEmail}
              onChange={(event) => setNewEmail(event.target.value)}
              className="sp-input-control"
              placeholder="Adresse email"
            />
          </div>
          <div className="sp-input-shell">
            <label className="sp-input-label" htmlFor="newPasswordInput">Mot de passe</label>
            <input
              id="newPasswordInput"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="sp-input-control"
              placeholder="Mot de passe"
            />
          </div>
          <button
            onClick={createNewAccount}
            disabled={busy}
            className="sp-button sp-button-md sp-button-full sp-button-green"
          >
            {busy ? "Création..." : "Créer et utiliser ce compte"}
          </button>
        </section>
      )}

      {!connected && authMode === "login" && (
        <section id="switch-account" className="sp-panel space-y-3">
          <h2 className="font-semibold">Se connecter</h2>
          <div className="sp-input-shell">
            <label className="sp-input-label" htmlFor="loginEmailInput">Adresse email</label>
            <input
              id="loginEmailInput"
              type="email"
              value={loginEmail}
              onChange={(event) => setLoginEmail(event.target.value)}
              className="sp-input-control"
              placeholder="Adresse email"
            />
          </div>
          <div className="sp-input-shell">
            <label className="sp-input-label" htmlFor="loginPasswordInput">Mot de passe</label>
            <input
              id="loginPasswordInput"
              type="password"
              value={loginPassword}
              onChange={(event) => setLoginPassword(event.target.value)}
              className="sp-input-control"
              placeholder="Mot de passe"
            />
          </div>
          <button
            onClick={loginAccount}
            disabled={busy}
            className="sp-button sp-button-md sp-button-full sp-button-blue"
          >
            {busy ? "Connexion..." : "Se connecter"}
          </button>
          <button
            type="button"
            onClick={requestPasswordResetEmail}
            disabled={busy}
            className="sp-button sp-button-md sp-button-full sp-button-neutral"
          >
            {busy ? "Envoi..." : "Mot de passe oublie ?"}
          </button>

          {resetToken && (
            <div id="reset-password" className="space-y-3 rounded border border-neutral-700 bg-neutral-950/50 p-3">
              <h3 className="font-semibold">Reinitialiser le mot de passe</h3>
              <div className="sp-input-shell">
                <label className="sp-input-label" htmlFor="resetPasswordInput">Nouveau mot de passe</label>
                <input
                  id="resetPasswordInput"
                  type="password"
                  value={resetPassword}
                  onChange={(event) => setResetPassword(event.target.value)}
                  className="sp-input-control"
                  placeholder="Nouveau mot de passe"
                />
              </div>
              <div className="sp-input-shell">
                <label className="sp-input-label" htmlFor="resetPasswordConfirmInput">Confirmer le mot de passe</label>
                <input
                  id="resetPasswordConfirmInput"
                  type="password"
                  value={resetPasswordConfirm}
                  onChange={(event) => setResetPasswordConfirm(event.target.value)}
                  className="sp-input-control"
                  placeholder="Confirme le nouveau mot de passe"
                />
              </div>
              <button
                type="button"
                onClick={resetPasswordFromToken}
                disabled={busy}
                className="sp-button sp-button-md sp-button-full sp-button-indigo"
              >
                {busy ? "Mise a jour..." : "Valider le nouveau mot de passe"}
              </button>
            </div>
          )}
        </section>
      )}

      {connected && account?.isAdmin && (
        <section className="sp-panel space-y-3">
          <h2 className="font-semibold">Administration</h2>
          <p className="text-sm text-neutral-300">Le compte admin peut gérer tous les comptes via la page dédiée.</p>
          <Link
            to="/admin"
            className="sp-button sp-button-md sp-button-amber"
          >
            Ouvrir la page admin
          </Link>
        </section>
      )}

      {message && <p className="text-sm text-green-400">{message}</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}
    </main>
  );
}
