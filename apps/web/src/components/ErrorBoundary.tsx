"use client";

import { Component, type ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <ErrorCard
          message={this.state.error?.message || "Something went wrong"}
          onRetry={() => this.setState({ hasError: false, error: null })}
        />
      );
    }
    return this.props.children;
  }
}

interface ErrorCardProps {
  message?: string;
  onRetry?: () => void;
  title?: string;
}

export function ErrorCard({
  message = "Something went wrong loading this content.",
  onRetry,
  title = "Oops!",
}: ErrorCardProps) {
  return (
    <Card className="bg-zinc-900 border-red-500/20">
      <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
          <AlertTriangle className="h-6 w-6 text-red-400" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-sm text-zinc-400 max-w-sm">{message}</p>
        </div>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export function EmptyState({
  icon = "🔍",
  title = "No results found",
  message = "Try adjusting your search or filters",
}: {
  icon?: string;
  title?: string;
  message?: string;
}) {
  return (
    <div className="text-center py-16">
      <span className="text-4xl block mb-3">{icon}</span>
      <p className="text-lg text-zinc-400 font-medium">{title}</p>
      <p className="text-sm text-zinc-600 mt-1">{message}</p>
    </div>
  );
}
