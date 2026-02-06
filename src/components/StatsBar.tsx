"use client";

import { Card, CardContent } from "@/components/ui/card";
import { getStats } from "@/lib/agents-seed";

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

export function StatsBar() {
  const stats = getStats();

  const items = [
    { label: "Total Agents", value: stats.totalAgents.toString(), icon: "🤖" },
    { label: "24h Volume", value: formatNumber(stats.totalVolume), icon: "📊" },
    { label: "Total Market Cap", value: formatNumber(stats.totalMarketCap), icon: "💰" },
    { label: "Total Holders", value: stats.totalHolders.toLocaleString(), icon: "👥" },
    { label: "Avg Score", value: stats.avgScore.toString(), icon: "⭐" },
    { label: "Graduated", value: stats.graduatedCount.toString(), icon: "🎓" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {items.map((item) => (
        <Card
          key={item.label}
          className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors"
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{item.icon}</span>
              <span className="text-xs text-zinc-400">{item.label}</span>
            </div>
            <p className="text-xl font-bold text-white">{item.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
