# OmniMarketX Frontend — Development Process & Change Log

This document records what was changed, what each change fixes, and **why** it was made.
Audio reference: `OmniMarketX_Frontend_UI_UX_Specification.md` (the UI/UX spec the work is checked against).

All changes are verified with:
- `npm run lint` — clean on every touched file (0 errors)
- `npm run build` — passes (TypeScript OK, all 16 routes generated)

---

## 1. Bug Fixes

### 1.1 Wallet "Total Withdrawn" always showed $0
**File:** `src/components/wallet/wallet-overview.tsx`

| Before | After |
| --- | --- |
| `Math.max(0, totalIn - balance - totalIn)` | `Math.max(0, totalIn - balance)` |

**Why:** The original formula always resolved to 0 (anything minus itself), so the stat was permanently incorrect. Since the trading store has no withdrawal mechanism, `totalIn - balance` is the net amount spent/lost on trades and is the best representation of "withdrawn" in the demo.

### 1.2 Category chips triggered a full page reload
**File:** `src/app/(dashboard)/page.tsx`

**Why:** Filtering categories used `window.location.href = "/markets?category=..."`. This performs a full browser navigation, reloading the whole SPA and losing client state (search input, charts, etc.). Replaced with `router.push(...)` (Next.js client-side navigation) via an added `useRouter`.

Extras:
- `wallet/page.tsx` and `portfolio/page.tsx`: EmptyState "Browse markets" action also used `window.location.href`; replaced with `router.push("/markets")`. A full repo grep confirmed **no `window.location.href` remains** in `src/`.

### 1.3 Double navigation from Buy/Sell buttons inside a link card
**File:** `src/components/market/market-actions.tsx`

**Why:** The Buy/Sell buttons live inside a `<a>` (the `MarketLink` card wrapper). Clicking them fired both the button's navigation **and** the link's navigation (two pushes to `/markets/[id]`). Added `e.preventDefault()` + `e.stopPropagation()` in the `go()` handler so only the intended button action runs.

### 1.4 Favorite star toggling the market link
**File:** `src/components/market/market-probability.tsx`

**Why:** Clicking the favorite star was also navigating the browser because the star sits inside the clickable market card. Added `e.stopPropagation()` on the star button so only the like toggle runs.

### 1.5 Trade shares could be `Infinity`
**File:** `src/store/trading-store.ts`

**Why:** `shares = Math.round(amount / price)` divides by the market price. If a side's price fell to `0`, the division produced `Infinity` shares and a broken trade. Price is now defensively clamped to the valid range before the math:

```ts
const safePrice = Math.min(0.99, Math.max(0.01, price));
const shares = Math.round(amount / safePrice);
```

### 1.6 "Closing soon" shown on expired markets
**File:** `src/components/market/market-probability.tsx` (`MarketTimeLeft`)

**Why:** When the computed time left was negative (market already closed/resolved), the component fell through to "Closing soon" — the opposite of reality. Now:
- negative time → label **"Ended"**
- exactly 1 day → `1d left`
- ≥ 7 days → `Nw left`

### 1.7 GlobalSearch did not clear stale results
**File:** `src/components/layout/global-search.tsx`

**Why:** After a search, clearing the input left the previous results visible until the debounce re-ran. Results are now cleared the moment the trimmed query becomes empty, both on type (`onChange`) and on the clear (X) button.

Lint note: `setResults([])` was moved out of the effect body into the event handlers to satisfy `react-hooks/set-state-in-effect`.

### 1.8 Markets search did not sync to the URL
**File:** `src/app/(dashboard)/markets/markets-browser.tsx`

**Why:** The spec (§48) requires URL-synced filters — the search term should be shareable and survive a refresh. A debounced effect now writes the `?search=` query param (`router.replace(..., { scroll: false })`) and skips when the URL already matches, avoiding infinite loops and scroll jumps.

---

## 2. Responsive UI Fixes

### 2.1 Right rails hidden entirely on tablet/mobile
**Files:** `activity/page.tsx`, `portfolio/page.tsx`, `leaderboard/page.tsx`, `social/page.tsx`

**Why:** These pages used `hidden ... xl:block` on their right-rail columns, so on phone/tablet the secondary content (leaderboard preview, live markets, activity feed, etc.) was simply gone. Per the spec's right-rail rule (§62), the rail should **move below the main content** on smaller screens — removed the `hidden` class so it renders stacked under the content.

### 2.2 Market detail page: bad mobile order
**File:** `src/app/(dashboard)/markets/[marketId]/market-detail-client.tsx`

