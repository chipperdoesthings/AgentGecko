/**
 * Agent Service — the bridge between raw Nad.fun data and our Agent types.
 *
 * Responsibilities:
 *  - Fetch token + market + metrics data in parallel
 *  - Map to our Agent / AgentDetail interfaces
 *  - Score, rank, and categorise agents
 *  - Maintain an in-memory agent list with background refresh
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
// In-memory agent store (server-side singleton via module scope)
// ---------------------------------------------------------------------------

let agentStore: Agent[] = [];
let lastRefreshAt = 0;
let refreshInProgress = false;

const MIN_REFRESH_INTERVAL_MS = 30_000; // 30s cooldown between refreshes
const STALE_THRESHOLD_MS = 3 * 60_000; // 3 min before auto-refresh

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseVolume(volume: string, nativePrice: number): number {
  // Volume is in wei (native). Convert to USD.
  const wei = parseFloat(volume) || 0;
  const nativeAmount = wei / 1e18;
  return nativeAmount * nativePrice;
}

function mapCategory(detected: string, hintCategory?: Category): Category {
  const valid: Category[] = [
    "meme_trader",
    "defi",
    "sniper",
    "copy_trader",
    "arbitrage",
    "social",
    "analyst",
    "trading",
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
  // Use MON/USD price from the API — native_price is the MON price
  // We need to estimate the USD value of native
  // price_usd = token price in USD, native_price = price in native MON
  // So USD per MON ≈ price_usd / native_price (if both > 0)
  const usdPerNative =
    nativePrice > 0 && priceUsd > 0 ? priceUsd / nativePrice : 18; // fallback $18/MON

  const volumeUsd = parseVolume(market?.volume ?? "0", usdPerNative);
  const holderCount = market?.holder_count ?? 0;

  // Find the best metric for price change (prefer longer timeframes for 24h)
  const metric60 = metrics.find((m) => m.timeframe === "60");
  const metric360 = metrics.find((m) => m.timeframe === "360");
  const metric1440 = metrics.find((m) => m.timeframe === "1440");
  const priceChange = metric1440?.percent ?? metric360?.percent ?? metric60?.percent ?? 0;

  // Count transactions from metrics
  const txCount = metrics.reduce(
    (sum, m) => sum + (m.transactions?.total ?? 0),
    0,
  );

  // Detect agent category
  const seed = findSeedToken(token.token_id);
  const detection = detectAgent(token.name, token.symbol, token.description);
  const category = mapCategory(detection.category, seed?.hintCategory);

  const createdAt = token.created_at * 1000; // API returns unix seconds

  // Calculate score
  const scoreResult = calculateScore({
    volume24h: volumeUsd,
    holderCount,
    priceChange24h: priceChange,
    txCount24h: txCount,
    createdAt,
  });

  // Calculate market cap: price_usd * circulating supply
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
    rank: 0, // assigned after sorting
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
// Public: Refresh all agents from Nad.fun
// ---------------------------------------------------------------------------

export async function refreshAgents(): Promise<{
  agents: Agent[];
  errors: string[];
  duration: number;
}> {
  if (refreshInProgress) {
    return { agents: agentStore, errors: ["Refresh already in progress"], duration: 0 };
  }

  const now = Date.now();
  if (now - lastRefreshAt < MIN_REFRESH_INTERVAL_MS && agentStore.length > 0) {
    return {
      agents: agentStore,
      errors: ["Too soon — cooldown active"],
      duration: 0,
    };
  }

  refreshInProgress = true;
  const start = Date.now();
  const errors: string[] = [];
  const addresses = getSeedAddresses();
  const results: Agent[] = [];

  // Process tokens in small batches to respect Nad.fun rate limits
  const BATCH_SIZE = 3;
  for (let i = 0; i < addresses.length; i += BATCH_SIZE) {
    const batch = addresses.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.allSettled(
      batch.map(async (addr) => {
        const [token, market, metrics] = await Promise.all([
          getTokenInfo(addr),
          getMarketData(addr),
          getMetrics(addr, "60,360,1440"),
        ]);

        if (!token) {
          errors.push(`Token info not found: ${addr}`);
          return null;
        }

        return buildAgent(token, market, metrics);
      }),
    );

    for (const result of batchResults) {
      if (result.status === "fulfilled" && result.value) {
        results.push(result.value);
      } else if (result.status === "rejected") {
        errors.push(`Fetch failed: ${result.reason}`);
      }
    }

    // Delay between batches to avoid rate limits
    if (i + BATCH_SIZE < addresses.length) {
      await new Promise((r) => setTimeout(r, 1500));
    }
  }

  // Sort by score descending and assign ranks
  results.sort((a, b) => b.score - a.score);
  results.forEach((agent, idx) => {
    agent.rank = idx + 1;
  });

  agentStore = results;
  lastRefreshAt = Date.now();
  refreshInProgress = false;

  return {
    agents: results,
    errors,
    duration: Date.now() - start,
  };
}

// ---------------------------------------------------------------------------
// Public: Get cached agents (returns stale data if available, triggers refresh if stale)
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
  // Fetch fresh data for the specific token
  const [token, market, metrics, swapHistory] = await Promise.all([
    getTokenInfo(address),
    getMarketData(address),
    getMetrics(address, "60,360,1440"),
    getSwapHistory(address, 20),
  ]);

  if (!token) return null;

  const agent = buildAgent(token, market, metrics);
  if (!agent) return null;

  // If we have agents in store, use that rank; otherwise rank 0
  const storeAgent = agentStore.find(
    (a) => a.address.toLowerCase() === address.toLowerCase(),
  );
  if (storeAgent) {
    agent.rank = storeAgent.rank;
  }

  // Map swap history to Trade[]
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

  // Calculate score breakdown
  const scoreResult = calculateScore({
    volume24h: agent.volume24h,
    holderCount: agent.holderCount,
    priceChange24h: agent.priceChange24h,
    txCount24h: agent.txCount24h,
    createdAt: agent.createdAt,
  });

  // Determine risk level from score and volatility
  let riskLevel: "low" | "medium" | "high" = "medium";
  if (agent.score >= 70 && agent.holderCount >= 50) riskLevel = "low";
  else if (agent.score < 40 || agent.holderCount < 10) riskLevel = "high";

  // Generate strengths/weaknesses from data
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

  // Ensure at least one of each
  if (strengths.length === 0) strengths.push("Active on Nad.fun platform");
  if (weaknesses.length === 0) weaknesses.push("Market conditions can change rapidly");

  const summary = `${agent.name} ($${agent.symbol}) is a ${agent.isGraduated ? "graduated" : "bonding curve"} token on Nad.fun with ${agent.holderCount} holders and a market cap of $${agent.marketCap > 1000 ? (agent.marketCap / 1000).toFixed(1) + "K" : agent.marketCap.toFixed(0)}${agent.description ? `. ${agent.description.slice(0, 150)}` : "."}`;

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
