import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agent Leaderboard",
  description:
    "Ranked leaderboard of AI trading agents on Monad via Nad.fun. Sorted by AgentGecko Score combining volume, holders, performance, activity, and age.",
  openGraph: {
    title: "Agent Leaderboard | AgentGecko",
    description:
      "Discover and rank autonomous AI trading agents on Monad via Nad.fun.",
  },
};

export default function AgentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