**Why:** On mobile the content column appeared first and the trade panel (the primary action) was pushed far down. Changed the grid order so on mobile the **trade panel is first** and the details follow; on desktop (`lg:`) the trade panel is the sticky right rail (`lg:sticky lg:top-20 self-start`).

### 2.3 Market grids were missing the extra-large column
**Files:** `src/app/(dashboard)/page.tsx`, `src/components/market/market-card-skeleton.tsx`

**Why:** Large monitors looked sparse with only 3 columns. Added `2xl:grid-cols-4` to the home top-markets grid and its skeleton loader (the `markets` page already had the correct breakpoints).

### 2.4 Leaderboard rows overflowed on small screens
**File:** `src/components/leaderboard/leaderboard-item.tsx`

**Why:** Fixed-width Profit/ROI columns plus a name column squeezed the row on 360px-wide phones, causing horizontal overflow. Profit column: `w-16 sm:w-24`; ROI column: `w-12 sm:w-20`.

### 2.5 Demo banner text overflow
**File:** `src/components/layout/demo-banner.tsx`

**Why:** The long banner copy wrapped/overflowed on tight screens. Shortened to "Demo trading mode — virtual funds, not real money", added `min-w-0` to the text, hid the dot on tiny screens, and made the button `shrink-0`.

### 2.6 GlobalSearch hidden on mobile
**File:** `src/components/layout/global-search.tsx`

**Why:** The search trigger was `hidden sm:block`, so phones had no search. Now it is always visible (`relative min-w-0 w-full max-w-md flex-1`), with the `/` shortcut kbd still restricted to `lg+`.

---

## 3. New Features & UI Additions

### 3.1 Trade panel guard for untradeable sides (edge case)
**File:** `src/components/market/trade-panel.tsx`

**Why:** When a side's price ≤ 0.01 the outcome is effectively resolved/locked — placing a trade there makes no sense. Added:
- a `degenerate` flag (`selectedPrice <= 0.01`),
- an inline notice ("Trading is temporarily unavailable for this side while the market settles."),
- submit button disabled.

### 3.2 Settings page: "Need Help?" card
**File:** `src/app/(dashboard)/settings/page.tsx`

**Why:** The spec's settings layout includes a support/help block. Added a right-rail card with **Contact Support** and **Read the Documentation** actions (demo toasts), placed after the existing Danger Zone card.

### 3.3 Invite page: missing spec sections
**File:** `src/app/(dashboard)/invite/page.tsx`

**Why:** The page previously had only the referral-link card and Recent Invites. Added, per spec §23:
1. **Share** card — WhatsApp, X (Twitter), LinkedIn share intents, plus a "More" button that uses the native Web Share API (falls back to copying the link).
2. **How It Works** card — the 3-step flow (They Sign Up → They Trade → You Earn).
3. **Upgrade to Pro** card — promotional CTA with gradient background ("14-day free trial · No card required").

### 3.4 Register page: password visibility toggles
**File:** `src/app/(auth)/register/page.tsx`

**Why:** The spec's auth UX (§24) lists a password visibility toggle (login already had one). Added Eye/EyeOff toggles for both **Password** and **Confirm Password** with `aria-label`s, matching the login page implementation.

---

## 4. Pre-existing warnings (not blocking)

The repo still has pre-existing ESLint warnings that were **not** introduced here and do not block the build:

- `src/app/(dashboard)/groups/page.tsx` — **resolved**: unused imports (create-group modal scaffolding) were wired up; see section 6
- `src/services/auth.service.ts`, `wallet.service.ts` — unused parameters
- `src/components/ui/input.tsx` — unused `VariantProps` import
- `src/components/theme-script.tsx` — unused eslint-disable directives
- `src/app/(dashboard)/social/page.tsx` — two `<Image>` elements missing `alt` (jsx-a11y)
- `react-hooks/incompatible-library` warnings on React Hook Form `useForm().watch()` usage (register, reset-password, trade-panel) — React Compiler skip notices, safe to ignore

---

## 5. Verification

| Check | Result |
| --- | --- |
| `npx eslint <changed files>` | 0 errors |
| `npm run build` | ✓ Compiled (59s) · ✓ TypeScript passed · ✓ 16 routes generated |

---

## 6. Live-Site Clone & Visual Alignment (task: "clone omnimarketx.com end to end")

