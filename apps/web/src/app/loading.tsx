import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero skeleton */}
      <div className="text-center space-y-4 py-8">
        <Skeleton className="h-8 w-48 mx-auto bg-zinc-800" />
        <Skeleton className="h-12 w-96 mx-auto bg-zinc-800" />
        <Skeleton className="h-6 w-80 mx-auto bg-zinc-800" />
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4 space-y-2">
              <Skeleton className="h-4 w-20 bg-zinc-800" />
              <Skeleton className="h-6 w-16 bg-zinc-800" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-32 bg-zinc-800" />
        <div className="rounded-lg border border-zinc-800 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-3 border-b border-zinc-800/50"
            >
              <Skeleton className="h-4 w-8 bg-zinc-800" />
              <Skeleton className="w-8 h-8 rounded-full bg-zinc-800" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-28 bg-zinc-800" />
                <Skeleton className="h-3 w-14 bg-zinc-800" />
              </div>
              <Skeleton className="h-4 w-16 bg-zinc-800" />
              <Skeleton className="h-4 w-14 bg-zinc-800" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
