# CLAUDE.md — AgentGecko

## What Is This?

AgentGecko is **CoinGecko for AI trading agents on Monad**. It aggregates, ranks, and lets users invest in autonomous trading agents via Nad.fun.

**Hackathon**: Moltiverse (Feb 2-15, 2026) · $200K prizes · Agent + Token Track

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    AGENT TEAMS (Opus 4.6)                │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ Scout    │  │ Analyst  │  │ Reporter │              │
│  │ Agent    │  │ Agent    │  │ Agent    │              │
│  │          │  │          │  │          │              │
│  │ Discovers│  │ Scores & │  │ Generates│              │
│  │ new agent│  │ ranks    │  │ insights │              │
│  │ tokens   │  │ agents   │  │ & alerts │              │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘              │
│       │              │              │                    │
│       └──────────────┼──────────────┘                    │
│                      ▼                                   │
│              ┌──────────────┐                            │
│              │ Coordinator  │ ← Orchestrates all agents  │
│              └──────┬───────┘                            │
└─────────────────────┼───────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────┐
│                   NEXT.JS APP                            │
│                                                          │
│  Frontend (shadcn/ui)         API Routes                 │
│  ┌──────────────────┐        ┌────────────────┐         │
│  │ / Homepage       │        │ /api/agents    │         │
│  │ /agents Board    │◄──────►│ /api/agent/:id │         │
│  │ /agent/:addr     │        │ /api/refresh   │         │
│  └──────────────────┘        └───────┬────────┘         │
│                                      │                   │
│                              ┌───────▼────────┐         │
│                              │  Nad.fun API   │         │
│                              │  (data source) │         │
│                              └────────────────┘         │
└─────────────────────────────────────────────────────────┘
```

## Agent Teams (Opus 4.6 Feature)

We use Opus 4.6's agent teams to power the backend intelligence:

### Scout Agent
- **Job**: Discover new AI agent tokens on Nad.fun
- **How**: Monitors new token launches, keyword-matches descriptions
- **Output**: List of candidate agent token addresses

### Analyst Agent  
- **Job**: Deep-dive analysis on each discovered agent
- **How**: Fetches market data, metrics, trade history from Nad.fun API
- **Output**: Scored agent profiles with category classification

### Reporter Agent
- **Job**: Generate human-readable insights and summaries
- **How**: Takes scored data, produces market commentary
- **Output**: Trending alerts, daily summaries, agent comparisons

### Coordinator
- **Job**: Orchestrates the team, resolves conflicts, merges outputs
- **Trigger**: Runs on API route `/api/refresh` or cron schedule

## Tech Stack

| Layer | Tech | Why |
|-------|------|-----|
| Framework | Next.js 14 (App Router) | SSR + API routes in one |
| UI | shadcn/ui + Tailwind v3 | Clean components, fast dev |
| Data | Nad.fun REST API (direct) | No DB needed for MVP |
| Caching | React Query (client) | Auto-refresh, dedup |
| AI | Claude Opus 4.6 (agent teams) | Multi-agent coordination |
| Token | $GECKO on Nad.fun | Hackathon requirement |
| Deploy | Vercel | Free, instant |

## Project Structure

```
agent-gecko/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Homepage: hero + stats + top agents + table
│   │   ├── layout.tsx            # Nav + footer
│   │   ├── agents/page.tsx       # Full leaderboard
│   │   ├── agent/[address]/
│   │   │   └── page.tsx          # Agent detail: metrics + chart + trades
│   │   └── api/
│   │       ├── agents/route.ts   # List/search agents
│   │       ├── agent/[address]/route.ts  # Single agent detail
│   │       └── refresh/route.ts  # Trigger agent team refresh
│   ├── lib/
│   │   ├── nadfun.ts             # Nad.fun API client
│   │   ├── detector.ts           # Agent detection (keyword matching)
│   │   ├── scorer.ts             # Scoring algorithm
│   │   ├── agents-seed.ts        # Known agent addresses + mock data
│   │   └── agent-team.ts         # Opus 4.6 agent team orchestrator
│   ├── components/
│   │   ├── ui/                   # shadcn components
│   │   ├── AgentCard.tsx
│   │   ├── AgentTable.tsx
│   │   ├── StatsBar.tsx
│   │   ├── CategoryFilter.tsx
│   │   └── SearchBar.tsx
│   └── types/
│       └── index.ts
├── CLAUDE.md                     # This file
├── package.json
├── tailwind.config.ts
└── next.config.mjs
```

## Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
```

## Key Design Decisions

1. **No database** — Fetch from Nad.fun API directly, cache in React Query
2. **Mock data for demo** — `agents-seed.ts` has realistic mock agents for the demo
3. **Live data when available** — API routes proxy to Nad.fun for real tokens
4. **Agent teams for intelligence** — Not just a static dashboard, AI agents actively discover + analyze
5. **shadcn/ui everywhere** — Consistent, accessible, dark theme

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
NEXT_PUBLIC_NAD_API_URL=https://dev-api.nad.fun   # or https://api.nadapp.net for mainnet
NAD_API_KEY=nadfun_xxx                             # optional, higher rate limits
ANTHROPIC_API_KEY=sk-ant-xxx                       # for agent team features
```

## Convention

- All components are client components ("use client") unless pure server
- Use shadcn/ui components for ALL UI elements
- Dark theme only (zinc-950 bg, zinc-900 cards)
- Green accent color (#22c55e) for CTAs and positive metrics
- Red (#ef4444) for negative metrics
- Keep it minimal — no unnecessary animations or complexity
- Mobile-responsive using Tailwind breakpoints

## What NOT To Do

- Don't add authentication — unnecessary for MVP
- Don't build a custom chart library — use lightweight-charts or just numbers
- Don't over-engineer the backend — direct API calls are fine
- Don't add wallet connect — just link to Nad.fun for buying
- Don't use SSR for the main pages — CSR with React Query is simpler