The live site (`https://www.omnimarketx.com`) is a fully client-rendered app with
closed-source backend (Privy auth, realtime chat, live market data), so its code and
data cannot be scraped. Approach taken: extract the **public design tokens** from its
stylesheet bundles and rebuild the equivalent look/feel/features with original code,
per the spec ("implement original code... original copy").

### 6.1 Design tokens matched to the real site
**File:** `src/app/globals.css`

Extracted from the live stylesheet (`chunks/0ee9u~makh80k.css`,
`chunks/15x02064r8al..css`):

| Token | Value (light) | Value (dark / purple-navy) |
| --- | --- | --- |
| Primary | `#f21f68` (hover `#d9185a`) | `#f21f68` (hover `#ff3d7c`) |
| Background | `#f4f5f7` | `#090426` |
| Surface / Card | `#ffffff` | `#110a36` |
| Elevated | — (falls back to surface) | `#1b1150` |
| Text | `#0f172a` / `#475569` / `#5f6b7a` | `#fff` / `#94a3b8` / `#64748b` |
| Border | `#e2e8f0` / `#f1f5f9` | `rgba(255,255,255,.08)` / `.05` |
| YES (success) | `#15803d` | `#16a34a` |
| NO (danger) | `#e11d48` | `#dc2626` |
| Warning orange | `#ff6b1a` | `#ff6b1a` |

New utilities added: `--shadow-lg`, `--shadow-glow` (brand glow), `--elevated` token,
and brand gradients `--gradient-brand` (pink→coral→amber), `--gradient-deposit`
(pink→indigo), `--gradient-soft`. Classes `bg-gradient-brand`, `bg-gradient-deposit`,
`bg-gradient-soft` defined in `@layer utilities`.

### 6.2 Fonts → Sora + Geist Mono
**File:** `src/app/layout.tsx`

**Why:** The real site uses Sora for UI and Geist Mono for numbers. Replaced the Inter
font with `next/font/google` `Sora` and `Geist_Mono`; `--font-sans` now resolves to Sora,
`--font-mono` to Geist Mono. `number-tight` numbers now render in Geist Mono.

### 6.3 Marketing landing page (new, at `/`)
**Files:** `src/app/(marketing)/page.tsx` (new)

**Why:** Real product sites have a public marketing page in front of the app (and the
real site redirects `/` → `/home`). Added a landing at `/` with: sticky nav (logo, links,
Log in / Get started CTAs), hero ("The World's Leading Social Prediction Market"),
stats band, 8 category cards linking to `/markets?category=…`, "How it works" 3-step,
features grid, brand-gradient CTA band, and footer. Original copy throughout.

### 6.4 Dashboard home moved to `/home`
**File:** `src/app/(dashboard)/home/page.tsx` (moved from `(dashboard)/page.tsx`)

**Why:** Mirrors the real site's `/` → `/home` shell. Updated:
- `src/constants/index.ts` — `NAV_ITEMS` and `MOBILE_NAV` Home → `/home`
- `src/components/layout/mobile-nav.tsx` — local items Home → `/home`
- `src/components/layout/sidebar.tsx` — logo now links to `/home`
- `src/components/layout/logo.tsx` — `Logo` accepts an optional `href` (landing keeps `/`)
- `src/app/(auth)/login/page.tsx`, `register/page.tsx` — post-auth redirect → `/home`

### 6.5 Search page (new, at `/search`)
**Files:** `src/app/(dashboard)/search/page.tsx` (new, server reads `?q=`),
`src/app/(dashboard)/search/search-client.tsx` (new, client results)

**Why:** The real site exposes `/search?q={term}`. Added a search results page inside
the app shell showing Markets (grid), matching Traders, and matching Groups, with a
handled empty state. `GlobalSearch` Enter now routes to `/search?q=…` instead of
`/markets?search=…`.

### 6.6 Groups: restored the dead "Create Group" modal
**File:** `src/app/(dashboard)/groups/page.tsx`

**Why:** The create modal's state and imports existed but the `<Modal>` JSX was missing —
the button did nothing. Rendered the modal with group name + description fields and
validation, using the existing state, resolving the unused-import lint warnings.

### 6.7 Social polls now actually create polls
**Files:** `src/app/(dashboard)/social/page.tsx`, `src/services/domain.service.ts`

**Why:** The compose box advertised "a poll will be attached" but captured no options.
Rewrote the poll toggle to a real composer (poll question + 2 option inputs), and
`createPost` now accepts an optional `poll` that is attached to the new post — which
`PostCard` already renders as an interactive poll.

### 6.8 Wallet deposit modal upgraded
**File:** `src/app/(dashboard)/wallet/page.tsx`

