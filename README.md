# OmniMarketX Frontend

A **social prediction-market dashboard** built from scratch with Next.js, TypeScript, and
Tailwind CSS — a polished SaaS-style trading product with markets, YES/NO trading, a full
portfolio, AI assistance, and a social/economy layer.

The app is built against the `OmniMarketX_Frontend_UI_UX_Specification.md` blueprint and the
public design language of `omnimarketx.com`, with **original code, original copy, and a
fully mock-backed data layer** (no proprietary assets or backend). All 28 routes are
server/client-rendered and deploy-ready with zero environment setup.

---

## Tech Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 (CSS variables design tokens) |
| UI Primitives | Radix UI (Dialog, Dropdown, Select, Tabs, Tooltip, Switch, Popover) |
| Icons | Lucide React |
| Client State | Zustand 5 (selective persisted stores) |
| Server State | TanStack React Query 5 |
| Forms | React Hook Form + Zod |
| Charts | Recharts 3 (portfolio/sentiment) + custom SVG (price chart) |
| Animation | Framer Motion |
| Toasts | Sonner |
| Dates | date-fns |
| Class merging | tailwind-merge + clsx + class-variance-authority |

---

## Getting Started

```bash
npm install
npm run dev
```

Open https://omni-marketx-v2.vercel.app/.

> The app is fully mock-backed — no API keys, env vars, or database are required.

## Scripts

```bash
npm run dev      # Development server (hot reload)
npm run build    # Production build (TypeScript check + prerender)
npm run start    # Production server
npm run lint     # ESLint (0 errors; 3 benign react-hook-form compiler notices)
```

## Design system

- **Primary accent**: `#f21f68` pink; **demo-mode accent**: `#ff6b1a` orange
- **Semantic tokens**: `--success` (YES), `--danger` (NO), `--purple`, `--blue`, muted text scale
- **Surfaces**: `--background`, `--surface`, `--elevated`, stepped borders; pure-black dark mode
- **Gradients**: brand (pink→coral→amber), deposit (pink→indigo), soft tint
- **Fonts**: Sora (UI) + Geist Mono (numbers) via `next/font/google`
- **Dark mode**: pure black background with layered near-black cards; Light/Dark only (no system mode)
- **Responsive**: fixed auto-hiding sidebar (desktop) → collapsed → mobile drawer + bottom nav;
  right rails reflow below content on tablet/phone; scrollbars hidden app-wide (wheel/touch/keyboard scrolling intact)

---

## Project structure

```
src/
├── app/
│   ├── layout.tsx               # Root layout (fonts, metadata, providers, theme)
│   ├── globals.css              # Design tokens + Tailwind theme
│   ├── (marketing)/             # Landing page + Pricing page (public)
│   ├── (auth)/                  # Login, register, forgot/reset password
│   ├── (onboarding)/onboarding  # 5-step onboarding wizard (profile → interests → plan)
│   └── (dashboard)/             # App shell (sidebar/header) pages
│       ├── home/                # Dashboard home: top markets, movers, right rail
│       ├── markets/             # Browse (filters/sort/search) + /markets/[marketId] detail
│       ├── search/              # /search?q= results (markets, events, users)
│       ├── wallet/              # Balance, transactions, deposit/reset demo
│       ├── portfolio/           # Stats, trading analytics, positions, open orders, trades
│       ├── trending/  leaderboard/  activity/  heatmap/
│       ├── watchlist/  achievements/  create-market/  messages/  notifications/
│       ├── social/              # Personalized feed, polls, suggested traders
│       ├── groups/  invite/  settings/  users/[userId]/
├── components/
│   ├── layout/                  # AppShell, Sidebar (auto-hide), Header, MobileNav, GlobalSearch
│   ├── market/                  # PriceChart (custom SVG), OrderBook, Depth, Trades, Discussion,
│   │                            # Alerts, AI Summary/Sentiment/News, TradePanel
│   ├── ui/                      # Button, Card, Modal, Tabs, Input, StatCard, Skeleton, EmptyState…
│   ├── auth/  social/  wallet/  portfolio/  groups/  leaderboard/  analytics/
│   ├── achievements/  orders/  heatmap/  messages/  notifications/  ai/
│   ├── pricing/  onboarding/  marketing/  invite/  support/  create-market/
├── constants/                   # Nav, categories, pricing config (single source of truth)
├── lib/                         # cn(), formatters, fileToDataUrl (image compression)
├── mocks/                       # Deterministic mock data (PRNG-seeded) for every domain
├── services/                    # Mock API abstraction layer (mockRequest latency, retries)
├── store/                       # Zustand persisted stores (watchlist, trading, user, alerts, …)
└── types/                       # Domain TypeScript interfaces
```

### State & data architecture

- **Services** act as the API boundary (`marketService`, `socialService`, `walletService`, `aiService`,
  `newsService`, …) — each returns promises shaped like a real backend with simulated latency. Swapping
  in a real API only changes the service files.
- **Mocks** are **deterministic**: a seeded PRNG (`hashString`/`createRng` in `market-activity.ts`)
  generates stable charts, order books, trades, feeds, and news per market — data never changes between
  refetches, so skeletons/error states are exercised consistently.
