# OmniMarketX Frontend — Development Process & Change Log

This document records what was changed, what each change fixes, and **why** it was made.
Audio reference: `OmniMarketX_Frontend_UI_UX_Specification.md` (the UI/UX spec the work is checked against).

All changes are verified with:
- `npm run lint` — clean on every touched file (0 errors)
- `npm run build` — passes (TypeScript OK, all 28 routes generated)

---

## Changelog at a glance (all work so far)

| # | Change | Why (rationale) |
| --- | --- | --- |
| 1 | Bug fixes (wallet $0, category reload, double nav, toggles, Infinity shares, expired labels, search) | Core flows were wrong/dead — first pass to make the demo behave correctly. |
| 2 | Responsive UI fixes (rails, grids, leaderboard rows, demo banner, mobile search) | Layouts broke or cut off content at tablet/mobile widths. |
| 3 | Feature additions (trade-panel guard, settings help card, invite spec sections, register password toggles) | Small spec features the app was missing. |
| 4 | Pre-existing warnings (non-blocking) | Documented known re-export warnings; nothing to fix yet. |
| 5 | Verification gate | Established lint + build as the always-run quality check. |
| 6 | Live-site clone & visual alignment (`/`, `/home`, `/search`, groups, polls, wallet, notifications) | Task was to clone omnimarketx.com end to end — matched design tokens, fonts, landing page, and fixed dead UI. |
| 7 | P0: Watchlist (persisted store, star, `/watchlist`) | The "check and implement these features" task — watchlist was marked done but didn't exist. |
| 8 | P1 batch 1: Order Book, Recent Trades, Market Discussion, Price Alerts | All P1 "Market Activity" features were missing from the market-detail page. |
| 9 | P1 batch 2: Trader Profiles + Follow Traders | Leaderboard/profile links were dead ends; no follow capability. |
| 10 | P1 batch 3: Trading Analytics + Achievements | Portfolio lacked performance insight; no gamification. |
| 11 | P1 batch 4: Market Heatmap + Open Orders | Visual "where is the money" + active-order management were absent. |
| 12 | P2 roadmap (deferred) | Differentiation features scoped for later phases. |
| 13 | P2 batch 1: AI Summary, Sentiment, Assistant | Differentiate the demo with AI features the spec called for. |
| 14 | P2 batch 2: Market News | Per-market news feed with impact/sentiment tagging. |
| 15 | P2 batch 3: Reputation Score, Copy Trading (demo), Advanced Leaderboards | Trader credibility, copy-demo loop, and podium/most-followed leaderboards. |
| 16 | P2 batch 4: Personalized Feed + Referral/Reward system | "For You" was a stub and the invite page was static — rebuilt both as stateful systems (finishes P2). |
| 17 | P2 roadmap complete | Full differentiation scope shipped (Create Market intentionally skipped). |
| 18 | Polish & bug-fix pass (2026-09-09) | Audit-driven fixes: negative NO price, trading on closed markets, profile 404s, fake search, unconfirmed destructive actions + a11y/CSS/perf nits (details below). |
| 19 | Onboarding/landing page feature showcase (2026-09-09) | New users had no way to discover the 19 features built in P0-P2 — the hero/footer only described an anonymous "prediction market" (details below). |
| 20 | Theme cleanup + auth/portfolio UI fixes (2026-09-09) | Removed the "system" theme (Light/Dark only), made dark mode pure black, and fixed the login/register + portfolio sidebar UI (details below). |
| 21 | Auto-hiding sidebar + hidden scrollbar (2026-09-09) | The sidebar's scrollbar was visible and the sidebar stayed pinned even when unused - it now hides on mouse-leave and returns via a left-edge hover zone or the header button (details below). |
| 22 | Portfolio/wallet stat-card overflow (2026-09-09) | Dollar values ran outside their cards at `xl` widths - stat rows now hold 2 columns until `2xl`, and values get a wrap safety net (details below). |
| 23 | Workable top search (markets / events / users) (2026-09-09) | Search matched market titles only, so category/event words returned nothing - matching now covers titles, categories and descriptions, plus a new Events section in the dropdown and the /search page (details below). |
| 24 | Pricing & onboarding "Choose your plan" step (2026-09-09) | There was no /pricing page and users went straight from the landing CTA to the dashboard - added a single sourced pricing config powering a marketing /pricing page and a 5-step /onboarding wizard with a Free/Pro plan step, monthly/yearly billing toggle and a demo upgrade modal (details below). |
| 25 | In-app plan upgrade & management (2026-09-09) | Pro now reflects the live offer ($14.99 billed monthly, 2-10% referral commission, Soon features) and users can change the plan after signup - added a Plan & Billing section in Settings, a shared PlanSelector reused by onboarding and settings, plus sidebar/profile-menu upgrade entry points (details below). |
| 26 | Plan downgrade guard + duplicate toast fix (2026-09-09) | A Pro user could switch back to Free with one click, and "Exit Demo" fired two toasts for a single click - the Free plan is now locked once Pro is active, and the profile-menu duplicate toast was removed (details below). |
| 27 | Editable profile: Settings now actually saves (2026-09-09) | The username in Settings looked editable but saving only fired a toast - added a single persisted identity store (`omx-user`) that Settings writes to and header/onboarding/social read from, so edits persist everywhere (details below). |
| 28 | Messages & Notifications header interactions (2026-09-09) | The header message icon was a stub that redirected to /social and notifications only existed as a dropdown with no page - built a real `/messages` experience and a `/notifications` page, backed by two shared persisted stores so header badges unread counts match the pages, plus Feedback tab + floating support chat on both pages (details below). |
| 29 | Market trade panel redesigned to spec card (2026-09-09) | The market-detail order card used YES/NO buttons + a plain amount field. Rebuilt it to the reference "Buy/Sell" card: Buy/Sell tabs, YES/NO price chips (93.5&#162; / 6.5&#162;), balance line, quick-amount chips (5/10/20/40/Custom), a min/max rule ($10 - $5000), and an order summary (Shares approx, Est. Payout/Credit, Fees @ 0.2%, Est. Total, Potential Profit). Selling is now real: `sellPosition` credits the balance and reduces/removes held shares, with "no/in-sufficient shares" guards (details below). |
| 30 | Invite page "Upgrade to Pro" redirects to the Pro plan (2026-09-09) | The invite/referral card's Upgrade button only flipped a private `referral-store.pro` flag (a duplicate of the real plan). It now redirects to the actual Plan & Billing section (`/settings#plan`) - same entry point as the sidebar/profile menu - and the page's 2x/reward state is derived from the true plan (`onboarding-store`), so upgrading in Settings reflects on the invite page (details below). |
| 31 | Fix "Maximum update depth exceeded" from object-literal store selectors (2026-09-09) | Zustand selectors that built a new object/array every snapshot (onboarding + settings pages read `useUserStore` via `(state) => ({...})`) make `useSyncExternalStore` see a new value each render `" - the app looped into `Maximum update depth exceeded` at runtime. Both were split into individual scalar selectors (stable references), matching the app's single-field selector convention. Subtle: React Compiler only lint-flagged the onboarding instance, but the runtime crash could come from either (details below). |
| 32 | Create Market flow (`/create-market`) (2026-09-09) | The app was trade-only - members could not create their own markets. Added a production-quality, front-end-only 4-step wizard (Question, Details, Resolution, Review & Publish) with live preview, a Market Quality Score, mock "Improve with AI", tag/image inputs, timezone-aware close dates, optional early resolution, auto-save + Save/Discard draft (localStorage `omx-market-draft`), confirm/success states with View Market + Copy Link + Share, and multi-outcome support in the persisted market store. Surfaced via sidebar, header Create button, and the /markets toolbar; created markets show a Community badge in cards + detail (details below). |
| 33 | Advanced charts: market-detail price chart + order book depth (2026-09-09) | The market chart was a single view and the order book had no visual. Rebuilt `MarketPriceChart` as a pro-grade candlestick/line chart (deterministic OHLCV data, drag-to-zoom/double-click reset, crosshair + floating OHLC tooltip, volume bars, range change pill, resize-aware SVG) and added a new **Depth** tab with a cumulative Recharts depth chart (bid/ask curves + best-bid/ask/spread stat tiles) driven by the same order-book mock as the Order Book tab (details below). |
| 34 | Live uploaded profile picture (2026-09-09) | The "Change Avatar" button in Settings only showed a toast - the picture never persisted or appeared anywhere. Uploads are now real (file -> dataURL, validated, stored in the persisted `omx-user` store) and the avatar updates live everywhere the current user appears: Settings, header profile menu, own trader profile (/users/user-me), market-discussion input + own comments, and the Social compose box (details below). Also hid all scrollbars app-wide (details below). |
| 35 | Pre-deployment audit pass (2026-09-09) | Full audit before evaluation deploy. Found + fixed a real robustness bug: avatars and create-market covers were stored as full-size base64 dataURLs in localStorage (up to 1.5 MB each) against the shared ~5 MB origin quota - one big upload could wipe ALL persistence. Images are now compressed on upload via a shared `fileToDataUrl` helper (avatar 256px, cover 800px, JPEG ~few KB). Also made `metadataBase` env-configurable, renamed the lucide `Image` icon import (was triggering jsx-a11y alt-text warnings), cleaned 8 of 11 lint warnings via the `_`-prefix unused convention, and removed dead code (details below). |

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

Mostly cleaned in §35. What remains is `react-hooks/incompatible-library` on React Hook
Form `useForm().watch()` (register, reset-password, trade-panel) - React Compiler notices
that skip memoization; runtime behavior is correct and these are no-ops to leave as-is.

---

## 5. Verification

| Check | Result |
| --- | --- |
| `npx eslint <changed files>` | 0 errors |

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

## 17. P2 roadmap — complete

Copy Trading, AI Market Assistant, Market News, AI Market Summary, Market
Sentiment, Personalized Feed, Trader Reputation Score, Advanced Leaderboards,
Referral/Reward system — **all implemented**. (Create Market — intentionally
skipped per scope decision.)
---

## 18. Polish & bug-fix pass (2026-09-09)

**Why:** After shipping the full P1/P2 roadmap (sections 8-17), a fresh audit of the
layout, every page, and the component/store layer surfaced a backlog of functional
bugs (wrong math, dead links, 404 routes, destructive actions without confirm) plus
a11y/CSS/perf nits. Left unfixed they break core flows, so this pass fixes the
high-impact bugs first and the top medium-impact items second. Verified with the
build + lint gate before committing.

### 18.1 High-severity fixes

#### 18.1.1 NO price went negative
**File:** `src/app/(dashboard)/markets/[marketId]/market-detail-client.tsx`
**Why:** `Market.probability` is stored as a 0-100 percentage, but the NO side was
computed as `(1 - market.probability) / 100` — real math with the wrong units, so the
NO price displayed negative for any market above 100% (see the shared
`probability - 1 - x` convention already used elsewhere, and the 0-100 contract in
`src/types/index.ts`). The YES price also rendered as raw floating point.
**Fix:** `1 - market.probability / 100` (keeps 0-100 units), and the YES price is
formatted to 3 decimals for a clean cents-per-share display.

#### 18.1.2 Trading was allowed on closed/resolved markets
**Files:** `src/components/market/trade-panel.tsx`, `market-card.tsx`, `market-row.tsx`,
`market-detail-client.tsx`
**Why:** `TradePanel` had no notion of market state, and `MarketActionButtons`
rendered live YES/NO buttons on every card — so users could place real trades against
markets that were CLOSED or already RESOLVED (a financial-integrity bug, even in demo).
**Fix:** `TradePanel` takes a `status` prop (default `"OPEN"`); when the market is not
OPEN it renders a "Market resolved/closed" notice instead of the side-select + form (no
browser history or URL toast side effects either). Cards/rows pass
`disabled={market.status !== "OPEN"}` into `MarketActionButtons`, and the detail page
passes `market.status` down. The degenerate-side guard (price <= 1%) is preserved.

#### 18.1.3 Activity feed trader links hit 404
**Files:** `src/mocks/traders.ts`, `src/mocks/activity.ts`
**Why:** The activity feed's `users` (`u-001..u-007`) are linked from avatars and
trade rows, but `traderProfiles` was built only from `socialUsers` + leaderboard rows,
so `/users/u-003` (etc.) threw the "trader not found" state — most profile links in
the app were broken.
**Fix:** Exported `activityUsers` alias from `activity.ts` and merged it into
`baseUsers` in `traders.ts`, so every id used anywhere in a link resolves to a
rendered profile.

#### 18.1.4 Search results were fake and un-clickable
**Files:** `src/mocks/social.ts` (new `searchUsers`), `src/components/layout/global-search.tsx`,
`src/app/(dashboard)/search/search-client.tsx`
**Why:** The header command search and the `/search` page listed "users" with fake ids
(`su-1/2/3`) that redirected nowhere, so search could never reach a real profile, and
result rows were inert `<button>`s. The two implementations also duplicated the same
mock data (drift risk).
**Fix:** Centralized a shared `searchUsers` array in `social.ts` using **real** ids from
`traderProfiles` (`s-002`, `u-l1`, `s-003`, `s-004`, `s-005`). Both consumers now emit
real `<Link href="/users/{id}">` rows (traders) and `/groups` links (groups);
global-search rows regained their avatars via an optional `initials` prop on the shared
`SearchRow`.

#### 18.1.5 Destructive reset ran with no confirmation
**File:** `src/app/(dashboard)/settings/page.tsx`
**Why:** "Reset Demo Account" wiped the trading ledger and wallet instantly on click —
a destructive, irreversible action with zero guard; one mis-click loses all positions.
**Fix:** The button now opens a confirm modal ("Clear all virtual trades, restore
$10,000") with Cancel/Reset; the reset itself runs only on explicit confirm.

#### 18.1.6 Back button stranded users with no history
**File:** `src/app/(dashboard)/markets/[marketId]/market-detail-client.tsx`
**Why:** The market-detail "Back" link called `router.back()` unconditionally. On a
deep-linked/opened-in-new-tab page there is no history, and the browser does nothing
(feels like a dead button).
**Fix:** `goBack()` checks `window.history.length > 1` first and falls back to
`router.push("/markets")` otherwise.

### 18.2 Medium-severity fixes
- **Dead `href="#"` article links** — `src/components/market/market-news.tsx`
  **Why:** News cards wrapped in `<Link href="#">` implied navigation that didn't exist;
  clicking scrolled to top / did nothing.
  **Fix:** Cards are now plain `<article>` elements with the hover affordance removed.
- **Watchlist "Clear all" no confirm** — `src/app/(dashboard)/watchlist/page.tsx`
  **Why:** Same destructive-action problem as settings: the wipe ran instantly.
  **Fix:** Confirm modal with live count before clearing.
- **Movers always showed `+`** — `src/components/layout/right-rail.tsx`
  **Why:** Top Volume Movers rendered `+{mover.change}%` in green for every row, even
  negative movers; also used raw `<a>` (no next/link SPA nav) and had no error state.
  **Fix:** Dynamic sign + danger color for negative changes, `next/link` navigation,
  and a shared "Retry" error state on both right-rail cards.
- **Grid overflow past the aside** — `src/app/(dashboard)/portfolio/page.tsx`,
  `src/app/(dashboard)/activity/page.tsx`
  **Why:** `xl:grid-cols-[1fr_320px]` uses min-content sizing for the content column, so
  wide inner grids (stat cards / position cards) could overflow under the right rail.
  **Fix:** `minmax(0,1fr)` + `min-w-0` on the content column.
- **Home page had no error state** — `src/app/(dashboard)/home/page.tsx`
  **Why:** A failed markets query silently rendered an empty grid ("Top Markets" with no
  cards) and the EmptyState action was a no-op button.
  **Fix:** Added `isError` branch with retry, and wired EmptyState's action to
  `router.push("/markets")`.
- **Created groups unreachable** — `src/app/(dashboard)/groups/page.tsx`
  **Why:** New groups default to category `Community`, but the filter chips had no
  Community option (only All matched them), and the "My Groups" tab ignored
  locally-created groups entirely.
  **Fix:** Added a "Community" chip and merged `extraGroups` into the My Groups render.
- **Invisible AI chat bubbles** — `src/components/ai/ai-assistant-dialog.tsx`
  **Why:** User messages used `text-primary-foreground`, a token that doesn't exist in
  this theme (only `text-text-*` tokens are defined), so user bubbles inheried
  text colour on a `bg-primary` background — near-unreadable.
  **Fix:** `text-white` on the primary background.
- **Pagination active page not announced** — `src/components/ui/pagination.tsx`
  **Why:** Screen readers had no way to tell which page was current.
  **Fix:** `aria-current="page"` on the active page button.
- **Chart series regenerated on every render** — `src/components/market/market-chart.tsx`
  **Why:** `generateData(...)` ran on each render even though it only depends on
  `probability` + `range`.
  **Fix:** Wrapped in `useMemo` over `[probability, range]`.
- **Inconsistent invite money formatting** — `src/app/(dashboard)/invite/page.tsx`
  **Why:** Stat cards hand-rolled `$${n.toFixed(2)}` while the rest of the app uses
  `formatCurrency`.
  **Fix:** `formatCurrency(earned)` / `formatCurrency(pending)`.
- **Demo banner caused layout shift** — `src/components/layout/demo-banner.tsx`
  **Why:** The banner mounted/unmounted with the mode, so SSR/persist hydration or a mode
  switch shifted the entire layout down/up by ~30px.
  **Fix:** The outer shell is always mounted with reserved height (`h-0 overflow-hidden`
  when not demo) so toggling DEMO/REAL no longer shifts content.
- **REAL mode had no disclaimer** — `src/store/app-store.ts`
  **Why:** Switching to "Real" mode silently implied live trading even though no funds
  move; also the same toggle exists in 4 places (header, banner, profile menu, settings),
  so adding UI at each call site would drift.
  **Fix:** Centralized the toast in the store action: REAL → "Live mode is simulated"
  warning, DEMO → "Demo mode enabled" confirmation, firing from every entry point.

### 18.3 Verification
| Check | Result |
| --- | --- |
| `npx eslint <changed files>` | 0 errors (1 pre-existing `react-hooks/incompatible-library` warning on react-hook-form `watch()`) |
| `npm run build` | ? Compiled (5.5s) ? TypeScript passed ? 23 routes |

### 18.4 Deferred (noted for a later pass)
- Command Palette (Cmd/Ctrl+K) global search - planned, not started.
- Unify the duplicate trader identities between activity feed (`u-*`) and
  social/leaderboard (`s-*` / `u-l*`) mocks into a single id space (routes currently
  still resolve, just under two id sets).

---

## 19. Onboarding / landing page � feature showcase (2026-09-09)

**File:** `src/app/(marketing)/page.tsx`

**Why:** The landing page (the pre-login "onboarding" experience at `/`) only ever
described a generic prediction market. Since P0-P2 shipped 19 real features (order
book, AI assistant, copy trading, referral rewards, heatmap, reputation, etc.), new
users had zero awareness of them � nothing told the user what they get for signing up.

**Changes**
- **New "Features" hero section** (`#features`): four grouped cards that mirror the
  actual product under real names � **Trade & Analyze** (order book & trades, heatmap,
  price alerts, open orders & analytics, rich market data), **AI Assistance** (assistant,
  summaries, sentiment, news), **Social & Community** (personalized feed, discussion,
  follow & watchlist, trader profiles & reputation, copy trading), **Earn & Level Up**
  ($10K demo wallet, referral rewards, achievements, advanced leaderboards, activity
  feed) � 19 feature tiles with icons + one-line explanations.
- **Feature chips strip** beneath the grid ("Order book", "AI assistant",
  "Personalized feed", "Copy trading", "Referral rewards", �) as a quick scanable list.
- **"Who it's for" section** adding a third motivational CTA block (demo funds,
  community groups, referral rewards) between features and the final CTA.
- Hero badge/stat updated to "all features included" and "19 built-in features";
  since the FAQ called for zero guessing, each chip/stat matches a real feature.
- Header nav added a **Features** anchor; "How it works" steps gained small tags
  (8 categories / 50�-$1 payout / 24/7 trading) for extra information density.
- Custom `CheckDot` inline SVG used for chip bullets (no new dependency).

### Verification
| Check | Result |
| --- | --- |
| `npx eslint src/app/(marketing)/page.tsx` | 0 problems |
| `npm run build` | compiled, TypeScript passed, 23 routes |

---

## 20. Theme cleanup + auth & portfolio UI fixes (2026-09-09)

**Requested:** Remove the system theme, keep only Light/Dark; use pure black for the
dark theme; fix the login/register page UI; fix the portfolio sidebar where stat
values overlapped and amounts didn't display.

### 20.1 Removed the "system" theme option

**Files:** `src/store/app-store.ts`, `src/components/theme-script.tsx`,
`src/components/theme-provider.tsx`, `src/app/(dashboard)/settings/page.tsx`,
`src/components/layout/sidebar.tsx`, `src/components/layout/profile-menu.tsx`

| Before | After |
| --- | --- |
| `Theme = "light" \| "dark" \| "system"`, default `"system"` | `Theme = "light" \| "dark"`, default `"light"` |
| `resolveTheme()` mapped `"system"` to the OS media query | `applyTheme()` toggles `.dark` for `"dark"` directly |
| ThemeProvider listened to OS media changes and re-applied on change | Media listener removed (no longer needed without `"system"`). |
| Settings / sidebar / profile dropdown still offered a System option | All three surfaces now offer only Light/Dark; sidebar selector grid is `grid-cols-2`. |
| theme-script pre-hydration fallback was `"system"` | Fallback is now `"light"` (still tolerates a legacy stored `"system"` value). |

**Migration:** the persisted store bumped to `version: 2` with a `migrate` fn that
coerces any legacy stored `"system"` into the user's actual OS preference, so
existing users don't land in the wrong theme and a stuck `"system"` value can never
re-apply.

**Why:** The user wants explicit theme control only (Light/Dark); the `system` mode
added a media-listener + two-code-path indirection for a feature nobody asked for,
and kept the type surface unnecessarily wide.

### 20.2 True-black dark theme

**File:** `src/app/globals.css` (`.dark` block)

| Token | Before | After |
| --- | --- | --- |
| `--background` | `#090426` (deep indigo) | `#000000` (pure black) |
| `--surface` | `#110a36` | `#0c0c0f` (near-black) |
| `--elevated` | `#1b1150` | `#141417` |
| `--border` | `rgba(255,255,255,0.08)` | `rgba(255,255,255,0.10)` |
| `--border-light` | `rgba(255,255,255,0.05)` | `rgba(255,255,255,0.06)` |
| `--text-*`, `--primary` accent | unchanged | unchanged |

**Why:** The requested look is a true-black dark mode; surfaces/elevation step up
from pure black in small grays so cards still read as layered, and borders were
lifted a touch to stay visible against the black background.

### 20.3 Login / register page UI

**Files:** `src/components/auth/auth-card.tsx`, `src/app/(auth)/register/page.tsx`

- Social buttons gained real icons: Google logo and GitHub mark as inline SVGs,
  Wallet as a lucide icon (lucide-react no longer ships a `Github` export, hence
  the inline SVG), with `gap-2` icon + label alignment.
- "or continue with email" divider: the shared `Separator` defaults to `w-full` +
  `shrink-0`, so two of them inside the flex row demanded full width each and shoved
  the label off-center. Added `flex-1` to both separators so the lines split the
  remaining space evenly and the label is truly centered.
- Card container padding bumped to `sm:p-7` for breathing room on desktop.
- Register now shows a terms acknowledgment line under the submit button
  ("By creating an account, you agree to our Terms of Service and Privacy Policy.")

**Why:** The social buttons were bare text (visually flat), and the register page
gave no acknowledgment of terms. The `Github` icon was missing from the installed
lucide-react version (build error), so an inline SVG mark was used instead.

### 20.4 Portfolio sidebar (right rail) - overlap + amount display

**Files:** `src/components/orders/open-orders-card.tsx`,
`src/app/(dashboard)/portfolio/page.tsx` (Recent Demo Trades list)

- **Open Orders:** the header row previously mixed `justify-between` with an
  `ml-auto` cancel button, which shoved the type/time text against the other items;
  the row never displayed a dollar value at all (only `@ price` and `shares`). Now:
  chip / order type / relative time / cancel are laid out with `shrink-0`,
  `whitespace-nowrap` and a proper `ml-auto` gap, and a second row shows
  `@ 0.440 / 120 shares` with the order value (`price x shares`) in a right-aligned
  bold amount pill, e.g. `$52.80`.
- **Recent Demo Trades:** each row was chip + amount on one line with the market
  title and date stacked beneath, letting a long title crowd the amount. Now each
  item is a bordered box with the chip, a truncating market title (`min-w-0 flex-1
  truncate`) and the right-aligned amount pill on one line, then date + share count
  on a second line.

**Why:** This is the section reported as broken - values visually collided and the
dollar amount was missing from orders. Truncation + `shrink-0` + nowrap guarantees
the numbers can never overlap the chips/titles at any column width, and every
order/trade now shows its actual amount.

### Verification
| Check | Result |
| --- | --- |
| `npx eslint <changed files>` | 0 errors (1 pre-existing react-hook-form `watch()` warning) |
| `npm run build` | compiled, TypeScript passed, 23 routes |

---

## 21. Auto-hiding sidebar + hidden scrollbar (2026-09-09)

**Requested:** Remove the visible scrolling bar in the sidebar, and hide the
sidebar when it is not in use.

### 21.1 Sidebar scrollbar removed

**Files:** `src/app/globals.css`, `src/components/layout/sidebar.tsx`

- Added a `scrollbar-none` utility in globals.css (`scrollbar-width: none`, visible
  webkit scrollbar hidden).
- The sidebar `nav` switched from `scrollbar-thin` to `scrollbar-none`. It keeps
  `overflow-y-auto`, so the nav can still scroll on short viewports - just without
  a visible scrollbar track/thumb.
- Other horizontal chip rows keep `scrollbar-thin` unchanged.

### 21.2 Sidebar auto-hides when not in use

**Files:** `src/components/layout/app-shell.tsx`, `src/components/layout/header.tsx`

- The previously-dead `sidebarOpen` / `setSidebarOpen` store fields are now wired
  up in `AppShell`.
- **Hide:** when the pointer leaves the desktop sidebar (with a 250 ms grace delay
  so quick jiggles don't close it), the sidebar slides off-canvas
  (`-translate-x-full`, 300 ms) and the main content padding shrinks
  (`lg:pl-60` -> `lg:pl-0`) with a matching transition.
- **Show:** moving the pointer back onto the screen's left edge (an invisible
  8 px hover zone) reopens it; the header menu button also becomes visible on large
  screens while the sidebar is hidden and reopens it with one click (the button's
  original mobile-drawer behavior is preserved while the sidebar is open).
- The left-edge hover zone is `pointer-events-none` while the sidebar is open so it
  never blocks clicks on the sidebar content.

**Why:** A permanently-pinned sidebar eats ~240 px of horizontal space even when the
user isn't navigating, and a visible scrollbar in such a short list looks like a
UI artifact. Auto-hide frees the content area while keeping navigation reachable
(hover-left-edge or the header menu button).

### Verification
| Check | Result |
| --- | --- |
| `npx eslint src/components/layout/{app-shell,header,sidebar}.tsx` | 0 problems |
| `npm run build` | compiled, TypeScript passed, 23 routes |

---

## 22. Portfolio / wallet stat-card overflow (2026-09-09)

**Requested:** On `/portfolio`, the stat-card values were running outside their
boxes (Total Value $10,266.43 / Total P&L $44.76 / Open Positions 6 / Cash Balance
$9,699.94) - the amounts looked cut off at the card edges.

**Root cause:** The stat rows were `sm:grid-cols-2 xl:grid-cols-4`. At `xl`
(~1280px) the main column is only ~880px wide once the 320px aside is subtracted,
so each card got ~210px and the inner text column ~114px after the icon. An
unbreakable string like "$10,266.43" is ~140px at `text-2xl` mono, so it overflowed
its `min-w-0` text column and spilled past the card border.

**Fix**
- `src/app/(dashboard)/portfolio/page.tsx` and
  `src/components/wallet/wallet-overview.tsx`: stat rows now stay two-up until
  `2xl` (`sm:grid-cols-2 2xl:grid-cols-4`), giving each card comfortable width at
  the common 1280-1535px range.
- `src/components/ui/stat-card.tsx`: the value line gained
  `[overflow-wrap:anywhere]` as a safety net, so at any viewport, zoom, or font
  scale a long number wraps inside the card instead of ever escaping it. This also
  protects the narrower `sm:grid-cols-4` grids on `/activity`.

**Why:** The full amounts must always be visible (the earlier right-column fix was
about the same "amount not showing" theme) - the fix gives the numbers their own
space and guarantees they can never render outside the card boundary.

### Verification
| Check | Result |
| --- | --- |
| `npx eslint src/components/ui/stat-card.tsx src/app/(dashboard)/portfolio/page.tsx src/components/wallet/wallet-overview.tsx` | 0 problems |
| `npm run build` | compiled, TypeScript passed, 23 routes |

---

## 23. Workable top search (markets / events / users) (2026-09-09)

**Requested:** Make the header search bar actually search users, markets and
events.

**Root cause:** `searchMarkets` filtered market titles only. Searching for an event
category or topic word - "crypto", "politics", "events", "gaming" - returned no
markets, and there was no "Events" result type in the header dropdown, so the
search felt broken. (Groups were surfaced, but events/markets were only findable by
exact title text.)

**Fix**
- `src/services/market.service.ts` - `searchMarkets` now matches the market title,
  the category **and** the description (case-insensitive), capped at 5 results.
- `src/components/layout/global-search.tsx` (header dropdown) - added an **Events**
  section: matched event categories link to `/markets?category=...`, right under
  Markets. Market rows now also show the status when a market is no longer OPEN.
- `src/app/(dashboard)/search/search-client.tsx` (the `/search?q=` page) - same
  Events section (individual event tiles linking to the category browse), so the
  dropdown and full results page agree.

Searching "crypto" now returns the matching **Markets** plus an **Events** card for
the Crypto category; searching "sophia" or "mia" returns **Users**; Groups still
match too. Enter/result click navigation and the `/` shortcut were already wired
and are unchanged.

**Why:** The top bar's own placeholder promises "Search markets, events, users" -
now all three can actually be found, including by the event category terms people
naturally type.

### Verification
| Check | Result |
| --- | --- |
| `npx eslint src/services/market.service.ts src/components/layout/global-search.tsx src/app/(dashboard)/search/search-client.tsx` | 0 problems |
| `npm run build` | compiled, TypeScript passed, 23 routes |

---

## 24. Pricing & onboarding "Choose your plan" step (2026-09-09)

**Requested:** Add pricing to the onboarding flow - a Choose-your-plan step inside
onboarding, driven by one shared pricing config between onboarding and a main
marketing Pricing page.

**Root cause:** Onboarding was just the landing page whose "Get started" CTAs
jumped straight to `/home` - there was no `/pricing` route, no plan/subscription
concept anywhere in the app, and no step-by-step onboarding wizard.

**Fix - single source of truth** (`src/constants/pricing.ts`)
- `pricingConfig`: Free (monthly/yearly $0, "Free forever") and OmniMarketX Pro
  ($14.99/mo, $12.49/mo on yearly) with their own feature lists and CTAs.
- `getBillingDetails(plan, cycle)`: computes monthly-vs-yearly display price, the
  yearly billing note ($149.88/yr) and the savings %; Free always renders as $0.
- `YEARLY_SAVINGS_PCT` = 16.7% (computed from the config, not hardcoded).

**Fix - reusable pricing components** (`src/components/pricing/`)
- `PricingToggle` - Monthly | Yearly segmented control with a "SAVE 16.7%" badge
  on the yearly option (savings derived from the config).
- `PricingPlanCard` - renders either plan from the config (price + billing note +
  savings chip + feature list + CTA); Pro gets a gradient border, a "Most
  popular" badge and a gradient CTA, Free stays clean but not diminished.
- `PricingFeatureList`, `PlanBadge`, `PricingCTA` - the shared building blocks.
- `UpgradeConfirmationModal` - shown when Pro is chosen; lists Pro features and
  the exact price, then "Continue" activates the demo subscription (Go Back
  reverts to the previously selected plan).

**Fix - onboarding wizard** (`/onboarding`, `src/app/(onboarding)/`)
- 5 steps with a connected progress indicator (Welcome - Profile - Interests -
  Plan - Complete), each step in its own card, Back preserved on every step.
- Profile (display name/username/email) and Interests (category chips) persist to
  a new zustand+persist store `src/store/onboarding-store.ts`
  (`omx-onboarding`), so going back keeps every selection.
- Plan step uses the shared components; Free default, "Continue with Free"
  advances without payment, "Start Pro" opens the upgrade confirmation modal, and
  "Maybe later" is simply never selecting Pro (Free stays selected).
- Complete step summarizes the profile, interests and chosen plan, then routes to
  `/home`. `?step=plan` deep-links straight to the plan step.

**Fix - main pricing page** (`/pricing`, `src/app/(marketing)/pricing/page.tsx`)
- Hero + billing toggle + Free/Pro cards (same config), an "Invite & Earn"
  section ($25/$50 referral copy matched to the invite page), a money-back
  guarantee strip, a mini FAQ and a gradient closing CTA.
- CTA buttons preset the plan/billing cycle in the onboarding store and
  deep-link to `/onboarding?step=plan`.
- Landing page header/footer were extracted into shared
  `MarketingNav`/`MarketingFooter` (nav gains a **Pricing** link) and reused by
  both marketing pages; all three landing-page "start" CTAs now point at
  `/onboarding` (was `/home`), and a successful register also routes to
  `/onboarding`.

**Why:** Pricing is a discoverability + onboarding problem in a demo: the plan
needs to be picked up-front without friction or payment, stay consistent between
the marketing page and the wizard, and persist so nothing is lost on Back.

### Files
- New: `src/constants/pricing.ts`, `src/store/onboarding-store.ts`,
  `src/components/pricing/{plan-badge,pricing-feature-list,pricing-toggle,pricing-plan-card,pricing-cta,upgrade-confirmation-modal}.tsx`,
  `src/components/onboarding/{onboarding-progress,onboarding-plan-step}.tsx`,
  `src/components/marketing/{marketing-nav,marketing-footer}.tsx`,
  `src/app/(onboarding)/{layout.tsx,onboarding/page.tsx}`,
  `src/app/(marketing)/pricing/page.tsx`
- Edited: `src/app/(marketing)/page.tsx` (shared nav/footer, CTAs - `/onboarding`),
  `src/app/(auth)/register/page.tsx` (success - `/onboarding`)

### Verification
| Check | Result |
| --- | --- |
| `npx eslint` on all pricing/onboarding/marketing files + register page | 0 problems (1 pre-existing react-hook-form warning) |
| `npm run build` | compiled, TypeScript passed, 25 routes (includes /pricing and /onboarding) |

---

## 25. In-app plan upgrade & management (2026-09-09)

**Requested:** Add an upgrade-plan option inside the app so users can change the
plan after signup, using the live paid-plan offer - $14.99/month billed monthly
with the full feature list, the 2%-10% referral commission and the "Soon"
roadmap items.

**Fix - Pro offer updated** (`src/constants/pricing.ts`)
- monthly note is now "Billed monthly" and the Pro feature list matches the live
  offer: Browse & Trade Markets, Create Markets, Join Groups, Pulse (Social
  Feed), Leaderboards, Pro Badge (verified checkmark), Invite & Earn (2%-10%
  commission).
- added `highlights` (renders "Up to 10% commission" as a gradient chip) and
  `soon` (Advanced Analytics, AI Market Insights, Whale Alerts, Advanced Charts,
  Creator Dashboard, API Access) fields to the config - one source of truth, so
  every surface stays in sync.

**Fix - shared PlanSelector** (`src/components/pricing/plan-selector.tsx`)
- Extracted the billing toggle + Free/Pro cards + upgrade-confirmation logic
  (canceling the modal reverts to the previously selected plan) so onboarding
  and Settings share one implementation instead of duplicating it.

**Fix - change the plan after signup** (`/settings`)
- New "Plan & Billing" card (`id="plan"`) shows the current plan and price, the
  billing-cycle toggle and both plan cards; switching plan fires a demo toast,
  and Pro still routes through the confirmation modal.
- The Connected Account card now shows the real plan (Free/Pro) instead of the
  placeholder "Standard".

**Fix - discovery entry points**
- Sidebar gained a plan teaser card - gradient "Upgrade to Pro" while on Free,
  "Pro is active" once upgraded - linking to `/settings#plan`.
- Profile menu gained an "Upgrade to Pro" / "Manage Pro" item.

**Fix - shared updates everywhere**
- `PricingPlanCard` and `UpgradeConfirmationModal` now render highlights and the
  muted "Coming soon" list (PricingSoonList), so /pricing and onboarding show
  the same offer as Settings.

**Why:** Onboarding picks the plan only once; after signup there was no way to
change it, and the paid offer printed on the pricing pages no longer matched
the live product.

### Files
- New: `src/components/pricing/pricing-soon-list.tsx`,
  `src/components/pricing/plan-selector.tsx`
- Edited: `src/constants/pricing.ts`,
  `src/components/pricing/pricing-plan-card.tsx`,
  `src/components/pricing/upgrade-confirmation-modal.tsx`,
  `src/components/onboarding/onboarding-plan-step.tsx`,
  `src/app/(dashboard)/settings/page.tsx`,
  `src/components/layout/sidebar.tsx`,
  `src/components/layout/profile-menu.tsx`

### Verification
| Check | Result |
| --- | --- |
| `npx eslint` on all touched files | 0 problems |
| `npm run build` | compiled, TypeScript passed, 25 routes |

---

## 26. Plan downgrade guard + duplicate toast fix (2026-09-09)

**Requested:** If a user is already on the paid plan they must not be able to
switch back to Free, and a single event was producing two notifications.

**Fix 1 - no downgrade from Pro** (`src/components/pricing/plan-selector.tsx`,
`src/components/pricing/pricing-plan-card.tsx`)
- While `plan === "PRO"` the Free card is now `disabled`: its CTA is
  non-interactive with a lock icon, the whole card is no longer selectable, and
  `chooseFree` carries a safety guard so the plan can never be reset to FREE
  (this also protects the onboarding plan step, which shares the component).

**Fix 2 - double toast on a single click** (`src/components/layout/profile-menu.tsx`)
- The "Exit Demo" menu item called `setTradingMode("REAL")` - which already
  fires `toast.info("Live mode is simulated")` inside `app-store.ts` - and then
  fired a second `toast.info("Switched to Real mode")` of its own. One click
  showed two toasts. The redundant local toast was removed, so switching modes
  notifies exactly once from every entry point (profile menu and Settings).

**Why:** Free stays a one-way upgrade decision in the demo, and notifications
must map one-to-one to user actions.

### Files
- Edited: `src/components/pricing/plan-selector.tsx`,
  `src/components/pricing/pricing-plan-card.tsx`,
  `src/components/layout/profile-menu.tsx`

### Verification
| Check | Result |
| --- | --- |
| `npx eslint` on the three touched files | 0 problems |
| `npm run build` | compiled, TypeScript passed, 25 routes |

---

## 27. Editable profile: Settings now actually saves (2026-09-09)

**Requested:** The username in Settings looked editable but could not be
changed - saving only fired a toast and never persisted, because identity was
hardcoded to the MOCK_CURRENT_USER constant and reused across the app.

**Fix - single persisted identity store** (new src/store/user-store.ts)
- New persisted Zustand store (omx-user) holding displayName, username,
  email, io and derived initials; initialised from MOCK_CURRENT_USER
  and updated through setProfile (recomputes initials from displayName).
- Settings -> Profile form now reads its defaultValues from the store and
  onSave calls store.setProfile(...) + a single "Profile updated" toast, so
  edits survive reloads. The avatar next to the form uses stored initials.
- ProfileMenu (header avatar, name, @handle) now renders the stored profile
  instead of MOCK_CURRENT_USER, so a saved username shows immediately.
- Onboarding wizard writes the Profile step into the same store (besides its own
  copy) and prefills from it, so a fresh onboarding sets the real identity.
- Social composer avatar uses stored initials/displayName.

**Why:** Settings look like they save but don't; identity must be one source of
truth shared by onboarding and the dashboard chrome.

### Files
- New: src/store/user-store.ts
- Edited: src/app/(dashboard)/settings/page.tsx,
  src/components/layout/profile-menu.tsx,
  src/app/(onboarding)/onboarding/page.tsx,
  src/app/(dashboard)/social/page.tsx

### Verification
| Check | Result |
| --- | --- |
| 
px eslint on all touched files | 0 errors (2 pre-existing Image alt warnings in social/page.tsx) |
| 
pm run build | compiled, TypeScript passed, 25 routes |

---

## 28. Messages & Notifications header interactions (2026-09-09)

**Requested:** Clicking the bell was supposed to open a usable notifications
experience, and the message icon was a stub that just pushed to /social with a
toast. The task: make both header icons real � a full "Notifications" page
(with working filters, a summary sidebar and mark-as-read) and a full
"Messages" experience (conversation list -> select -> chat -> send), all
desktop/tablet/mobile responsive, sharing state so header badges never drift
from the pages. Screens also show a vertical Feedback tab and a floating
support chat button, which the app did not have.

**Fix 1 - shared notification state** (new
src/store/notifications-store.ts, persisted omx-notifications) - a single
source of truth: 
otifications[], load(), markAsRead(), markAllAsRead(),
and a derived selectUnreadCount. The header bell badge, the bell dropdown
preview and the /notifications page all read the same store, so marking read
anywhere updates the badge everywhere. Data loads once through

otificationsService (mockRequest), structured like a real API (loading
skeletons + ErrorState with retry).

- New richer mock src/mocks/notifications.ts; the old array moved out of
  social.ts and 
otificationService re-pointed. NotificationItem gained a
  required category (TRADE/SOCIAL/REWARD/ANNOUNCEMENT/SYSTEM) + optional
  metadata, and an "announcement" type was added.
- EmptyState now accepts a custom icon, so the page shows the exact
  "No notifications here / Check back later" state from the spec.

**Fix 2 - notifications UI** - /notifications page with real tabs (All /
Trades / Social / Rewards / Announcements / System) using Radix tabs + proper
tabpanel semantics; clicking a tab filters the store data live. Right rail has
a live **Notification Summary** (Unread / Trades / Social / System, all derived
from the feed) and a **Manage Notifications** card linking to /settings.
"Mark all as read" appears only while unread > 0. Notification rows mark read
on click and navigate by type (markets / leaderboard / social / settings).
The header NotificationsMenu was refactored to the store, keeps its preview
dropdown and adds a "View all notifications" footer -> /notifications.

**Fix 3 - messages feature** (new src/store/messages-store.ts, persisted
omx-messages, src/services/messages.service.ts, src/mocks/messages.ts) -
New Conversation / Message types. ConversationList (searchable sidebar),
ConversationView (chat header + scrollable bubbles + composer), reusable
MessageBubble / MessageComposer. Composer: Enter/button sends, empties are
prevented, input clears, timestamps show, sent messages appear instantly via
store, thread auto-scrolls.

- Header MessageCircle now routes to /messages and shows the shared unread
  badge (selectUnreadCount); opening a conversation marks it read and the
  badge updates everywhere. Added Messages entry to the sidebar nav.
- /messages layout: 340px | rest grid on desktop; mobile swaps between the
  list and the conversation with a back button. "Select a conversation" empty
  panel + per-conversation unread badges matched to the spec screenshots.

**Fix 4 - global widgets the screens needed** - new FeedbackTab (fixed
vertical right tab -> feedback modal with type + message, submits a toast) and
SupportChatButton (floating bottom-right chat dialog with canned replies),
both shared components rendered on the Notifications and Messages pages. No
duplicate widgets; both use the Radix Modal so Escape/click-outside close them.

**Why:** The header icons looked present but lead nowhere; notifications had no
page/filters and unread state could diverge; messages didn't exist. Both
features are now stateful, persisted, responsive and consistent (one store per
domain, badges derived from the same data).

### Files
- New: src/mocks/notifications.ts, src/mocks/messages.ts,
  src/services/notifications.service.ts, src/services/messages.service.ts,
  src/store/notifications-store.ts, src/store/messages-store.ts,
  src/components/notifications/{notification-utils.ts,notification-item.tsx,notification-summary.tsx},
  src/components/messages/{conversation-item.tsx,conversation-list.tsx,conversation-view.tsx,message-bubble.tsx,message-composer.tsx},
  src/components/support/{feedback-tab.tsx,support-chat-button.tsx},
  src/app/(dashboard)/notifications/page.tsx,
  src/app/(dashboard)/messages/page.tsx
- Edited: src/types/index.ts, src/mocks/social.ts,
  src/services/domain.service.ts, src/components/ui/empty-state.tsx,
  src/components/layout/notifications-menu.tsx,
  src/components/layout/header.tsx,
  src/components/layout/nav-icons.tsx, src/constants/index.ts

### Verification
| Check | Result |
| --- | --- |
| 
px eslint . (whole project) | 0 errors (only pre-existing warnings: watch()-based forms, input VariantProps, auth/wallet service unused params, social Image alt, check-lucide script) |
| 
pm run build | compiled, TypeScript passed, 27 routes (added /messages + /notifications) |
| 
ode .check-lucide.mjs | all runtime icons exist (type-only LucideIcon reported as missing is the pre-existing type-import pattern, not a runtime import) |

---

## 29. Market trade panel redesigned to spec card (2026-09-09)

**What:** The market-detail order card was rebuilt to match the reference look
("Trade" -> Buy | Sell tabs, YES **93.5&#162;** / NO **6.5&#162;** price chips, balance line,
quick-amount chips, min/max rule, order summary) and selling is now functional.

**Why:** The old panel only offered a Buy-style YES/NO form (no BUY vs SELL
concept, no per-share price display, no fees/payout breakdown). The reference
card shows the per-outcome price in cens, quick amount buttons, and a
Shares/Payout/Fees/Total/Profit breakdown that makes the trade math visible.

### Details
- **Buy/Sell tabs**: segmented toggle at the top (BUY default).
- **Outcome chips**: YES shows `probability&#162;`, NO shows `(100-probability)&#162;`
  (price-in-cens == probability % for a \$1 share); selected chip fills colored.
- **Balance line**: "Your Balance 9,xxx.xx USDC (Demo)" driven by the trading store.
- **Quick amounts**: 5 / 10 / 20 / 40 / Custom chips - clicking sets the amount
  input; "Custom" is active when no preset matches.
- **Min/max rule**: amounts below \$10.00 or above \$5,000.00 are invalid and show
  an inline error (input + note below).
- **Order summary** (on every keystroke):
  - Shares (approx.) = amount / price
  - Est. Payout (Buy) = shares x \$1 ; Est. Credit (Sell) = amount
  - Fees = amount x 0.2% (0.02 on \$10)
  - Est. Total = amount + fees (Buy) ; net credit amount - fees (Sell)
  - Potential Profit = payout - total, colored green/red with +/-
- **Sell is real**: added `sellPosition` to the trading store - validates held
  shares, credits the balance, appends a Filled trade, and reduces/removes the
  position. Guards: "You don't hold any {side} shares in this market yet" and
  "Insufficient {side} shares - you hold N."
- Submit button reads "Buy YES / Sell NO" and is left/right colored
  (success/danger). Confirm modal gained an "Action" field and matches the new
  Buy/Sell wording. Demo toast reflects `Bought`/`Sold`.

### Files
- Edited: src/components/market/trade-panel.tsx, src/store/trading-store.ts
  (sellPosition), process.md (this section)

### Verification
| Check | Result |
| --- | --- |
| eslint\n trade-panel.tsx + trading-store.ts | 0 errors (pre-existing React-Compiler watch() warning on trade-panel, same pattern already in the repo) |
| npm run build | compiled, TypeScript passed |

---

## 30. Invite page "Upgrade to Pro" redirects to the Pro plan (2026-09-09)

**What:** The invite/referral page's "Upgrade to Pro" button no longer fakes an
activation - it now redirects to the real plan management area, and the page's
Pro state reads from the actual plan.

**Why:** "Upgrade to Pro" on the invite card only flipped a private
`referral-store.pro` boolean, which was a duplicate source of truth disconnected
from the user's real plan (driven by `onboarding-store`, used by the sidebar,
profile menu and Settings). A persisted `pro:false` could hide 2x rewards even
after the user genuinely upgraded, and the button silently "activated" Pro
without any plan change.