**Why:** Deposit flow felt generic. The modal now has a **brand-gradient banner showing
the current balance**, **quick-amount chips (100/250/500/1000)**, and the confirm button
shows the amount being deposited.

### 6.9 Notifications: unread count badge
**File:** `src/components/layout/notifications-menu.tsx`

**Why:** The notifications dropdown (already implemented: fetch on open, mark-all-read,
per-item read state, routing by type) got a real unread count badge (capped at "9+")
instead of a plain dot.

### 6.10 Verification
| Check | Result |
| --- | --- |
| `npx eslint <changed files>` | 0 errors (only pre-existing `react-hooks/incompatible-library` + `jsx-a11y/alt-text` warnings remain) |
| `npm run build` | ✓ Compiled (10.1s) · ✓ TypeScript passed · ✓ 20 routes generated (`/`, `/home`, `/search`, `/markets/[marketId]`, …) |

### 6.11 What could NOT be cloned
- Live market data, real user accounts, and actual trade settlement (closed backend)
- Privy embedded wallet / real auth, realtime chat, FCM push — all proprietary
- The site's logo asset, imagery, and marketing copy (kept original per spec)

---

## 7. Feature roadmap — P0 gap: Watchlist (task: "check and implement these features")

Audited the requested feature list against the app. **P0 (Must Have): Market Detail,
YES/NO Trading, Portfolio, Wallet, Trade History, Notifications, Market Search, Market
Chart, Responsive UI — already implemented.** The only P0 gap was **Watchlist**: the
`FavoriteStar` component used component-local state only (no persistence, no page).

### 7.1 Persisted watchlist store
**File:** `src/store/watchlist-store.ts` (new)

Zustand + `persist` (localStorage key `omx-watchlist`) holding market IDs with
`toggle` / `remove` / `clear`.

### 7.2 `FavoriteStar` wired to the store
**File:** `src/components/market/market-probability.tsx`

`FavoriteStar` no longer takes `starred`; it takes `marketId` and reads/writes the
watchlist store reactively (orange filled star when watched). Stars remain click-safe
inside links via `preventDefault`/`stopPropagation`.

Call sites updated to pass `marketId`:
- `src/components/market/market-card.tsx`
- `src/components/market/market-card-compact.tsx`
- `src/components/market/market-row.tsx`
- `src/app/(dashboard)/markets/[marketId]/market-detail-client.tsx`

### 7.3 Watchlist page (new, at `/watchlist`)
**File:** `src/app/(dashboard)/watchlist/page.tsx` (new)

Fetches all markets and renders only the watched subset as a `MarketCard` grid, with
count, "Clear all" action, skeleton loading state, error retry state, and an EmptyState
linking back to `/markets`.

### 7.4 Navigation
**Files:** `src/constants/index.ts`, `src/components/layout/nav-icons.tsx`

Added `Watchlist → /watchlist` (star icon) to `NAV_ITEMS` in the sidebar.

### 7.5 Verification
| Check | Result |
| --- | --- |
| `npx eslint <changed files>` | 0 errors |
| `npm run build` | ✓ Compiled (65s) · ✓ TypeScript passed · ✓ 21 routes generated (new `/watchlist`) |

### 7.6 Remaining roadmap (deferred — build in stages)
- **P1 (Add next):** Order Book, Open Orders, Recent Trades, Market Discussion, Trader
  Profiles, Follow Traders, Market Alerts, Trading Analytics, Achievements, Market Heatmap
- **P2 (Differentiation):** Copy Trading (demo), Create Market, AI Market Assistant,
  Market News, AI Market Summary, Market Sentiment, Personalized Feed, Trader Reputation
  Score, Advanced Leaderboards, Referral/Reward system

---

## 8. Feature roadmap — P1 batch 1: Market-detail activity (Order Book, Recent Trades, Discussion, Alerts)

Audit: **all 10 P1 features were missing**. Building them in batches. This batch adds the
four market-detail page features together.

### 8.1 Types
**File:** `src/types/index.ts`

Added `OrderSide`, `OrderBookLevel`, `RecentTrade`, `MarketDiscussionComment`,
`AlertDirection`, `MarketAlert`.

### 8.2 Deterministic activity mocks
**File:** `src/mocks/market-activity.ts` (new)

Seed-based PRNG (FNV hash → LCG) generates a realistic order-book ladder, recent trades,
and a discussion thread per market without touching shared state, so data is stable
across refetches. Traders reuse `socialUsers`.

