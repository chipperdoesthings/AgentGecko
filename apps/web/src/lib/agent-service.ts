/**
 * Agent Service — the bridge between raw Nad.fun data and our Agent types.
 *
 * Designed for serverless (Vercel):
 *  - Fast initial response (returns whatever data we have)
 *  - Background refresh via non-blocking approach
 *  - In-memory cache that persists within a warm function instance
 */

import type { Agent, AgentDetail, Category, Trade } from "@/types";
import {
  getTokenInfo,
  getMarketData,
  getMetrics,
  getSwapHistory,
  invalidateCache,
  type TokenInfo,
  type MarketInfo,
  type MetricTimeframe,
  type Swap,
} from "./nadfun";
import { calculateScore } from "./scorer";
import { detectAgent } from "./detector";
import { getSeedAddresses, findSeedToken } from "./seed-tokens";

// ---------------------------------------------------------------------------
// In-memory agent store (persists within warm serverless instance)
// ---------------------------------------------------------------------------

let agentStore: Agent[] = [];
let lastRefreshAt = 0;
let refreshPromise: Promise<void> | null = null;

const MIN_REFRESH_INTERVAL_MS = 60_000; // 60s cooldown between refreshes
const STALE_THRESHOLD_MS = 5 * 60_000; // 5 min before auto-refresh

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseVolume(volume: string, usdPerNative: number): number {
  const wei = parseFloat(volume) || 0;
  const nativeAmount = wei / 1e18;
  return nativeAmount * usdPerNative;
}

function mapCategory(detected: string, hintCategory?: Category): Category {
  const valid: Category[] = [
    "meme_trader", "defi", "sniper", "copy_trader",
    "arbitrage", "social", "analyst", "trading",
  ];
  if (valid.includes(detected as Category)) return detected as Category;
  if (hintCategory && valid.includes(hintCategory)) return hintCategory;
  return "trading";
}

// ---------------------------------------------------------------------------
// Build Agent from raw API data
// ---------------------------------------------------------------------------

function buildAgent(
  token: TokenInfo,
  market: MarketInfo | null,
  metrics: MetricTimeframe[],
): Agent | null {
  const priceUsd = parseFloat(market?.price_usd ?? "0");
  const nativePrice = parseFloat(market?.native_price ?? "0");
  const usdPerNative =
    nativePrice > 0 && priceUsd > 0 ? priceUsd / nativePrice : 18;

  const volumeUsd = parseVolume(market?.volume ?? "0", usdPerNative);
  const holderCount = market?.holder_count ?? 0;

  const metric60 = metrics.find((m) => m.timeframe === "60");
  const metric360 = metrics.find((m) => m.timeframe === "360");
  const metric1440 = metrics.find((m) => m.timeframe === "1440");
  const priceChange = metric1440?.percent ?? metric360?.percent ?? metric60?.percent ?? 0;

  const txCount = metrics.reduce(
    (sum, m) => sum + (m.transactions?.total ?? 0), 0,
  );

  const seed = findSeedToken(token.token_id);
  const detection = detectAgent(token.name, token.symbol, token.description);
  const category = mapCategory(detection.category, seed?.hintCategory);

  const createdAt = token.created_at * 1000;

  const scoreResult = calculateScore({
    volume24h: volumeUsd,
    holderCount,
    priceChange24h: priceChange,
    txCount24h: txCount,
    createdAt,
  });

  const totalSupply = parseFloat(market?.total_supply ?? "1000000000000000000000000000") / 1e18;
  const marketCap = priceUsd > 0 ? priceUsd * totalSupply : 0;

  return {
    address: token.token_id,
    name: token.name,
    symbol: token.symbol,
    description: token.description,
    imageUri: token.image_uri || "",
    category,
    score: scoreResult.overall,
    rank: 0,
    marketCap,
    price: priceUsd,
    priceChange24h: priceChange,
    volume24h: volumeUsd,
    holderCount,
    txCount24h: txCount,
    createdAt,
    isGraduated: token.is_graduated,
  };
}

// ---------------------------------------------------------------------------
// Fetch a single agent (fast — 3 parallel API calls)
// ---------------------------------------------------------------------------