### Details
- The card's button now calls `router.push("/settings#plan")` - the same
  destination as the sidebar "Upgrade to Pro" and the profile-menu "Upgrade to
  Pro / Manage Pro". When Pro is active the card shows "Manage Plan" instead of
  "Deactivate Pro" (downgrading to Free is intentionally locked once Pro is on).
- The page derives `pro` from `useOnboardingStore((s) => s.plan === "PRO")`, so
  per-friend payouts, milestone 2x values and the "Pro is Active" card all
  reflect the true plan and update live after upgrading in Settings.
- Removed the duplicate `pro`/`setPro` from `referral-store`; `addInvite` now
  takes `pro` from the caller. (Persisted `omx-referrals` old flag is ignored.)

### Files
- Edited: src/app/(dashboard)/invite/page.tsx, src/store/referral-store.ts,
  process.md (this section)

### Verification
| Check | Result |
| --- | --- |
| eslint invite/page.tsx + referral-store.ts | 0 errors |
| npm run build | compiled, TypeScript passed |

---

## 31. Fix "Maximum update depth exceeded" from object-literal store selectors (2026-09-09)

**What:** Two components read the persisted user store through a selector that
built a brand-new object on every call
(`useUserStore((state) => ({ displayName, username, email, ... }))`). With
`useSyncExternalStore` (what Zustand v5 uses under the hood) a selector result
is only accepted as unchanged when `Object.is` says so - so every render saw a
"changed" snapshot and React re-rendered forever, surfacing as
`Maximum update depth exceeded` at runtime.

