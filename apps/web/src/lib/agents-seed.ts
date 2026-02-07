import type { Agent, AgentDetail, Trade } from "@/types";

export const MOCK_AGENTS: Agent[] = [
  {
    address: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef01",
    name: "DegenFlipBot",
    symbol: "DFLIP",
    description:
      "Autonomous meme token trading agent. Apes into new launches, flips for profit. Degen-approved AI pump detector.",
    imageUri: "",
    category: "meme_trader",
    score: 82.4,
    rank: 1,
    marketCap: 487000,
    price: 0.0487,
    priceChange24h: 34.2,
    volume24h: 215000,
    holderCount: 1842,
    txCount24h: 1460,
    createdAt: Date.now() - 12 * 86400000,
    isGraduated: true,
  },
  {
    address: "0x2b3c4d5e6f7890abcdef1234567890abcdef0102",
    name: "YieldMaxxor",
    symbol: "YMAX",
    description:
      "DeFi yield optimization agent. Autonomously farms the best APY vaults on Monad. Compounds and rebalances 24/7.",
    imageUri: "",
    category: "defi",
    score: 78.6,
    rank: 2,
    marketCap: 392000,
    price: 0.0392,
    priceChange24h: 12.8,
    volume24h: 168000,
    holderCount: 1203,
    txCount24h: 890,
    createdAt: Date.now() - 18 * 86400000,
    isGraduated: true,
  },
  {
    address: "0x3c4d5e6f7890abcdef1234567890abcdef010203",
    name: "AlphaSniper",
    symbol: "ASNIP",
    description:
      "First-block sniper bot agent. Detects new token launches and snipes within milliseconds. Fast, autonomous, ruthless.",
    imageUri: "",
    category: "sniper",
    score: 75.1,
    rank: 3,
    marketCap: 310000,
    price: 0.031,
    priceChange24h: -5.4,
    volume24h: 142000,
    holderCount: 967,
    txCount24h: 2100,
    createdAt: Date.now() - 8 * 86400000,
    isGraduated: false,
  },
  {
    address: "0x4d5e6f7890abcdef1234567890abcdef01020304",
    name: "WhaleMirror",
    symbol: "WMRR",
    description:
      "Copy trading agent that mirrors whale wallets. Tracks smart money on Monad and follows their every move.",
    imageUri: "",
    category: "copy_trader",
    score: 71.3,
    rank: 4,
    marketCap: 245000,
    price: 0.0245,
    priceChange24h: 8.9,
    volume24h: 98000,
    holderCount: 756,
    txCount24h: 340,
    createdAt: Date.now() - 22 * 86400000,
    isGraduated: true,
  },
  {
    address: "0x5e6f7890abcdef1234567890abcdef0102030405",
    name: "ArbBot9000",
    symbol: "ARB9K",
    description:
      "Cross-DEX arbitrage agent exploiting price spreads across Monad DEXes. Lightning fast autonomous execution.",
    imageUri: "",
    category: "arbitrage",
    score: 68.9,
    rank: 5,
    marketCap: 198000,
    price: 0.0198,
    priceChange24h: -2.1,
    volume24h: 87000,
    holderCount: 623,
    txCount24h: 3200,
    createdAt: Date.now() - 30 * 86400000,
    isGraduated: true,
  },
  {
    address: "0x6f7890abcdef1234567890abcdef010203040506",
    name: "SentimentAI",
    symbol: "SENT",
    description:
      "Social alpha agent. Monitors Twitter sentiment, community signals, and breaking news to generate alpha calls.",
    imageUri: "",
    category: "social",
    score: 64.2,
    rank: 6,
    marketCap: 156000,
    price: 0.0156,
    priceChange24h: 19.7,
    volume24h: 72000,
    holderCount: 512,
    txCount24h: 210,
    createdAt: Date.now() - 15 * 86400000,
    isGraduated: false,
  },
  {
    address: "0x7890abcdef1234567890abcdef01020304050607",
    name: "RiskScope",
    symbol: "RSKP",
    description:
      "On-chain analyst agent. Audits smart contracts, scores token risk, and provides deep analysis for traders.",
    imageUri: "",
    category: "analyst",
    score: 59.8,
    rank: 7,
    marketCap: 112000,
    price: 0.0112,
    priceChange24h: 3.2,
    volume24h: 45000,
    holderCount: 389,
    txCount24h: 120,
    createdAt: Date.now() - 25 * 86400000,
    isGraduated: false,
  },
  {
    address: "0x890abcdef1234567890abcdef0102030405060708",
    name: "MonadTrader",
    symbol: "MTRD",
    description:
      "General purpose AI trading agent on Monad. Executes automated strategies with adaptive risk management.",
    imageUri: "",
    category: "trading",
    score: 55.4,
    rank: 8,
    marketCap: 89000,
    price: 0.0089,
    priceChange24h: -8.5,
    volume24h: 34000,
    holderCount: 278,
    txCount24h: 180,
    createdAt: Date.now() - 35 * 86400000,
    isGraduated: false,
  },
];

function generateTrades(count: number): Trade[] {
  const trades: Trade[] = [];
  const now = Date.now();
  for (let i = 0; i < count; i++) {
    trades.push({
      id: `trade-${i}`,
      type: Math.random() > 0.45 ? "buy" : "sell",
      amount: Math.round(Math.random() * 50000 + 100),
      price: Math.random() * 0.05 + 0.001,
      timestamp: now - Math.random() * 86400000,
      trader: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
    });
  }
  return trades.sort((a, b) => b.timestamp - a.timestamp);
}

const DETAIL_DATA: Record<
  string,
  Pick<AgentDetail, "strengths" | "weaknesses" | "riskLevel" | "summary" | "scoreBreakdown">
