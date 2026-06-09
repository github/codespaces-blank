"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  History,
  Zap,
  RefreshCw,
} from "lucide-react";

import { fetchApi } from "@/lib/fetch-api";
import { useAuth } from "@/hooks/use-auth";
import { useResearchHistory } from "./hooks/use-research-history";

import { ResearchInput, type ResearchMode } from "./components/research-input";
import { ResearchArtifact } from "./components/research-artifact";
import { ResearchQueue } from "./components/research-queue";
import { ResearchHistory } from "./components/research-history";

export const dynamic = "force-dynamic";

type ResearchResult = {
  search_id?: string;
  results?: Array<{
    title: string;
    url: string;
    excerpts: string[];
  }>;
  summary?: string;
};

export default function ResearchPage() {
  const { user } = useAuth();
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<ResearchResult | null>(null);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<ResearchMode>("search");

  const { artifacts, refetch: refetchHistory } = useResearchHistory(user?.uid);

  const handleSearch = async (mode: ResearchMode, searchQuery: string) => {
    setActiveMode(mode);
    setIsSearching(true);
    setResults(null);

    try {
      if (mode === "deep") {
        const data = await fetchApi<{ jobId: string; status: string }>(
          "/api/research/deep-research",
          {
            method: "POST",
            body: JSON.stringify({ objective: searchQuery, userId: user?.uid }),
          }
        );
        setActiveJobId(data.jobId);
      } else {
        const endpoint =
          mode === "extract" ? "/api/research/extract" : "/api/research/search";
        const body =
          mode === "extract"
            ? { url: searchQuery, objective: "Extract key information", userId: user?.uid }
            : { objective: searchQuery, queries: [searchQuery], userId: user?.uid };

        const data = await fetchApi<ResearchResult>(endpoint, {
          method: "POST",
          body: JSON.stringify(body),
        });
        setResults(data);
      }
    } catch (error) {
      console.error("Research Error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleJobComplete = (result: any) => {
    setResults(result);
    setActiveJobId(null);
    refetchHistory();
  };

  const handleJobCancel = (jobId: string) => {
    setActiveJobId(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-slate-500 font-medium">
          <span>Intelligence</span>
          <span className="text-slate-800">/</span>
          <span className="text-slate-300">Research Hub</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Agentic Deep Research
        </h1>
        <p className="text-slate-400 text-sm max-w-xl">
          Multi-step autonomous research with real-time progress tracking.
        </p>
      </div>

      {/* Research Input */}
      <ResearchInput onSearch={handleSearch} isLoading={isSearching} />

      {/* Active Job Queue */}
      {activeJobId && (
        <ResearchQueue
          jobId={activeJobId}
          onJobComplete={handleJobComplete}
          onJobCancel={handleJobCancel}
        />
      )}

      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        {/* Results Area */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Research Results
              {activeMode === "deep" && (
                <Badge
                  variant="outline"
                  className="ml-2 rounded-lg border-purple-500/20 text-purple-400 text-[10px]"
                >
                  <Zap className="h-3 w-3 mr-1" />
                  Deep Research
                </Badge>
              )}
            </h2>
          </div>

          <div className="space-y-6">
            {!results && !isSearching && !activeJobId && (
              <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 border border-dashed border-white/5 rounded-[2rem]">
                <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center">
                  <History className="h-8 w-8 text-slate-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-400">
                    No active research
                  </p>
                  <p className="text-xs text-slate-600">
                    Enter a query above to begin autonomous research.
                  </p>
                </div>
              </div>
            )}

            {isSearching && !activeJobId && (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-32 bg-white/[0.02] border border-white/5 rounded-2xl animate-pulse"
                  />
                ))}
              </div>
            )}

            {results?.results && (
              <div className="space-y-4">
                {results.summary && (
                  <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.01]">
                    <p className="text-sm text-slate-300 whitespace-pre-wrap">
                      {results.summary}
                    </p>
                  </div>
                )}
                {results.results.map((item, i) => (
                  <ResearchArtifact key={i} result={item} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Research History */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
              <History className="h-4 w-4" />
              Recent Research
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs rounded-lg text-slate-500"
              onClick={() => refetchHistory()}
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>
          <ResearchHistory artifacts={artifacts} onSelect={() => {}} />
        </div>
      </div>
    </div>
  );
}