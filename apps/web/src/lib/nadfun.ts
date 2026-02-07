/**
 * Nad.fun API Client
 *
 * Handles real API calls to the Nad.fun platform with:
 * - In-memory TTL cache
 * - Token-bucket rate limiter
 * - Graceful error handling with retries
 */

const API_BASE =
  process.env.NEXT_PUBLIC_NAD_API_URL || "https://api.nadapp.net";

const headers: Record<string, string> = {
  Accept: "application/json",
};
if (typeof process !== "undefined" && process.env?.NAD_API_KEY) {
  headers["X-API-Key"] = process.env.NAD_API_KEY;
}

// ---------------------------------------------------------------------------
// Types — matching real API response shapes
// ---------------------------------------------------------------------------

export interface TokenCreator {
  account_id: string;
  nickname: string;
  bio: string;
  image_uri: string;
}

export interface TokenInfo {
  token_id: string;
  name: string;
  symbol: string;
  description: string;
  image_uri: string;
  is_graduated: boolean;
  is_nsfw: boolean;
  twitter: string | null;
  telegram: string | null;
  website: string | null;
  created_at: number; // unix seconds
  creator: TokenCreator;
  is_cto: boolean;
  hackathon_info: unknown;
}

export interface MarketInfo {
  market_type: "CURVE" | "DEX";
  token_id: string;
  market_id: string;
  reserve_native: string;
  reserve_token: string;
  token_price: string; // USD price as string
  native_price: string;
  price: string;
  price_usd: string;
  price_native: string;
  total_supply: string;
  volume: string;
  ath_price: string;
  ath_price_usd: string;
  ath_price_native: string;
  holder_count: number;
}

export interface MetricTimeframe {
  timeframe: string;
  percent: number;
  transactions: { buy: number; sell: number; total: number };
  volume: { buy: string; sell: string; total: string };
  makers: { buy: number; sell: number; total: number };
}

export interface SwapAccountInfo {
  account_id: string;
  nickname: string;
  bio: string;
  image_uri: string;
}

export interface SwapInfo {
  event_type: "BUY" | "SELL";
  native_amount: string;
  token_amount: string;
  native_price: string;
  value: string;
  transaction_hash: string;
  created_at: number;
}

export interface Swap {
  account_info: SwapAccountInfo;
  swap_info: SwapInfo;
}

// ---------------------------------------------------------------------------
// In-memory TTL cache
// ---------------------------------------------------------------------------

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class TTLCache {
  private store = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    return entry.data as T;
  }

  set<T>(key: string, data: T, ttlMs: number): void {
    this.store.set(key, { data, expiresAt: Date.now() + ttlMs });
  }

  invalidate(prefix?: string): number {
    if (!prefix) {
      const size = this.store.size;
      this.store.clear();
      return size;
    }
    let count = 0;
    const keys = Array.from(this.store.keys());
    for (const key of keys) {
      if (key.startsWith(prefix)) {
        this.store.delete(key);
        count++;
      }
    }
    return count;
  }
}

const cache = new TTLCache();

// Cache TTLs in milliseconds
// In serverless, these only live within a warm instance
const CACHE_TTL = {
  token: 10 * 60_000,   // 10 min — token info rarely changes
  market: 60_000,        // 60s — prices update frequently
  metrics: 60_000,       // 60s
  swaps: 30_000,         // 30s — recent trades
  chart: 5 * 60_000,     // 5 min
} as const;

// ---------------------------------------------------------------------------
// Rate limiter — token bucket
// ---------------------------------------------------------------------------

class RateLimiter {
  private tokens: number;
  private lastRefill: number;

  constructor(
    private maxTokens: number = 10,
    private refillRate: number = 2, // tokens per second
  ) {
    this.tokens = maxTokens;
    this.lastRefill = Date.now();
  }

  private refill(): void {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(this.maxTokens, this.tokens + elapsed * this.refillRate);
    this.lastRefill = now;
  }

