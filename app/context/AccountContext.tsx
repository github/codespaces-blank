import React, { createContext, useContext, useEffect, useState } from "react";

interface AccountInfo {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AccountContextValue {
  account: AccountInfo | null;
  connected: boolean;
  loading: boolean;
  refreshAccount: () => Promise<AccountInfo | null>;
  logout: () => Promise<void>;
}

const AccountContext = createContext<AccountContextValue | null>(null);

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<AccountInfo | null>(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  async function refreshAccount() {
    const response = await fetch("/api/account");
    const data = (await response.json()) as { connected?: boolean; account?: AccountInfo | null };
    const nextAccount = data.account ?? null;
    setAccount(nextAccount);
    setConnected(Boolean(data.connected) && Boolean(nextAccount));
    return nextAccount;
  }

  async function logout() {
    await fetch("/api/account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ intent: "logout" }),
    });
    setConnected(false);
    setAccount(null);
  }

  useEffect(() => {
    let cancelled = false;

    refreshAccount()
      .catch(() => {
        if (cancelled) return;
        setAccount(null);
        setConnected(false);
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AccountContext.Provider value={{ account, connected, loading, refreshAccount, logout }}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const ctx = useContext(AccountContext);
  if (!ctx) {
    throw new Error("useAccount must be used within an AccountProvider");
  }
  return ctx;
}
