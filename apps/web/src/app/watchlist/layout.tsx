import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Watchlist",
  description:
    "Track your favorite AI trading agents on Monad. Your personal watchlist on AgentGecko, saved locally.",
};

export default function WatchlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
