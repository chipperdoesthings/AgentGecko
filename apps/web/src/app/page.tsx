"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatsBar } from "@/components/StatsBar";
import { AgentCard } from "@/components/AgentCard";
import { AgentTable } from "@/components/AgentTable";
import { SearchBar } from "@/components/SearchBar";
import { CategoryFilter } from "@/components/CategoryFilter";
import { GeckoTokenBanner } from "@/components/GeckoToken";
import { CompareProvider, CompareBar, CompareModal } from "@/components/CompareDrawer";
import { ErrorBoundary, EmptyState, ErrorCard } from "@/components/ErrorBoundary";
import { useAgents } from "@/hooks/useAgents";
import { AgentCardSkeleton, AgentTableSkeleton } from "@/components/Skeletons";
import { ArrowRight, LayoutGrid, List, Sparkles, Zap, Eye, RefreshCw } from "lucide-react";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [view, setView] = useState<"table" | "grid">("table");

  const { agents, loading, error, reload } = useAgents(query, category);
  const top3 = useMemo(() => agents.slice(0, 3), [agents]);

  return (
    <CompareProvider>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Hero */}
        <section className="text-center space-y-6 py-8 sm:py-12 relative">
          <div className="absolute inset-0 -z-10" aria-hidden="true">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-green-500/5 rounded-full blur-3xl" />
          </div>

          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1.5 text-sm text-green-400 mb-2">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Moltiverse Hackathon 2026
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-green-400 via-green-500 to-emerald-600 bg-clip-text text-transparent">
              CoinGecko
            </span>{" "}
            <span className="text-white">for AI Agents</span>
          </h1>

          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Discover, rank, and invest in autonomous AI trading agents on{" "}
            <span className="text-purple-400 font-semibold">Monad</span> via
            Nad.fun. Powered by{" "}
            <span className="text-green-400 font-semibold">Opus 4.6</span>{" "}
            agent teams.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/agents">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg shadow-green-500/20"
              >
                View Leaderboard <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/watchlist">
              <Button
                variant="outline"
                size="lg"
                className="border-zinc-700 text-zinc-300 hover:border-green-500/50 hover:text-green-400"
              >
                <Eye className="mr-2 h-4 w-4" />
                My Watchlist
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-zinc-500">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            Live data from Nad.fun API
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-sm text-zinc-500">
            <div className="flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-green-400" aria-hidden="true" />
              <span>Multi-Agent Scoring</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-green-400" aria-hidden="true">
                📊
              </span>
              <span>Real-time Rankings</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-green-400" aria-hidden="true">
                🤖
              </span>
              <span>AI-Powered Analysis</span>
            </div>
          </div>
        </section>

        <ErrorBoundary>
          <StatsBar />
        </ErrorBoundary>

        {/* Top 3 Agents */}
        <section className="space-y-4" aria-label="Top agents">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            🏆 Top Agents
          </h2>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <AgentCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <ErrorCard message={error} onRetry={reload} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {top3.map((agent) => (
                <AgentCard key={agent.address} agent={agent} />
              ))}
            </div>
          )}
        </section>

        <GeckoTokenBanner />

        {/* All Agents */}
        <section className="space-y-4" aria-label="All agents">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-white">All Agents</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={reload}
                className="border-zinc-700 text-zinc-400 hover:text-white gap-1.5"
                aria-label="Refresh data"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
                />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              <Button
                variant={view === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("table")}
                className={
                  view === "table"
                    ? "bg-green-600 hover:bg-green-700"
                    : "border-zinc-700 text-zinc-400 hover:text-white"
                }
                aria-label="Table view"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={view === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("grid")}
                className={
                  view === "grid"
                    ? "bg-green-600 hover:bg-green-700"
                    : "border-zinc-700 text-zinc-400 hover:text-white"
                }
                aria-label="Grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <SearchBar value={query} onChange={setQuery} />
            <CategoryFilter selected={category} onChange={setCategory} />
          </div>

          <ErrorBoundary>
            {loading ? (
              view === "table" ? (
                <AgentTableSkeleton />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <AgentCardSkeleton key={i} />
                  ))}
                </div>
              )
            ) : error ? (
              <ErrorCard message={error} onRetry={reload} />
            ) : agents.length === 0 ? (
              <EmptyState />
            ) : view === "table" ? (
              <AgentTable agents={agents} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {agents.map((agent) => (
                  <AgentCard key={agent.address} agent={agent} />
                ))}
              </div>
            )}
          </ErrorBoundary>
        </section>
      </div>

      <CompareBar />
      <CompareModal />
    </CompareProvider>
  );
}
