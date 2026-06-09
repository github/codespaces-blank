"use client";

import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function DashboardHeader() {
  const { user } = useAuth();

  return (
    <header className="flex h-16 items-center gap-4 border-b border-white/5 bg-black backdrop-blur-md px-6">
      <SidebarTrigger className="text-slate-400 hover:text-white" />
      <form className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            type="search"
            placeholder="Search agents, workflows, research..."
            className="h-10 w-full md:w-2/3 lg:w-1/3 bg-white/5 border-white/10 text-white placeholder:text-slate-500 pl-10 rounded-xl focus:border-blue-500"
          />
        </div>
      </form>
      <span className="text-sm text-slate-300 hidden md:block">
        {user?.displayName || user?.email?.split("@")[0] || "User"}
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative text-neutral-400 hover:text-white hover:bg-white/10"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-neutral-500 shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
            <span className="sr-only">Notifications</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-[#0b0b10] border border-white/10 shadow-lg shadow-black/40">
          <DropdownMenuItem className="text-sm text-slate-300">New alert: Market scan finished</DropdownMenuItem>
          <DropdownMenuItem className="text-sm text-slate-300">Agent registry synced</DropdownMenuItem>
          <DropdownMenuItem className="text-sm text-slate-300">Workflow health stable</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
