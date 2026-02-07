"use client";

import { useState, useCallback, useEffect } from "react";
import { getWatchlist, toggleWatchlist as toggle } from "@/lib/watchlist";

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<string[]>([]);

  useEffect(() => {
    setWatchlist(getWatchlist());
  }, []);

  const toggleWatchlist = useCallback((address: string) => {
    const result = toggle(address);
    setWatchlist(result.list);
    return result.added;
  }, []);

  const isWatchlisted = useCallback(
    (address: string) => watchlist.includes(address),
    [watchlist]
  );

  return { watchlist, toggleWatchlist, isWatchlisted };
}
