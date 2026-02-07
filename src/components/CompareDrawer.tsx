"use client";

import { useState, createContext, useContext, useCallback, type ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CATEGORY_META, type Agent } from "@/types";
import { getScoreBadge } from "@/lib/scorer";
import { getCategoryColor } from "@/lib/detector";
import { formatCompact } from "@/lib/format";
import { cn } from "@/lib/utils";
import { X, GitCompareArrows } from "lucide-react";

// --- Context for compare state ---
interface CompareContextType {
  selected: Agent[];
  addToCompare: (agent: Agent) => void;
  removeFromCompare: (address: string) => void;
  clearCompare: () => void;
  isInCompare: (address: string) => boolean;
  showCompare: boolean;
  setShowCompare: (show: boolean) => void;
}

const CompareContext = createContext<CompareContextType>({
  selected: [],
  addToCompare: () => {},
  removeFromCompare: () => {},
  clearCompare: () => {},
  isInCompare: () => false,
  showCompare: false,
  setShowCompare: () => {},
});

export function CompareProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<Agent[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  const addToCompare = useCallback((agent: Agent) => {
    setSelected((prev) => {
      if (prev.length >= 3) return prev;
      if (prev.find((a) => a.address === agent.address)) return prev;
      return [...prev, agent];
    });
  }, []);

  const removeFromCompare = useCallback((address: string) => {
    setSelected((prev) => prev.filter((a) => a.address !== address));
  }, []);

  const clearCompare = useCallback(() => {
    setSelected([]);
    setShowCompare(false);
  }, []);

  const isInCompare = useCallback(
    (address: string) => selected.some((a) => a.address === address),
    [selected]
  );

  return (
    <CompareContext.Provider
      value={{ selected, addToCompare, removeFromCompare, clearCompare, isInCompare, showCompare, setShowCompare }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  return useContext(CompareContext);
}

// --- Compare Button (for each agent card/row) ---
export function CompareButton({ agent, className }: { agent: Agent; className?: string }) {
  const { addToCompare, removeFromCompare, isInCompare, selected } = useCompare();
  const inCompare = isInCompare(agent.address);
  const full = selected.length >= 3;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      removeFromCompare(agent.address);
    } else if (!full) {
      addToCompare(agent);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      disabled={!inCompare && full}
      className={cn(
        "transition-all duration-200 h-8 w-8",
        inCompare
          ? "text-green-400 hover:text-green-300"
          : "text-zinc-500 hover:text-green-400",
        !inCompare && full && "opacity-30 cursor-not-allowed",
        className
      )}
      title={inCompare ? "Remove from compare" : full ? "Max 3 agents" : "Add to compare"}
    >
      <GitCompareArrows className={cn("h-4 w-4", inCompare && "text-green-400")} />
    </Button>
  );
}

// --- Floating Compare Bar ---
export function CompareBar() {
  const { selected, removeFromCompare, clearCompare, setShowCompare } = useCompare();

  if (selected.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-900/95 backdrop-blur-xl border-t border-green-500/30 shadow-lg shadow-green-500/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-x-auto">
            <span className="text-sm text-zinc-400 shrink-0">
              <GitCompareArrows className="h-4 w-4 inline mr-1.5" />
              Compare ({selected.length}/3):
            </span>
            {selected.map((agent) => (
              <Badge
                key={agent.address}
                variant="outline"
                className="border-green-500/30 text-green-400 shrink-0 gap-1.5 pr-1"
              >
                {CATEGORY_META[agent.category].icon} {agent.name}
                <button
                  onClick={() => removeFromCompare(agent.address)}
                  className="ml-1 hover:text-red-400 transition-colors p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearCompare}
              className="text-zinc-400 hover:text-white text-xs"
            >
              Clear
            </Button>
            <Button
              size="sm"
              onClick={() => setShowCompare(true)}
              disabled={selected.length < 2}
              className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold"
            >
              Compare →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Full Comparison Modal ---
export function CompareModal() {
  const { selected, showCompare, setShowCompare, clearCompare } = useCompare();

  if (!showCompare || selected.length < 2) return null;

  const metrics = [
    { key: "score", label: "AgentGecko Score", format: (v: number) => `${getScoreBadge(v)} ${v}` },
    { key: "marketCap", label: "Market Cap", format: formatCompact },
    { key: "price", label: "Price", format: (v: number) => `$${v.toFixed(4)}` },
    { key: "priceChange24h", label: "24h Change", format: (v: number) => `${v >= 0 ? "+" : ""}${v.toFixed(1)}%` },
    { key: "volume24h", label: "24h Volume", format: formatCompact },
    { key: "holderCount", label: "Holders", format: (v: number) => v.toLocaleString() },
    { key: "txCount24h", label: "24h Transactions", format: (v: number) => v.toLocaleString() },
    { key: "rank", label: "Rank", format: (v: number) => `#${v}` },
  ] as const;

  const getVal = (agent: Agent, key: string): number => {
    return (agent as unknown as Record<string, number>)[key] ?? 0;
  };

  const getBest = (key: string) => {
    if (key === "rank") {
      return selected.reduce((best, a) => getVal(a, key) < getVal(best, key) ? a : best).address;
    }
    return selected.reduce((best, a) => getVal(a, key) > getVal(best, key) ? a : best).address;
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowCompare(false)}>
      <Card className="bg-zinc-900 border-zinc-700 w-full max-w-4xl max-h-[85vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-white flex items-center gap-2">
            <GitCompareArrows className="h-5 w-5 text-green-400" />
            Agent Comparison
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={clearCompare} className="text-zinc-400 hover:text-white">
              Clear All
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setShowCompare(false)} className="text-zinc-400 hover:text-white">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-0">
          {/* Agent Headers */}
          <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${selected.length}, 1fr)` }}>
            <div />
            {selected.map((agent) => {
              const meta = CATEGORY_META[agent.category];
              return (
                <div key={agent.address} className="text-center space-y-2 pb-4">
                  <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-2xl mx-auto">
                    {meta.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{agent.name}</p>
                    <p className="text-xs text-zinc-500">${agent.symbol}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn("text-xs", getCategoryColor(agent.category))}
                  >
                    {meta.label}
                  </Badge>
                </div>
              );
            })}
          </div>

          <Separator className="bg-zinc-800" />

          {/* Metric Rows */}
          {metrics.map((metric) => {
            const bestAddr = getBest(metric.key);
            return (
              <div
                key={metric.key}
                className="grid gap-4 py-3 border-b border-zinc-800/50 last:border-0 items-center hover:bg-zinc-800/20 transition-colors"
                style={{ gridTemplateColumns: `200px repeat(${selected.length}, 1fr)` }}
              >
                <span className="text-sm text-zinc-400 font-medium">{metric.label}</span>
                {selected.map((agent) => {
                  const val = getVal(agent, metric.key);
                  const isBest = agent.address === bestAddr;
                  const isPriceChange = metric.key === "priceChange24h";
                  return (
                    <div key={agent.address} className="text-center">
                      <span
                        className={cn(
                          "text-sm font-semibold",
                          isBest ? "text-green-400" : "text-zinc-300",
                          isPriceChange && val < 0 && "text-red-400",
                          isPriceChange && val >= 0 && !isBest && "text-zinc-300"
                        )}
                      >
                        {metric.format(val)}
                      </span>
                      {isBest && selected.length > 1 && (
                        <span className="ml-1 text-green-400 text-xs">★</span>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