### 8.3 Service methods
**File:** `src/services/market.service.ts`

Added `getOrderBook(marketId, lastPrice)`, `getRecentTrades(marketId, lastPrice)`,
`getMarketDiscussion(marketId)`.

### 8.4 Market Activity panel (Order Book + Recent Trades)
**Files:** `src/components/market/market-activity.tsx`, `order-book.tsx`, `recent-trades.tsx`

Tabs card in the main column. **Order Book** renders a depth ladder — asks above / bids
below, cumulative depth bars (green bids, red asks), midpoint line with last price +
spread. **Recent Trades** lists fills with trader avatar/username, YES/NO pill, price,
shares, relative time. Both use TanStack Query with skeleton/error states.

### 8.5 Market Discussion
**File:** `src/components/market/market-discussion.tsx`

Per-market comment thread seeded from mocks; user comments are appended locally and
survive the session; like toggle per comment; posting requires non-empty text.

### 8.6 Price Alerts
**Files:** `src/store/alerts-store.ts`, `src/components/market/market-alerts.tsx`

Persisted Zustand store (`omx-alerts`). Card in the market-detail right rail: Above/Below
toggle, threshold %, Add + toast, and a list of active alerts for this market with
remove. Alerts are per-market (filtered by `marketId`).

### 8.7 Wiring
**File:** `src/app/(dashboard)/markets/[marketId]/market-detail-client.tsx`

Main column now renders `MarketActivity` + `MarketDiscussion` (below About); right rail
renders `MarketAlertsCard` (below market stats).

### 8.8 Verification
| Check | Result |
| --- | --- |
| `npx eslint <changed files>` | 0 errors |
| `npm run build` | ✓ Compiled (15.0s) · ✓ TypeScript passed · ✓ 21 routes |

### 8.9 Still to build (P1)
Open Orders, Trader Profiles, Follow Traders, Trading Analytics, Achievements,
Market Heatmap. (Order Book, Recent Trades, Market Discussion, Market Alerts — done.)

---

## 9. Feature roadmap — P1 batch 2: Trader Profiles + Follow Traders

### 9.1 Types + shared helpers
**Files:** `src/types/index.ts`, `src/mocks/market-activity.ts`

Added `TraderPosition` and `TraderProfile` types. Exported `hashString`/`createRng`
from `market-activity.ts` so other mocks reuse the deterministic PRNG.

### 9.2 Trader data
**Files:** `src/mocks/traders.ts`, `src/services/trader.service.ts`

`traderProfiles` covers the current user, all `socialUsers`, and all 8 leaderboard
users (leaderboard rows reuse their real ROI/profit/trades). Each profile has a bio,
member-since date, stats (ROI, P&L, win rate, trades, followers, following), and 3
recent positions linked to real markets. `traderService.getTraderProfile(userId)`
throws for unknown ids → ErrorState.

### 9.3 Follow state + button
**Files:** `src/store/follow-store.ts`, `src/components/social/follow-button.tsx`

Persisted Zustand store (`omx-follows`) of followed user ids. `FollowButton` toggles
Follow ↔ Following (with check icon) and `aria-pressed`.

### 9.4 Trader profile page
**Files:** `src/app/(dashboard)/users/[userId]/page.tsx`, `trader-profile-client.tsx`

New dynamic route `/users/[userId]` (async server page + client component). Header card
(avatar, name, @username, member-since, bio, "You" badge for self, Follow button),
4-stat grid (ROI, Profit, Win Rate, Trades), follower/following counters, and a
"Recent Positions" card linking to each market with YES/NO pill, size, price, P&L.

### 9.5 Profile links wired in
- `leaderboard-item.tsx` — avatar+name link to `/users/{id}`; follow button on ≥md rows
- `leaderboard/page.tsx` — "Fastest Rising" list links to profiles
- `recent-trades.tsx` (market detail) — trader avatar/@username link to profiles
- `activity-item.tsx` — display name links to profiles

### 9.6 Verification
| Check | Result |
| --- | --- |
| `npx eslint <changed files>` | 0 errors |
| `npm run build` | ✓ Compiled (5.5s) · ✓ TypeScript passed · ✓ new `/users/[userId]` route |

### 9.7 Still to build (P1)
Open Orders, Trading Analytics, Achievements, Market Heatmap.
(Trader Profiles + Follow Traders — done.)

---

## 10. Feature roadmap — P1 batch 3: Trading Analytics + Achievements

### 10.1 Types
**File:** `src/types/index.ts` — added `PnLPoint`, `TradingAnalytics`, `Achievement`,
`AchievementTier`.

