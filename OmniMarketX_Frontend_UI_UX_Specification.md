# OmniMarketX-Style Frontend Development Specification

## End-to-End UI/UX, Design System, Architecture, Components, Pages, Responsive Behavior & Implementation Plan

> **Purpose:** This document is a complete frontend development
> blueprint for building an OmniMarketX-inspired social
> prediction-market web application from scratch.
>
> **Reference:** `https://www.omnimarketx.com/` plus the supplied
> screenshots/reference visuals.
>
> **Important:** Use the reference for layout, interaction patterns,
> hierarchy, spacing, and visual direction. Implement original code,
> original copy, original icons/assets where appropriate, and your own
> backend/data. Do not copy proprietary source code or protected assets.

------------------------------------------------------------------------

# 1. Product Overview

The product is a modern **social prediction-market / social trading
dashboard** where users can:

-   Discover prediction markets.
-   View market probabilities.
-   Trade YES/NO outcomes.
-   Explore trending markets.
-   Track a virtual/demo portfolio.
-   View wallet balance and trade history.
-   Follow social activity.
-   Create posts, polls, and market discussions.
-   Join groups.
-   Compete on leaderboards.
-   View activity and achievements.
-   Manage profile/settings.
-   Invite users and earn rewards.
-   Switch between Demo/Real modes.
-   Use light/dark theme.

The frontend should feel like a polished SaaS dashboard rather than a
traditional finance terminal.

### Primary UX characteristics

-   Clean white application shell.
-   Fixed desktop sidebar.
-   Compact top navigation.
-   Pink primary brand accent.
-   Orange demo-trading warning.
-   Rounded cards.
-   Light gray borders.
-   Dense but readable market information.
-   Strong use of probability and volume metrics.
-   Responsive dashboard behavior.
-   Fast navigation with minimal page reloads.
-   Clear active navigation state.
-   Consistent buttons, chips, cards, tables and empty states.

------------------------------------------------------------------------

# 2. Target Frontend Stack

Recommended implementation:

  Area              Technology
  ----------------- ---------------------------------
  Framework         Next.js
  Language          TypeScript
  Styling           Tailwind CSS
  UI primitives     shadcn/ui
  Icons             Lucide React
  State             Zustand or React Context
  Server state      TanStack Query
  Forms             React Hook Form
  Validation        Zod
  Charts            Recharts
  Animation         Framer Motion
  HTTP              fetch or Axios
  Authentication    HTTP-only cookie/session or JWT
  Notifications     Sonner
  Tables            TanStack Table
  Date handling     date-fns
  Package manager   npm/pnpm
  Deployment        Vercel or equivalent

### Recommended version philosophy

Use current stable versions when implementing. Keep the application
TypeScript-first and avoid unnecessary dependencies.

------------------------------------------------------------------------

# 3. Application Shell

The desktop application should use this structure:

``` text
┌────────────────────────────────────────────────────────────────────┐
│ Header / Search / Mode / Messages / Notifications / Profile       │
├───────────────┬────────────────────────────────────────────────────┤
│               │                                                    │
│   Sidebar     │                  Main Content                      │
│               │                                                    │
│   Home        │                                                    │
│   Wallet      │       Page Header                                 │
│   Markets     │       Filters                                     │
│   Trending    │       Main cards / tables / feeds                 │
│   Activity    │                                                    │
│   Leaderboard │                                                    │
│   Social      │                                                    │
│   Groups      │                                                    │
│   Portfolio   │                                                    │
│   Settings    │                                                    │
│   Invite      │                                                    │
│               │                                                    │
│   Theme       │                                     Right rail     │
│               │                                                    │
└───────────────┴────────────────────────────────────────────────────┘
```

Desktop:

-   Sidebar: approximately 230--260px.
-   Header: approximately 64--72px.
-   Content max-width: approximately 1400--1500px.
-   Main content uses flexible grid.
-   Right rail can be 280--340px.
-   Main cards use 12--24px internal spacing.

Tablet:

-   Sidebar collapses.
-   Right rail moves below main content.
-   Header remains fixed/sticky.
-   Content padding decreases.

Mobile:

-   Sidebar becomes drawer.
-   Bottom navigation may be used for the most important sections.
-   Right rail becomes stacked cards.
-   Market cards become one-column.
-   Tables become cards or horizontally scrollable containers.
-   Filters become horizontally scrollable chips or a filter drawer.

------------------------------------------------------------------------

# 4. Global Design Tokens

Use CSS variables so the entire UI can be adjusted centrally.

``` css
:root {
  --primary: #f51b63;
  --primary-hover: #df1456;
  --primary-light: #ffe8ef;

  --orange: #ff6417;
  --orange-light: #fff1e8;

  --success: #149447;
  --success-light: #e8f6ee;

  --danger: #dc2626;
  --danger-light: #feecec;

  --purple: #7c3aed;
  --blue: #2563eb;

  --text-primary: #101828;
  --text-secondary: #667085;
  --text-muted: #98a2b3;

  --border: #dfe5ee;
  --border-light: #eaecf0;

  --background: #f8fafc;
  --surface: #ffffff;

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;

  --shadow-sm: 0 1px 2px rgba(16, 24, 40, 0.05);
  --shadow-md: 0 4px 12px rgba(16, 24, 40, 0.08);
}
```

Do not hard-code these values repeatedly inside components.

------------------------------------------------------------------------

# 5. Typography

Recommended font:

-   Inter
-   system-ui fallback

Hierarchy:

``` text
Display / Hero:
36–48px / 700

Page title:
28–32px / 700

Section heading:
20–24px / 650–700

Card title:
15–18px / 600–700

Body:
14–16px / 400–500

Secondary:
12–14px / 400–500

Labels:
11–13px / 500–600
```

Use tight typography for financial/market numbers.

Important numerical values should have strong visual contrast.

------------------------------------------------------------------------

# 6. Global Header

