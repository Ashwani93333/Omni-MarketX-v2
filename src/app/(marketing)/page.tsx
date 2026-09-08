import {
  ArrowRight,
  Award,
  BadgeCheck,
  BarChart3,
  Bell,
  Bitcoin,
  Bot,
  Clapperboard,
  Clock,
  Copy,
  Cpu,
  FlaskConical,
  Gamepad2,
  Gauge,
  Gift,
  History,
  Landmark,
  LineChart,
  MessageSquareText,
  Newspaper,
  Radar,
  Shield,
  Sparkles,
  Star,
  Trophy,
  Users,
  UsersRound,
  Wallet,
  Zap,
} from "lucide-react";
import Link from "next/link";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { CATEGORIES } from "@/constants";

const categoryMeta: Record<
  string,
  { icon: React.ReactNode; blurb: string }
> = {
  Gaming: { icon: <Gamepad2 className="h-5 w-5" />, blurb: "Esports & release reacts" },
  Crypto: { icon: <Bitcoin className="h-5 w-5" />, blurb: "Tokens & price calls" },
  Politics: { icon: <Landmark className="h-5 w-5" />, blurb: "Elections & policy" },
  Sports: { icon: <Trophy className="h-5 w-5" />, blurb: "Games & showdowns" },
  Economy: { icon: <BarChart3 className="h-5 w-5" />, blurb: "Rates & markets" },
  Entertainment: {
    icon: <Clapperboard className="h-5 w-5" />,
    blurb: "Awards & launches",
  },
  Tech: { icon: <Cpu className="h-5 w-5" />, blurb: "Devices & AI" },
  Science: { icon: <FlaskConical className="h-5 w-5" />, blurb: "Launch & discovery" },
};

const howItWorks = [
  {
    step: "Pick your market",
    text: "Browse hundreds of YES/NO markets across eight categories, from sports to crypto to politics.",
    tag: "8 categories",
  },
  {
    step: "Trade your view",
    text: "Buy YES or NO on what you think will happen. Prices move as the world moves.",
    tag: "50¢–$1 payout",
  },
  {
    step: "Cash out or win",
    text: "Sell early to lock in profit, or hold to your settlement — every winning share pays $1.",
    tag: "24/7 trading",
  },
];

