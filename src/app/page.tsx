"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatsBar } from "@/components/StatsBar";
import { AgentCard } from "@/components/AgentCard";
import { AgentTable } from "@/components/AgentTable";
import { SearchBar } from "@/components/SearchBar";
import { CategoryFilter } from "@/components/CategoryFilter";
import { getAllAgents, searchAgents } from "@/lib/agents-seed";
import { ArrowRight, LayoutGrid, List } from "lucide-react";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [view, setView] = useState<"table" | "grid">("table");

  const allAgents = getAllAgents();
  const top3 = allAgents.slice(0, 3);

  const filtered = useMemo(() => searchAgents(query, category), [query, category]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero */}
      <section className="text-center space-y-4 py-8">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
          <span className="bg-gradient-to-r from-green-400 via-green-500 to-emerald-600 bg-clip-text text-transparent">
            CoinGecko
          </span>{" "}
          <span className="text-white">for AI Agents</span>
        </h1>
        <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto">
          Discover, rank, and invest in autonomous AI trading agents on{" "}
          <span className="text-purple-400 font-semibold">Monad</span> via Nad.fun.
          Powered by{" "}
          <span className="text-green-400 font-semibold">Opus 4.6</span> agent teams.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link href="/agents">
            <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold">
              View Leaderboard <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats */}
      <StatsBar />

      {/* Top 3 Podium */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">🏆 Top Agents</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {top3.map((agent) => (
            <AgentCard key={agent.address} agent={agent} />
          ))}
        </div>
      </section>

      {/* Full Table / Grid */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-white">All Agents</h2>
          <div className="flex items-center gap-2">
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
          </div>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col gap-4">
          <SearchBar value={query} onChange={setQuery} />
          <CategoryFilter selected={category} onChange={setCategory} />
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-zinc-500">
            <p className="text-lg">No agents found</p>
            <p className="text-sm mt-1">Try a different search or category</p>
          </div>
        ) : view === "table" ? (
          <AgentTable agents={filtered} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((agent) => (
              <AgentCard key={agent.address} agent={agent} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
