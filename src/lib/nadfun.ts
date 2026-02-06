const API_URL = process.env.NEXT_PUBLIC_NAD_API_URL || "https://dev-api.nad.fun";

const headers: Record<string, string> = {};
if (typeof process !== "undefined" && process.env?.NAD_API_KEY) {
  headers["X-API-Key"] = process.env.NAD_API_KEY;
}

export interface TokenInfo {
  token_id: string;
  name: string;
  symbol: string;
  description: string;
  image_uri: string;
  creator: string;
  is_graduated: boolean;
  created_at: string;
}

export interface MarketInfo {
  market_type: string;
  price_usd: number;
  price_mon: number;
  holder_count: number;
  volume: number;
  volume_24h: number;
  ath_price: number;
  market_cap: number;
}

export async function getTokenInfo(tokenId: string): Promise<TokenInfo | null> {
  try {
    const res = await fetch(`${API_URL}/agent/token/${tokenId}`, { headers, next: { revalidate: 300 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.token_info;
  } catch { return null; }
}

export async function getMarketData(tokenId: string): Promise<MarketInfo | null> {
  try {
    const res = await fetch(`${API_URL}/agent/market/${tokenId}`, { headers, next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.market_info;
  } catch { return null; }
}

export async function getMetrics(tokenId: string, timeframes = "1,5,60,1440") {
  try {
    const res = await fetch(`${API_URL}/agent/metrics/${tokenId}?timeframes=${timeframes}`, { headers, next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.metrics || [];
  } catch { return []; }
}

export async function getSwapHistory(tokenId: string, limit = 20) {
  try {
    const res = await fetch(`${API_URL}/agent/swap-history/${tokenId}?limit=${limit}`, { headers, next: { revalidate: 60 } });
    if (!res.ok) return { swaps: [], total_count: 0 };
    return await res.json();
  } catch { return { swaps: [], total_count: 0 }; }
}

export async function getChartData(tokenId: string, resolution = "60") {
  const now = Math.floor(Date.now() / 1000);
  try {
    const res = await fetch(`${API_URL}/agent/chart/${tokenId}?resolution=${resolution}&from=${now - 86400 * 7}&to=${now}`, { headers, next: { revalidate: 300 } });
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

export async function getHoldings(accountId: string, page = 1, limit = 20) {
  try {
    const res = await fetch(`${API_URL}/agent/holdings/${accountId}?page=${page}&limit=${limit}`, { headers, next: { revalidate: 120 } });
    if (!res.ok) return { tokens: [], total_count: 0 };
    return await res.json();
  } catch { return { tokens: [], total_count: 0 }; }
}