**Why:** The app's convention is one scalar per `useStore` selector. Object/array
shorthand selectors are silently dangerous: the compiler lint only flagged the
onboarding instance (that is what the previously reported `getSnapshot should be
cached` warning pointed at), while the settings page had the exact same defect
and could throw the same runtime loop.

### Details
- `src/app/(onboarding)/onboarding/page.tsx` (getSnapshot warning): split the
  object selector into `useUserStore((s) => s.displayName)` /
  `s.username` / `s.email` and used those in the three `useState` initialisers.
- `src/app/(dashboard)/settings/page.tsx` (same defect, caught by a repo-wide
  grep): the Settings form defaults and avatar now come from five scalar
  selectors (`userDisplayName`, `userUsername`, `userEmail`, `userBio`,
  `userInitials`); the `useForm` `defaultValues` object is plain render-time
  data (never a selector snapshot, so it is safe).
- Repo-wide sweep confirmed no other store selector builds an object/array
  (`grep` over all `use*Store(` call sites).

### Files
- Edited: src/app/(onboarding)/onboarding/page.tsx,
  src/app/(dashboard)/settings/page.tsx, process.md (this section)

### Verification
| Check | Result |
| --- | --- |
| eslint onboarding + settings pages | 0 errors |
| eslint . (whole project) | 0 errors (only pre-existing warnings) |
| npm run build | compiled, TypeScript passed |

