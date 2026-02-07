export interface AgentScore {
  overall: number;
  volume: number;
  holders: number;
  performance: number;
  activity: number;
  age: number;
}

export function calculateScore(metrics: {
  volume24h: number;
  holderCount: number;
  priceChange24h: number;
  txCount24h: number;
  createdAt: number;
}): AgentScore {
  const volumeScore = Math.min(100, metrics.volume24h > 0 ? Math.log10(metrics.volume24h + 1) * 20 : 0);
  const holderScore = Math.min(100, metrics.holderCount > 0 ? Math.log10(metrics.holderCount + 1) * 33 : 0);
  const perfClamped = Math.max(-100, Math.min(200, metrics.priceChange24h));
  const performanceScore = Math.min(100, Math.max(0, 50 + perfClamped * 0.25));
  const activityScore = Math.min(100, metrics.txCount24h > 0 ? Math.log10(metrics.txCount24h + 1) * 40 : 0);
  const ageHours = (Date.now() - metrics.createdAt) / 3600000;
  const ageScore = Math.min(100, Math.sqrt(ageHours) * 5);

  const overall = volumeScore * 0.3 + holderScore * 0.25 + performanceScore * 0.2 + activityScore * 0.15 + ageScore * 0.1;

  return {
    overall: Math.round(overall * 10) / 10,
    volume: Math.round(volumeScore * 10) / 10,
    holders: Math.round(holderScore * 10) / 10,
    performance: Math.round(performanceScore * 10) / 10,
    activity: Math.round(activityScore * 10) / 10,
    age: Math.round(ageScore * 10) / 10,
  };
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-400";
  if (score >= 60) return "text-yellow-400";
  if (score >= 40) return "text-orange-400";
  return "text-red-400";
}

export function getScoreBadge(score: number): string {
  if (score >= 80) return "🔥";
  if (score >= 60) return "✨";
  if (score >= 40) return "👀";
  return "💤";
}
