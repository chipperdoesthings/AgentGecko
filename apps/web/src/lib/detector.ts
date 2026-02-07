const AGENT_KEYWORDS = [
  "agent", "ai", "bot", "autonomous", "trading", "autopilot", "copilot",
  "pilot", "sniper", "tracker", "defi", "yield", "arbitrage", "mev",
  "openclaw", "moltbot", "claude", "gpt", "automated", "algo", "strategy",
  "intelligence", "neural", "prediction", "analyzer", "scanner", "monitor",
];

const NICHE_KEYWORDS: Record<string, string[]> = {
  meme_trader: ["meme", "degen", "ape", "flip", "shitcoin", "pump", "moon", "gem"],
  defi: ["defi", "yield", "farm", "liquidity", "pool", "stake", "vault", "lend"],
  sniper: ["sniper", "snipe", "launch", "new token", "early", "first", "fast"],
  copy_trader: ["copy", "mirror", "follow", "whale", "smart money", "track"],
  arbitrage: ["arbitrage", "arb", "spread", "cross", "dex"],
  social: ["social", "twitter", "sentiment", "news", "signal", "alpha", "community"],
  analyst: ["analysis", "analyze", "research", "score", "rate", "audit", "risk"],
};

export function detectAgent(name: string, symbol: string, description: string) {
  const text = `${name} ${symbol} ${description}`.toLowerCase();
  const matchedKeywords = AGENT_KEYWORDS.filter((kw) => text.includes(kw));
  const isAgent = matchedKeywords.length >= 2;
  const confidence = Math.min(1, matchedKeywords.length / 5);

  let category = "other";
  let maxNicheMatches = 0;
  for (const [niche, keywords] of Object.entries(NICHE_KEYWORDS)) {
    const matches = keywords.filter((kw) => text.includes(kw)).length;
    if (matches > maxNicheMatches) { maxNicheMatches = matches; category = niche; }
  }
  if (maxNicheMatches === 0 && isAgent) category = "trading";

  return { isAgent, confidence, category, matchedKeywords };
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    meme_trader: "Meme Trader", defi: "DeFi", sniper: "Sniper",
    copy_trader: "Copy Trader", arbitrage: "Arbitrage", social: "Social/Alpha",
    analyst: "Analyst", trading: "Trading", other: "Other",
  };
  return labels[category] || "Other";
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    meme_trader: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    defi: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    sniper: "bg-red-500/10 text-red-500 border-red-500/20",
    copy_trader: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    arbitrage: "bg-green-500/10 text-green-500 border-green-500/20",
    social: "bg-pink-500/10 text-pink-500 border-pink-500/20",
    analyst: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
    trading: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    other: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  };
  return colors[category] || colors.other;
}
