import type { Metadata } from "next";
import { DashboardAuthGate } from "./auth-gate";
import { DashboardHeader } from "@/app/components/dashboard-header";
import { DashboardLayout } from "@/app/components/dashboard-layout";

export const metadata: Metadata = {
  title: "Dashboard | World Automate",
  description: "AI-driven enterprise dashboard for workflows, agents, monitoring, and analytics.",
};

export const dynamic = "force-dynamic";

import { Toaster } from "sonner";

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardAuthGate>
      <DashboardLayout>
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto bg-[#0a0a0a]">
          <div className="mx-auto w-full max-w-7xl p-6 md:p-8">{children}</div>
        </main>
      </DashboardLayout>
      <Toaster position="top-right" richColors />
    </DashboardAuthGate>
  );
}
