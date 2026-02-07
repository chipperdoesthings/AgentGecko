"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[AgentGecko Error]", error);
  }, [error]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex items-center justify-center">
      <Card className="bg-zinc-900 border-red-500/20 max-w-lg w-full">
        <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center">
            <AlertTriangle className="h-7 w-7 text-red-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-white">
              Something went wrong
            </h2>
            <p className="text-sm text-zinc-400">
              {error.message || "An unexpected error occurred. Please try again."}
            </p>
          </div>
          <Button
            onClick={reset}
            className="bg-green-600 hover:bg-green-700 text-white gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
