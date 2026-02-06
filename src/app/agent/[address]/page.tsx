"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAgentDetail } from "@/lib/agents-seed";
import { CATEGORY_META } from "@/types";
import { getScoreColor, getScoreBadge } from "@/lib/scorer";
import { getCategoryColor } from "@/lib/detector";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Users,
  BarChart3,
  Clock,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  Shield,
} from "lucide-react";

function formatCompact(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(2)}`;
}

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

const riskConfig = {
  low: { color: "text-green-400 border-green-500/20 bg-green-500/10", icon: ShieldCheck, label: "Low Risk" },
  medium: { color: "text-yellow-400 border-yellow-500/20 bg-yellow-500/10", icon: Shield, label: "Medium Risk" },
  high: { color: "text-red-400 border-red-500/20 bg-red-500/10", icon: ShieldAlert, label: "High Risk" },
};

export default function AgentDetailPage() {
  const params = useParams();
  const address = params.address as string;
  const agent = getAgentDetail(address);

  if (!agent) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-2xl text-zinc-400">Agent not found</p>
        <Link href="/agents">
          <Button variant="outline" className="mt-4 border-zinc-700 text-zinc-300">
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
    { label: "Volume", value: agent.scoreBreakdown.volume, max: 100 },
    { label: "Holders", value: agent.scoreBreakdown.holders, max: 100 },
    { label: "Performance", value: agent.scoreBreakdown.performance, max: 100 },
    { label: "Activity", value: agent.scoreBreakdown.activity, max: 100 },
    { label: "Age", value: agent.scoreBreakdown.age, max: 100 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Button */}
      <Link href="/agents">
        <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Leaderboard
        </Button>
      </Link>

      {/* Agent Header */}
      <div className="flex flex-col sm:flex-row items-start gap-6">
        <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center text-3xl shrink-0">
          {meta.icon}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold text-white">{agent.name}</h1>
            <Badge variant="outline" className="text-zinc-400 border-zinc-700">
              ${agent.symbol}
            </Badge>
            <Badge variant="outline" className={cn("text-xs", getCategoryColor(agent.category))}>
              {meta.icon} {meta.label}
            </Badge>
            <Badge variant="outline" className={cn("text-xs", risk.color)}>
              <RiskIcon className="mr-1 h-3 w-3" />
              {risk.label}
            </Badge>
            {agent.isGraduated && (
              <Badge className="bg-green-600/20 text-green-400 border-green-500/20">
                🎓 Graduated
              </Badge>
            )}
          </div>
          <p className="text-zinc-400 max-w-2xl">{agent.description}</p>
          <p className="text-xs text-zinc-600 font-mono break-all">{agent.address}</p>
        </div>
        <div className="text-right space-y-1 shrink-0">
          <div className={cn("text-3xl font-bold", getScoreColor(agent.score))}>
            {getScoreBadge(agent.score)} {agent.score}
          </div>
          <p className="text-sm text-zinc-500">Rank #{agent.rank}</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4">
            <p className="text-xs text-zinc-500">Price</p>
            <p className="text-lg font-bold text-white">${agent.price.toFixed(4)}</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4">
            <p className="text-xs text-zinc-500">24h Change</p>
            <p
              className={cn(
                "text-lg font-bold flex items-center gap-1",
                isPositive ? "text-green-400" : "text-red-400"
              )}
            >
              {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              {isPositive ? "+" : ""}
              {agent.priceChange24h.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4">
            <p className="text-xs text-zinc-500">Market Cap</p>
            <p className="text-lg font-bold text-white">{formatCompact(agent.marketCap)}</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4">
            <p className="text-xs text-zinc-500 flex items-center gap-1">
              <BarChart3 className="h-3 w-3" /> Volume 24h
            </p>
            <p className="text-lg font-bold text-white">{formatCompact(agent.volume24h)}</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4">
            <p className="text-xs text-zinc-500 flex items-center gap-1">
              <Users className="h-3 w-3" /> Holders
            </p>
            <p className="text-lg font-bold text-white">{agent.holderCount.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4">
            <p className="text-xs text-zinc-500 flex items-center gap-1">
              <Clock className="h-3 w-3" /> 24h Txns
            </p>
            <p className="text-lg font-bold text-white">{agent.txCount24h.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Buy Button */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Invest in {agent.name}</h3>
            <p className="text-sm text-zinc-400">
              Buy ${agent.symbol} on Nad.fun to invest in this AI agent
            </p>
          </div>
          <a
            href={`https://testnet.nad.fun/token/${agent.address}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 text-base">
              Buy on Nad.fun <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </a>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Breakdown */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Score Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {scoreItems.map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">{item.label}</span>
                  <span className={getScoreColor(item.value)}>{item.value}</span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full transition-all"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Analysis */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">AI Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-zinc-300 text-sm">{agent.summary}</p>
            <Separator className="bg-zinc-800" />
            <div>
              <h4 className="text-sm font-semibold text-green-400 mb-2">✅ Strengths</h4>
              <ul className="space-y-1">
                {agent.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-zinc-400 flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-red-400 mb-2">⚠️ Weaknesses</h4>
              <ul className="space-y-1">
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
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Recent Trades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-zinc-800 overflow-hidden">
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
                      {trade.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-zinc-300 hidden sm:table-cell">
                      ${trade.price.toFixed(4)}
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
    </div>
  );
}