### 10.2 Analytics data
**Files:** `src/mocks/analytics.ts`, `src/services/analytics.service.ts`

Deterministic daily P&L equity series (30 points ending at the demo user's real net
P&L, $884.12) and performance KPIs (win rate, avg win/loss, profit factor, best/worst
day, trades, net P&L) via the shared PRNG. `analyticsService.getTradingAnalytics(userId)`
and `getAchievements()`.

### 10.3 Trading Analytics card
**Files:** `src/components/analytics/trading-analytics.tsx`

Recharts equity curve (7D/30D toggle, green/red by net P&L, currency tooltip) plus an
8-tile KPI grid. Embedded on the **Portfolio page** between the stat tiles and Open
Positions (`src/app/(dashboard)/portfolio/page.tsx`).

### 10.4 Achievements
**Files:** `src/mocks/analytics.ts` (catalog), `src/components/achievements/achievement-card.tsx`,
`src/app/(dashboard)/achievements/page.tsx`

Catalog of 10 achievements across bronze/silver/gold/platinum tiers (icon, description,
progress bar, points, earn date). The `/achievements` page shows a Badges-Earned + Total
Points summary and a responsive card grid. Reachable from the profile menu
(`profile-menu.tsx` → Trophy link).

### 10.5 Verification
| Check | Result |
| --- | --- |
| `npx eslint <changed files>` | 0 errors (fixed 2 self-introduced warnings) |
| `npm run build` | ✓ Compiled (5.5s) · ✓ TypeScript passed · ✓ new `/achievements` route (22 total) |

### 10.6 Still to build (P1)
Open Orders, Market Heatmap. (Trading Analytics + Achievements — done.)

---

## 11. Feature roadmap — P1 batch 4: Market Heatmap + Open Orders

### 11.1 Open Orders
**Files:** `src/types/index.ts` (`OpenOrder`), `src/store/orders-store.ts`,
`src/components/orders/open-orders-card.tsx`

Persisted orders store (`omx-open-orders`) seeded with two demo limit orders. Card on
the **Portfolio** rail lists each order (YES/NO side pill, limit/type + relative time,
market link, price, shares, cancel button → toast). Empty state explains limit orders
land here.

### 11.2 Market Heatmap
**Files:** `src/components/heatmap/market-heatmap.tsx`,
`src/app/(dashboard)/heatmap/page.tsx`

Full-page grid of every open market grouped by category. Cells are color-coded by
**probability** (5-bucket scale: 0–30 red → 70%+ green) or **24h change**, sortable by
Volume / Newest / Probability, with legend, category headers, and hover lift. Clicking a
cell opens the market. New sidebar nav entry "Heatmap" (`LayoutGrid`) under Markets.

### 11.3 Verification
| Check | Result |
| --- | --- |
| `npx eslint <changed files>` | 0 problems |
| `npm run build` | ✓ Compiled (5.4s) · ✓ TypeScript passed · ✓ new `/heatmap` route (23 total) |

### 11.4 Still to build (P1)
None — P1 roadmap complete.

---

## 12. P2 (differentiation) — deferred roadmap

- Copy Trading (demo), Create Market, AI Market Assistant, Market News, AI Market
  Summary, Market Sentiment, Personalized Feed, Trader Reputation Score, Advanced
  Leaderboards, Referral/Reward system.
- **Scope decision (per user): build P2 in batches but skip Create Market.**

---

## 13. P2 batch 1 — AI features (Summary, Sentiment, Assistant)

### 13.1 Types
**File:** `src/types/index.ts` — added `AiTone`, `MarketAiSummary`,
`MarketSentiment`, `SentimentDriver`, `AiMessage`.

### 13.2 AI service
**File:** `src/services/ai.service.ts`

Deterministic generators over the shared PRNG (`hashString`/`createRng`):
- `getAiSummary(market, salt?)` — headline + 3 bullets chosen from bullish / bearish /
  neutral templates (tone derived from probability), with a model-confidence score.
  Salt lets the UI "regenerate" fresh content client-side.
- `getMarketSentiment(market)` — YES/NO dollar-split (probability ±6pt jitter) and the
  top 3 weighted drivers from a catalyst pool.
- `getAssistantReply(market, prompt, history)` — intent-matched canned answers (buy YES,
  NO side, summary, catalysts, risks) that reference the real market price/probability.

### 13.3 UI
**Files:** `src/components/ai/ai-summary-card.tsx`,
`src/components/ai/ai-assistant-dialog.tsx`,
`src/components/market/market-sentiment.tsx`

