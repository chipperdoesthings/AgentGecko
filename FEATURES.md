# FEATURES.md — AgentGecko Roadmap

## ✅ Shipped (MVP)
- [x] Agent leaderboard with AgentGecko Score (5-factor weighted)
- [x] 8 agent categories with filter pills
- [x] Search by name, symbol, description
- [x] Sortable table + grid view toggle
- [x] Agent detail pages (metrics, score breakdown, AI analysis, trades)
- [x] Stats overview bar (total agents, volume, mcap, holders)
- [x] Top 3 agents podium on homepage
- [x] "Buy on Nad.fun" CTA on each agent
- [x] Dark theme with shadcn/ui components
- [x] Mobile responsive
- [x] Static export + Vercel deploy
- [x] Agent Teams architecture (Scout, Analyst, Reporter)
- [x] Mock data with 8 realistic agents

---

## 🔥 Priority 1 — Ship This Week (Hackathon Critical)

### Live Nad.fun Data
- [ ] Replace mock data with real agent tokens from Nad.fun API
- [ ] Auto-refresh data on page load (React Query / SWR)
- [ ] Proxy Nad.fun API through Next.js API routes (avoid CORS + rate limits)

### Agent Auto-Discovery
- [ ] Scan Nad.fun for new token launches
- [ ] AI-powered agent detection (Scout Agent analyzes descriptions)
- [ ] Community submission form (submit an agent address to be listed)
- [ ] Manual curation via seed list of known agents

### $GECKO Token
- [ ] Design token logo (512x512 PNG)
- [ ] Deploy $GECKO on Nad.fun (testnet first, then mainnet)
- [ ] Add $GECKO info to homepage/footer
- [ ] Token holders get "Verified" badge on submitted agents

### Watchlist (localStorage)
- [ ] Heart/star button on each agent card
- [ ] /watchlist page showing saved agents
- [ ] Persist in localStorage (no auth needed)

### Agent Comparison
- [ ] Select 2-3 agents to compare side-by-side
- [ ] Comparison table: metrics, scores, category, risk
- [ ] "Compare" button on agent cards

---

## ⚡ Priority 2 — Polish & Differentiate

### AI Market Report
- [ ] Reporter Agent generates daily "Agent Alpha" summary
- [ ] Trending agents, biggest movers, new entries
- [ ] Display on homepage as a banner/card
- [ ] Optional: post to Moltbook automatically

### Agent Wallet Tracker
- [ ] Fetch agent creator's wallet holdings from Nad.fun
- [ ] Show "What this agent is trading" on detail page
- [ ] Track PnL of agent's own trades

### Historical Data
- [ ] Snapshot scores every sync cycle
- [ ] Score trend chart on agent detail page (sparkline)
- [ ] "Score 7d ago" vs "Score now" comparison
- [ ] Price mini-charts on leaderboard (sparklines)

### Shareable Agent Cards
- [ ] OG meta tags for Twitter/social sharing
- [ ] Dynamic OG images per agent (using @vercel/og)
- [ ] "Share" button that copies link + generates preview

### Portfolio Simulator
- [ ] "If you invested $X in [Agent] Y days ago" calculator
- [ ] Shows hypothetical returns based on price history
- [ ] Comparison against holding MON

---

## 🚀 Priority 3 — Post-Hackathon / If Time Permits

### Alerts & Notifications
- [ ] Set price/volume thresholds per agent
- [ ] Browser push notifications or Telegram alerts
- [ ] "Agent graduated" alerts

### Sentiment Analysis
- [ ] Scrape Twitter/Moltbook for agent mentions
- [ ] Sentiment score (bullish/bearish/neutral)
- [ ] Display on agent detail page

### Embed Widget
- [ ] Embeddable iframe leaderboard for other sites
- [ ] "Powered by AgentGecko" branding
- [ ] Customizable (filter by category, limit results)

### Agent Battles
- [ ] Community votes: "Which agent would you trust with $1000?"
- [ ] Weekly tournament bracket
- [ ] Results influence a "Community Score" metric

### Featured Listings
- [ ] $GECKO holders can boost agent visibility
- [ ] "Featured" badge on sponsored agents
- [ ] Revenue model for post-hackathon sustainability

### Multi-Chain Support
- [ ] Expand beyond Monad to Base, Solana, etc.
- [ ] Unified scoring across chains
- [ ] Chain filter on leaderboard

---

## 🏗️ Technical Debt
- [ ] Replace static export with SSR (for live data)
- [ ] Add error boundaries and loading skeletons
- [ ] Rate limit handling for Nad.fun API
- [ ] SEO optimization (meta tags, structured data)
- [ ] Analytics (Plausible or simple event tracking)
- [ ] CI/CD pipeline (auto-deploy on push)

---

## 📋 Hackathon Submission Checklist
- [ ] Live demo URL on Vercel
- [ ] GitHub repo (public)
- [ ] $GECKO token deployed on Nad.fun
- [ ] Submit to moltbook.com/m/moltiversehackathon
- [ ] Demo video / screenshots
- [ ] README with clear setup instructions
- [ ] CLAUDE.md for AI contributors

---

*Last updated: 2026-02-06*
*Built for Moltiverse Hackathon by Sublime & Chipper ⚡*