## Layout

Left:

-   Search box.
-   Search shortcut `/`.

Right:

-   Real/Demo toggle.
-   Messages.
-   Notifications.
-   User avatar.
-   Username.
-   Dropdown chevron.

### Search

Placeholder:

``` text
Search markets, events, users
```

Behavior:

-   Clicking opens global search.
-   `/` focuses search.
-   Search supports:
    -   Markets
    -   Events
    -   Users
    -   Groups

Search result layout:

``` text
Markets
  ├─ Market result
  ├─ Market result

Users
  ├─ Avatar + username

Groups
  ├─ Group result
```

States:

-   Empty.
-   Loading.
-   Results.
-   No results.
-   Error.

------------------------------------------------------------------------

# 7. Demo Trading Banner

When Demo Mode is active, display a persistent orange information bar.

Example:

``` text
DEMO TRADING MODE — TRADING WITH 10,000 USDC IN VIRTUAL FUNDS, NOT REAL MONEY
                                             Exit Demo
```

Design:

-   Orange text.
-   Very light orange background.
-   Full content width.
-   Compact height.
-   Clear CTA to exit.

The banner should never look like a dangerous error.

------------------------------------------------------------------------

# 8. Sidebar Navigation

## Navigation

``` text
Home
Wallet
Markets
Trending
Activity
Leaderboard
Social
Groups
Portfolio
Settings

Invite & Earn
```

Bottom:

``` text
Theme
```

Optional:

``` text
Help
Documentation
```

### Active state

Active item:

-   Light pink background.
-   Pink icon.
-   Pink text.
-   Medium/semibold font.

Inactive:

-   Gray icon.
-   Dark gray text.
-   Transparent background.

Hover:

-   Slight gray/pink background.

### Sidebar behavior

Desktop:

-   Fixed.
-   Full viewport height.
-   Scrollable if required.

Tablet:

-   Collapsible.

Mobile:

-   Drawer from left.
-   Overlay behind drawer.
-   Close button.

------------------------------------------------------------------------

# 9. Reusable UI Components

Create reusable primitives before implementing pages.

``` text
Button
IconButton
Input
SearchInput
Textarea
Select
Dropdown
Tabs
Badge
Chip
Avatar
Tooltip
Modal
Drawer
Popover
Toast
Card
StatCard
EmptyState
Skeleton
Divider
Pagination
DataTable
ProgressBar
Toggle
Switch
SegmentedControl
Breadcrumb
```

Do not build separate versions of the same component for each page.

------------------------------------------------------------------------

# 10. Market Domain Components

Core reusable components:

``` text
MarketCard
MarketCardCompact
MarketRow
MarketProbability
ProbabilityBar
MarketCategoryChip
MarketActionButtons
MarketOptions
MarketVolume
MarketTraderCount
MarketStatusBadge
MarketDetailHeader
TradePanel
OrderSummary
TradeConfirmation
```

------------------------------------------------------------------------

# 11. Market Card

Market card is one of the most important components.

Structure:

``` text
┌─────────────────────────────────────┐
│ Gaming                    ☆         │
│                                     │
│ Will X happen before Y?             │
│                                     │
│ YES  63%                            │
│ ███████████████░░░                  │
│                                     │
│ Volume        Traders                │
│ $123K         1,284                 │
│                                     │
│ [ YES ]              [ NO ]         │
└─────────────────────────────────────┘
```

Required information:

-   Category.
-   Favorite/star.
-   Question.
-   Probability.
-   Volume.
-   Trader count.
-   YES action.
-   NO action.

Optional:

-   Time remaining.
-   Market status.
-   Featured badge.
-   Multiple outcome options.
-   Price movement.

Hover:

-   Small elevation.
-   Border emphasis.
-   No excessive animation.

------------------------------------------------------------------------

# 12. Multi-Option Markets

For markets with more than two outcomes:

``` text
Question

Option A    42%
Option B    31%
Option C    18%
Option D     9%

[ View Options ]
```

Use:

-   Horizontal/vertical probability bars.
-   Percentage.
-   Optional price.
-   View Options CTA.

------------------------------------------------------------------------

# 13. Markets Page

Route:

``` text
/markets
```

Header:

``` text
Browse
Markets

Explore all prediction markets.
Trade on what you know.
```

Category chips:

``` text
All
Gaming
Crypto
Politics
Sports
Economy
Entertainment
Tech
```

Controls:

``` text
Search
Grid/List
Sort
```

Sort:

``` text
Volume
Newest
Probability
Trending
```

Main layout:

``` text
Page Header
Category Filter
Search / View / Sort

Market Grid
```

Desktop grid:

``` text
3 columns
```

Large desktop:

``` text
3–4 columns depending on available width
```

Mobile:

``` text
1 column
```

------------------------------------------------------------------------

# 14. Home Page

Route:

``` text
/
```

Hero section:

``` text
The World’s Leading
Social Prediction Market.™

Trade on what you know.
Compete. Discuss. Discover.

[ Start Trading ]
```

Hero should visually dominate the top section.

Below:

``` text
Category Filters
```

Then:

``` text
Top Markets
```

Market cards.

Right side:

``` text
Trending Now
```

Trending list:

``` text
1. Market title       63%
2. Market title       48%
3. Market title       72%
```

------------------------------------------------------------------------

# 15. Trending Page

Route:

``` text
/trending
```

Header:

``` text
Trending
```

Main area:

-   Ranked market list.
-   Market probability.
-   Volume.
-   Price movement.
-   Trader activity.

Right rail:

``` text
Live Market Pulse
```

Example:

``` text
LOW VOLATILITY

0 / 100
```

Then:

``` text
Top Volume Movers
```

Each item:

``` text
Market
Volume change
Probability
```

------------------------------------------------------------------------

# 16. Wallet Page

Route:

``` text
/wallet
```

Header:

``` text
Funding Dashboard
Demo Wallet
```

