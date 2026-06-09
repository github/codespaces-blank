"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchApi, ApiError } from "@/lib/fetch-api";
import { useAuth } from "./use-auth";
import type { User, Agent, Task, Workflow } from "@repo/database";

interface UseFetchOptions {
  skip?: boolean;
  refetchInterval?: number;
}

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching user data
 */
export function useUser(userId: string, options: UseFetchOptions = {}): UseFetchResult<User> {
  const { user: authUser } = useAuth();
  const [data, setData] = useState<User | null>(null);
  const [loading, setLoading] = useState(!options.skip);
  const [error, setError] = useState<ApiError | null>(null);

  const fetch = useCallback(async () => {
    if (!userId || options.skip) return;

    try {
      setLoading(true);
      setError(null);
      const userData = await fetchApi<User>(`/api/users/${userId}`);
      setData(userData);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err);
        console.error("Failed to fetch user:", err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [userId, options.skip]);

  useEffect(() => {
    fetch();
    if (options.refetchInterval) {
      const interval = setInterval(fetch, options.refetchInterval);
      return () => clearInterval(interval);
    }
  }, [fetch, options.refetchInterval]);

  return { data, loading, error, refetch: fetch };
}

/**
 * Hook for fetching user's agents
 */
export function useAgents(userId: string, options: UseFetchOptions = {}): UseFetchResult<Agent[]> {
  const [data, setData] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(!options.skip);
  const [error, setError] = useState<ApiError | null>(null);

  const fetch = useCallback(async () => {
    if (!userId || options.skip) return;

    try {
      setLoading(true);
      setError(null);
      const agents = await fetchApi<Agent[]>(`/api/users/${userId}/agents`);
      setData(agents);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err);
        console.error("Failed to fetch agents:", err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [userId, options.skip]);

  useEffect(() => {
    fetch();
    if (options.refetchInterval) {
      const interval = setInterval(fetch, options.refetchInterval);
      return () => clearInterval(interval);
    }
  }, [fetch, options.refetchInterval]);

  return { data, loading, error, refetch: fetch };
}

/**
 * Hook for fetching user's tasks
 */
export function useTasks(userId: string, options: UseFetchOptions = {}): UseFetchResult<Task[]> {
  const [data, setData] = useState<Task[]>([]);
  const [loading, setLoading] = useState(!options.skip);
  const [error, setError] = useState<ApiError | null>(null);

  const fetch = useCallback(async () => {
    if (!userId || options.skip) return;

    try {
      setLoading(true);
      setError(null);
      const tasks = await fetchApi<Task[]>(`/api/tasks?userId=${userId}`);
      setData(tasks);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err);
        console.error("Failed to fetch tasks:", err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [userId, options.skip]);

  useEffect(() => {
    fetch();
    if (options.refetchInterval) {
      const interval = setInterval(fetch, options.refetchInterval);
      return () => clearInterval(interval);
    }
  }, [fetch, options.refetchInterval]);

  return { data, loading, error, refetch: fetch };
}

/**
 * Hook for fetching user's workflows
 */
export function useWorkflows(userId: string, options: UseFetchOptions = {}): UseFetchResult<Workflow[]> {
  const [data, setData] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(!options.skip);
  const [error, setError] = useState<ApiError | null>(null);

  const fetch = useCallback(async () => {
    if (!userId || options.skip) return;

    try {
      setLoading(true);
      setError(null);
      const workflows = await fetchApi<Workflow[]>(`/api/workflows?userId=${userId}`);
      setData(workflows);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err);
        console.error("Failed to fetch workflows:", err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [userId, options.skip]);

  useEffect(() => {
    fetch();
    if (options.refetchInterval) {
      const interval = setInterval(fetch, options.refetchInterval);
      return () => clearInterval(interval);
    }
  }, [fetch, options.refetchInterval]);

  return { data, loading, error, refetch: fetch };
}

/**
 * Hook for fetching single agent
 */
export function useAgent(agentId: string, options: UseFetchOptions = {}): UseFetchResult<Agent> {
  const [data, setData] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(!options.skip);
  const [error, setError] = useState<ApiError | null>(null);

  const fetch = useCallback(async () => {
    if (!agentId || options.skip) return;

    try {
      setLoading(true);
      setError(null);
      const agent = await fetchApi<Agent>(`/api/agents/${agentId}`);
      setData(agent);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err);
        console.error("Failed to fetch agent:", err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [agentId, options.skip]);

  useEffect(() => {
    fetch();
    if (options.refetchInterval) {
      const interval = setInterval(fetch, options.refetchInterval);
      return () => clearInterval(interval);
    }
  }, [fetch, options.refetchInterval]);

  return { data, loading, error, refetch: fetch };
}
