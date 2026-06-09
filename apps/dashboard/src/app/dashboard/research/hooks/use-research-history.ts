"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchApi } from "@/lib/fetch-api";

export type ResearchType = "SEARCH" | "EXTRACT" | "DEEP_RESEARCH";
export type JobStatus = "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED";

export interface ResearchArtifact {
  id: string;
  objective: string;
  type: ResearchType;
  status: JobStatus;
  results?: any;
  sources?: any;
  queryChain: string[];
  durationMs?: number;
  sourceCount: number;
  createdAt: string;
  updatedAt: string;
}

export function useResearchHistory(userId?: string) {
  const [artifacts, setArtifacts] = useState<ResearchArtifact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    if (!userId) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchApi<ResearchArtifact[]>(
        `/api/research/history?userId=${userId}`
      );
      setArtifacts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch history");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const addArtifact = (artifact: ResearchArtifact) => {
    setArtifacts((prev) => [artifact, ...prev]);
  };

  const removeArtifact = (id: string) => {
    setArtifacts((prev) => prev.filter((a) => a.id !== id));
  };

  return { artifacts, isLoading, error, refetch: fetchHistory, addArtifact, removeArtifact };
}