  async acquire(): Promise<void> {
    this.refill();
    if (this.tokens >= 1) {
      this.tokens -= 1;
      return;
    }
    // Wait for a token to become available
    const waitMs = ((1 - this.tokens) / this.refillRate) * 1000;
    await new Promise((r) => setTimeout(r, Math.ceil(waitMs)));
    this.refill();
    this.tokens -= 1;
  }
}

const limiter = new RateLimiter(10, 3); // 10 burst, 3/sec sustained

// ---------------------------------------------------------------------------
// Fetch with retry + rate limit
// ---------------------------------------------------------------------------

async function apiFetch<T>(
  path: string,
  cacheKey: string,
  ttlMs: number,
  retries = 2,
): Promise<T | null> {
  // Check cache first
  const cached = cache.get<T>(cacheKey);
  if (cached !== undefined) return cached;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      await limiter.acquire();

      const url = `${API_BASE}${path}`;
      const res = await fetch(url, {
        headers,
        signal: AbortSignal.timeout(10_000),
      });

      if (res.status === 429) {
        // Rate limited by server — back off
        const retryAfter = parseInt(res.headers.get("retry-after") || "5", 10);
        console.warn(`[nadfun] 429 rate limited, waiting ${retryAfter}s`);
        await new Promise((r) => setTimeout(r, retryAfter * 1000));
        continue;
      }

      if (!res.ok) {
        console.warn(`[nadfun] ${res.status} for ${path}`);
        return null;
      }

      const data = (await res.json()) as T;
      cache.set(cacheKey, data, ttlMs);
      return data;
    } catch (err) {
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
        continue;
      }
      console.error(`[nadfun] Failed after ${retries + 1} attempts: ${path}`, err);
      return null;
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Public API functions
// ---------------------------------------------------------------------------

export async function getTokenInfo(tokenId: string): Promise<TokenInfo | null> {
  const res = await apiFetch<{ token_info: TokenInfo }>(
    `/agent/token/${tokenId}`,
    `token:${tokenId}`,
    CACHE_TTL.token,
  );
  return res?.token_info ?? null;
}

export async function getMarketData(tokenId: string): Promise<MarketInfo | null> {
  const res = await apiFetch<{ market_info: MarketInfo }>(
    `/agent/market/${tokenId}`,
    `market:${tokenId}`,
    CACHE_TTL.market,
  );
  return res?.market_info ?? null;
}

export async function getMetrics(
  tokenId: string,
  timeframes = "5,15,60",
): Promise<MetricTimeframe[]> {
  const res = await apiFetch<{ metrics: MetricTimeframe[] }>(
    `/agent/metrics/${tokenId}?timeframes=${timeframes}`,
    `metrics:${tokenId}:${timeframes}`,
    CACHE_TTL.metrics,
  );
  return res?.metrics ?? [];
}

export async function getSwapHistory(
  tokenId: string,
  limit = 20,
): Promise<{ swaps: Swap[]; total_count?: number }> {
  const res = await apiFetch<{ swaps: Swap[]; total_count?: number }>(
    `/agent/swap-history/${tokenId}?limit=${limit}`,
    `swaps:${tokenId}:${limit}`,
    CACHE_TTL.swaps,
  );
  return res ?? { swaps: [] };
}

export async function getChartData(tokenId: string, resolution = "60") {
  const now = Math.floor(Date.now() / 1000);
  const res = await apiFetch<unknown>(
    `/agent/chart/${tokenId}?resolution=${resolution}&from=${now - 86400 * 7}&to=${now}`,
    `chart:${tokenId}:${resolution}`,
    CACHE_TTL.chart,
  );
  return res;
}

// ---------------------------------------------------------------------------
// Cache management
// ---------------------------------------------------------------------------

export function invalidateCache(prefix?: string): number {
  return cache.invalidate(prefix);
}

export function invalidateTokenCache(tokenId: string): void {
  cache.invalidate(`token:${tokenId}`);
  cache.invalidate(`market:${tokenId}`);
  cache.invalidate(`metrics:${tokenId}`);
  cache.invalidate(`swaps:${tokenId}`);
  cache.invalidate(`chart:${tokenId}`);
}
