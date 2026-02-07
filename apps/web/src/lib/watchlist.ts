"use client";

const WATCHLIST_KEY = "agentgecko-watchlist";

export function getWatchlist(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(WATCHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToWatchlist(address: string): string[] {
  const list = getWatchlist();
  if (!list.includes(address)) {
    list.push(address);
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(list));
  }
  return list;
}

export function removeFromWatchlist(address: string): string[] {
  const list = getWatchlist().filter((a) => a !== address);
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(list));
  return list;
}

export function toggleWatchlist(address: string): { list: string[]; added: boolean } {
  const current = getWatchlist();
  if (current.includes(address)) {
    return { list: removeFromWatchlist(address), added: false };
  }
  return { list: addToWatchlist(address), added: true };
}

export function isWatchlisted(address: string): boolean {
  return getWatchlist().includes(address);
}