Primary balance card:

``` text
Demo Balance

9,969.94 USDC

[ Reset Demo Account ]
```

The balance card should be visually prominent.

Secondary sections:

``` text
Transaction History
Demo Trade History
```

Table:

  Date    Market     Side     Amount   Price Status
  ------- ---------- ------ -------- ------- --------
  Today   Market A   YES         100    0.63 Filled

Mobile:

Convert rows into cards.

------------------------------------------------------------------------

# 17. Portfolio Page

Route:

``` text
/portfolio
```

Header:

``` text
Demo Portfolio
```

Summary cards:

``` text
Total Value
Total P&L
Open Positions
```

Example:

``` text
Total Value     10,482 USDC
Total P&L       +482 USDC
Open Positions  8
```

Main content:

``` text
Open Positions
```

Position item:

``` text
Market
YES
Shares
Average Price
Current Price
P&L
```

Right rail:

``` text
Recent Demo Trades
```

------------------------------------------------------------------------

# 18. Social Page

Route:

``` text
/social
```

Tabs:

``` text
For You
Following
Top
Latest
```

Story section:

``` text
Your Story
```

Post composer:

``` text
What are you thinking?

[ Market ]
[ Image ]
[ Poll ]

[ Post ]
```

Social post:

``` text
Avatar
Username
Time

Post content

Optional market attachment

❤️ Like
💬 Comment
↗ Share
```

Interactions should have hover/pressed states.

Right rail:

``` text
Trending Now
```

------------------------------------------------------------------------

# 19. Groups Page

Route:

``` text
/groups
```

Tabs:

``` text
Discover
My Groups
Popular
```

Featured groups section:

``` text
Featured Groups
```

Group card:

``` text
Group Avatar
Group Name
Description
Members

[ Join ]
```

Filters:

``` text
All
Crypto
Sports
Politics
Gaming
Technology
```

Right rail:

``` text
My Groups
Top Groups
Active Discussions
```

------------------------------------------------------------------------

# 20. Leaderboard

Route:

``` text
/leaderboard
```

Tabs:

``` text
Daily
Weekly
Monthly
All Time
```

Filters:

``` text
Highest ROI
Highest Profit
Most Trades
Most Active
```

Leaderboard row:

``` text
Rank
Avatar
Username
ROI
Profit
Trades
```

Top three can receive enhanced visual treatment.

Rewards card:

``` text
Monthly Rewards

Compete for rewards and recognition.
```

Side sections:

``` text
Fastest Rising
Trending Traders
```

------------------------------------------------------------------------

# 21. Activity Page

Route:

``` text
/activity
```

Tabs:

``` text
All
Trades
Markets
Social
Alerts
Achievements
```

Stats:

``` text
Live Trades
Volume Moved
Markets Moved
Active Traders
```

Recent activity feed:

``` text
Avatar
User
Action
Market
Time
```

Example:

``` text
Alex traded YES on Market A
2m ago
```

Right rail:

``` text
Live Market Pulse
Trending Markets
```

------------------------------------------------------------------------

# 22. Settings Page

Route:

``` text
/settings
```

Profile section:

``` text
Profile Information

Profile Picture
Display Name
Username
Email

[ Save Changes ]
```

Profile image:

-   Circular.
-   Upload button.
-   Replace image.
-   Remove image if supported.

Account overview:

``` text
Account Overview
Member since
Email status
Account status
```

Help card:

``` text
Need Help?
Contact support
Documentation
```

------------------------------------------------------------------------

# 23. Invite & Earn

Route:

``` text
/invite
```

Main heading:

``` text
Invite Friends.
Earn Rewards.
```

Invite link card:

``` text
Your invite link

https://example.com/invite/xxxxx

[ Copy ]
```

Social sharing:

``` text
Share
WhatsApp
X
LinkedIn
```

Referral stats:

``` text
Invites Sent
Joined
Trading
Rewards Earned
```

How it works:

``` text
1. They Sign Up
2. They Trade
3. You Earn
```

Pro CTA:

``` text
Upgrade to Pro
```

------------------------------------------------------------------------

# 24. Authentication Pages

Required routes:

``` text
/login
/register
/forgot-password
/reset-password
```

Login:

``` text
Logo
Welcome back

Email
Password

[ Sign In ]

Forgot password?

Don't have an account?
Create account
```

Register:

``` text
Display name
Username
Email
Password
Confirm password

[ Create Account ]
```

UX requirements:

-   Inline validation.
-   Password visibility toggle.
-   Loading state.
-   API error state.
-   Success state.
-   Disabled submit while request is running.

------------------------------------------------------------------------

# 25. Market Detail Page

Route:

``` text
/markets/[marketId]
```

Desktop:

``` text
┌──────────────────────────────────────────┬───────────────────┐
│ Market information                       │ Trade panel       │
│                                          │                   │
│ Question                                 │ YES / NO          │
│ Probability                              │ Amount            │
│ Chart                                    │ Estimated return  │
│ Description                              │                   │
│ Activity                                 │ [ Trade ]         │
└──────────────────────────────────────────┴───────────────────┘
```

Include:

-   Market title.
-   Category.
-   Status.
-   Probability.
-   Volume.
-   Traders.
-   Price chart.
-   Description.
-   Resolution criteria.
-   Related markets.
-   Comments/social discussion.
-   Trade panel.

------------------------------------------------------------------------

# 26. Trading Panel UX

Panel:

``` text
Trade

[ YES ] [ NO ]

Amount

$ 100

Potential Return
$ 158.73

Estimated Profit
$ 58.73

[ Place Trade ]
```

States:

1.  Default.
2.  Invalid amount.
3.  Insufficient balance.
4.  Confirming.
5.  Processing.
6.  Success.
7.  Failure.

Success:

``` text
Trade placed successfully
```

Never hide financial confirmation information.

------------------------------------------------------------------------

