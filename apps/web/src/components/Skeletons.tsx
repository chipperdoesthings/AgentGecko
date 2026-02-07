"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function AgentCardSkeleton() {
  return (
    <Card className="bg-zinc-900 border-zinc-800 h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full bg-zinc-800" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 bg-zinc-800" />
              <Skeleton className="h-3 w-12 bg-zinc-800" />
            </div>
          </div>
          <div className="text-right space-y-1">
            <Skeleton className="h-5 w-16 bg-zinc-800" />
            <Skeleton className="h-3 w-8 bg-zinc-800 ml-auto" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-5 w-20 rounded-full bg-zinc-800" />
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Skeleton className="h-3 w-14 bg-zinc-800" />
            <Skeleton className="h-4 w-20 bg-zinc-800" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-3 w-14 bg-zinc-800" />
            <Skeleton className="h-4 w-16 bg-zinc-800" />
          </div>
          <Skeleton className="h-3 w-16 bg-zinc-800" />
          <Skeleton className="h-3 w-12 bg-zinc-800" />
        </div>
        <Skeleton className="h-8 w-full rounded-md bg-zinc-800" />
      </CardContent>
    </Card>
  );
}

export function AgentTableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="rounded-lg border border-zinc-800 overflow-hidden">
      <div className="bg-zinc-900/50 p-3 border-b border-zinc-800">
        <div className="flex gap-4">
          {[40, 120, 80, 60, 80, 60, 80, 60].map((w, i) => (
            <Skeleton key={i} className="h-4 bg-zinc-800" style={{ width: w }} />
          ))}
        </div>
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-3 border-b border-zinc-800/50 last:border-0">
          <Skeleton className="h-4 w-8 bg-zinc-800" />
          <div className="flex items-center gap-3 flex-1">
            <Skeleton className="w-8 h-8 rounded-full bg-zinc-800 shrink-0" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-28 bg-zinc-800" />
              <Skeleton className="h-3 w-14 bg-zinc-800" />
            </div>
          </div>
          <Skeleton className="h-5 w-16 bg-zinc-800 hidden md:block" />
          <Skeleton className="h-4 w-12 bg-zinc-800" />
          <Skeleton className="h-4 w-16 bg-zinc-800 hidden sm:block" />
          <Skeleton className="h-4 w-14 bg-zinc-800" />
          <Skeleton className="h-4 w-16 bg-zinc-800 hidden md:block" />
        </div>
      ))}
    </div>
  );
}

export function StatsBarSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded bg-zinc-800" />
              <Skeleton className="h-3 w-16 bg-zinc-800" />
            </div>
            <Skeleton className="h-6 w-20 bg-zinc-800" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function AgentDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Skeleton className="h-8 w-40 bg-zinc-800" />
      <div className="flex flex-col sm:flex-row items-start gap-6">
        <Skeleton className="w-16 h-16 rounded-full bg-zinc-800 shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <Skeleton className="h-8 w-48 bg-zinc-800" />
            <Skeleton className="h-5 w-16 rounded-full bg-zinc-800" />
            <Skeleton className="h-5 w-24 rounded-full bg-zinc-800" />
          </div>
          <Skeleton className="h-4 w-full max-w-2xl bg-zinc-800" />
          <Skeleton className="h-3 w-96 bg-zinc-800" />
        </div>
        <div className="space-y-2 shrink-0">
          <Skeleton className="h-10 w-24 bg-zinc-800" />
          <Skeleton className="h-4 w-16 bg-zinc-800 ml-auto" />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4 space-y-2">
              <Skeleton className="h-3 w-14 bg-zinc-800" />
              <Skeleton className="h-6 w-20 bg-zinc-800" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <Card key={i} className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <Skeleton className="h-5 w-32 bg-zinc-800" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="space-y-1">
                  <Skeleton className="h-3 w-full bg-zinc-800" />
                  <Skeleton className="h-2 w-3/4 bg-zinc-800" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
