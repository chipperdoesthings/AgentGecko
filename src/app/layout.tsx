import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import "./globals.css";

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
              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <span className="text-2xl">🦎</span>
                <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                  AgentGecko
                </span>
              </Link>
              <div className="flex items-center gap-6">
                <Link
                  href="/agents"
                  className="text-sm text-zinc-400 hover:text-green-400 transition-colors"
                >
                  Leaderboard
                </Link>
                <a
                  href="https://dev-api.nad.fun"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-400 hover:text-green-400 transition-colors"
                >
                  Nad.fun ↗
                </a>
              </div>
            </div>
          </div>
        </nav>

        {/* Main */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="border-t border-zinc-800 bg-zinc-950 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
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
