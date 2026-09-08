"use client";

import { ArrowRight, Gem, Gift, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { PricingPlanCard } from "@/components/pricing/pricing-plan-card";
import { PricingToggle } from "@/components/pricing/pricing-toggle";
import {
  pricingConfig,
  type BillingCycle,
  type SubscriptionPlan,
} from "@/constants/pricing";
import { useOnboardingStore } from "@/store/onboarding-store";

const faqs = [
  {
    q: "Is pricing locked in forever?",
    a: "Yes — the demo lets you toggle the plan freely, and you can change it anytime from your settings.",
  },
  {
    q: "Do I need a payment method?",
    a: "No. OmniMarketX is a demo experience; Pro is simulated and never billed.",
  },
  {
    q: "What counts toward Pro features?",
    a: "Pro unlocks the advanced analytics tray on your portfolio, a Pro badge on your profile, AI market insights and creator tools across every category.",
  },
];

export default function PricingPage() {
  const router = useRouter();
  const setPlan = useOnboardingStore((state) => state.setPlan);
  const setBillingCycle = useOnboardingStore((state) => state.setBillingCycle);
  const [cycle, setCycle] = useState<BillingCycle>("MONTHLY");

  const goToPlan = (plan: SubscriptionPlan) => {
    setPlan(plan);
    setBillingCycle(cycle);
    router.push("/onboarding?step=plan");
  };

  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />

      <main>
        <section className="mx-auto max-w-6xl px-4 pb-14 pt-16 sm:px-6 sm:pt-20">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-light/50 px-3.5 py-1.5 text-xs font-bold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Simple, honest plans
            </span>
            <h1 className="mt-6 text-3xl font-extrabold leading-[1.1] tracking-tight text-text-primary sm:text-5xl">
              Simple pricing. Serious edge.
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-text-secondary">
              Start free with $10,000 in demo funds. Upgrade to Pro whenever
              you&rsquo;re ready — or keep every headline feature, at zero cost.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <PricingToggle cycle={cycle} onChange={setCycle} />
            </div>
          </div>

          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-5 md:grid-cols-2">
            <PricingPlanCard
              plan="FREE"
              cycle={cycle}
              onPrimaryClick={() => goToPlan("FREE")}
            />
            <PricingPlanCard
              plan="PRO"
              cycle={cycle}
              onPrimaryClick={() => goToPlan("PRO")}
            />
          </div>
        </section>

        <section className="border-y border-border bg-surface py-16">
          <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary-light/50 px-3 py-1 text-xs font-bold text-primary">
                <Gift className="h-3.5 w-3.5" />
                Invite &amp; Earn
              </span>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
                Get paid for growing the community
              </h2>
              <p className="mt-3 text-base leading-relaxed text-text-secondary">
                Every friend who joins earns you $25 in referral rewards — and
                every reward doubles to $50 when you&rsquo;re on Pro. Your
                invitees start with their own $10,000 demo wallet, so everyone
                wins.
              </p>
              <Link
                href="/invite"
                className="mt-6 inline-flex h-11 items-center gap-2 rounded-[12px] bg-primary px-5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-hover active:scale-[0.98]"
              >
                Check your invite link
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                {
                  value: "$25",
                  label: "Per friend on Free",
                  detail: "Credited to your demo wallet",
                },
                {
                  value: "$50",
                  label: "Per friend on Pro",
                  detail: "Twice the reward, zero extra work",
                },
                {
                  value: "$10K",
                  label: "Bonus for invitees",
                  detail: "Every new trader starts funded",
                },
                {
                  value: "∞",
                  label: "No cap",
                  detail: "Keep inviting, keep earning",
                },
              ].map((card) => (
                <div
                  key={card.label}
                  className="rounded-[16px] border border-border bg-background p-5"
                >
                  <p className="number-tight text-3xl font-extrabold text-primary">
                    {card.value}
                  </p>
                  <p className="mt-1 text-sm font-bold text-text-primary">
                    {card.label}
                  </p>
                  <p className="mt-1 text-xs text-text-secondary">
                    {card.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="rounded-[20px] border border-success/20 bg-success-light/40 p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-success-light text-success">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-bold text-text-primary">
                7-day money-back guarantee
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                Even though Pro is a demo, the promise is real: if it&rsquo;s
                not for you, downgrade in one tap from settings — no questions,
                no charge.
              </p>
            </div>
            <div className="rounded-[20px] border border-border bg-surface p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-primary-light text-primary">
                <Gem className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-bold text-text-primary">
                Pro features on every market
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {pricingConfig.PRO.features.slice(1).join(", ")} — applied
                across all 8 categories, from crypto to sports.
              </p>
            </div>
            <div className="rounded-[20px] border border-border bg-surface p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-primary-light text-primary">
                <Sparkles className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-bold text-text-primary">
                Free forever
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {pricingConfig.FREE.features.join(" · ")} — all included at $0,
                no credit card required.
              </p>
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-2xl">
            <p className="text-center text-xs font-bold uppercase tracking-widest text-primary">
              FAQ
            </p>
            <h2 className="mt-2 text-center text-2xl font-bold tracking-tight text-text-primary">
              Questions, answered
            </h2>
            <div className="mt-6 space-y-3">
              {faqs.map((faq) => (
                <details
                  key={faq.q}
                  className="group rounded-[14px] border border-border bg-surface p-4"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-sm font-bold text-text-primary">
                    {faq.q}
                    <span className="text-text-muted transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <div className="relative overflow-hidden rounded-[24px] bg-gradient-brand px-6 py-14 text-center sm:px-12">
            <div className="relative">
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Start free. Upgrade when you&rsquo;re ready.
              </h2>
              <p className="mx-auto mt-3 max-w-md text-base text-white/85">
                Pick your plan in under a minute — every feature stays unlocked,
                whatever you choose.
              </p>
              <Link
                href="/onboarding?step=plan"
                className="mt-7 inline-flex h-12 items-center gap-2 rounded-[12px] bg-white px-6 text-base font-bold text-[#d00287] shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Choose your plan
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