# 27. Charts

Use Recharts.

Market chart:

-   Time series.
-   Probability/price.
-   Tooltip.
-   Time ranges.

Controls:

``` text
1H
24H
7D
30D
ALL
```

Chart states:

-   Loading skeleton.
-   Empty.
-   Error.
-   Loaded.
-   No data.

------------------------------------------------------------------------

# 28. Responsive Design

Breakpoints:

``` text
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

## Desktop \>= 1280

-   Sidebar visible.
-   Header full.
-   Main + right rail.
-   Market grid 3--4 columns.

## Tablet 768--1279

-   Collapsed sidebar.
-   Right rail reduced or moved below.
-   Market grid 2 columns.

## Mobile \< 768

-   Sidebar drawer.
-   One-column content.
-   Compact header.
-   Horizontal chips.
-   Stacked cards.
-   Trade panel becomes bottom sheet/modal.
-   Tables become cards.

------------------------------------------------------------------------

# 29. Mobile Navigation

Recommended:

``` text
Home
Markets
Trending
Portfolio
Menu
```

Menu opens:

``` text
Wallet
Activity
Leaderboard
Social
Groups
Settings
Invite
```

Use safe-area spacing on modern mobile devices.

------------------------------------------------------------------------

# 30. Dark Mode

Dark theme should not simply invert colors.

Suggested:

``` css
.dark {
  --background: #0b0f14;
  --surface: #111827;
  --text-primary: #f9fafb;
  --text-secondary: #98a2b3;
  --border: #273244;
}
```

Maintain:

-   readable contrast.
-   recognizable success/danger states.
-   accessible focus rings.
-   same component hierarchy.

------------------------------------------------------------------------

# 31. Theme Selector

Sidebar theme selector:

``` text
Light
Dark
System
```

Persist choice in localStorage or user profile.

Prevent flash of incorrect theme during initial render.

------------------------------------------------------------------------

# 32. Loading States

Every async component needs a loading state.

Examples:

``` text
MarketCardSkeleton
TableSkeleton
ProfileSkeleton
StatsSkeleton
FeedSkeleton
```

Skeleton design:

-   Match final component dimensions.
-   Use subtle animation.
-   Never cause large layout shifts.

------------------------------------------------------------------------

# 33. Empty States

Examples:

``` text
No markets found

Try another search or category.
[ Clear Filters ]
```

Portfolio:

``` text
No open positions

Start trading to see your positions here.
[ Explore Markets ]
```

Social:

``` text
Nothing here yet

Follow traders and communities to personalize your feed.
```

------------------------------------------------------------------------

# 34. Error States

API error:

``` text
Something went wrong.

We couldn't load this information.

[ Try Again ]
```

Do not show raw backend stack traces.

------------------------------------------------------------------------

# 35. Toast Notifications

Use toasts for:

-   Trade success.
-   Trade failure.
-   Profile saved.
-   Link copied.
-   Invite sent.
-   Group joined.
-   Post published.
-   Settings updated.

Examples:

``` text
Profile updated successfully.
```

``` text
Invite link copied.
```

------------------------------------------------------------------------

# 36. Modal / Drawer Rules

Use modal for:

-   Confirm trade.
-   Delete/irreversible action.
-   Account reset.

Use drawer for:

-   Mobile filters.
-   Mobile navigation.
-   Trade panel on small screens.

Do not use modal for normal navigation.

------------------------------------------------------------------------

# 37. Accessibility

Minimum requirements:

-   WCAG AA target.
-   Keyboard navigation.
-   Visible focus states.
-   Semantic HTML.
-   Labels for all inputs.
-   Accessible buttons.
-   `aria-label` for icon-only buttons.
-   Sufficient color contrast.
-   Do not rely on color alone.
-   Screen-reader-friendly status updates.
-   Escape closes dialogs.
-   Focus trapping inside modal.
-   Restore focus after modal closes.

------------------------------------------------------------------------

# 38. Interaction Design

Buttons:

### Primary

Pink background + white text.

### Secondary

White background + border.

### Destructive

Red.

### Success

Green.

### Ghost

Transparent with subtle hover.

All interactive elements should have:

``` text
Default
Hover
Active
Focus
Disabled
Loading
```

------------------------------------------------------------------------

# 39. Animation Guidelines

Use Framer Motion sparingly.

Recommended:

-   Page fade/slide: 150--250ms.
-   Modal: 180--250ms.
-   Sidebar drawer: 200--300ms.
-   Card hover: 120--180ms.
-   Toast: 200ms.

Avoid:

-   Excessive bouncing.
-   Long transitions.
-   Animating every card on page load.

Respect:

``` css
@media (prefers-reduced-motion: reduce) {
  /* Disable non-essential animation */
}
```

------------------------------------------------------------------------

# 40. Folder Architecture

Recommended Next.js App Router structure:

``` text
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   │
│   ├── (dashboard)/
│   │   ├── page.tsx
│   │   ├── wallet/
│   │   ├── markets/
│   │   ├── trending/
│   │   ├── activity/
│   │   ├── leaderboard/
│   │   ├── social/
│   │   ├── groups/
│   │   ├── portfolio/
│   │   ├── settings/
│   │   └── invite/
│   │
│   ├── markets/
│   │   └── [marketId]/
│   │
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── MobileNav.tsx
│   │   └── DemoBanner.tsx
│   │
│   ├── market/
│   │   ├── MarketCard.tsx
│   │   ├── MarketRow.tsx
│   │   ├── MarketChart.tsx
│   │   ├── TradePanel.tsx
│   │   └── ProbabilityBar.tsx
│   │
│   ├── social/
│   ├── wallet/
│   ├── portfolio/
│   ├── groups/
│   ├── leaderboard/
│   └── ui/
│
├── hooks/
├── lib/
├── services/
├── store/
├── types/
├── constants/
└── mocks/
```

------------------------------------------------------------------------

# 41. Route Map

``` text
/
├── /login
├── /register
├── /forgot-password
├── /markets
├── /markets/[id]
├── /wallet
├── /trending
├── /activity
├── /leaderboard
├── /social
├── /groups
├── /portfolio
├── /settings
└── /invite
```

------------------------------------------------------------------------

# 42. Data Types

Example TypeScript models:

``` ts
export interface Market {
  id: string;
  title: string;
  category: MarketCategory;
  probability: number;
  volume: number;
  traderCount: number;
  status: "OPEN" | "CLOSED" | "RESOLVED";
  outcomes?: MarketOutcome[];
  createdAt: string;
  closesAt?: string;
}

