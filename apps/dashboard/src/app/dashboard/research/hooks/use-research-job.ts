"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchApi } from "@/lib/fetch-api";

export type ResearchJobStatus = "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED";

export interface ResearchJob {
  id: string;
  type: string;
  status: ResearchJobStatus;
  payload: { objective: string };
  result?: any;
  error?: string;
  createdAt: string;
  updatedAt: string;
  finishedAt?: string;
}

export interface UseResearchJobOptions {
  jobId: string | null;
  enabled?: boolean;
  pollingInterval?: number;
}

export function useResearchJob({
  jobId,
  enabled = true,
  pollingInterval = 2000,
}: UseResearchJobOptions) {
  const [job, setJob] = useState<ResearchJob | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJob = useCallback(async () => {
    if (!jobId) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchApi<ResearchJob>(`/api/jobs/${jobId}`);
      setJob(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch job");
    } finally {
      setIsLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    if (!enabled || !jobId) return;

    fetchJob();

    const isComplete = job?.status === "COMPLETED" || job?.status === "FAILED";
    if (isComplete) return;

    const interval = setInterval(fetchJob, pollingInterval);
    return () => clearInterval(interval);
  }, [jobId, enabled, pollingInterval, fetchJob, job?.status]);

  return { job, isLoading, error, refetch: fetchJob };
}