---

## 32. Create Market flow (`/create-market`) (2026-09-09)

**What:** The app let users trade markets but not create them. Added a
front-end-only, API-ready Create Market experience built on the existing design
system, stores, and `marketService.mockRequest` pattern.

**Why:** The spec's P1 differentiation list includes community-created markets
("Create Market intentionally skipped" in row 17) and this task asked for it as a
polished, mock-backed feature - no backend, but shaped so a real API can be
slotted in later without touching the UI.

### Details
- **Route & nav:** new `src/app/(dashboard)/create-market/page.tsx` renders the
  wizard; entry points are a **Create Market** sidebar item (`PlusSquare`),
  a **Create** header button (md+), and a **Create Market** button on the
  `/markets` toolbar. The throwaway single-page `/create` attempt was deleted.
- **Wizard (4 steps):**
  1. **Question** - 160-char question with live counter, Yes/No vs Multiple
     choice card selector (2-5 outcomes, add/remove), category chips, a mock
     **Improve question with AI** button (spinner shimmer, rephrases to a
     "Will … ?" form, toast with the result), and - for binary markets - a
     **Starting probability** control (5-95% slider + number input, live
     YES/NO cent preview); multiple-choice markets open evenly split.
  2. **Details** - 500-char description, optional cover image (file → dataURL,
     validated type + 1.5 MB cap, preview/Replace/Remove, `next/image`), and
     tags (Enter/Add, dedupe, backspace-removes-last, max 8).
  3. **Resolution** - resolution criteria, optional source URL (validated),
     `datetime-local` close + timezone `Select`, and an early-resolution
     toggle that reveals its own criteria input.
  4. **Review & Publish** - live `MarketPreviewCard` (image, category, Community
     badge, ProbabilityBar or outcome chips, tags, formatted close), a
     resolution-plan / publishing-details summary, a confirm `Modal`, and a
     success screen (View Market, Copy Link, Share on X, Create another).
