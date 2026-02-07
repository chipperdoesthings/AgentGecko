import AgentDetailClient from "@/components/AgentDetailClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export function generateMetadata({
  params,
}: {
  params: { address: string };
}): Metadata {
  // Base metadata for agent pages — actual content loaded client-side
  return {
    title: `Agent ${params.address.slice(0, 8)}... | AgentGecko`,
    description: "AI trading agent details, score breakdown, and analysis on AgentGecko.",
    openGraph: {
      title: "Agent Details | AgentGecko",
      description: "Discover and analyze AI trading agents on Monad via Nad.fun.",
      url: `https://agentgecko.vercel.app/agent/${params.address}`,
      siteName: "AgentGecko",
      type: "website",
      images: [
        {
          url: "https://agentgecko.vercel.app/og-image.png",
          width: 1200,
          height: 630,
          alt: "AgentGecko — AI Agent Leaderboard on Monad",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Agent Details | AgentGecko",
      description: "Discover and analyze AI trading agents on Monad via Nad.fun.",
      images: ["https://agentgecko.vercel.app/og-image.png"],
    },
  };
}

export default function AgentDetailPage() {
  return <AgentDetailClient />;
}
