"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Agent, AgentDetail } from "@/types";
import {
  fetchAgents,
  fetchAgentDetail,
  fetchStats,
  triggerRefresh,
  type StatsResponse,
} from "@/lib/api-client";

// ---------------------------------------------------------------------------
// useAgents — list of agents with search/filter
// ---------------------------------------------------------------------------

export function useAgents(query = "", category = "all") {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(async () => {
    // Cancel previous request
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setError(null);
    try {
      const data = await fetchAgents({
        q: query || undefined,
        category: category !== "all" ? category : undefined,
      });
      setAgents(data.agents);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "Failed to load agents");
    } finally {
      setLoading(false);
    }
  }, [query, category]);

  useEffect(() => {
    load();
    return () => abortRef.current?.abort();
  }, [load]);

  return { agents, loading, error, reload: load };
}

// ---------------------------------------------------------------------------
// useFilteredAgents — alias that returns React-Query-style shape
// ---------------------------------------------------------------------------

export function useFilteredAgents(query: string, category: string) {
  const { agents, loading, error, reload } = useAgents(query, category);
  return {
    data: agents,
    isLoading: loading,
    error: error ? new Error(error) : null,
    refetch: reload,
  };
}

// ---------------------------------------------------------------------------
// useAllAgents — fetch all agents (no filter), returns React-Query-style shape
// ---------------------------------------------------------------------------

export function useAllAgents() {
  const { agents, loading, error, reload } = useAgents();
  return {
    data: agents,
    isLoading: loading,
    error: error ? new Error(error) : null,
    refetch: reload,
  };
}

// ---------------------------------------------------------------------------
// useAgentDetail — single agent with trades
// ---------------------------------------------------------------------------

export function useAgentDetail(address: string) {
  const [agent, setAgent] = useState<AgentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAgentDetail(address);
      setAgent(data.agent);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load agent");
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    let cancelled = false;

    async function doLoad() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAgentDetail(address);
        if (!cancelled) setAgent(data.agent);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load agent");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (address) doLoad();
    return () => { cancelled = true; };
  }, [address]);

  return {
    data: agent,
    isLoading: loading,
    error: error ? new Error(error) : null,
    refetch: load,
    // Legacy shape
    agent,
    loading,
  };
}

// ---------------------------------------------------------------------------
// useStats
// ---------------------------------------------------------------------------

export function useStats() {
  const [stats, setStats] = useState<StatsResponse["stats"] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchStats()
      .then((data) => {
        if (!cancelled) setStats(data.stats);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return {
    data: stats,
    isLoading: loading,
    // Legacy shape
    stats,
    loading,
  };
}

// ---------------------------------------------------------------------------
// useRefresh
// ---------------------------------------------------------------------------

export function useRefresh() {
  const [refreshing, setRefreshing] = useState(false);
  const [result, setResult] = useState<{
    agentCount: number;
    durationMs: number;
    errors: string[];
  } | null>(null);

  const refresh = useCallback(async (force = false) => {
    setRefreshing(true);
    try {
      const data = await triggerRefresh(force);
      setResult(data);
      return data;
    } finally {
      setRefreshing(false);
    }
  }, []);

  return { refresh, refreshing, result };
}