- **Live Market Quality Score:** rendered in a sticky aside on every step; 7
  checks (question/category/description/criteria/source/tags/future close) →
  0-100 with Excellent/Good/Fair/Needs-work labels and a colored ProgressBar.
- **Draft persistence:** auto-saves to `localStorage: omx-market-draft` (600 ms
  debounce) with a "Saved at HH:MM" indicator, an explicit Save draft button,
  and a Discard path. Draft hydrates on revisit; validation guards stale data.
- **Publishing:** builds a `CreateMarketInput` and calls the existing
  `marketService.createMarket` (mock 600 ms) which now supports MULTI markets
  (equal-probability outcomes), a creator-set starting probability (binary:
  YES opens at `p`¢, NO at `100-p`¢), and optional `image/tags/sourceUrl/
  earlyResolution/timezone` fields, returning a persisted `Market`
  (`source: "community"`, `creator: "user-me"`).
- **Community badge:** `market-card.tsx` and the market-detail header show a
  Community pill when `market.source === "community"`, so created markets are
  visibly distinct from seeded ones and still render the chart/detail (chart is
  probability-driven, no mock dependency).
- **Responsive:** 2-col grid (`form 1fr + sticky aside 320px`) collapses to a
  single column on mobile; step labels hide below `sm` (OnboardingProgress shows
  "Step X of 4").

