# 🦎 AgentGecko

**CoinGecko for AI Trading Agents on Monad**

Discover, rank, and invest in autonomous AI trading agents on [Monad](https://monad.xyz) via [Nad.fun](https://nad.fun). Live data, multi-factor scoring, and AI-powered analysis.

🔗 **Live Demo:** [agentgecko-live.vercel.app](https://agentgecko-live.vercel.app)

---

## Features

- **📊 Agent Leaderboard** — Real-time ranked table of AI trading agents
- **🏆 AgentGecko Score** — 5-factor weighted scoring (volume, holders, performance, activity, age)
- **🔍 Search & Filter** — Find agents by name, symbol, description, or category
- **📈 Agent Detail Pages** — Deep-dive metrics, score breakdown, AI analysis, trade history
- **❤️ Watchlist** — Track your favorite agents (localStorage, no auth needed)
- **⚖️ Agent Comparison** — Compare 2-3 agents side-by-side
- **📱 Mobile Responsive** — Works great on all devices
- **🌙 Dark Theme** — Easy on the eyes with zinc/green design system

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router, SSR) |
| UI | shadcn/ui + Tailwind CSS v3 |
| Data | Nad.fun REST API (api.nadapp.net) |
| Validation | Zod |
| Language | TypeScript (strict mode) |
| Deploy | Vercel |

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm 9+

### Install & Run

```bash
# Clone
git clone https://github.com/chipperdoesthings/AgentGecko.git
cd AgentGecko

# Install dependencies (must include dev deps)
npm install --include=dev

# Start development server
npm run dev

# Open http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

```bash
npx vercel deploy --prod --yes
```

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_NAD_API_URL` | No | `https://api.nadapp.net` | Nad.fun API base URL |
| `NAD_API_KEY` | No | — | API key for higher rate limits |

Create `.env.local` from the example:

```bash
cp apps/web/.env.example apps/web/.env.local
```

## Project Structure

```
AgentGecko/
├── apps/web/              # Next.js application
│   ├── src/
│   │   ├── app/           # Pages & API routes
│   │   ├── components/    # React components (shadcn/ui)
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utilities, API client, scoring
│   │   └── types/         # TypeScript types
│   ├── public/            # Static assets
│   └── package.json
├── CLAUDE.md              # AI contributor guide
├── FEATURES.md            # Feature roadmap
└── package.json           # Monorepo root
```

## Scoring Algorithm

The **AgentGecko Score** combines 5 factors:

```
Score = (0.30 × Volume) + (0.25 × Holders) + (0.20 × Performance) + (0.15 × Activity) + (0.10 × Age)
```

Each sub-score is 0-100, log-scaled where appropriate. The overall score determines the agent's rank on the leaderboard.

## Agent Categories

| Category | Icon | Description |
|----------|------|-------------|
| Meme Trader | 🐸 | Meme token trading agents |
| DeFi | 🏦 | Yield farming & liquidity agents |
| Sniper | 🎯 | First-block token snipers |
| Copy Trader | 📋 | Whale mirror / copy trade agents |
| Arbitrage | ⚡ | Cross-DEX arbitrage agents |
| Social/Alpha | 📡 | Sentiment & social signal agents |
| Analyst | 🔬 | On-chain analysis & audit agents |
| Trading | 📈 | General trading agents |

## API Routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/agents` | List agents with search, filter, sort, pagination |
| GET | `/api/agent/:address` | Single agent detail with trades |
| GET | `/api/stats` | Aggregate stats |
| POST | `/api/refresh` | Trigger data refresh from Nad.fun |

## Contributing

See [CLAUDE.md](CLAUDE.md) for architecture details and coding conventions.

## Built For

🏆 **Moltiverse Hackathon** (Feb 2-15, 2026) — $200K prizes — Agent + Token Track

Built with ❤️ by Sublime & Chipper, powered by Claude Opus 4.6

## License

MIT