- **Zustand stores** hold mutable/persisted client state (`omx-user`, `omx-watchlist`, `omx-trading`,
  `omx-open-orders`, `omx-alerts`, `omx-messages`, `omx-notifications`, `omx-follows`, `omx-referrals`,
  `omx-copy-trading`, `omx-market-draft`, `omx-onboarding`). Selectors use **one scalar per field**
  (Zustand v5 `useSyncExternalStore` requirement).

---

## Routes (28)

| Route | Description |
| --- | --- |
| `/` | Marketing landing — hero, 19-feature showcase, how-it-works, pricing CTA |
| `/pricing`, `/onboarding` | Free/Pro plans (one config) + 5-step signup wizard |
| `/login`, `/register`, `/forgot-password`, `/reset-password` | Auth |
| `/home` | Dashboard home — top markets, movers, right rail |
| `/markets` | Browse + filter by category/sort/search (URL-synced) |
| `/markets/[marketId]` | Detail: chart, sentiment, activity tabs, discussion, news, AI, trade panel, alerts |
| `/search` | Search results — markets, matching events/categories, traders, groups |
| `/wallet` | Balance, history, deposit, demo reset |
| `/portfolio` | Stats, equity + KPI analytics, open positions, open orders, recent trades |
| `/trending`, `/activity`, `/leaderboard`, `/heatmap` | Discovery & rankings (podium, periods, most-followed) |
| `/watchlist` | Starred markets (persisted) |
| `/achievements` | 10 badge achievements + points |
| `/create-market` | 4-step wizard → live market (Community badge) |
| `/messages`, `/notifications` | Chat + notifications with shared unread badges |
| `/social` | Personalized feed, polls, suggested traders |
| `/groups`, `/invite`, `/settings` | Communities, referral rewards, profile/plan/theme |
| `/users/[userId]` | Trader profile, reputation, copy trading |

---

## Feature overview

### Trading (P0)
- **Market detail with custom candlestick chart** — SVG candlesticks/line toggle, volume bars,
  crosshair + OHLC tooltip, drag-to-zoom + double-click reset, time-range chips with change pill,
  resize-aware. Deterministic per-market data.
- **Trade panel (BUY/SELL)** — YES/NO price chips (cents), quick amounts, $10–$5,000 validation,
  live order summary (shares, payout/credit, fees @0.2%, total, potential profit); SELL settles
  positions; guards for settled markets and insufficient shares.
- **Portfolio & wallet** — P&L stats, positions, equity analytics, transactions, demo reset (confirmed).
- **Watchlist, order book, recent trades, open orders, price alerts.**

### Market activity (P1)
- **Order book + Depth tab** — depth ladder and cumulative bid/ask depth chart with spread/last price.
- **Market discussion** — per-market threads with likes and live author avatars.
- **Trader profiles, follow traders, reputation score, copy trading (demo).**
- **Trading analytics, achievements, market heatmap.**

### AI & differentiation (P2)
- **AI Market Summary**, **Market Sentiment** (YES/NO split + drivers), **"Ask AI" assistant**,
  **Market News** (impact/sentiment tagged), all deterministic and price-aware.
- **Personalized feed** — "For You" scores posts from your follows/watchlist; "Following" filters to
  followed traders.
- **Advanced leaderboards** — Daily/Weekly/Monthly (deterministic), top-3 podium, Most Followed/Active.
- **Referral & rewards** — persisted ledger, milestone ladder, Pro-doubled payouts, deterministic SVG QR.
- **Create Market** — 4-step wizard with live preview, quality score, AI question-improve, tags, cover
  image, multi-outcome support, auto-saved draft, successful publish into the market store.

### Account & experience
- **Persisted identity** — editable profile (name/username/bio) + **live avatar upload** (compressed
  to ~5–20 KB, updated everywhere: header, profile, discussion, social).
- **Plan & billing** — Free/Pro from one pricing config; upgrade management in Settings; Pro locks
  downgrade; sidebar "Upgrade" entry points.
- **Messages & notifications** — real chat and notification page, shared unread badges, feedback tab,
  floating support chat.
- **Polish** — gradient brand logo, hidden scrollbars, true-black dark mode, empty/error/skeleton states,
  aria labels and keyboard accessibility, URL-synced filters.

---

## Engineering notes

- **Quality gate**: `next build` (TypeScript) + `eslint .` — 0 errors, 3 benign
  `react-hooks/incompatible-library` notices on `react-hook-form` `watch()`.
- **Image uploads** are compressed client-side (`src/lib/image.ts`) to protect the shared ~5 MB
  localStorage quota (avatar 256px, market cover 800px JPEG).
- **Performance**: custom SVG for the trading chart (no chart-library overhead on the hot path),
  `useMemo`/`useCallback` throughout, deterministic data cached via React Query.
- Full development history, per-change rationale, and verification: see `process.md`.

## Specification

See [OmniMarketX_Frontend_UI_UX_Specification.md](./OmniMarketX_Frontend_UI_UX_Specification.md) for the
full UI/UX blueprint this implementation is checked against.