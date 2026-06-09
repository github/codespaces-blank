import type { Metadata } from "next";
import { DashboardAuthGate } from "../auth-gate";
import { DashboardHeader } from "@/app/components/dashboard-header";
import { DashboardLayout } from "@/app/components/dashboard-layout";

export const metadata: Metadata = {
  title: "Chat | World Automate",
  description: "AI chat interface with agent swarm and file attachments.",
};

export const dynamic = "force-dynamic";

import { Toaster } from "sonner";

export default function ChatRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardAuthGate>
      <DashboardLayout>
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto bg-[#0a0a0a]">
          {children}
        </main>
      </DashboardLayout>
      <Toaster position="top-right" richColors />
    </DashboardAuthGate>
  );
}