const featureGroups = [
  {
    eyebrow: "Trade & Analyze",
    title: "A full trading toolkit",
    description:
      "The depth, context and tools you need to make every call with confidence.",
    features: [
      {
        icon: <BarChart3 className="h-5 w-5" />,
        title: "Order Book & Recent Trades",
        text: "Live depth ladder — bids and asks, cumulative volume, last price with spread, plus a stream of real-time fills.",
      },
      {
        icon: <Radar className="h-5 w-5" />,
        title: "Market Heatmap",
        text: "A color-coded grid of every market and its probability, so you can spot where the action is at a glance.",
      },
      {
        icon: <Bell className="h-5 w-5" />,
        title: "Price Alerts",
        text: "Set a threshold above or below the current price and get notified the moment the market hits it.",
      },
      {
        icon: <History className="h-5 w-5" />,
        title: "Open Orders & Analytics",
        text: "Manage active orders from your portfolio and review trading analytics — win rate, P&L and volume.",
      },
      {
        icon: <LineChart className="h-5 w-5" />,
        title: "Rich Market Data",
        text: "Volume, trader counts, 24h change and probability curves on every card and market page.",
      },
    ],
  },
  {
    eyebrow: "AI Assistance",
    title: "AI that explains the market",
    description:
      "Every market gets a briefing, a sentiment gauge and an assistant on call.",
    features: [
      {
        icon: <Bot className="h-5 w-5" />,
        title: "AI Market Assistant",
        text: "Ask anything about a market — pricing, risk, catalysts, even the NO side — and get instant, market-aware answers.",
      },
      {
        icon: <Sparkles className="h-5 w-5" />,
        title: "AI Market Summaries",
        text: "One-paragraph briefs capturing the setup, key levels and what would change the market's direction.",
      },
      {
        icon: <Gauge className="h-5 w-5" />,
        title: "Market Sentiment",
        text: "A live bull/bear gauge of the crowd's lean, updated as money moves.",
      },
      {
        icon: <Newspaper className="h-5 w-5" />,
        title: "Market News",
        text: "Impact-tagged headlines and community takes attached to the exact market they affect.",
      },
    ],
  },
  {
    eyebrow: "Social & Community",
    title: "Built for the crowd",
    description:
      "Prediction markets are a team sport — follow, discuss, and learn from the best.",
    features: [
      {
        icon: <Zap className="h-5 w-5" />,
        title: "Personalized Feed",
        text: "For You ranks posts by the traders and markets you follow; Following is your hand-picked shortlist.",
      },
      {
        icon: <MessageSquareText className="h-5 w-5" />,
        title: "Market Discussion",
        text: "A live thread under every market — trade ideas, hot takes and on-chain reactions.",
      },
      {
        icon: <Star className="h-5 w-5" />,
        title: "Follow & Watchlist",
        text: "Follow the traders you learn from and star the markets you care about — both drive your feed.",
      },
      {
        icon: <BadgeCheck className="h-5 w-5" />,
        title: "Trader Profiles & Reputation",
        text: "Every trader has a homepage — reputation score, win rate, edit history and followers.",
      },
      {
        icon: <Copy className="h-5 w-5" />,
        title: "Copy Trading",
        text: "Mirror a top trader's positions from their profile to yours — the best way to learn the ropes (demo).",
      },
    ],
  },
  {
    eyebrow: "Earn & Level Up",
    title: "Rewarded for participation",
    description:
      "Start with free virtual funds and earn your way up the leaderboard.",
    features: [
      {
        icon: <Wallet className="h-5 w-5" />,
        title: "$10,000 Demo Wallet",
        text: "A full trading simulator with virtual USDC — deposits, withdrawals and a portfolio that tracks everything.",
      },
      {
        icon: <Gift className="h-5 w-5" />,
        title: "Referral Rewards",
        text: "Invite friends to unlock milestone bonuses — and double every reward when you upgrade to Pro.",
      },
      {
        icon: <Award className="h-5 w-5" />,
        title: "Achievements",
        text: "Unlock badges for milestones, streaks and style as you trade.",
      },
      {
        icon: <Trophy className="h-5 w-5" />,
        title: "Advanced Leaderboards",
        text: "Weekly and seasonal podiums, run-up momentum and the most-followed traders on the platform.",
      },
      {
        icon: <UsersRound className="h-5 w-5" />,
        title: "Live Activity Feed",
        text: "A rolling timeline of every trade, market move, milestone and alert across the community.",
      },
    ],
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />

      <main>
        <section className="mx-auto max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-light/50 px-3.5 py-1.5 text-xs font-bold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Demo trading · $10,000 virtual funds · all features included
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-text-primary sm:text-6xl">
              The World&rsquo;s Leading Social Prediction Market.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-text-secondary">
              Trade on what you know. Compete. Discuss. Discover. Put your
              intuition to work across sports, crypto, politics and more — with
              AI research, copy trading and a community that talks back.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/onboarding"
                className="inline-flex h-12 items-center gap-2 rounded-[12px] bg-primary px-6 text-base font-semibold text-white shadow-md transition-all hover:bg-primary-hover active:scale-[0.98]"
              >
                Start trading free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/markets"
                className="inline-flex h-12 items-center rounded-[12px] border border-border bg-surface px-6 text-base font-semibold text-text-primary transition-colors hover:bg-background"
              >
                Browse markets
              </Link>
            </div>
            <dl className="mx-auto mt-12 grid max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-[16px] border border-border bg-border sm:grid-cols-4">
              {[
                { value: "8", label: "Categories" },
                { value: "700+", label: "Live markets" },
                { value: "19", label: "Built-in features" },
                { value: "$10K", label: "Demo funds" },
              ].map((stat) => (
                <div key={stat.label} className="bg-surface px-4 py-5">
                  <dd className="number-tight text-2xl font-extrabold text-primary">
                    {stat.value}
                  </dd>
                  <dt className="mt-1 text-xs font-medium text-text-secondary">
                    {stat.label}
                  </dt>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section
          id="features"
          className="border-y border-border bg-surface py-16"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-primary">
                Features
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
                Everything you get, out of the box
              </h2>
              <p className="mt-3 text-base text-text-secondary">
                Not just a ticker. OmniMarketX bundles a full trading toolkit,
                an AI research layer and a social community into one demo.
              </p>
            </div>

            <div className="mt-10 space-y-6">
              {featureGroups.map((group) => (
                <section
                  key={group.eyebrow}
                  className="rounded-[20px] border border-border bg-background p-6 sm:p-8"
                >
                  <div className="flex flex-wrap items-end justify-between gap-2">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-primary">
                        {group.eyebrow}
                      </p>
                      <h3 className="mt-1 text-xl font-bold tracking-tight text-text-primary">
                        {group.title}
                      </h3>
                    </div>
                    <p className="max-w-xs text-sm text-text-secondary">
                      {group.description}
                    </p>
                  </div>
                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {group.features.map((feature) => (
                      <div
                        key={feature.title}
                        className="rounded-[14px] border border-border-light bg-surface p-4 transition-colors hover:border-primary/30"
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-primary-light text-primary">
                          {feature.icon}
                        </span>
                        <p className="mt-3 text-sm font-bold text-text-primary">
                          {feature.title}
                        </p>
                        <p className="mt-1.5 text-[13px] leading-relaxed text-text-secondary">
                          {feature.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              {[
                "Order book",
                "AI assistant",
                "Personalized feed",
                "Copy trading",
                "Referral rewards",
                "Watchlist",
                "Price alerts",
                "Achievements",
                "Market heatmap",
                "Trader reputation",
                "Market news",
                "Advanced leaderboards",
                "Wallet & withdrawals",
                "Notifications",
              ].map((chip) => (
                <span
                  key={chip}
                  className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-text-secondary"
                >
                  <CheckDot />
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section
          id="categories"
          className="mx-auto max-w-6xl px-4 py-16 sm:px-6"
        >
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary">
                Categories
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
                Trade on what you care about
              </h2>
            </div>
            <Link
              href="/markets"
              className="hidden items-center gap-1 text-sm font-semibold text-primary hover:underline sm:flex"
            >
              All markets <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map((category) => {
              const meta = categoryMeta[category];
              return (
                <Link
                  key={category}
                  href={`/markets?category=${encodeURIComponent(category)}`}
                  className="group rounded-[16px] border border-border bg-surface p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-primary-light text-primary">
                    {meta?.icon}
                  </span>
                  <p className="mt-4 text-base font-bold text-text-primary">
                    {category}
                  </p>
                  <p className="mt-1 text-sm text-text-secondary">
                    {meta?.blurb}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        <section
          id="how-it-works"
          className="border-y border-border bg-surface py-16"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="text-center text-xs font-bold uppercase tracking-widest text-primary">
              How it works
            </p>
            <h2 className="mt-2 text-center text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
              Three steps to your first trade
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              {howItWorks.map((item, i) => (
                <div
                  key={item.step}
                  className="rounded-[16px] border border-border bg-background p-6"
                >
                  <div className="flex items-center justify-between">
                    <span className="number-tight flex h-9 w-9 items-center justify-center rounded-full bg-gradient-brand text-base font-extrabold text-white">
                      {i + 1}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-primary-light px-2 py-0.5 text-[11px] font-bold text-primary">
                      <Clock className="h-3 w-3" />
                      {item.tag}
                    </span>
                  </div>
                  <p className="mt-4 text-base font-bold text-text-primary">
                    {item.step}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              Who it&rsquo;s for
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
              Buy the dip, call the winner, prove the doubters wrong
            </h2>
            <p className="mt-3 text-base text-text-secondary">
              From casual fans predicting game nights to serious traders running
              full portfolios — there&rsquo;s a market for every opinion, and a
              board every week to brag to.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              {[
                { icon: <Shield className="h-4 w-4" />, label: "$10,000 free demo" },
                { icon: <Users className="h-4 w-4" />, label: "Community groups" },
                { icon: <Gift className="h-4 w-4" />, label: "Referral rewards" },
              ].map((item) => (
                <span
                  key={item.label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-semibold text-text-primary"
                >
                  <span className="text-primary">{item.icon}</span>
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <div className="relative overflow-hidden rounded-[24px] bg-gradient-brand px-6 py-14 text-center sm:px-12">
            <div className="relative">
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Put your intuition on the line.
              </h2>
              <p className="mx-auto mt-3 max-w-md text-base text-white/85">
                Create a free demo account, get $10,000 in virtual funds, and
                start trading in seconds — with every feature unlocked.
              </p>
              <Link
                href="/onboarding"
                className="mt-7 inline-flex h-12 items-center gap-2 rounded-[12px] bg-white px-6 text-base font-bold text-[#d00287] shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Get started free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}

function CheckDot() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="mr-1.5 h-3.5 w-3.5 text-success"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3.5 8.5l3 3 6-7" />
    </svg>
  );
}