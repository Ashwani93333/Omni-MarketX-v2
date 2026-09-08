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