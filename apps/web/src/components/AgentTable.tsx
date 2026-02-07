"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_META, type Agent, type SortField, type SortOrder } from "@/types";
import { getScoreColor, getScoreBadge } from "@/lib/scorer";
import { getCategoryColor } from "@/lib/detector";
import { formatCompact } from "@/lib/format";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { WatchlistButton } from "./WatchlistButton";
import { CompareButton } from "./CompareDrawer";

interface AgentTableProps {
  agents: Agent[];
}

export function AgentTable({ agents }: AgentTableProps) {
  const [sortField, setSortField] = useState<SortField>("rank");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder(field === "rank" ? "asc" : "desc");
    }
  };

  const sorted = [...agents].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    const diff = (aVal as number) - (bVal as number);
    return sortOrder === "asc" ? diff : -diff;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 ml-1 opacity-40" />;
    return sortOrder === "asc" ? (
      <ArrowUp className="h-3 w-3 ml-1 text-green-400" />
    ) : (
      <ArrowDown className="h-3 w-3 ml-1 text-green-400" />
    );
  };

  const SortableHead = ({
    field, children, className,
  }: {
    field: SortField; children: React.ReactNode; className?: string;
  }) => (
    <TableHead
      className={cn("cursor-pointer select-none hover:text-green-400 transition-colors text-zinc-400", className)}
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center">{children}<SortIcon field={field} /></div>
    </TableHead>
  );

  return (
    <div className="rounded-lg border border-zinc-800 overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
            <SortableHead field="rank" className="w-[60px]">#</SortableHead>
            <SortableHead field="name">Agent</SortableHead>
            <TableHead className="text-zinc-400 hidden md:table-cell">Category</TableHead>
            <SortableHead field="score">Score</SortableHead>
            <SortableHead field="marketCap" className="hidden sm:table-cell">MCap</SortableHead>
            <SortableHead field="price" className="hidden lg:table-cell">Price</SortableHead>
            <SortableHead field="priceChange24h">24h %</SortableHead>
            <SortableHead field="volume24h" className="hidden md:table-cell">Volume</SortableHead>
            <SortableHead field="holderCount" className="hidden lg:table-cell">Holders</SortableHead>
            <TableHead className="w-[80px] text-zinc-400" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((agent) => {
            const meta = CATEGORY_META[agent.category];
            const isPositive = agent.priceChange24h >= 0;
            return (
              <TableRow
                key={agent.address}
                className="border-zinc-800 hover:bg-zinc-900/70 cursor-pointer transition-colors group"
              >
                <TableCell className="font-medium text-zinc-400">{agent.rank}</TableCell>
                <TableCell>
                  <Link
                    href={`/agent/${agent.address}`}
                    className="flex items-center gap-3 hover:text-green-400 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-sm shrink-0 group-hover:scale-110 transition-transform">
                      {meta.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-white truncate">{agent.name}</p>
                      <p className="text-xs text-zinc-500">${agent.symbol}</p>
                    </div>
                  </Link>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant="outline" className={cn("text-xs", getCategoryColor(agent.category))}>
                    {meta.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className={cn("font-bold", getScoreColor(agent.score))}>
                    {getScoreBadge(agent.score)} {agent.score}
                  </span>
                </TableCell>
                <TableCell className="hidden sm:table-cell text-zinc-300">
                  {formatCompact(agent.marketCap)}
                </TableCell>
                <TableCell className="hidden lg:table-cell text-zinc-300">
                  ${agent.price.toFixed(4)}
                </TableCell>
                <TableCell>
                  <span className={cn("flex items-center gap-1 font-medium", isPositive ? "text-green-400" : "text-red-400")}>
                    {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {isPositive ? "+" : ""}{agent.priceChange24h.toFixed(1)}%
                  </span>
                </TableCell>
                <TableCell className="hidden md:table-cell text-zinc-300">
                  {formatCompact(agent.volume24h)}
                </TableCell>
                <TableCell className="hidden lg:table-cell text-zinc-300">
                  {agent.holderCount.toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <WatchlistButton address={agent.address} />
                    <CompareButton agent={agent} />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
