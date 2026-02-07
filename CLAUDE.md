# CLAUDE.md — AgentGecko

## What Is This?

AgentGecko is **CoinGecko for AI trading agents on Monad**. It aggregates, ranks, and lets users invest in autonomous trading agents via Nad.fun.

**Hackathon**: Moltiverse (Feb 2-15, 2026) · $200K prizes · Agent + Token Track

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   NEXT.JS APP (SSR)                      │
│                                                          │
│  Frontend (shadcn/ui)         API Routes                 │
│  ┌──────────────────┐        ┌────────────────┐         │
│  │ / Homepage       │        │ /api/agents    │         │
│  │ /agents Board    │◄──────►│ /api/agent/:id │         │
│  │ /agent/:addr     │        │ /api/stats     │         │
│  │ /watchlist       │        │ /api/refresh   │         │
│  └──────────────────┘        └───────┬────────┘         │
│                                      │                   │
│                              ┌───────▼────────┐         │
│                              │  Nad.fun API   │         │
│                              │ api.nadapp.net │         │
│                              └────────────────┘         │
└─────────────────────────────────────────────────────────┘
```

## Data Flow

1. **Seed tokens** → Curated list of Nad.fun token addresses (`seed-tokens.ts`)
2. **Agent service** → Fetches token info, market data, metrics from Nad.fun API
3. **Scorer** → Calculates AgentGecko Score from 5 weighted factors
4. **Detector** → Classifies tokens into 8 categories by keyword matching
5. **API routes** → Serve processed data with Zod-validated params
6. **Client** → React components fetch from API routes, display with shadcn/ui

## Tech Stack

| Layer | Tech | Why |
|-------|------|-----|
| Framework | Next.js 14 (App Router, SSR) | SSR + API routes in one |
| UI | shadcn/ui + Tailwind v3 | Clean components, fast dev |
| Data | Nad.fun REST API (api.nadapp.net) | No DB needed for MVP |
| Validation | Zod | API input validation |
| Deploy | Vercel | Free, instant |

## Project Structure (Monorepo)

```
AgentGecko/
├── apps/
│   └── web/
│       ├── src/
│       │   ├── app/
│       │   │   ├── page.tsx              # Homepage: hero + stats + top agents + table
│       │   │   ├── layout.tsx            # Nav + footer + SEO
│       │   │   ├── globals.css           # Tailwind + custom styles
│       │   │   ├── agents/page.tsx       # Full leaderboard
│       │   │   ├── agent/[address]/
│       │   │   │   └── page.tsx          # Agent detail: metrics + chart + trades
│       │   │   ├── watchlist/page.tsx    # User's watchlisted agents
│       │   │   └── api/
│       │   │       ├── agents/route.ts   # List/search agents (Zod validated)
│       │   │       ├── agent/[address]/route.ts  # Single agent detail
│       │   │       ├── stats/route.ts    # Aggregate stats
│       │   │       └── refresh/route.ts  # Trigger agent data refresh
│       │   ├── lib/
│       │   │   ├── nadfun.ts             # Nad.fun API client (TTL cache + rate limiter)
│       │   │   ├── agent-service.ts      # Agent data orchestration (server singleton)
│       │   │   ├── detector.ts           # Agent detection (keyword matching)
│       │   │   ├── scorer.ts             # Scoring algorithm (5-factor weighted)
│       │   │   ├── seed-tokens.ts        # Curated seed addresses
│       │   │   ├── api-client.ts         # Client-side fetch helpers
│       │   │   ├── watchlist.ts          # localStorage watchlist
│       │   │   ├── format.ts             # Number/date formatting
│       │   │   └── utils.ts              # cn() + misc
│       │   ├── components/
│       │   │   ├── ui/                   # shadcn components
│       │   │   ├── AgentCard.tsx          # Card view for agents
│       │   │   ├── AgentTable.tsx         # Table view (sortable)
│       │   │   ├── AgentDetailClient.tsx  # Agent detail page content
│       │   │   ├── StatsBar.tsx           # Aggregate stats display
│       │   │   ├── SearchBar.tsx          # Search input
│       │   │   ├── CategoryFilter.tsx     # Category pill filters
│       │   │   ├── CompareDrawer.tsx      # Agent comparison (2-3 agents)
│       │   │   ├── WatchlistButton.tsx    # Heart toggle button
│       │   │   ├── ShareButton.tsx        # Share / copy link
│       │   │   ├── GeckoToken.tsx         # $GECKO branding
│       │   │   ├── ErrorBoundary.tsx      # Error UI components
│       │   │   └── Skeletons.tsx          # Loading skeletons
│       │   ├── hooks/
│       │   │   ├── useAgents.ts           # Agent data hooks
│       │   │   └── useWatchlist.ts        # Watchlist state hook
│       │   └── types/
│       │       └── index.ts              # TypeScript types
│       ├── next.config.mjs
│       ├── tailwind.config.ts
│       └── package.json
├── CLAUDE.md                             # This file
├── FEATURES.md                           # Feature roadmap
├── vercel.json
└── package.json                          # Monorepo root
```

## Commands

```bash
# From repo root
npm run dev                                       # Start dev server (localhost:3000)
npm run build                                     # Build for production
npm run build --workspace=@agentgecko/web         # Build (explicit workspace)

# Deploy
npx vercel deploy --prod --token $TOKEN --yes     # Deploy to Vercel
```

## Scoring Algorithm

```
Score = (0.30 × Volume) + (0.25 × Holders) + (0.20 × Performance) + (0.15 × Activity) + (0.10 × Age)
```

All sub-scores 0-100, log-scaled where appropriate.

## Agent Categories

| Category | Keywords | Icon |
|----------|----------|------|
| Meme Trader | meme, degen, pump, flip | 🐸 |
| DeFi | yield, farm, liquidity, vault | 🏦 |
| Sniper | sniper, launch, early, fast | 🎯 |
| Copy Trader | copy, mirror, whale, follow | 📋 |
| Arbitrage | arb, spread, cross-dex | ⚡ |
| Social/Alpha | sentiment, twitter, news | 📡 |
| Analyst | analysis, audit, risk, score | 🔬 |
| Trading | generic trading agent | 📈 |

## Environment Variables

```
NEXT_PUBLIC_NAD_API_URL=https://api.nadapp.net    # Nad.fun API (mainnet)
NAD_API_KEY=nadfun_xxx                             # optional, higher rate limits
```

## Convention

- All components are client components ("use client") unless pure server
- Use shadcn/ui components for ALL UI elements
- Dark theme only (zinc-950 bg, zinc-900 cards)
- Green accent color (#22c55e) for CTAs and positive metrics
- Red (#ef4444) for negative metrics
- Keep it minimal — no unnecessary animations or complexity
- Mobile-responsive using Tailwind breakpoints
- API routes use Zod validation for all inputs
- Nad.fun API calls go through agent-service.ts (server-side only)

## What NOT To Do

- Don't add authentication — unnecessary for this project
- Don't build a custom chart library — use lightweight-charts or just numbers
- Don't over-engineer the backend — direct API calls are fine
- Don't add wallet connect — just link to Nad.fun for buying
