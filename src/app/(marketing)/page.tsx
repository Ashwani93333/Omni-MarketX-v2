import {
  ArrowRight,
  BarChart3,
  Bitcoin,
  Clapperboard,
  Cpu,
  FlaskConical,
  Gamepad2,
  Landmark,
  Shield,
  Sparkles,
  Trophy,
  Users,
  Wallet,
} from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/layout/logo";
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
  },
  {
    step: "Trade your view",
    text: "Buy YES or NO on what you think will happen. Prices move as the world moves.",
  },
  {
    step: "Cash out or win",
    text: "Sell early to lock in profit, or hold to your settlement — every winning share pays $1.",
  },
];

const features = [
  {
    icon: <Shield className="h-5 w-5" />,
    title: "$10,000 Demo Account",
    text: "Practice with virtual funds and a full trading simulator before you put real money on the line.",
  },
  {
    icon: <Users className="h-5 w-5" />,
    title: "Social by Design",
    text: "Follow traders, join groups, and see live community takes right beside every market.",
  },
  {
    icon: <BarChart3 className="h-5 w-5" />,
    title: "Rich Market Data",
    text: "Volume, probability curves, trader counts, and time left — everything you need at a glance.",
  },
  {
    icon: <Wallet className="h-5 w-5" />,
    title: "Wallet & Portfolio",
    text: "Track balance, positions, P&L and full transaction history. Deposit and withdraw in a tap.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex">
            {[
              { label: "Markets", href: "/markets" },
              { label: "Trending", href: "/trending" },
              { label: "Categories", href: "#categories" },
              { label: "How it works", href: "#how-it-works" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface hover:text-text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-text-secondary transition-colors hover:text-text-primary sm:block"
            >
              Log in
            </Link>
            <Link
              href="/home"
              className="inline-flex h-9 items-center gap-1.5 rounded-[10px] bg-primary px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-hover"
            >
              Get started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-light/50 px-3.5 py-1.5 text-xs font-bold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Demo trading · $10,000 virtual funds
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-text-primary sm:text-6xl">
              The World&rsquo;s Leading Social Prediction Market.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-text-secondary">
              Trade on what you know. Compete. Discuss. Discover. Put your
              intuition to work across sports, crypto, politics and more.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/home"
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
                { value: "24/7", label: "Trading" },
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

        <section id="categories" className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
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
                  <span className="number-tight flex h-9 w-9 items-center justify-center rounded-full bg-gradient-brand text-base font-extrabold text-white">
                    {i + 1}
                  </span>
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-[16px] border border-border bg-surface p-6"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-gradient-soft text-primary">
                  {feature.icon}
                </span>
                <p className="mt-4 text-base font-bold text-text-primary">
                  {feature.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {feature.text}
                </p>
              </div>
            ))}
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
                start trading in seconds.
              </p>
              <Link
                href="/home"
                className="mt-7 inline-flex h-12 items-center gap-2 rounded-[12px] bg-white px-6 text-base font-bold text-[#d00287] shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Get started free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-surface">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
          <Logo />
          <p className="text-sm text-text-muted">
            OmniMarketX — a demo prediction-market experience.
          </p>
        </div>
      </footer>
    </div>
  );
}