### Files
- New: src/components/create-market/create-market.types.ts, market-quality-score.tsx,
  market-preview-card.tsx, question-step.tsx, details-step.tsx, resolution-step.tsx,
  review-step.tsx, create-market-wizard.tsx, src/app/(dashboard)/create-market/page.tsx
- Edited: src/types/index.ts (Market image/tags/sourceUrl/earlyResolution/timezone),
  src/store/market-store.ts (CreateMarketInput + MULTI/extras),
  src/constants/index.ts + src/components/layout/nav-icons.tsx (nav item),
  src/components/layout/header.tsx (Create button),
  src/app/(dashboard)/markets/markets-browser.tsx (toolbar button),
  src/components/market/market-card.tsx + [marketId]/market-detail-client.tsx (Community badge)
- Deleted: src/app/(dashboard)/create/page.tsx

### Verification
| Check | Result |
| --- | --- |
| eslint on new/changed files | 0 errors, 0 warnings |
| eslint . (whole project) | 0 errors (only 11 pre-existing warnings) |
| npm run build | compiled, TypeScript passed, 28 routes incl. `/create-market` |

---

## 33. Advanced charts: market price chart + order book depth (2026-09-09)

**What:** The market-detail chart was a single Recharts area view tied to `probability`,
and the order book was a text ladder only. Per the user's chosen scope, the price chart
became a production-grade chart and the order book gained a visual depth curve.

