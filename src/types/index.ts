export type Category =
  | "meme_trader"
  | "defi"
  | "sniper"
  | "copy_trader"
  | "arbitrage"
  | "social"
  | "analyst"
  | "trading";

export const CATEGORIES: Category[] = [
  "meme_trader",
  "defi",
  "sniper",
  "copy_trader",
  "arbitrage",
  "social",
  "analyst",
  "trading",
];

export const CATEGORY_META: Record<Category, { label: string; icon: string }> = {
  meme_trader: { label: "Meme Trader", icon: "🐸" },
  defi: { label: "DeFi", icon: "🏦" },
  sniper: { label: "Sniper", icon: "🎯" },
  copy_trader: { label: "Copy Trader", icon: "📋" },
  arbitrage: { label: "Arbitrage", icon: "⚡" },
  social: { label: "Social/Alpha", icon: "📡" },
  analyst: { label: "Analyst", icon: "🔬" },
  trading: { label: "Trading", icon: "📈" },
};

export interface Agent {
  address: string;
  name: string;
  symbol: string;
  description: string;
  imageUri: string;
  category: Category;
  score: number;
  rank: number;
  marketCap: number;
  price: number;
  priceChange24h: number;
  volume24h: number;
  holderCount: number;
  txCount24h: number;
  createdAt: number;
  isGraduated: boolean;
}

export interface Trade {
  id: string;
  type: "buy" | "sell";
  amount: number;
  price: number;
  timestamp: number;
  trader: string;
}

export interface AgentDetail extends Agent {
  strengths: string[];
  weaknesses: string[];
  riskLevel: "low" | "medium" | "high";
  summary: string;
  trades: Trade[];
  scoreBreakdown: {
    volume: number;
    holders: number;
    performance: number;
    activity: number;
    age: number;
  };
}

export type SortField =
  | "rank"
  | "name"
  | "score"
  | "marketCap"
  | "price"
  | "priceChange24h"
  | "volume24h"
  | "holderCount";

export type SortOrder = "asc" | "desc";
