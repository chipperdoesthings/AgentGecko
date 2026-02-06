"use client";

import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AgentCard } from "@/components/AgentCard";
import { AgentTable } from "@/components/AgentTable";
import { SearchBar } from "@/components/SearchBar";
import { CategoryFilter } from "@/components/CategoryFilter";
import { StatsBar } from "@/components/StatsBar";
import { searchAgents } from "@/lib/agents-seed";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";

export default function LeaderboardPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [view, setView] = useState<"table" | "grid">("table");

  const agents = useMemo(() => searchAgents(query, category), [query, category]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-white">
          🏆 Agent Leaderboard
        </h1>
        <p className="text-zinc-400">
          Ranked by AgentGecko Score — combining volume, holders, performance, activity, and age.
        </p>
      </div>

      {/* Stats */}
      <StatsBar />

      {/* Controls */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <SearchBar value={query} onChange={setQuery} />
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
        <CategoryFilter selected={category} onChange={setCategory} />
      </div>

      {/* Results */}
      {agents.length === 0 ? (
        <div className="text-center py-16 text-zinc-500">
          <p className="text-xl">No agents found</p>
          <p className="text-sm mt-2">Try adjusting your search or category filter</p>
        </div>
      ) : view === "table" ? (
        <AgentTable agents={agents} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {agents.map((agent) => (
            <AgentCard key={agent.address} agent={agent} />
          ))}
        </div>
      )}
    </div>
  );
}