**Why:** "Market Chart" is a P0 feature and the trader-facing surface of the app - a
single sparkline made it impossible to see OHLC, volume, or zoom/pan intraday trends,
and the order book gave no sense of market thickness. Both were rebuilt to feel like a
real trading terminal without adding dependencies.

### Details (price chart)
**File:** `src/components/market/market-chart.tsx` (rewritten, export + props unchanged
`MarketPriceChart({ probability })`, consumer `market-detail-client.tsx` untouched)

- **Deterministic OHLCV candles:** seeded LCG (`Math.imul` + count/price seed) pins each
  (probability, range) to a stable series; last close snaps to the market probability.
  Per-range volatility so 1H is calm and 30D/ALL drift more. No new deps - the existing
  Recharts area was replaced with a **custom SVG chart** (canvas-style control, no
  Recharts candle hacks).
- **Candle / Line toggle:** candles draw wick + body (green `--success` up, red
  `--danger` down); line mode draws the close line + gradient fill. Icon toggle keeps the
  header tidy.
- **Volume bars** under the price pane, sized to the visible max volume, colored by
  direction, with compact 4-something tick labels.
- **Crosshair:** hovering the plot shows a dashed vertical line, a dot on the close, and
  a floating HTML tooltip (Open/High/Low/Close in cents + volume), clamped inside the
  clip so it never overflows on mobile.
