"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { isWatchlisted, toggleWatchlist } from "@/lib/watchlist";
import { cn } from "@/lib/utils";

interface WatchlistButtonProps {
  address: string;
  size?: "sm" | "default" | "lg" | "icon";
  variant?: "outline" | "ghost";
  showLabel?: boolean;
  className?: string;
  onToggle?: (added: boolean) => void;
}

export function WatchlistButton({
  address,
  size = "icon",
  variant = "ghost",
  showLabel = false,
  className,
  onToggle,
}: WatchlistButtonProps) {
  const [watched, setWatched] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setWatched(isWatchlisted(address));
  }, [address]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const result = toggleWatchlist(address);
    setWatched(result.added);
    if (result.added) {
      setAnimate(true);
      setTimeout(() => setAnimate(false), 400);
    }
    onToggle?.(result.added);
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={cn(
        "transition-all duration-200",
        watched
          ? "text-red-400 hover:text-red-300"
          : "text-zinc-500 hover:text-red-400",
        className
      )}
      title={watched ? "Remove from watchlist" : "Add to watchlist"}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-all",
          watched && "fill-red-400",
          animate && "scale-125"
        )}
      />
      {showLabel && (
        <span className="ml-1.5 text-sm">
          {watched ? "Watchlisted" : "Watch"}
        </span>
      )}
    </Button>
  );
}