async function fetchSingleAgent(addr: string): Promise<Agent | null> {
  try {
    const [token, market, metrics] = await Promise.all([
      getTokenInfo(addr),
      getMarketData(addr),
      getMetrics(addr, "60,360"),
    ]);
    if (!token) return null;
    return buildAgent(token, market, metrics);
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Background refresh — populates the store incrementally
// ---------------------------------------------------------------------------

async function doRefresh(): Promise<{ count: number; errors: string[] }> {
  // On cold start (empty store), only fetch primary tier to stay within 10s timeout
  // On warm instances, fetch all tokens
  const tier = agentStore.length === 0 ? "primary" : "all";
  const addresses = getSeedAddresses(tier);
  const errors: string[] = [];
  const results: Agent[] = [];

  // Fetch tokens with parallel batches of 2 for speed
  const BATCH = 2;
  for (let i = 0; i < addresses.length; i += BATCH) {
    const batch = addresses.slice(i, i + BATCH);
    const batchResults = await Promise.all(
      batch.map((addr) => fetchSingleAgent(addr)),
    );
    for (let j = 0; j < batchResults.length; j++) {
      if (batchResults[j]) {
        results.push(batchResults[j]!);
      } else {
        errors.push(`Failed: ${batch[j].slice(0, 10)}...`);
      }
    }
    // Small delay between batches to avoid rate limits
    if (i + BATCH < addresses.length) {
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  // Sort and assign ranks
  results.sort((a, b) => b.score - a.score);
  results.forEach((agent, idx) => {
    agent.rank = idx + 1;
  });

  if (results.length > 0) {
    agentStore = results;
    lastRefreshAt = Date.now();
  }

  return { count: results.length, errors };
}

// ---------------------------------------------------------------------------
// Public: Refresh all agents from Nad.fun
// ---------------------------------------------------------------------------

export async function refreshAgents(): Promise<{
  agents: Agent[];
  errors: string[];
  duration: number;
}> {
  const now = Date.now();
  if (now - lastRefreshAt < MIN_REFRESH_INTERVAL_MS && agentStore.length > 0) {
    return {
      agents: agentStore,
      errors: ["Too soon — cooldown active"],
      duration: 0,
    };
  }

  // If already refreshing, wait for it
  if (refreshPromise) {
    await refreshPromise;
    return { agents: agentStore, errors: [], duration: 0 };
  }

  const start = Date.now();
  refreshPromise = doRefresh().then(() => {
    refreshPromise = null;
  }).catch(() => {
    refreshPromise = null;
  });

  await refreshPromise;

  return {
    agents: agentStore,
    errors: [],
    duration: Date.now() - start,
  };
}

// ---------------------------------------------------------------------------
// Public: Get cached agents (returns stale data if available, triggers refresh)
// ---------------------------------------------------------------------------

export async function getAgents(): Promise<Agent[]> {
  if (agentStore.length === 0 || Date.now() - lastRefreshAt > STALE_THRESHOLD_MS) {
    await refreshAgents();
  }
  return agentStore;
}

// ---------------------------------------------------------------------------
// Public: Get single agent detail with trades
// ---------------------------------------------------------------------------

export async function getAgentDetail(
  address: string,
): Promise<AgentDetail | null> {
  const [token, market, metrics, swapHistory] = await Promise.all([
    getTokenInfo(address),
    getMarketData(address),
    getMetrics(address, "60,360"),
    getSwapHistory(address, 20),
  ]);

  if (!token) return null;

  const agent = buildAgent(token, market, metrics);
  if (!agent) return null;

  const storeAgent = agentStore.find(
    (a) => a.address.toLowerCase() === address.toLowerCase(),
  );
  if (storeAgent) {
    agent.rank = storeAgent.rank;
  }

  const trades: Trade[] = (swapHistory.swaps || []).map(
    (swap: Swap, idx: number) => ({
      id: swap.swap_info.transaction_hash || `trade-${idx}`,
      type: swap.swap_info.event_type === "BUY" ? ("buy" as const) : ("sell" as const),
      amount: parseFloat(swap.swap_info.token_amount) / 1e18,
      price: parseFloat(swap.swap_info.value),
      timestamp: swap.swap_info.created_at * 1000,
      trader: `${swap.account_info.account_id.slice(0, 6)}...${swap.account_info.account_id.slice(-4)}`,
    }),
  );

  const scoreResult = calculateScore({
    volume24h: agent.volume24h,
    holderCount: agent.holderCount,
    priceChange24h: agent.priceChange24h,
    txCount24h: agent.txCount24h,
    createdAt: agent.createdAt,
  });

  let riskLevel: "low" | "medium" | "high" = "medium";
  if (agent.score >= 70 && agent.holderCount >= 50) riskLevel = "low";
  else if (agent.score < 40 || agent.holderCount < 10) riskLevel = "high";

  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (agent.holderCount >= 50) strengths.push(`Strong holder base (${agent.holderCount} holders)`);
  else if (agent.holderCount >= 10) strengths.push(`Growing holder base (${agent.holderCount} holders)`);
  else weaknesses.push(`Limited holders (${agent.holderCount})`);

  if (agent.isGraduated) strengths.push("Graduated to DEX — proven liquidity");
  else weaknesses.push("Still on bonding curve — not yet graduated");

  if (agent.volume24h > 10000) strengths.push(`High trading volume ($${Math.round(agent.volume24h).toLocaleString()})`);
  else if (agent.volume24h > 1000) strengths.push(`Active trading volume ($${Math.round(agent.volume24h).toLocaleString()})`);
  else weaknesses.push("Low trading volume");

  if (agent.priceChange24h > 10) strengths.push(`Strong positive momentum (+${agent.priceChange24h.toFixed(1)}%)`);
  else if (agent.priceChange24h > 0) strengths.push(`Positive price movement (+${agent.priceChange24h.toFixed(1)}%)`);
  else if (agent.priceChange24h < -10) weaknesses.push(`Price declining (${agent.priceChange24h.toFixed(1)}%)`);

  if (agent.txCount24h > 50) strengths.push(`High activity (${agent.txCount24h} recent transactions)`);
  else if (agent.txCount24h > 10) strengths.push(`Active trading (${agent.txCount24h} recent transactions)`);
  else weaknesses.push("Low recent transaction activity");

  if (strengths.length === 0) strengths.push("Active on Nad.fun platform");
  if (weaknesses.length === 0) weaknesses.push("Market conditions can change rapidly");

  const mcapStr = agent.marketCap > 1000
    ? `$${(agent.marketCap / 1000).toFixed(1)}K`
    : `$${agent.marketCap.toFixed(0)}`;
  const summary = `${agent.name} ($${agent.symbol}) is a ${agent.isGraduated ? "graduated" : "bonding curve"} token on Nad.fun with ${agent.holderCount} holders and a market cap of ${mcapStr}${agent.description ? `. ${agent.description.slice(0, 150)}` : "."}`;

  return {
    ...agent,
    strengths,
    weaknesses,
    riskLevel,
    summary,
    trades,
    scoreBreakdown: {
      volume: scoreResult.volume,
      holders: scoreResult.holders,
      performance: scoreResult.performance,
      activity: scoreResult.activity,
      age: scoreResult.age,
    },
  };
}

// ---------------------------------------------------------------------------
// Public: Stats
// ---------------------------------------------------------------------------

export async function getStats() {
  const agents = await getAgents();
  return {
    totalAgents: agents.length,
    totalVolume: agents.reduce((sum, a) => sum + a.volume24h, 0),
    totalMarketCap: agents.reduce((sum, a) => sum + a.marketCap, 0),
    totalHolders: agents.reduce((sum, a) => sum + a.holderCount, 0),
    avgScore:
      agents.length > 0
        ? Math.round(
            (agents.reduce((sum, a) => sum + a.score, 0) / agents.length) * 10,
          ) / 10
        : 0,
    graduatedCount: agents.filter((a) => a.isGraduated).length,
  };
}

// ---------------------------------------------------------------------------
// Public: Search
// ---------------------------------------------------------------------------

export async function searchAgents(
  query: string,
  category?: string,
): Promise<Agent[]> {
  const agents = await getAgents();
  let results = agents;

  if (query) {
    const q = query.toLowerCase();
    results = results.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.symbol.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q),
    );
  }

  if (category && category !== "all") {
    results = results.filter((a) => a.category === category);
  }

  return results;
}

// ---------------------------------------------------------------------------
// Public: Force cache invalidation
// ---------------------------------------------------------------------------

export function forceInvalidate(): void {
  invalidateCache();
  lastRefreshAt = 0;
}