export interface MarketOutcome {
  id: string;
  label: string;
  probability: number;
  price: number;
}

export interface Position {
  id: string;
  marketId: string;
  marketTitle: string;
  side: "YES" | "NO";
  shares: number;
  averagePrice: number;
  currentPrice: number;
  pnl: number;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  category: string;
  avatarUrl?: string;
}
```

------------------------------------------------------------------------

# 43. Mock Data

Before backend integration, create realistic mock data.

Example:

``` ts
export const markets: Market[] = [
  {
    id: "market-001",
    title: "Will a major gaming release launch this quarter?",
    category: "Gaming",
    probability: 63,
    volume: 124500,
    traderCount: 1284,
    status: "OPEN",
    createdAt: "2026-09-01T10:00:00Z",
  },
];
```

Do not use empty placeholder data during visual development.

Use realistic:

-   titles.
-   percentages.
-   volumes.
-   usernames.
-   dates.
-   trader counts.

------------------------------------------------------------------------

# 44. API Layer

Create a service abstraction:

``` text
services/
├── auth.service.ts
├── market.service.ts
├── wallet.service.ts
├── portfolio.service.ts
├── social.service.ts
├── group.service.ts
├── leaderboard.service.ts
└── user.service.ts
```

Example:

``` ts
marketService.getMarkets()
marketService.getMarket(id)
marketService.getTrendingMarkets()
marketService.searchMarkets(query)
```

The components should not directly contain API URLs.

------------------------------------------------------------------------

# 45. Environment Variables

Example:

``` env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_APP_NAME=YourApp
```

Never expose:

-   database passwords.
-   private API keys.
-   JWT signing secrets.
-   payment provider secret keys.

------------------------------------------------------------------------

# 46. Authentication Architecture

Recommended:

``` text
Browser
   ↓
Next.js
   ↓
Secure session / HTTP-only cookie
   ↓
