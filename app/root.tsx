import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import {
  faHouse,
  faStopwatch,
  faUsers,
  faFileLines,
  faUserShield,
  faChevronUp,
  faChevronDown,
  faCircleUser,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  {
    rel: "icon",
    type: "image/png",
    href: "/favicon_mr.png",
  }
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

import { TeamsProvider } from "~/context/TeamsContext";
import { AccountProvider } from "~/context/AccountContext";
import { useAccount } from "~/context/AccountContext";

export default function App() {
  return (
    <AccountProvider>
      <TeamsProvider>
        <AppContent />
      </TeamsProvider>
    </AccountProvider>
  );
}

function AppContent() {
  const { connected, account } = useAccount();
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const isLiveRoute = pathname.startsWith("/live/");
  const liveSlug = isLiveRoute ? pathname.split("/")[2] || "" : "";
  const liveBasePath = isLiveRoute && liveSlug ? `/live/${liveSlug}` : "";

  const defaultNavigationItems = [
    { href: "/", label: "Accueil", icon: faHouse, active: true },
    { href: "/roster", label: "Effectifs", icon: faUsers, active: true },
    { href: "/tracker", label: "Match", icon: faStopwatch, active: true },
    { href: "/syntheses", label: "Synthèses", icon: faFileLines, active: true },
    ...(connected && account
      ? [{ href: "/account", label: account.name, icon: faCircleUser, active: true }]
      : []),
    ...(connected && account?.isAdmin
      ? [{ href: "/admin", label: "Admin", icon: faUserShield, active: true }]
      : []),
  ] as const;

  const liveNavigationItems = liveSlug
    ? [
        { href: `/live/${liveSlug}`, label: "Live", icon: faStopwatch, active: true },
        { href: `/live/${liveSlug}/roster`, label: "Effectifs", icon: faUsers, active: true },
      ]
    : [];

  const navigationItems = isLiveRoute ? liveNavigationItems : defaultNavigationItems;
  const resolvedNavigationItems = navigationItems.map((item) => {
    const itemPathname = item.href.split("?")[0];
    const isSelected =
      item.active &&
      (itemPathname === "/"
        ? pathname === "/"
        : itemPathname === liveBasePath
          ? pathname === itemPathname
          : pathname === itemPathname || pathname.startsWith(`${itemPathname}/`));

    return {
      ...item,
      isSelected,
    };
  });

  return (
    <>
      <div className={isHome ? "flex h-dvh w-full max-w-full flex-col overflow-hidden xl:pl-72" : "flex h-dvh w-full max-w-full flex-col overflow-hidden xl:pl-72"}>
        <div className={isHome ? "flex-1 min-h-0 overflow-hidden" : "flex-1 min-h-0 overflow-y-auto overflow-x-hidden pb-[calc(12rem+env(safe-area-inset-bottom))] sm:pb-[calc(14rem+env(safe-area-inset-bottom))] xl:pb-6"}>
          <Outlet />
          {!isHome && (
            <footer className="pointer-events-none px-4 py-4 text-center text-[10px] uppercase tracking-wide text-neutral-600 sm:py-5 xl:py-6">
              © {new Date().getFullYear()} Match Reporter
            </footer>
          )}
        </div>
      </div>

      <ScrollPageControls />

      <nav className="fixed left-4 top-4 bottom-4 z-50 hidden w-64 xl:block">
        <div className="flex h-full flex-col rounded-3xl border border-gray-700 bg-neutral-950/95 px-4 py-5 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/80">
          <div className="border-b border-gray-800 pb-4">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-700 bg-neutral-900 p-2">
                <img src="/favicon_mr.png" alt="Match Reporter" className="h-full w-full object-contain" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-lg font-semibold text-white">Match Reporter</p>
                <p className="text-xs uppercase tracking-wide text-neutral-500">
                  {isLiveRoute ? "Navigation live" : "Navigation"}
                </p>
              </div>
            </div>
          </div>

          <div className="sp-no-scrollbar mt-4 flex flex-1 flex-col gap-2 overflow-y-auto">
            {resolvedNavigationItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                aria-disabled={!item.active}
                onClick={(event) => {
                  if (!item.active) {
                    event.preventDefault();
                  }
                }}
                className={`flex items-center gap-3 rounded-2xl border px-3 py-3 text-sm transition-colors ${
                  item.active
                    ? item.isSelected
                      ? "border-blue-500 bg-blue-500/20 text-blue-300"
                      : "border-neutral-700 bg-neutral-900 text-neutral-300 hover:bg-neutral-800"
                    : "border-neutral-800 bg-neutral-900/60 text-neutral-500"
                }`}
                title={item.active ? item.label : `${item.label} (bientôt)`}
              >
                <span
                  className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl border leading-none transition-colors ${
                    item.active
                      ? item.isSelected
                        ? "border-blue-500 bg-blue-500/20"
                        : "border-neutral-700 bg-neutral-900"
                      : "border-neutral-800 bg-neutral-900/60"
                  }`}
                >
                  <FontAwesomeIcon fixedWidth className="block text-base" icon={item.icon} />
                </span>
                <span className="min-w-0 truncate font-medium">{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      </nav>

      <nav className="fixed inset-x-0 bottom-2 z-50 px-2 pb-[env(safe-area-inset-bottom)] xl:hidden">
        <div className="mx-auto max-w-screen-md">
          <div className="sp-no-scrollbar flex items-stretch justify-start gap-1.5 overflow-x-auto rounded-3xl border border-gray-700 bg-neutral-950/95 px-2 py-2 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/80 md:justify-between md:overflow-x-visible">
            {resolvedNavigationItems.map((item) => {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  aria-disabled={!item.active}
                  onClick={(event) => {
                    if (!item.active) {
                      event.preventDefault();
                    }
                  }}
                  className={`flex min-w-[4.5rem] shrink-0 flex-col items-center justify-center gap-1 py-1 text-[10px] leading-none transition-colors sm:min-w-[5rem] sm:text-[11px] md:min-w-0 md:flex-1 ${
                    item.active
                      ? item.isSelected
                        ? "text-blue-400"
                        : "text-gray-300"
                      : "text-gray-500"
                  }`}
                  title={item.active ? item.label : `${item.label} (bientôt)`}
                >
                  <span
                    className={`grid h-9 w-9 place-items-center rounded-full border leading-none transition-colors sm:h-10 sm:w-10 ${
                      item.active
                        ? item.isSelected
                          ? "border-blue-500/70 bg-blue-500/15"
                          : "border-gray-700 bg-neutral-900"
                        : "border-gray-800 bg-neutral-900/60"
                    }`}
                  >
                    <FontAwesomeIcon fixedWidth className="block text-sm sm:text-base" icon={item.icon} />
                  </span>
                  <span className="w-full max-w-full truncate text-center">{item.label}</span>
                </a>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}

function ScrollPageControls() {
  const { pathname } = useLocation();
  const [isScrollable, setIsScrollable] = useState(false);

  useEffect(() => {
    function updateScrollability() {
      const documentHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      setIsScrollable(documentHeight > viewportHeight + 1);
    }

    updateScrollability();

    window.addEventListener("resize", updateScrollability);

    const timeoutId = window.setTimeout(updateScrollability, 50);

    return () => {
      window.removeEventListener("resize", updateScrollability);
      window.clearTimeout(timeoutId);
    };
  }, [pathname]);

  if (!isScrollable) return null;

  return (
    <div className="fixed bottom-28 right-4 z-40 flex flex-col gap-2">
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="sp-button sp-button-neutral sp-button-icon-lg border-gray-700"
        aria-label="Aller en haut"
        title="Aller en haut"
      >
        <FontAwesomeIcon icon={faChevronUp} />
      </button>
      <button
        type="button"
        onClick={() =>
          window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" })
        }
        className="sp-button sp-button-neutral sp-button-icon-lg border-gray-700"
        aria-label="Aller en bas"
        title="Aller en bas"
      >
        <FontAwesomeIcon icon={faChevronDown} />
      </button>
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let code: number | null = null;
  let title = "Une erreur est survenue";
  let detail = "Une erreur inattendue s'est produite.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    code = error.status;
    if (error.status === 404) {
      title = "Page introuvable";
      detail = "La page que tu cherches n'existe pas ou a été déplacée.";
    } else if (error.status === 401) {
      title = "Non autorisé";
      detail = "Tu dois être connecté pour accéder à cette page.";
    } else if (error.status === 403) {
      title = "Accès refusé";
      detail = "Tu n'as pas les droits pour accéder à cette page.";
    } else if (error.status === 410) {
      title = "Session expirée";
      detail = "Cette session n'est plus disponible.";
    } else {
      title = `Erreur ${error.status}`;
      detail = error.statusText || detail;
    }
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    title = "Erreur de développement";
    detail = error.message;
    stack = error.stack;
  }

  return (
    <main className="sp-page flex flex-col gap-4 pt-16">
      <p className="font-mono text-xs uppercase tracking-widest text-neutral-500">
        {code ? `Code ${code}` : "Erreur"}
      </p>
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-sm text-neutral-300">{detail}</p>
      {stack && (
        <pre className="w-full overflow-x-auto rounded border border-neutral-700 bg-neutral-900 p-4 text-xs text-neutral-400">
          <code>{stack}</code>
        </pre>
      )}
      <a href="/" className="sp-link-muted">
        <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
        Retour à l'accueil
      </a>
    </main>
  );
}
