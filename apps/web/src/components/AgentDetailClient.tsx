"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useAgentDetail } from "@/hooks/useAgents";
import { CATEGORY_META } from "@/types";
import { getScoreColor, getScoreBadge } from "@/lib/scorer";
import { getCategoryColor } from "@/lib/detector";
import { formatCompact, timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  ArrowLeft, TrendingUp, TrendingDown, Users, BarChart3, Clock,
  ExternalLink, ShieldCheck, ShieldAlert, Shield,
} from "lucide-react";
import { WatchlistButton } from "./WatchlistButton";
import { ShareButton } from "./ShareButton";
import { AgentDetailSkeleton } from "./Skeletons";
import { ErrorCard } from "./ErrorBoundary";

const riskConfig = {
  low: { color: "text-green-400 border-green-500/20 bg-green-500/10", icon: ShieldCheck, label: "Low Risk" },
  medium: { color: "text-yellow-400 border-yellow-500/20 bg-yellow-500/10", icon: Shield, label: "Medium Risk" },
  high: { color: "text-red-400 border-red-500/20 bg-red-500/10", icon: ShieldAlert, label: "High Risk" },
};

export default function AgentDetailClient() {
  const params = useParams();
  const address = params.address as string;
  const { agent, loading, error, refetch } = useAgentDetail(address);

  if (loading) return <AgentDetailSkeleton />;

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <ErrorCard
          title="Failed to load agent"
          message={error.message || "Could not fetch agent data. Please try again."}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <span className="text-5xl block mb-4">🦎</span>
        <p className="text-2xl text-zinc-400 font-medium">Agent not found</p>
        <p className="text-sm text-zinc-500 mt-2">This agent may not exist or has been removed.</p>
        <Link href="/agents">
          <Button variant="outline" className="mt-6 border-zinc-700 text-zinc-300">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Leaderboard
          </Button>
        </Link>
      </div>
    );
  }

  const meta = CATEGORY_META[agent.category];
  const isPositive = agent.priceChange24h >= 0;
  const risk = riskConfig[agent.riskLevel];
  const RiskIcon = risk.icon;

  const scoreItems = [
    { label: "Volume", value: agent.scoreBreakdown.volume, weight: "30%" },
    { label: "Holders", value: agent.scoreBreakdown.holders, weight: "25%" },
    { label: "Performance", value: agent.scoreBreakdown.performance, weight: "20%" },
    { label: "Activity", value: agent.scoreBreakdown.activity, weight: "15%" },
    { label: "Age", value: agent.scoreBreakdown.age, weight: "10%" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Link href="/agents">
        <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Leaderboard
        </Button>
      </Link>

      {/* Agent Header */}
      <div className="flex flex-col sm:flex-row items-start gap-6">
        <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center text-3xl shrink-0 ring-2 ring-zinc-700">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {agent.imageUri ? (
            <img src={agent.imageUri} alt={agent.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            meta.icon
          )}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold text-white">{agent.name}</h1>
            <Badge variant="outline" className="text-zinc-400 border-zinc-700">${agent.symbol}</Badge>
            <Badge variant="outline" className={cn("text-xs", getCategoryColor(agent.category))}>{meta.icon} {meta.label}</Badge>
            <Badge variant="outline" className={cn("text-xs", risk.color)}><RiskIcon className="mr-1 h-3 w-3" />{risk.label}</Badge>
            {agent.isGraduated && <Badge className="bg-green-600/20 text-green-400 border-green-500/20">🎓 Graduated</Badge>}
          </div>
          <p className="text-zinc-400 max-w-2xl">{agent.description}</p>
          <p className="text-xs text-zinc-600 font-mono break-all">{agent.address}</p>
        </div>
        <div className="flex items-start gap-2 shrink-0">
          <WatchlistButton address={agent.address} size="sm" variant="outline" showLabel className="border-zinc-700" />
          <ShareButton agent={agent} className="border-zinc-700" />
          <div className="text-right space-y-1 pl-2">
            <div className={cn("text-3xl font-bold", getScoreColor(agent.score))}>
              {getScoreBadge(agent.score)} {agent.score}
            </div>
            <p className="text-sm text-zinc-500">Rank #{agent.rank}</p>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Price", value: `$${agent.price.toFixed(agent.price < 0.01 ? 6 : 4)}` },
          {
            label: "24h Change",
            value: `${isPositive ? "+" : ""}${agent.priceChange24h.toFixed(1)}%`,
            color: isPositive ? "text-green-400" : "text-red-400",
            Icon: isPositive ? TrendingUp : TrendingDown,
          },
          { label: "Market Cap", value: formatCompact(agent.marketCap) },
          { label: "Volume 24h", value: formatCompact(agent.volume24h), Icon: BarChart3 },
          { label: "Holders", value: agent.holderCount.toLocaleString(), Icon: Users },
          { label: "24h Txns", value: agent.txCount24h.toLocaleString(), Icon: Clock },
        ].map((m) => (
          <Card key={m.label} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
            <CardContent className="p-4">
              <p className="text-xs text-zinc-500 flex items-center gap-1">
                {m.Icon && <m.Icon className="h-3 w-3" />}
                {m.label}
              </p>
              <p className={cn("text-lg font-bold text-white mt-1", m.color)}>{m.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Buy CTA */}
      <Card className="bg-gradient-to-r from-green-900/20 via-zinc-900 to-green-900/20 border-green-500/20">
        <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Invest in {agent.name}</h3>
            <p className="text-sm text-zinc-400">Buy ${agent.symbol} on Nad.fun</p>
          </div>
          <a href={`https://nad.fun/tokens/${agent.address}`} target="_blank" rel="noopener noreferrer">
            <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 text-base shadow-lg shadow-green-500/20">
              Buy on Nad.fun <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </a>
        </CardContent>
      </Card>

      {/* Score + Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              📊 Score Breakdown
              <span className="text-xs text-zinc-500 font-normal">AgentGecko Score™</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {scoreItems.map((item) => (
              <div key={item.label} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">
                    {item.label}
                    <span className="text-zinc-600 text-xs ml-1">({item.weight})</span>
                  </span>
                  <span className={cn("font-semibold", getScoreColor(item.value))}>
                    {item.value}
                  </span>
                </div>
                <div className="h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-700",
                      item.value >= 80
                        ? "bg-gradient-to-r from-green-600 to-green-400"
                        : item.value >= 60
                        ? "bg-gradient-to-r from-yellow-600 to-yellow-400"
                        : item.value >= 40
                        ? "bg-gradient-to-r from-orange-600 to-orange-400"
                        : "bg-gradient-to-r from-red-600 to-red-400"
                    )}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
            <Separator className="bg-zinc-800" />
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-zinc-300">Overall Score</span>
              <span className={cn("text-2xl font-bold", getScoreColor(agent.score))}>
                {getScoreBadge(agent.score)} {agent.score}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">🤖 AI Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-zinc-300 text-sm leading-relaxed">{agent.summary}</p>
            <Separator className="bg-zinc-800" />
            <div>
              <h4 className="text-sm font-semibold text-green-400 mb-2">✅ Strengths</h4>
              <ul className="space-y-1.5">
                {agent.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-zinc-400 flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-red-400 mb-2">⚠️ Weaknesses</h4>
              <ul className="space-y-1.5">
                {agent.weaknesses.map((w, i) => (
                  <li key={i} className="text-sm text-zinc-400 flex items-start gap-2">
                    <span className="text-red-400 mt-0.5">•</span> {w}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Trades */}
      {agent.trades && agent.trades.length > 0 && (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">📈 Recent Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-zinc-800 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800">
                    <TableHead className="text-zinc-400">Type</TableHead>
                    <TableHead className="text-zinc-400">Amount</TableHead>
                    <TableHead className="text-zinc-400 hidden sm:table-cell">Price</TableHead>
                    <TableHead className="text-zinc-400 hidden md:table-cell">Trader</TableHead>
                    <TableHead className="text-zinc-400 text-right">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agent.trades.slice(0, 10).map((trade) => (
                    <TableRow key={trade.id} className="border-zinc-800">
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            trade.type === "buy"
                              ? "text-green-400 border-green-500/20 bg-green-500/10"
                              : "text-red-400 border-red-500/20 bg-red-500/10"
                          )}
                        >
                          {trade.type.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-white font-medium">
                        {typeof trade.amount === "number" ? trade.amount.toLocaleString() : trade.amount}
                      </TableCell>
                      <TableCell className="text-zinc-300 hidden sm:table-cell">
                        ${typeof trade.price === "number" ? trade.price.toFixed(4) : trade.price}
                      </TableCell>
                      <TableCell className="text-zinc-500 font-mono text-xs hidden md:table-cell">
                        {trade.trader}
                      </TableCell>
                      <TableCell className="text-zinc-500 text-right text-sm">
                        {timeAgo(trade.timestamp)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
