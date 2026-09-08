# OmniMarketX Frontend

A social prediction-market dashboard built with Next.js, TypeScript, and Tailwind CSS.

## Tech Stack

| Area | Technology |
|------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| UI Primitives | Radix UI |
| Icons | Lucide React |
| State | Zustand 5 |
| Server State | TanStack React Query 5 |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Animation | Framer Motion |
| Toasts | Sonner |
| Dates | date-fns |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint
```

## Project Structure

```
src/
├── app/
│   ├── (auth)/              # Login, register, forgot/reset password
│   ├── (dashboard)/         # Main app pages with sidebar shell
│   │   ├── page.tsx         # Home
│   │   ├── markets/         # Browse + detail pages
│   │   ├── wallet/
│   │   ├── portfolio/
│   │   ├── trending/
│   │   ├── activity/
│   │   ├── leaderboard/
│   │   ├── social/
│   │   ├── groups/
│   │   ├── settings/
│   │   └── invite/
│   ├── layout.tsx           # Root layout (font, providers)
│   └── globals.css          # Design tokens, Tailwind theme
├── components/
│   ├── layout/              # AppShell, Sidebar, Header, MobileNav, DemoBanner
│   ├── market/              # MarketCard, TradePanel, MarketChart, etc.
│   ├── ui/                  # Button, Card, Input, Modal, Tabs, etc.
│   ├── auth/
│   ├── social/
│   ├── wallet/
│   ├── portfolio/
│   ├── groups/
│   └── leaderboard/
├── constants/               # Nav items, categories, sort options
├── lib/                     # Utilities (cn, formatters)
├── mocks/                   # Mock data for all domains
├── services/                # API abstraction layer (mock backend)
├── store/                   # Zustand stores (app state, trading)
└── types/                   # TypeScript interfaces
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home with hero, top markets, trending |
| `/markets` | Browse all markets with filters/sort/search |
| `/markets/[id]` | Market detail with chart and trade panel |
| `/wallet` | Balance, transaction history, demo reset |
| `/portfolio` | Open positions, P&L, recent trades |
| `/trending` | Ranked trending markets |
| `/activity` | Live activity feed |
| `/leaderboard` | Trader rankings |
| `/social` | Social feed with posts, polls |
| `/groups` | Discover and join groups |
| `/settings` | Profile and account settings |
| `/invite` | Referral link and rewards |
| `/login` | Sign in |
| `/register` | Create account |
| `/forgot-password` | Password reset |

## Design

- **Primary accent**: `#F51B63` (pink)
- **Demo mode accent**: `#FF6417` (orange)
- **Font**: Inter
- **Dark mode**: Full support via CSS variables
- **Responsive**: Desktop sidebar, tablet collapsed, mobile drawer + bottom nav

## Specification

See [OmniMarketX_Frontend_UI_UX_Specification.md](./OmniMarketX_Frontend_UI_UX_Specification.md) for the full UI/UX blueprint.
