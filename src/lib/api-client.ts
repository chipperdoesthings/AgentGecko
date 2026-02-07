/**
 * Client-side API helpers for fetching agent data from our API routes.
 * Used by React components to avoid importing server-side code.
 */

import type { Agent, AgentDetail } from "@/types";

const BASE = typeof window !== "undefined" ? "" : "http://localhost:3000";

// ---------------------------------------------------------------------------
// Agents list
// ---------------------------------------------------------------------------

export interface AgentsResponse {
  agents: Agent[];
  total: number;
  offset: number;
  limit: number;
  hasMore: boolean;
}

export async function fetchAgents(params?: {
  q?: string;
  category?: string;
  sort?: string;
  order?: string;
  limit?: number;
  offset?: number;
}): Promise<AgentsResponse> {
  const sp = new URLSearchParams();
  if (params?.q) sp.set("q", params.q);
  if (params?.category && params.category !== "all") sp.set("category", params.category);
  if (params?.sort) sp.set("sort", params.sort);
  if (params?.order) sp.set("order", params.order);
  if (params?.limit) sp.set("limit", String(params.limit));
  if (params?.offset) sp.set("offset", String(params.offset));

  const qs = sp.toString();
  const url = `${BASE}/api/agents${qs ? `?${qs}` : ""}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch agents: ${res.status}`);
  return res.json();
}

// ---------------------------------------------------------------------------
// Single agent detail
// ---------------------------------------------------------------------------

export interface AgentDetailResponse {
  agent: AgentDetail;
}

export async function fetchAgentDetail(
  address: string,
): Promise<AgentDetailResponse> {
  const res = await fetch(`${BASE}/api/agent/${address}`, { cache: "no-store" });
  if (!res.ok) {
    if (res.status === 404) throw new Error("Agent not found");
    throw new Error(`Failed to fetch agent: ${res.status}`);
  }
  return res.json();
}

// ---------------------------------------------------------------------------
// Stats
// ---------------------------------------------------------------------------

export interface StatsResponse {
  stats: {
    totalAgents: number;
    totalVolume: number;
    totalMarketCap: number;
    totalHolders: number;
    avgScore: number;
    graduatedCount: number;
  };
}

export async function fetchStats(): Promise<StatsResponse> {
  const res = await fetch(`${BASE}/api/stats`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch stats: ${res.status}`);
  return res.json();
}

// ---------------------------------------------------------------------------
// Refresh
// ---------------------------------------------------------------------------

export async function triggerRefresh(force = false): Promise<{
  success: boolean;
  agentCount: number;
  errors: string[];
  durationMs: number;
}> {
  const res = await fetch(`${BASE}/api/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ force }),
  });
  if (!res.ok) throw new Error(`Refresh failed: ${res.status}`);
  return res.json();
}
