"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardNav } from "./dashboard-nav";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#050507] text-white">
        <DashboardNav />
        <SidebarInset className="flex w-full flex-col border-l border-white/5 bg-[#06060b]">
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
