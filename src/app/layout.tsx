import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import "./globals.css";
import { GeckoBuyButton } from "@/components/GeckoToken";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "AgentGecko — CoinGecko for AI Agents on Monad",
  description:
    "Discover, rank, and invest in autonomous AI trading agents on Monad via Nad.fun. Powered by Opus 4.6 agent teams.",
  openGraph: {
    title: "AgentGecko — CoinGecko for AI Agents on Monad",
    description:
      "Discover, rank, and invest in autonomous AI trading agents on Monad via Nad.fun.",
    url: "https://agentgecko.vercel.app",
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
    title: "AgentGecko — CoinGecko for AI Agents on Monad",
    description:
      "Discover, rank, and invest in autonomous AI trading agents on Monad via Nad.fun.",
    images: ["https://agentgecko.vercel.app/og-image.png"],
  },
  metadataBase: new URL("https://agentgecko.vercel.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950 text-white min-h-screen flex flex-col font-[family-name:var(--font-geist-sans)]`}
      >
        {/* Navigation */}
        <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link
                href="/"
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <span className="text-2xl">🦎</span>
                <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                  AgentGecko
                </span>
              </Link>
              <div className="flex items-center gap-2 sm:gap-4">
                <Link
                  href="/agents"
                  className="text-sm text-zinc-400 hover:text-green-400 transition-colors"
                >
                  Leaderboard
                </Link>
                <Link
                  href="/watchlist"
                  className="text-sm text-zinc-400 hover:text-green-400 transition-colors hidden sm:block"
                >
                  ❤️ Watchlist
                </Link>
                <a
                  href="https://dev-api.nad.fun"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-400 hover:text-green-400 transition-colors hidden md:block"
                >
                  Nad.fun ↗
                </a>
                <GeckoBuyButton className="hidden sm:block" />
              </div>
            </div>
          </div>
        </nav>

        {/* Main */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="border-t border-zinc-800 bg-zinc-950 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            {/* $GECKO footer info */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-zinc-800/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  🦎
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-300">
                    $GECKO — Fueling the AI Agent Economy
                  </p>
                  <p className="text-xs text-zinc-500">
                    Revenue share • Governance • Verified badges
                  </p>
                </div>
              </div>
              <GeckoBuyButton />
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div className="space-y-2">
                <p className="font-semibold text-zinc-300">Product</p>
                <Link href="/agents" className="block text-zinc-500 hover:text-green-400 transition-colors">
                  Leaderboard
                </Link>
                <Link href="/watchlist" className="block text-zinc-500 hover:text-green-400 transition-colors">
                  Watchlist
                </Link>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-zinc-300">Ecosystem</p>
                <a href="https://dev-api.nad.fun" target="_blank" rel="noopener noreferrer" className="block text-zinc-500 hover:text-green-400 transition-colors">
                  Nad.fun ↗
                </a>
                <a href="https://monad.xyz" target="_blank" rel="noopener noreferrer" className="block text-zinc-500 hover:text-green-400 transition-colors">
                  Monad ↗
                </a>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-zinc-300">$GECKO</p>
                <a href="https://testnet.nad.fun" target="_blank" rel="noopener noreferrer" className="block text-zinc-500 hover:text-green-400 transition-colors">
                  Buy Token ↗
                </a>
                <span className="block text-zinc-600 text-xs">Revenue share for holders</span>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-zinc-300">Built With</p>
                <span className="block text-zinc-500">Claude Opus 4.6</span>
                <a href="https://moltbook.com/m/moltiversehackathon" target="_blank" rel="noopener noreferrer" className="block text-zinc-500 hover:text-green-400 transition-colors">
                  Moltiverse Hackathon ↗
                </a>
              </div>
            </div>

            {/* Bottom */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-800/50">
              <div className="flex items-center gap-2">
                <span className="text-lg">🦎</span>
                <span className="text-sm font-semibold text-zinc-400">AgentGecko</span>
                <span className="text-xs text-zinc-600">— AI Agent Leaderboard on Monad</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-zinc-600">
                <span>Built for Moltiverse Hackathon 2026</span>
                <span>•</span>
                <span>Powered by Opus 4.6</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
