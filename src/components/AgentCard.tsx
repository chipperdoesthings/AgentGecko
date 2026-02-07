"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CATEGORY_META, type Agent } from "@/types";
import { getScoreColor, getScoreBadge } from "@/lib/scorer";
import { getCategoryColor } from "@/lib/detector";
import { formatCompact } from "@/lib/format";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Users, BarChart3 } from "lucide-react";
import { WatchlistButton } from "./WatchlistButton";
import { CompareButton } from "./CompareDrawer";
import { ShareButton } from "./ShareButton";

interface AgentCardProps {
  agent: Agent;
  showActions?: boolean;
}

export function AgentCard({ agent, showActions = true }: AgentCardProps) {
  const meta = CATEGORY_META[agent.category];
  const isPositive = agent.priceChange24h >= 0;

  return (
    <Link href={`/agent/${agent.address}`}>
      <Card className="bg-zinc-900 border-zinc-800 hover:border-green-500/50 transition-all duration-200 cursor-pointer h-full group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                {meta.icon}
              </div>
              <div>
                <CardTitle className="text-base text-white">{agent.name}</CardTitle>
                <span className="text-xs text-zinc-500">${agent.symbol}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {showActions && (
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <WatchlistButton address={agent.address} />
                  <CompareButton agent={agent} />
                  <ShareButton agent={agent} />
                </div>
              )}
              <div className="text-right pl-1">
                <span className={cn("text-lg font-bold", getScoreColor(agent.score))}>
                  {getScoreBadge(agent.score)} {agent.score}
                </span>
                <p className="text-xs text-zinc-500">#{agent.rank}</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn("text-xs", getCategoryColor(agent.category))}
            >
              {meta.icon} {meta.label}
            </Badge>
            {agent.isGraduated && (
              <Badge className="bg-green-600/20 text-green-400 border-green-500/20 text-xs">
                🎓
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-zinc-500 text-xs">Market Cap</p>
              <p className="text-white font-medium">{formatCompact(agent.marketCap)}</p>
            </div>
            <div>
              <p className="text-zinc-500 text-xs">24h Change</p>
              <p
                className={cn(
                  "font-medium flex items-center gap-1",
                  isPositive ? "text-green-400" : "text-red-400"
                )}
              >
                {isPositive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {isPositive ? "+" : ""}
                {agent.priceChange24h.toFixed(1)}%
              </p>
            </div>
            <div className="flex items-center gap-1 text-zinc-400">
              <BarChart3 className="h-3 w-3" />
              <span className="text-xs">{formatCompact(agent.volume24h)}</span>
            </div>
            <div className="flex items-center gap-1 text-zinc-400">
              <Users className="h-3 w-3" />
              <span className="text-xs">{agent.holderCount.toLocaleString()}</span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full border-green-600 text-green-400 hover:bg-green-600 hover:text-white transition-colors"
          >
            View Agent →
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
