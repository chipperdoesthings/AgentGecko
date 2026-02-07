"use client";

import { useState } from "react";
import { AgentCard } from "@/components/AgentCard";
import { AgentTable } from "@/components/AgentTable";
import { SearchBar } from "@/components/SearchBar";
import { CategoryFilter } from "@/components/CategoryFilter";
import { StatsBar } from "@/components/StatsBar";
import { Button } from "@/components/ui/button";
import { CompareProvider, CompareBar, CompareModal } from "@/components/CompareDrawer";
import { ErrorBoundary, EmptyState, ErrorCard } from "@/components/ErrorBoundary";
import { AgentCardSkeleton, AgentTableSkeleton } from "@/components/Skeletons";
import { useAgents } from "@/hooks/useAgents";
import { LayoutGrid, List, RefreshCw } from "lucide-react";

export default function LeaderboardPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [view, setView] = useState<"table" | "grid">("table");
  const { agents, loading, error, reload } = useAgents(query, category);

  return (
    <CompareProvider>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            🏆 Agent Leaderboard
          </h1>
          <p className="text-zinc-400">
            Ranked by AgentGecko Score — combining volume, holders, performance,
            activity, and age.
          </p>
        </div>

        <ErrorBoundary>
          <StatsBar />
        </ErrorBoundary>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <SearchBar value={query} onChange={setQuery} />
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
      </div>

      <CompareBar />
      <CompareModal />
    </CompareProvider>
  );
}
