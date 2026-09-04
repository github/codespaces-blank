import { Link } from "react-router";
import { getConnectedAccountFromRequest } from "~/utils/account.server";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export function meta() {
  return [{ title: "Administration" }];
}

export async function loader({ request }: { request: Request }) {
  const account = await getConnectedAccountFromRequest(request);
  if (!account) {
    throw new Response("Unauthorized", { status: 401 });
  }
  if (!account.isAdmin) {
    throw new Response("Forbidden", { status: 403 });
  }

  return { accountName: account.name };
}

export default function AdminPage() {
  return (
    <main className="sp-page space-y-4">
      <h1 className="text-2xl font-bold">Administration</h1>
      <p className="text-sm text-neutral-300">Choisissez une section d'administration.</p>

      <section className="sp-panel space-y-2">
        <h2 className="font-semibold">Comptes</h2>
        <p className="text-sm text-neutral-300">Gérer les comptes utilisateurs et les droits admin.</p>
        <Link
          to="/admin/accounts"
          className="sp-button sp-button-md sp-button-amber"
        >
          Administration des comptes
        </Link>
      </section>

      <Link to="/account" className="sp-link-muted">
        <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
        Retour au compte
      </Link>
    </main>
  );
}