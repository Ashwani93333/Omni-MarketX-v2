import { Logo } from "@/components/layout/logo";

const marketCategories = [
  "🎮 Gaming",
  "₿ Crypto",
  "🗳 Politics",
  "⚽ Sports",
  "💰 Economy",
  "🎬 Entertainment",
  "🤖 Tech",
];

const productLinks = [
  "How It Works",
  "Create Market",
  "Portfolio",
  "Analytics",
  "OmniMarket Pro",
  "Creator Dashboard",
  "Invite & Earn",
  "API & Developers",
];

const companyLinks = [
  "About Us",
  "Careers",
  "Brand Kit",
  "Blog",
  "Press",
  "Partners",
  "Contact Us",
];

const supportLinks = [
  "Help Center",
  "FAQ",
  "Guides",
  "Fees & Limits",
  "Trading Rules",
  "Market Integrity",
  "Report an Issue",
  "Feedback & Feature Requests",
];

const legalLinks = [
  "Terms of Service",
  "Privacy Policy",
  "Risk Disclosure",
  "Cookie Policy",
  "Data Policy",
  "Regulatory & Compliance",
  "AML & KYC Policy",
];

const highlights = [
  {
    title: "Secure & Transparent",
    description: "All funds are secured. Markets are transparent and verifiable.",
    icon: (
      <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: "Global Access",
    description: "Available worldwide. 24/7 market access.",
    icon: (
      <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Built for Everyone",
    description: "Simple for beginners. Powerful for pros.",
    icon: (
      <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    title: "Rewards & Incentives",
    description: "Earn rewards, airdrops and creator incentives.",
    icon: (
      <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      </svg>
    ),
  },
];

function FooterSection({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-text-muted">
        {title}
      </h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item}>
            <span className="text-sm text-text-secondary">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-12">
          <Logo />
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-text-secondary">
            The World&apos;s Leading Social Prediction Market.™
          </p>
          <p className="mt-1 text-sm font-semibold text-text-primary">
            Trade What Matters.
          </p>
        </div>

        <div className="mb-16 grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <FooterSection
              title="Markets"
              items={[
                "Trending",
                "New Markets",
                ...marketCategories,
                "View All Markets",
              ]}
            />
          </div>
          <FooterSection title="Product" items={productLinks} />
          <FooterSection title="Company" items={companyLinks} />
          <FooterSection title="Support" items={supportLinks} />
          <FooterSection title="Status" items={["Status"]} />
          <FooterSection title="Legal" items={legalLinks} />
        </div>

        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-3 rounded-[12px] border border-border-light bg-background p-4"
            >
              <div className="mt-0.5 flex-shrink-0">{item.icon}</div>
              <div>
                <h4 className="text-sm font-semibold text-text-primary">
                  {item.title}
                </h4>
                <p className="mt-0.5 text-xs leading-relaxed text-text-muted">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} OmniMarketX. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-text-muted">Terms</span>
            <span className="text-xs text-text-muted">Privacy</span>
            <span className="text-xs text-text-muted">Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