Backend API
```

Prefer secure HTTP-only cookies for production authentication.

If JWT is used:

-   short-lived access token.
-   refresh token rotation.
-   secure storage strategy.
-   server-side validation.

Avoid storing sensitive long-lived tokens in localStorage when a secure
cookie/session architecture is possible.

------------------------------------------------------------------------

# 47. State Management

Separate state into:

### Server state

Use TanStack Query:

-   markets.
-   user profile.
-   portfolio.
-   activity.
-   groups.
-   leaderboard.

### UI state

Use Zustand/Context:

-   sidebar open.
-   theme.
-   selected market.
-   filters.
-   demo mode.
-   modal state.

Do not put all API data into one global store.

------------------------------------------------------------------------

# 48. Market Filters

URL-sync filters when possible:

``` text
/markets?category=crypto&sort=volume&view=grid
```

Benefits:

-   Shareable.
-   Browser back/forward works.
-   Refresh-safe.
-   Better UX.

------------------------------------------------------------------------

# 49. Search UX

Debounce search:

``` text
300–400ms
```

Show recent searches.

Keyboard:

``` text
/
```

opens/focuses search.

Escape:

``` text
Close search overlay
```

Enter:

``` text
Open search results
```

------------------------------------------------------------------------

# 50. Performance

Use:

-   Next.js server components where appropriate.
-   Dynamic imports for heavy charts.
-   Image optimization.
-   Lazy loading.
-   Virtualization for very long activity feeds.
-   Query caching.
-   Pagination/infinite scrolling.

Avoid:

-   Huge client components.
-   Re-rendering the entire dashboard when one filter changes.
-   Loading every market at once.

------------------------------------------------------------------------

# 51. SEO

Public pages should have:

-   Metadata.
-   Open Graph.
-   Twitter/X card.
-   Canonical URL.
-   Semantic headings.

Private dashboard pages should not need public SEO.

------------------------------------------------------------------------

# 52. PWA / Mobile Consideration

Optional:

-   Installable PWA.
-   Offline shell.
-   Push notifications.

Do not attempt offline trading.

Trading actions require a verified online connection.

------------------------------------------------------------------------

# 53. Security UX

Frontend should handle:

-   Session expiration.
-   Unauthorized responses.
-   Forbidden responses.
-   CSRF protection where applicable.
-   Rate-limit responses.
-   Duplicate trade submission prevention.

Disable trade button while transaction is processing.

------------------------------------------------------------------------

# 54. Financial UX Rules

Always clearly display:

-   balance.
-   trade amount.
-   estimated outcome.
-   fees if applicable.
-   potential profit/loss.
-   selected side.
-   confirmation state.

Never make users guess whether an order succeeded.

------------------------------------------------------------------------

# 55. Design System Components Checklist

Build these first:

``` text
Button
Input
SearchInput
Select
Tabs
Badge
Avatar
Card
StatCard
Chip
Tooltip
Modal
Drawer
Toast
Skeleton
EmptyState
ErrorState
DataTable
ProgressBar
```

Then domain components:

``` text
MarketCard
MarketRow
MarketChart
TradePanel
PositionCard
ActivityItem
PostCard
GroupCard
LeaderboardRow
WalletCard
```

------------------------------------------------------------------------

# 56. Exact UI Construction Order

Recommended implementation sequence:

## Phase 1 --- Foundation

1.  Create Next.js app.
2.  Configure TypeScript.
3.  Configure Tailwind.
4.  Install shadcn/ui.
5.  Configure fonts.
6.  Add design tokens.
7.  Configure dark mode.
8.  Add global CSS.

## Phase 2 --- Shell

9.  Build AppShell.
10. Build Sidebar.
11. Build Header.
12. Build DemoBanner.
13. Build responsive mobile drawer.
14. Add routing.

## Phase 3 --- UI primitives

15. Button.
16. Input.
17. Card.
18. Tabs.
19. Badge.
20. Modal.
21. Toast.
22. Skeleton.

## Phase 4 --- Market components

23. MarketCard.
24. MarketRow.
25. ProbabilityBar.
26. MarketChart.
27. TradePanel.

## Phase 5 --- Pages

28. Home.
29. Markets.
30. Market detail.
31. Trending.
32. Wallet.
33. Portfolio.
34. Activity.
35. Leaderboard.
36. Social.
37. Groups.
38. Settings.
39. Invite.

## Phase 6 --- Responsive

40. Desktop.
41. Tablet.
42. Mobile.
43. Mobile navigation.
44. Mobile trade drawer.

## Phase 7 --- Data

45. Mock API.
46. TanStack Query.
47. Real backend integration.
48. Authentication.
49. Error handling.

## Phase 8 --- Polish

50. Loading states.
51. Empty states.
52. Animations.
53. Accessibility.
54. SEO.
55. Performance.
56. Final visual QA.

------------------------------------------------------------------------

# 57. Visual QA Process

For every page:

1.  Compare desktop layout.
2.  Compare tablet layout.
3.  Compare mobile layout.
4.  Check spacing.
5.  Check typography.
6.  Check card dimensions.
7.  Check icon alignment.
8.  Check button dimensions.
9.  Check borders.
10. Check shadows.
11. Check active states.
12. Check hover states.
13. Check empty states.
14. Check loading states.
15. Check error states.

Use screenshot comparison during development.

------------------------------------------------------------------------

# 58. Pixel-Accuracy Rules

To get close to the supplied reference:

### Layout

Measure:

-   Sidebar width.
-   Header height.
-   Content max-width.
-   Card gap.
-   Grid columns.
-   Page padding.

### Typography

Measure:

-   Font size.
-   Weight.
-   Line height.
-   Letter spacing.

### Components

Measure:

-   Button height.
-   Border radius.
-   Icon size.
-   Card padding.
-   Badge height.

### Colors

Use centralized variables and tune them after visual comparison.

### Do not

-   Randomly add gradients.
-   Add excessive shadows.
-   Add excessive animations.
-   Change navigation hierarchy.
-   Mix multiple design systems.

------------------------------------------------------------------------

# 59. Suggested Spacing Scale

Use an 8px-based scale:

``` text
4px
8px
12px
16px
20px
24px
32px
40px
48px
64px
80px
```

Common:

``` text
Card padding: 16–24px
Grid gap: 16–24px
Section gap: 24–40px
Page padding: 24–32px
```

------------------------------------------------------------------------

# 60. Border and Radius Rules

Default:

``` text
Card: 12–16px
Button: 8–10px
Input: 8–10px
Pill: 999px
Modal: 16–20px
```

Borders should generally be:

``` text
1px solid #DFE5EE
```

Keep the interface light and professional.

------------------------------------------------------------------------

# 61. Iconography

Use Lucide icons consistently.

Examples:

``` text
Home
Wallet
Chart
TrendingUp
Activity
Trophy
Users
UsersRound
Briefcase
Settings
Gift
Search
Bell
MessageCircle
Star
ChevronDown
MoreHorizontal
```

Rules:

-   Default: 18--20px.
-   Sidebar: 18px.
-   Header: 20px.
-   Avoid mixing icon libraries.

------------------------------------------------------------------------

# 62. Right Rail Rules

Right rail is secondary information.

Priority:

1.  Trending.
2.  Market pulse.
3.  Movers.
4.  Recent trades.
5.  Active discussions.

On mobile, right rail becomes:

``` text
Main content
↓
Secondary cards
```

Never let the right rail dominate the primary task.

------------------------------------------------------------------------

# 63. Social Feed Architecture

Components:

``` text
SocialTabs
StoryRow
CreatePost
PostCard
PostActions
CommentList
CommentComposer
PollCard
MarketAttachment
```

Post interactions should be optimistic when safe.

------------------------------------------------------------------------

# 64. Group Architecture

Components:

``` text
GroupTabs
GroupFilter
FeaturedGroupCard
GroupCard
MemberList
DiscussionList
JoinButton
```

Group membership states:

``` text
Join
Joined
Request Sent
Private
```

------------------------------------------------------------------------

# 65. Leaderboard Architecture

Components:

``` text
LeaderboardTabs
LeaderboardFilters
TopTraderCard
LeaderboardRow
RewardsCard
RisingTraderList
```

Ranking changes can have subtle animation.

Do not overanimate large tables.

------------------------------------------------------------------------

# 66. Wallet Architecture

Components:

``` text
BalanceCard
ResetDemoButton
TransactionTable
TransactionRow
WalletStats
```

Reset demo flow:

``` text
Click Reset
      ↓
Confirmation Modal
      ↓
Resetting
      ↓
Success
```

Never reset immediately without confirmation.

------------------------------------------------------------------------

# 67. Portfolio Architecture

Components:

``` text
PortfolioSummary
PnlCard
PositionsTable
PositionCard
RecentTrades
```

P&L formatting:

``` text
+ $124.50
- $42.10
```

Use semantic positive/negative styling.

------------------------------------------------------------------------

# 68. Activity Architecture

Components:

``` text
ActivityTabs
ActivityStats
ActivityFeed
ActivityItem
MarketPulse
TrendingMarkets
```

Support infinite scrolling if the backend supports cursor pagination.

------------------------------------------------------------------------

# 69. Notifications

Notification center:

``` text
All
Unread
```

Notification types:

``` text
Trade executed
Market resolved
Someone followed you
Comment
Mention
Group invite
Reward
System
```

Unread indicator:

-   small dot.
-   do not use huge red badges.

------------------------------------------------------------------------

# 70. Profile Menu

Clicking avatar opens:

``` text
Profile
Portfolio
Settings