- **AI Market Summary** — gradient card in the market main column (below the chart):
  tone chip (bullish/bearish/neutral), headline, bullets, confidence, regenerate.
- **Market Sentiment** — rail card: YES/NO split bar, direction label, weighted driver
  bars. Sits above Market Alerts.
- **AI Assistant** — "Ask AI" button in the market header opens a chat modal with
  suggested prompts; replies are typed, intent-matched, and priced from the market.

### 13.4 Verification
| Check | Result |
| --- | --- |
| `npx eslint <changed files>` | 0 problems (fixed 1 purity lint error → ref-based ids) |
| `npm run build` | ✓ Compiled (6.7s) · ✓ TypeScript passed · 23 routes unchanged |

### 13.5 Still to build (P2)
Market News, Trader Reputation Score, Copy Trading (demo), Advanced Leaderboards,
Referral/Reward system, Personalized Feed. (Create Market — intentionally skipped.)

---

## 14. P2 batch 2 — Market News

### 14.1 Types
**File:** `src/types/index.ts` — added `MarketNewsArticle` (source, headline, excerpt,
impact HIGH/MEDIUM/LOW, sentiment, minutesAgo, likes, comments).

### 14.2 Service
**File:** `src/services/news.service.ts`

Deterministic per-market news feed: headlines/excerpts templated to the market's topic
(crypto / rate policy / semiconductors / earnings / regulation — derived from the title),
random-but-stable source + impact + sentiment, and relative ages. `getMarketNews(market, limit)`.

### 14.3 UI
**File:** `src/components/market/market-news.tsx` — "Market News" card at the bottom of
the market main column. Each item: source + impact chip + sentiment + relative time,
bold headline, 2-line excerpt, like/comment counts. Link hover state → `#` (demo).

### 14.4 Verification
| Check | Result |
| --- | --- |
| `npx eslint <changed files>` | 0 problems |
| `npm run build` | ✓ Compiled (3.7s) · ✓ TypeScript passed (fixed 1 widening error via explicit return type) · 23 routes |

### 14.5 Still to build (P2)
Trader Reputation Score, Copy Trading (demo), Advanced Leaderboards,
Referral/Reward system, Personalized Feed. (Create Market — intentionally skipped.)

---

## 15. P2 batch 3 — Reputation, Copy Trading (demo), Advanced Leaderboards

### 15.1 Trader Reputation Score
**Files:** `src/types/index.ts`, `src/mocks/traders.ts`,
`src/components/social/reputation-score.tsx`

Deterministic per-trader reputation seed (score /1000, weekly-win streak, profitable
weeks). Card on each `/users/[userId]` page: big score, tier badge (Rookie → Elite),
and a 4-bar breakdown — Trade Success (win rate), Consistency, Streak, Influence.

### 15.2 Copy Trading (demo)
**Files:** `src/store/copy-store.ts` (`omx-copy-trading`),
`src/components/social/copy-trader-button.tsx`,
`src/components/portfolio/copy-trading-panel.tsx`

- Copy Trader button on trader profiles opens a modal: choose allocation 1%/5%/10%,
  start/stop with toasts (persisted, max-free via store).
- Copy Trading card in the portfolio rail lists active copies (avatar, trader link,
  allocation chip, Stop) or prompts to pick one from the leaderboard.

### 15.3 Advanced Leaderboards
**Files:** `src/types/index.ts` (followers on `LeaderboardEntry`),
`src/mocks/leaderboard.ts`, `src/components/leaderboard/leaderboard-item.tsx`,
`src/app/(dashboard)/leaderboard/page.tsx`

- **Period tabs are now functional**: each period applies a deterministic multiplier +
  per-entry PRNG jitter, so Daily/Weekly/Monthly produce different, stable rankings.
- **New "Most Followed" ranking** (leaderboard rows now carry follower counts with a
  followers override column). "Most Active" now sorts by trades × change-weighted recency.
- **Top-3 podium**: avatars + metric + rank cards above the ranked list, with the leader
  highlighted. Title shows active period + filter.

### 15.4 Verification
| Check | Result |
| --- | --- |
| `npx eslint <changed files>` | 0 problems |
| `npm run build` | ✓ Compiled (5.1s) · ✓ TypeScript passed (fixed 1 button variant) · 23 routes |

### 15.5 Still to build (P2)
Referral/Reward system, Personalized Feed. (Create Market — intentionally skipped.)

---

