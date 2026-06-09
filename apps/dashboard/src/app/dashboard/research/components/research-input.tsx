"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { 
  Search, 
  Zap, 
  Database, 
  Sparkles,
  Loader2,
} from "lucide-react";

export type ResearchMode = "search" | "extract" | "deep";

const researchModes: Array<{
  id: ResearchMode;
  name: string;
  desc: string;
  icon: React.ElementType;
  color: string;
}> = [
  { id: "search", name: "Quick Search", desc: "Real-time search results", icon: Search, color: "text-blue-400" },
  { id: "extract", name: "Data Extract", desc: "Extract structured data", icon: Database, color: "text-emerald-400" },
  { id: "deep", name: "Deep Research", desc: "Multi-step analysis", icon: Zap, color: "text-purple-400" },
];

export function ResearchInput({
  onSearch,
  isLoading,
}: {
  onSearch: (mode: ResearchMode, query: string) => void;
  isLoading: boolean;
}) {
  const [query, setQuery] = useState("");
  const [activeMode, setActiveMode] = useState<ResearchMode>("search");

  const handleSubmit = () => {
    if (!query.trim()) return;
    onSearch(activeMode, query);
    setQuery("");
  };

  return (
    <div className="space-y-6">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
        <div className="relative rounded-[2rem] border border-white/10 bg-[#09090f] p-8 space-y-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 h-5 w-5" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="Enter your research query..."
                className="h-16 pl-14 bg-white/[0.02] border-white/5 text-white placeholder:text-slate-500 rounded-2xl text-lg focus:border-purple-500 transition-all"
              />
            </div>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !query.trim()}
              className="h-16 px-10 bg-white text-black hover:bg-slate-200 rounded-2xl gap-3 font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Sparkles className="h-5 w-5" />
              )}
              {isLoading ? "Processing..." : activeMode === "deep" ? "Deep Research" : "Search"}
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {researchModes.map((mode) => (
              <div
                key={mode.id}
                onClick={() => setActiveMode(mode.id)}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer group/mode",
                  activeMode === mode.id
                    ? "bg-white/5 border-white/20"
                    : "bg-white/[0.02] border-white/5 hover:border-white/10"
                )}
              >
                <div
                  className={cn(
                    "p-2 rounded-lg bg-white/[0.03] group-hover/mode:bg-white/[0.08] transition-colors",
                    mode.color
                  )}
                >
                  <mode.icon className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-white tracking-tight">{mode.name}</p>
                  <p className="text-xs text-slate-500 leading-none">{mode.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}