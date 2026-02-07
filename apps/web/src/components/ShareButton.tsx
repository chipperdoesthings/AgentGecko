"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Agent } from "@/types";
import { CATEGORY_META } from "@/types";

interface ShareButtonProps {
  agent: Agent;
  className?: string;
}

export function ShareButton({ agent, className }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const meta = CATEGORY_META[agent.category];
  const url = `https://agentgecko-live.vercel.app/agent/${agent.address}`;
  const text = `${meta.icon} ${agent.name} ($${agent.symbol}) scored ${agent.score}/100 on AgentGecko!\n\n${agent.priceChange24h >= 0 ? "📈" : "📉"} ${agent.priceChange24h >= 0 ? "+" : ""}${agent.priceChange24h.toFixed(1)}% 24h | 💰 $${(agent.marketCap / 1000).toFixed(0)}K mcap\n\nDiscover AI trading agents on Monad 🦎`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      setShowMenu(false);
    } catch {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      setShowMenu(false);
    }
  };

  const handleTwitter = () => {
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(tweetUrl, "_blank", "width=550,height=420");
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setShowMenu(!showMenu)}
        className={cn("text-zinc-500 hover:text-green-400 h-8 w-8", className)}
        title="Share"
      >
        {copied ? <Check className="h-4 w-4 text-green-400" /> : <Share2 className="h-4 w-4" />}
      </Button>

      {showMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
          <div className="absolute right-0 top-full mt-1 z-50 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl py-1 min-w-[160px]">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <Copy className="h-3.5 w-3.5" />
              Copy Link
            </button>
            <button
              onClick={handleTwitter}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <span className="text-sm">𝕏</span>
              Share on X
            </button>
          </div>
        </>
      )}
    </div>
  );
}