## 16. P2 batch 4 — Personalized Feed + Referral/Reward system (finishes P2)

### Audit (all 9 requested features vs. app)
| Feature | Status |
| --- | --- |
| Copy Trading (demo) | ✅ exists — `copy-store.ts`, `copy-trader-button.tsx` (trader profile), `copy-trading-panel.tsx` (portfolio rail) |
| AI Market Assistant | ✅ exists — "Ask AI" dialog on market detail |
| Market News | ✅ exists — `market-news.tsx` bottom of market main column |
| AI Market Summary | ✅ exists — `ai-summary-card.tsx` below market chart |
| Market Sentiment | ✅ exists — `market-sentiment.tsx` in market detail rail |
| Trader Reputation Score | ✅ exists — `reputation-score.tsx` on `/users/[userId]` |
| Advanced Leaderboards | ✅ exists — period tabs, podium, Most Followed on `/leaderboard` |
| Referral/Reward system | ⚠️ existed but static (hardcoded stats, toast-only QR/Pro) → rebuilt (below) |
| Personalized Feed | ❌ **missing** — "For You"/"Following" tabs were stubs → built (below) |
| Create Market | ✅ intentionally absent (scope decision) |

### 16.1 Personalized Feed (was a stub)
**Files:** `src/mocks/social.ts`, `src/services/domain.service.ts`,
`src/app/(dashboard)/social/page.tsx`

**Why:** The "For You" and "Following" tabs were placeholders — Following always
returned `false` (permanent empty state) and For You was just raw posts. The
follow (`omx-follows`) and watchlist (`omx-watchlist`) stores existed but were
never read by the feed.

- **Expanded mock posts** 5 → 11 across all 5 social users, so follows/watchlist
  curation is meaningful (posts attach real markets m-001/m-007/m-013/m-015).
- **"Following"** now filters posts to followed traders (+ own posts) instead of
  always empty; empty state offers a "Find traders" action that scrolls to the
  suggestions card.
- **"For You"** now genuinely personalizes: each post is scored on followed
  author (+8), watched attached market (+4), own post (+2), and engagement
  (likes/comments/shares, capped), then sorted descending. A Sparkles meta line
  states what the feed was curated from (e.g. "Curated from 2 traders and 1
  market you follow").
- **Fresh "Suggested to Follow"** sidebar card — top non-followed posters with a
  live `FollowButton`, closing the loop: follow → feed adapts. Backed by new
  `socialService.getSuggestedTraders()`.
- "Top" now sorts by engagement score; "Latest" unchanged.

### 16.2 Referral/Reward system (was fully static)
**Files:** `src/store/referral-store.ts` (new),
`src/components/invite/referral-qr.tsx` (new),
`src/app/(dashboard)/invite/page.tsx`

**Why:** The invite page was static markup with hardcoded stats, a toast-only QR
button, and a "coming soon" Pro button. Rebuilt as a stateful reward system.

- **Persisted store** (`omx-referrals`): invite ledger (6 seed invites: 4 paid
  + 2 pending → live stats $85 earned / $50 pending / 6 friends), `setPro`,
  `addInvite` (pays `2x` when Pro), and `referralTotals()` helper.
- **Reward Ladder card** (new): 4 milestone tiers (1/3/5/10 friends → +$10/25/50/100)
  with unlocked/locked/next states, a progress bar to the next bonus, and
  Pro-doubled values.
- **QR code modal**: real modal (no more toast) rendering a **deterministic
  SVG QR pattern** seeded from the referral link (`hashString`/`createRng`),
  finder corners included — remixable demo QR.
- **Functional Pro toggle**: the Upgrade card now actually flips the persisted
  `pro` flag with a success toast; per-friend reward, ladder values, and copy
  all react (e.g. "$50 per friend"). Deactivate restores $25.
- **Recent Invites** list live from the store with Paid (+$) / Pending (~$) chips
  and a "Last rewarded" date derived from the ledger.

### 16.3 Verification
| Check | Result |
| --- | --- |
| `npx eslint <changed files>` | 0 problems (only pre-existing `jsx-a11y/alt-text` warnings remain on the social page) |
| `npm run build` | ✓ Compiled (5.9s) · ✓ TypeScript passed · ✓ 23 routes |

## 17. P2 roadmap — complete

Copy Trading, AI Market Assistant, Market News, AI Market Summary, Market
Sentiment, Personalized Feed, Trader Reputation Score, Advanced Leaderboards,
Referral/Reward system — **all implemented**. (Create Market — intentionally
skipped per scope decision.)