> = {
  "0x1a2b3c4d5e6f7890abcdef1234567890abcdef01": {
    strengths: ["High volume and active community", "Fast meme detection algorithm", "Consistently profitable flips"],
    weaknesses: ["High-risk meme exposure", "Relies on hype cycles", "Volatile returns"],
    riskLevel: "high",
    summary:
      "DegenFlipBot is the top meme trading agent on Monad, known for its lightning-fast pump detection and high-volume trades.",
    scoreBreakdown: { volume: 89, holders: 78, performance: 82, activity: 90, age: 65 },
  },
  "0x2b3c4d5e6f7890abcdef1234567890abcdef0102": {
    strengths: ["Consistent yield generation", "Auto-compounding strategy", "Low drawdown"],
    weaknesses: ["Moderate APY ceiling", "Dependent on DeFi TVL", "Slower growth"],
    riskLevel: "low",
    summary:
      "YieldMaxxor optimizes DeFi yields across Monad vaults, offering steady returns with automated compounding.",
    scoreBreakdown: { volume: 82, holders: 72, performance: 75, activity: 70, age: 78 },
  },
  "0x3c4d5e6f7890abcdef1234567890abcdef010203": {
    strengths: ["Sub-second execution", "Excellent launch detection", "High win rate on snipes"],
    weaknesses: ["Concentrated risk per trade", "Occasional failed snipes", "Newer agent"],
    riskLevel: "high",
    summary:
      "AlphaSniper excels at first-block token sniping with millisecond execution and a strong track record.",
    scoreBreakdown: { volume: 78, holders: 65, performance: 68, activity: 95, age: 55 },
  },
  "0x4d5e6f7890abcdef1234567890abcdef01020304": {
    strengths: ["Tracks top whale wallets", "Diversified copy strategy", "Transparent trade history"],
    weaknesses: ["Lagging indicator by nature", "Whale exits can be fast", "Moderate volume"],
    riskLevel: "medium",
    summary:
      "WhaleMirror copies smart money trades on Monad, offering exposure to whale-level strategies for retail holders.",
    scoreBreakdown: { volume: 68, holders: 62, performance: 72, activity: 55, age: 82 },
  },
  "0x5e6f7890abcdef1234567890abcdef0102030405": {
    strengths: ["Cross-DEX price discovery", "High frequency trading", "Consistent small profits"],
    weaknesses: ["Thin margins per trade", "Gas cost sensitive", "Requires deep liquidity"],
    riskLevel: "medium",
    summary:
      "ArbBot9000 exploits cross-DEX price inefficiencies on Monad with high-frequency automated arbitrage.",
    scoreBreakdown: { volume: 65, holders: 58, performance: 62, activity: 98, age: 88 },
  },
  "0x6f7890abcdef1234567890abcdef010203040506": {
    strengths: ["Real-time sentiment analysis", "Community-driven alpha", "Growing follower base"],
    weaknesses: ["Signal noise in social data", "Unproven long-term track", "Moderate holder count"],
    riskLevel: "medium",
    summary:
      "SentimentAI monitors Twitter and community channels to generate social alpha calls for Monad traders.",
    scoreBreakdown: { volume: 60, holders: 52, performance: 78, activity: 45, age: 70 },
  },
  "0x7890abcdef1234567890abcdef01020304050607": {
    strengths: ["Deep on-chain analysis", "Risk scoring accuracy", "Trusted by community"],
    weaknesses: ["Lower trading volume", "Niche appeal", "Slower adoption"],
    riskLevel: "low",
    summary:
      "RiskScope provides on-chain audit and risk scoring for tokens on Monad, trusted by careful traders.",
    scoreBreakdown: { volume: 48, holders: 45, performance: 58, activity: 38, age: 85 },
  },
  "0x890abcdef1234567890abcdef0102030405060708": {
    strengths: ["Adaptive strategies", "Solid risk management", "Multi-pair coverage"],
    weaknesses: ["Generic approach", "Lower returns than specialists", "Smaller community"],
    riskLevel: "medium",
    summary:
      "MonadTrader is a general-purpose AI trading agent with adaptive strategies and built-in risk management.",
    scoreBreakdown: { volume: 42, holders: 38, performance: 45, activity: 42, age: 90 },
  },
};

export function getAgentDetail(address: string): AgentDetail | null {
  const agent = MOCK_AGENTS.find((a) => a.address === address);
  if (!agent) return null;

  const detail = DETAIL_DATA[address] || {
    strengths: ["Active development"],
    weaknesses: ["Limited history"],
    riskLevel: "medium" as const,
    summary: "An AI trading agent on Monad.",
    scoreBreakdown: { volume: 50, holders: 50, performance: 50, activity: 50, age: 50 },
  };

  return {
    ...agent,
    ...detail,
    trades: generateTrades(20),
  };
}

export function getAllAgents(): Agent[] {
  return MOCK_AGENTS;
}

export function searchAgents(query: string, category?: string): Agent[] {
  let results = MOCK_AGENTS;
  if (query) {
    const q = query.toLowerCase();
    results = results.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.symbol.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q)
    );
  }
  if (category && category !== "all") {
    results = results.filter((a) => a.category === category);
  }
  return results;
}

export function getStats() {
  const agents = MOCK_AGENTS;
  return {
    totalAgents: agents.length,
    totalVolume: agents.reduce((sum, a) => sum + a.volume24h, 0),
    totalMarketCap: agents.reduce((sum, a) => sum + a.marketCap, 0),
    totalHolders: agents.reduce((sum, a) => sum + a.holderCount, 0),
    avgScore: Math.round((agents.reduce((sum, a) => sum + a.score, 0) / agents.length) * 10) / 10,
    graduatedCount: agents.filter((a) => a.isGraduated).length,
  };
}