- **Drag-to-zoom:** pointer-capture drag over the chart selects a window (overlay rect);
  release zooms in. Double-click or the **Reset zoom** button restores full range. The
  zoom window stores **absolute indices into the full candle array** (window-relative
  drag indices are offset by the current view start), so repeated drags zoom deeper in
  the same region instead of jumping to unrelated candles; the window is keyed by `range`
  so changing time range never shows a stale window (also satisfies
  `react-hooks/set-state-in-effect` - no effect-based reset state).
- **Ranges + change pill:** 1H/24H/7D/30D/ALL chips, price shown next to the range's
  signed % change (green/red) so trend direction is readable at a glance; X labels switch
  to date format beyond 24H.
- **Resize-aware:** ResizeObserver remeasures the container so paths/tooltips track real
  pixel coordinates (no `viewBox` stretching).

### Details (depth chart)
**Files:** `src/components/market/order-book-depth.tsx` (new),
`src/components/market/market-activity.tsx` (new **Depth** tab)

- Reuses the exact same `marketService.getOrderBook(marketId, lastPrice)` query key as
  the Order Book tab (shared caching, single source of truth).
- Recharts `ComposedChart` with two **cumulative `Area` series** (per-series `data`
  props): asks ascend from the best ask toward higher prices, bids ascend toward the best
  bid (`[...bids].reverse()`), depths summing shares at each level. Success/​danger
  gradients, monotone smoothing, animation off.
- **Stat tiles** above the chart: Bids depth + best bid, Spread + last price, Asks depth
  + best ask (cents, `formatCompactNumber` for depth).
- `ReferenceLine` at the last price with a cents label, custom depth tooltip (side, price,
  cumulative shares), skeleton and error states mirroring `OrderBook`. Y-axis domain is
  pinned to `[0, maxDepth * 1.05]` so the curves anchor to the baseline instead of being
  auto-trimmed to the shallowest level.

### Verification
| Check | Result |
| --- | --- |
| eslint on new/changed files | 0 errors, 0 warnings |
| eslint . (whole project) | 0 errors (only 11 pre-existing warnings) |
| npm run build | compiled (6.3s), TypeScript passed, 28 routes |

### Notes / follow-up
- Depth data is still the deterministic 7x7 mock ladder (consistent with Order Book);
  a real feed would just swap the query source.
- The custom SVG chart is the only fully-custom chart in the app; the portfolio equity
  curve keeps Recharts (fine for its single-area use case).

---

## 34. Live uploaded profile picture + hidden scrollbars (2026-09-09)

### 34.1 Avatar upload now persists and updates live
**Why:** The Settings "Change Avatar" button read a file, showed a toast, then threw the
file away - the picture was never stored or rendered, so users could not change how they
appear anywhere in the app.

**Changes**
- **Store:** `src/store/user-store.ts` - added `avatarUrl?: string` to `UserProfile`.
  `setProfile` already spreads partial profiles so the value persists to localStorage
  (`omx-user`); `resetProfile` clears it (falls back to initials).
- **Settings:** `src/app/(dashboard)/settings/page.tsx` - the input handler now validates
  (must be an image, under 1.5 MB like the Create Market cover), reads the file via
  `FileReader.readAsDataURL`, persists it through `setProfile({ avatarUrl })`, and shows
  the existing loading state. The profile card Avatar renders `src={avatarUrl}`, and a
  **Remove** button appears when a photo is set (clears back to initials).
- **Live surfaces** (all read the same persisted store, so one upload updates every avatar
  in the same session and after refresh):
  - header profile menu - `src/components/layout/profile-menu.tsx`
  - own trader profile - `src/app/(dashboard)/users/[userId]/trader-profile-client.tsx`
    (`isMe` overlays the store identity: avatar + display name + username + bio)
  - market discussion - `src/components/market/market-discussion.tsx` (compose input and
    the user's own posted comments carry the avatar via `author.avatarUrl`)
  - social compose box - `src/app/(dashboard)/social/page.tsx`

**Note:** The dataURL is stored in localStorage, which caps at ~5 MB - the 1.5 MB image
limit keeps several edits/persisted drafts comfortably within that budget.

### 34.2 Scrollbars hidden app-wide
**Why:** Every scroll container showed a visible scrollbar (the `scrollbar-thin` 6px
thumb and the native page scrollbar). The user asked for scrolling without visible bars.

**Changes:** `src/app/globals.css` - global `* { scrollbar-width: none }` +
`-ms-overflow-style: none` and `*::-webkit-scrollbar { display: none }` in `@layer base`
cover the document and all inner containers; `.scrollbar-thin` was repurposed to hide
(used by sidebar, messages, notifications, chat). Wheel, touch, and keyboard scrolling
all still work.

### Verification
| Check | Result |
| --- | --- |
| eslint on changed files | 0 errors (only the 2 pre-existing social-page `alt` warnings) |
| eslint . (whole project) | 0 errors (only 11 pre-existing warnings) |
| npm run build | compiled, TypeScript passed, 28 routes |

---

## 35. Pre-deployment audit pass (2026-09-09)

**Why:** The user is deploying for evaluation, so before shipping I ran a full audit
against the evaluation criteria - looking for real bugs, quota/perf risks, dead code,
warning debt, and polish issues rather than assuming the last feature pass was enough.

### 35.1 localStorage quota bug (highest-value fix)
**Problem:** A profile avatar was stored as a full-size base64 dataURL (up to 1.5 MB) in
the persisted `omx-user` store. localStorage shares a **single ~5 MB quota per origin**
across every persisted store (`omx-wallet`, `omx-trading`, `omx-messages`, drafts, etc.),
so a user uploading one or two large photos could push the origin over quota - after which
**every** `persist` write (orders, watchlist, theme, even the avatar itself) starts
throwing `QuotaExceededError`. The Create Market draft had the identical risk (cover image
up to 1.5 MB in `omx-market-draft`).
**Fix:** New `src/lib/image.ts` - `fileToDataUrl(file, maxDimension, quality)` loads the
image, downscales to the target size on a canvas (white-composited), and returns a JPEG
dataURL. Avatar uploads use 256px/0.85 (~5-20 KB instead of up to 1.5 MB); market covers
use 800px/0.85. Both call sites (Settings avatar, `details-step.tsx` cover) now share the
helper, so the quota is never close to exceeded and the payload persisted per update is tiny.

### 35.2 Deployment config
- `src/app/layout.tsx`: `metadataBase` is now env-configurable via
  `NEXT_PUBLIC_SITE_URL` (falls back to the placeholder), so OG/sitemap URLs point at the
  real deployed origin.
- Verified `npm run build` + `next start` surface (28 routes; dynamic routes are
  on-demand SSR, static pages pre-rendered) - deploy-ready as-is, no API keys or env secrets
  required since the app is fully mock-backed.

### 35.3 Lint warning debt (11 -> 3)
- `src/components/ui/input.tsx`: removed unused `VariantProps` import.
- `src/services/auth.service.ts` / `wallet.service.ts`: mock params kept for API-shape
  fidelity are now `_`-prefixed.
- `.check-lucide.mjs`: removed dead `createRequire` line.
- `eslint.config.mjs`: added the `^_` args/vars/caught ignore patterns - a standard
  convention, so intentional unused mock params no longer produce warnings.
- `src/app/(dashboard)/social/page.tsx`: aliased the lucide `Image` icon to `ImageIcon` -
  the rule flags any component by that name as a missing-`alt` `<img>`; these are
  decorative buttons already labeled with `aria-label`.
- Remaining 3 warnings are React Compiler notices about `react-hook-form` `watch()` and
  are runtime-correct no-ops (documented in §4).

### 35.4 Verification
| Check | Result |
| --- | --- |
| eslint . (whole project) | 0 errors, 3 warnings (compiler notices only) |
| npm run build | compiled, TypeScript passed, 28 routes |
| Debug/TODO scan | no `console.*`, `debugger`, `TODO`/`FIXME`, `href="#"` in src/ |

---