Theme

Help

Log out
```

If demo mode:

``` text
Demo Mode
Exit Demo
```

------------------------------------------------------------------------

# 71. Demo Mode

Demo mode should be treated as a first-class application state.

State:

``` ts
type TradingMode = "DEMO" | "REAL";
```

The entire UI should know the current mode.

Demo:

``` text
Demo Wallet
Virtual USDC
Demo Trade History
```

Real:

``` text
Real Wallet
Real funds
Real trade history
```

Use clear visual separation.

------------------------------------------------------------------------

# 72. Feature Flags

Optional:

``` ts
FEATURE_SOCIAL
FEATURE_GROUPS
FEATURE_INVITE
FEATURE_REAL_TRADING
FEATURE_DARK_MODE
```

Useful during development.

------------------------------------------------------------------------

# 73. Testing Strategy

## Unit

Test:

-   Probability formatting.
-   Currency formatting.
-   P&L calculations.
-   Filter logic.
-   Validation.

## Component

Test:

-   MarketCard.
-   TradePanel.
-   Header.
-   Sidebar.
-   WalletCard.

## Integration

Test:

-   Login.
-   Market search.
-   Place demo trade.
-   Portfolio update.
-   Create post.

## E2E

Use Playwright.

Critical flow:

``` text
Login
→ Markets
→ Open market
→ Select YES
→ Enter amount
→ Confirm
→ Portfolio
→ Verify position
```

------------------------------------------------------------------------

# 74. Form Validation

Use Zod.

Example:

``` ts
const tradeSchema = z.object({
  amount: z
    .number()
    .positive("Amount must be greater than zero"),
});
```

Show validation close to the input.

------------------------------------------------------------------------

# 75. Currency / Number Formatting

Centralize formatting:

``` ts
formatCurrency()
formatCompactNumber()
formatPercentage()
formatDate()
formatRelativeTime()
```

Examples:

``` text
$12,450
$12.4K
63%
2m ago
```

Do not implement formatting independently in every component.

------------------------------------------------------------------------

# 76. Internationalization

If future global support is expected, avoid hardcoding:

-   currencies.
-   date formats.
-   number formats.
-   language strings.

Prepare a translation layer even if the first release is English-only.

------------------------------------------------------------------------

# 77. Browser Support

Target current versions of:

-   Chrome.
-   Edge.
-   Firefox.
-   Safari.

Test:

-   Desktop.
-   iPad/tablet.
-   Android.
-   iPhone.

------------------------------------------------------------------------

# 78. Final Page Acceptance Checklist

## Home

-   [ ] Hero matches visual hierarchy.
-   [ ] CTA works.
-   [ ] Categories work.
-   [ ] Market cards work.
-   [ ] Trending rail works.

## Markets

-   [ ] Search works.
-   [ ] Categories work.
-   [ ] Sorting works.
-   [ ] Grid/list works.
-   [ ] Cards are responsive.

## Trending

-   [ ] Rankings.
-   [ ] Pulse.
-   [ ] Volume movers.

## Wallet

-   [ ] Balance.
-   [ ] Reset.
-   [ ] History.
-   [ ] Responsive table.

## Portfolio

-   [ ] Total value.
-   [ ] P&L.
-   [ ] Positions.
-   [ ] Recent trades.

## Social

-   [ ] Feed tabs.
-   [ ] Composer.
-   [ ] Posts.
-   [ ] Reactions.
-   [ ] Comments.

## Groups

-   [ ] Discovery.
-   [ ] Filters.
-   [ ] Join states.
-   [ ] Group details.

## Leaderboard

-   [ ] Period tabs.
-   [ ] Ranking.
-   [ ] Filters.
-   [ ] Rewards.

## Activity

-   [ ] Tabs.
-   [ ] Stats.
-   [ ] Feed.
-   [ ] Trending.

## Settings

-   [ ] Profile.
-   [ ] Avatar.
-   [ ] Save.
-   [ ] Account information.

## Invite

-   [ ] Link.
-   [ ] Copy.
-   [ ] Share.
-   [ ] Referral stats.

------------------------------------------------------------------------

# 79. AI Coding Prompt

Use the following prompt in Cursor, Claude Code, ChatGPT coding mode, or
another coding assistant:

``` text
Build a production-quality social prediction-market dashboard using Next.js, TypeScript, Tailwind CSS, shadcn/ui and Lucide React.

Use the supplied OmniMarketX screenshots and this specification as visual/UX references.

IMPORTANT:
- Build the application from scratch.
- Do not copy proprietary source code.
- Do not scrape or reproduce protected assets.
- Create original mock data, icons and copy where needed.
- Match the visual hierarchy, spacing, density, colors and interaction patterns as closely as reasonably possible.

APPLICATION SHELL:
- Fixed desktop sidebar.
- Top header.
- Main content area.
- Optional right rail.
- Responsive mobile drawer.
- Demo trading banner.

PRIMARY NAVIGATION:
Home
Wallet
Markets
Trending
Activity
Leaderboard
Social
Groups
Portfolio
Settings
Invite & Earn
Theme

DESIGN:
- White/light SaaS dashboard.
- Pink primary accent around #F51B63.
- Orange demo state around #FF6417.
- Dark navy/gray primary text.
- Muted gray secondary text.
- Light gray borders.
- Rounded cards.
- Inter/system font.
- Subtle shadows.
- Minimal animation.

