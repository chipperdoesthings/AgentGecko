"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Coins, Shield, TrendingUp, Zap } from "lucide-react";

const GECKO_BUY_URL = "https://nad.fun";

export function GeckoBuyButton({ className }: { className?: string }) {
  return (
    <a href={GECKO_BUY_URL} target="_blank" rel="noopener noreferrer" className={className}>
      <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold shadow-lg shadow-green-500/20 gap-2 text-sm">
        <Coins className="h-4 w-4" />
        Buy $GECKO
      </Button>
    </a>
  );
}

export function GeckoTokenBanner() {
  return (
    <Card className="bg-gradient-to-br from-green-900/30 via-zinc-900 to-emerald-900/20 border-green-500/20 overflow-hidden relative">
      {/* Glow effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl" />
      
      <CardContent className="p-6 sm:p-8 relative">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-2xl ring-2 ring-green-500/30">
                🦎
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">$GECKO Token</h3>
                <p className="text-sm text-green-400/80">The AgentGecko Governance & Utility Token</p>
              </div>
              <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20 text-xs">
                Coming Soon
              </Badge>
            </div>

            <p className="text-sm text-zinc-400 max-w-xl">
              $GECKO powers the AgentGecko ecosystem. Hold tokens to unlock premium features, earn revenue share from platform fees, and participate in governance decisions.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-start gap-2">
                <Shield className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-white">Verified Badge</p>
                  <p className="text-xs text-zinc-500">Badge on submitted agents</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <TrendingUp className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-white">Revenue Share</p>
                  <p className="text-xs text-zinc-500">Earn from platform fees</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Zap className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-white">Early Access</p>
                  <p className="text-xs text-zinc-500">New features first</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 shrink-0">
            <a href={GECKO_BUY_URL} target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold shadow-lg shadow-green-500/25 gap-2 px-8 text-base"
              >
                <Coins className="h-5 w-5" />
                Buy $GECKO on Nad.fun
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
            <p className="text-xs text-zinc-500">Launching on Monad via Nad.fun</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function GeckoTokenFooter() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t border-zinc-800">
      <div className="flex items-center gap-3">
        <span className="text-lg">🦎</span>
        <div>
          <p className="text-sm font-semibold text-zinc-300">
            $GECKO — Fueling the AI Agent Economy
          </p>
          <p className="text-xs text-zinc-500">
            Revenue share • Governance • Verified badges • Priority listings
          </p>
        </div>
      </div>
      <a href={GECKO_BUY_URL} target="_blank" rel="noopener noreferrer">
        <Button
          variant="outline"
          size="sm"
          className="border-green-600/50 text-green-400 hover:bg-green-600 hover:text-white gap-1.5"
        >
          <Coins className="h-3.5 w-3.5" />
          Get $GECKO
        </Button>
      </a>
    </div>
  );
}
