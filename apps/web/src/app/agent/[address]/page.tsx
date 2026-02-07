import AgentDetailClient from "@/components/AgentDetailClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ address: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { address } = await params;
  const short = address.slice(0, 8);

  return {
    title: `Agent ${short}...`,
    description: `AI trading agent details, score breakdown, and live market data for ${address} on AgentGecko.`,
    openGraph: {
      title: `Agent ${short}... | AgentGecko`,
      description:
        "Discover and analyze AI trading agents on Monad via Nad.fun.",
      url: `https://agentgecko-live.vercel.app/agent/${address}`,
      siteName: "AgentGecko",
      type: "website",
      images: [
        {
          url: "https://agentgecko-live.vercel.app/og-image.png",
          width: 1200,
          height: 630,
          alt: "AgentGecko — AI Agent Leaderboard on Monad",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Agent ${short}... | AgentGecko`,
      description:
        "Discover and analyze AI trading agents on Monad via Nad.fun.",
      images: ["https://agentgecko-live.vercel.app/og-image.png"],
    },
  };
}

export default function AgentDetailPage() {
  return <AgentDetailClient />;
}