PAGES:
/
 /wallet
 /markets
 /markets/[id]
 /trending
 /activity
 /leaderboard
 /social
 /groups
 /portfolio
 /settings
 /invite

AUTH:
 /login
 /register
 /forgot-password

BUILD REUSABLE COMPONENTS:
- AppShell
- Sidebar
- Header
- DemoBanner
- MarketCard
- MarketRow
- ProbabilityBar
- MarketChart
- TradePanel
- StatCard
- PostCard
- GroupCard
- LeaderboardRow
- ActivityItem
- WalletCard
- PositionCard
- EmptyState
- ErrorState
- Skeleton
- Modal
- Drawer
- Tabs
- SearchInput

IMPLEMENT:
- Responsive desktop/tablet/mobile layouts.
- Loading states.
- Empty states.
- Error states.
- Hover/focus/active/disabled states.
- Accessible keyboard navigation.
- Dark mode.
- URL-synced market filters.
- Search.
- Sorting.
- Demo trading state.
- Mock API/service layer.
- TypeScript domain models.
- TanStack Query for server state.
- Zustand or Context for UI state.
- React Hook Form + Zod for forms.
- Recharts for market charts.
- Framer Motion for subtle transitions.

FIRST BUILD THE DESIGN SYSTEM AND APP SHELL.
THEN IMPLEMENT MARKET COMPONENTS.
THEN BUILD EACH PAGE.
THEN ADD MOCK DATA.
THEN ADD RESPONSIVENESS.
THEN ADD POLISH AND ACCESSIBILITY.

Do not create each page as an isolated design. All pages must share the same design system and layout components.
```

------------------------------------------------------------------------

# 80. Recommended Development Milestones

### Milestone 1

``` text
App shell
Sidebar
Header
Theme
Demo banner
Responsive navigation
```

### Milestone 2

``` text
Home
Markets
Market cards
Filters
Search
```

### Milestone 3

``` text
Market detail
Chart
Trade panel
Demo trade flow
```

### Milestone 4

``` text
Wallet
Portfolio
Activity
```

### Milestone 5

``` text
Social
Groups
Leaderboard
```

### Milestone 6

``` text
Settings
Invite
Notifications
Profile
```

### Milestone 7

``` text
Authentication
Backend integration
Real API state
```

### Milestone 8

``` text
Responsive QA
Accessibility
Performance
Security
Deployment
```

------------------------------------------------------------------------

# 81. Definition of Done

The frontend is considered complete when:

-   All routes work.
-   Navigation works.
-   No page contains duplicated layout code unnecessarily.
-   Desktop matches the reference visual direction.
-   Mobile is intentionally designed rather than simply scaled down.
-   All major components have loading/error/empty states.
-   Demo trading flow works.
-   Market filtering/search/sorting works.
-   Portfolio updates after demo trade.
-   Wallet history updates.
-   Social feed works with mock data.
-   Groups work.
-   Leaderboard works.
-   Settings save flow works.
-   Invite copy/share works.
-   Dark mode works.
-   Keyboard navigation works.
-   No major console errors.
-   No broken links.
-   No layout overflow at common screen sizes.
-   Lighthouse/performance issues are addressed.
-   Sensitive secrets are not exposed in client code.

------------------------------------------------------------------------

# 82. Final Visual Direction

The target aesthetic should be:

``` text
Modern
Clean
Financial
Social
Data-rich
Friendly
Professional
Minimal
Responsive
Fast
```

The visual hierarchy should always prioritize:

``` text
1. What is happening?
2. What can I trade/do?
3. What is the probability/value?
4. What is trending?
5. What are other users doing?
6. What is my portfolio/status?
```

The interface should feel like a combination of:

``` text
Prediction Market
+
Social Network
+
Modern Fintech Dashboard
```

rather than a conventional banking application.

------------------------------------------------------------------------

# 83. Reference-Driven Implementation Workflow

When implementing against the screenshots:

``` text
Reference screenshot
       ↓
Identify page structure
       ↓
Measure visual hierarchy
       ↓
Map repeated components
       ↓
Create design tokens
       ↓
Build reusable components
       ↓
Build page
       ↓
Populate realistic data
       ↓
Responsive adaptation
       ↓
Screenshot comparison
       ↓
Adjust spacing/colors/typography
       ↓
Final QA
```

Do not start by building every page independently.

Start with the shared shell and reusable components. This is the most
important step for achieving consistent UI/UX.

------------------------------------------------------------------------

# 84. Quick Build Checklist

``` text
[ ] Next.js configured
[ ] TypeScript configured
[ ] Tailwind configured
[ ] shadcn/ui configured
[ ] Lucide installed
[ ] Font configured
[ ] Design tokens created
[ ] AppShell
[ ] Sidebar
[ ] Header
[ ] DemoBanner
[ ] Mobile drawer
[ ] MarketCard
[ ] MarketRow
[ ] ProbabilityBar
[ ] TradePanel
[ ] MarketChart
[ ] Home
[ ] Markets
[ ] Market detail
[ ] Trending
[ ] Wallet
[ ] Portfolio
[ ] Activity
[ ] Leaderboard
[ ] Social
[ ] Groups
[ ] Settings
[ ] Invite
[ ] Authentication
[ ] Mock services
[ ] API layer
[ ] Loading states
[ ] Error states
[ ] Empty states
[ ] Dark mode
[ ] Accessibility
[ ] Responsive QA
[ ] E2E tests
[ ] Production build
[ ] Deployment
```

------------------------------------------------------------------------

# 85. Important Implementation Note

This document is intentionally more detailed than a simple visual
prompt. Treat it as the **frontend product specification** for the
project.

The screenshots/reference site should be used to tune:

-   exact spacing,
-   card dimensions,
-   typography,
-   icon positioning,
-   responsive behavior,
-   visual density,
-   hover states,
-   component proportions,
-   color shades,
-   page-specific composition.

The implementation should remain an original codebase with its own
components, data, assets and branding.
