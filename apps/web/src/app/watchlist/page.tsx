"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AgentCard } from "@/components/AgentCard";
import { AgentTable } from "@/components/AgentTable";
import { CompareProvider, CompareBar, CompareModal } from "@/components/CompareDrawer";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AgentCardSkeleton, AgentTableSkeleton } from "@/components/Skeletons";
import { useWatchlist } from "@/hooks/useWatchlist";
import { fetchAgents } from "@/lib/api-client";
import type { Agent } from "@/types";
import {
  ArrowLeft,
  Heart,
  LayoutGrid,
  List,
} from "lucide-react";

export default function WatchlistPage() {
  const { watchlist } = useWatchlist();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"table" | "grid">("grid");

  // Load all agents and filter to watchlisted ones
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetchAgents({ limit: 100 })
      .then((data) => {
        if (!cancelled) {
          const watched = data.agents.filter((a) =>
            watchlist.includes(a.address),
          );
          setAgents(watched);
        }
      })
      .catch(() => {
        // If API fails, just show empty
        if (!cancelled) setAgents([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [watchlist]);

  const sortedAgents = useMemo(
    () => [...agents].sort((a, b) => b.score - a.score),
    [agents],
  );

  return (
    <CompareProvider>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-zinc-400 hover:text-white -ml-2"
                >
                  <ArrowLeft className="mr-1 h-4 w-4" /> Back
                </Button>
              </Link>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white flex items-center gap-3">
              <Heart className="h-8 w-8 text-red-400 fill-red-400" />
              My Watchlist
            </h1>
            <p className="text-zinc-400">
              {watchlist.length === 0
                ? "You haven't added any agents yet."
                : `Tracking ${watchlist.length} agent${watchlist.length === 1 ? "" : "s"}`}
            </p>
          </div>

          {sortedAgents.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant={view === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("grid")}
                className={
                  view === "grid"
                    ? "bg-green-600 hover:bg-green-700"
                    : "border-zinc-700 text-zinc-400 hover:text-white"
                }
              >
                <LayoutGrid className="h-4 w-4" />
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
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Content */}
        <ErrorBoundary>
          {loading ? (
            view === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: Math.min(watchlist.length || 4, 8) }).map(
                  (_, i) => (
                    <AgentCardSkeleton key={i} />
                  ),
                )}
              </div>
            ) : (
              <AgentTableSkeleton rows={Math.min(watchlist.length || 4, 8)} />
            )
          ) : sortedAgents.length === 0 ? (
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="flex flex-col items-center justify-center py-20 px-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center">
                  <Heart className="h-8 w-8 text-zinc-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-white">
                    No agents in your watchlist
                  </h3>
                  <p className="text-sm text-zinc-400 max-w-md">
                    Click the ❤️ heart button on any agent to add it to your
                    watchlist. Your watchlist is saved locally in your browser.
                  </p>
                </div>
                <Link href="/agents">
                  <Button className="bg-green-600 hover:bg-green-700 text-white mt-2">
                    Browse Agents
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : view === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {sortedAgents.map((agent) => (
                <AgentCard key={agent.address} agent={agent} />
              ))}
            </div>
          ) : (
            <AgentTable agents={sortedAgents} />
          )}
        </ErrorBoundary>

        {/* Info */}
        {watchlist.length > 0 && (
          <div className="text-center text-xs text-zinc-600 py-4">
            💡 Your watchlist is saved in your browser&apos;s local storage — no
            account needed.
          </div>
        )}
      </div>

      <CompareBar />
      <CompareModal />
    </CompareProvider>
  );
}
