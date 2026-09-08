export type SubscriptionPlan = "FREE" | "PRO";

export type BillingCycle = "MONTHLY" | "YEARLY";

export interface PricingBillingDetails {
  price: number;
  period: "MONTHLY" | "YEARLY";
  perMonth: number;
  billingNote?: string;
  savingsPct: number;
}

export interface PricingTierConfig {
  id: SubscriptionPlan;
  name: string;
  tagline: string;
  badge?: string;
  highlighted: boolean;
  monthly: { price: number; note?: string };
  yearly: { price: number; note?: string };
  features: string[];
  highlights?: string[];
  soon?: string[];
  cta: string;
}

export type PricingConfig = Record<SubscriptionPlan, PricingTierConfig>;

export const pricingConfig: PricingConfig = {
  FREE: {
    id: "FREE",
    name: "Free",
    tagline: "Great way to start",
    highlighted: false,
    monthly: { price: 0, note: "Free forever" },
    yearly: { price: 0, note: "Free forever" },
    features: [
      "Browse markets",
      "Trade markets",
      "Create markets",
      "Join groups",
      "Basic portfolio",
    ],
    cta: "Continue with Free",
  },
  PRO: {
    id: "PRO",
    name: "OmniMarketX Pro",
    tagline: "Best for active & power users",
    badge: "👑 Most popular",
    highlighted: true,
    monthly: { price: 14.99, note: "Billed monthly" },
    yearly: { price: 12.49, note: "$149.88 billed yearly" },
    features: [
      "Browse & Trade Markets",
      "Create Markets",
      "Join Groups",
      "Pulse (Social Feed)",
      "Leaderboards",
      "Pro Badge (verified checkmark)",
      "Invite & Earn (2%–10% commission)",
    ],
    highlights: ["Up to 10% commission"],
    soon: [
      "Advanced Analytics",
      "AI Market Insights",
      "Whale Alerts",
      "Advanced Charts",
      "Creator Dashboard",
      "API Access",
    ],
    cta: "Start Pro",
  },
};

export const YEARLY_SAVINGS_PCT =
  Math.round(
    (1 - pricingConfig.PRO.yearly.price / pricingConfig.PRO.monthly.price) * 1000
  ) / 10;

export function getBillingDetails(
  plan: SubscriptionPlan,
  cycle: BillingCycle,
  fallbackCycle: BillingCycle = "MONTHLY"
): PricingBillingDetails {
  const tier = pricingConfig[plan];
  const effective = plan === "PRO" ? cycle : fallbackCycle;
  const config = effective === "MONTHLY" ? tier.monthly : tier.yearly;
  const perMonth =
    effective === "YEARLY" && config.price > 0
      ? Math.round((config.price * 12 * 100) / 100) / 12
      : config.price;
  return {
    price: config.price,
    period: effective,
    perMonth: config.price > 0 ? perMonth : 0,
    billingNote: config.note,
    savingsPct: effective === "YEARLY" && config.price > 0 ? YEARLY_SAVINGS_PCT : 0,
  };
}