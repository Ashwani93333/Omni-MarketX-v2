import {
  BarChart3,
  BookOpen,
  Briefcase,
  Building2,
  Bug,
  ChevronRight,
  Code2,
  Coins,
  Cookie,
  CreditCard,
  Crown,
  Database,
  DollarSign,
  FileText,
  Gamepad2,
  Gift,
  Globe,
  ShieldAlert,
  GraduationCap,
  Handshake,
  HelpCircle,
  LayoutDashboard,
  Lock,
  Mail,
  MessageSquare,
  Newspaper,
  Palette,
  PartyPopper,
  PieChart,
  Scale,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Swords,
  TrendingUp,
  Trophy,
  Tv,
  UserCheck,
  Users,
  Zap,
} from "lucide-react";
import type { ComponentType } from "react";

import { Logo } from "@/components/layout/logo";

interface FooterItem {
  label: string;
  icon?: ComponentType<{ className?: string }>;
}

const marketItems: FooterItem[] = [
  { label: "Trending", icon: TrendingUp },
  { label: "New Markets", icon: Zap },
  { label: "Gaming", icon: Gamepad2 },
  { label: "Crypto", icon: Coins },
  { label: "Politics", icon: Tv },
  { label: "Sports", icon: Swords },
  { label: "Economy", icon: DollarSign },
  { label: "Entertainment", icon: PartyPopper },
  { label: "Tech", icon: Smartphone },
  { label: "View All Markets", icon: ChevronRight },
];

const productItems: FooterItem[] = [
  { label: "How It Works", icon: HelpCircle },
  { label: "Create Market", icon: Sparkles },
  { label: "Portfolio", icon: PieChart },
  { label: "Analytics", icon: BarChart3 },
  { label: "OmniMarket Pro", icon: Crown },
  { label: "Creator Dashboard", icon: LayoutDashboard },
  { label: "Invite & Earn", icon: Gift },
  { label: "API & Developers", icon: Code2 },
];

const companyItems: FooterItem[] = [
  { label: "About Us", icon: Building2 },
  { label: "Careers", icon: Briefcase },
  { label: "Brand Kit", icon: Palette },
  { label: "Blog", icon: Newspaper },
  { label: "Press", icon: Star },
  { label: "Partners", icon: Handshake },
  { label: "Contact Us", icon: Mail },
];

const supportItems: FooterItem[] = [
  { label: "Help Center", icon: HelpCircle },
  { label: "FAQ", icon: BookOpen },
  { label: "Guides", icon: GraduationCap },
  { label: "Fees & Limits", icon: CreditCard },
  { label: "Trading Rules", icon: FileText },
  { label: "Market Integrity", icon: ShieldCheck },
  { label: "Report an Issue", icon: Bug },
  { label: "Feedback & Feature Requests", icon: MessageSquare },
];

const legalItems: FooterItem[] = [
  { label: "Terms of Service", icon: FileText },
  { label: "Privacy Policy", icon: Lock },
  { label: "Risk Disclosure", icon: ShieldAlert },
  { label: "Cookie Policy", icon: Cookie },
  { label: "Data Policy", icon: Database },
  { label: "Regulatory & Compliance", icon: Scale },
  { label: "AML & KYC Policy", icon: UserCheck },
];

const highlights = [
  {
    title: "Secure & Transparent",
    description: "All funds are secured. Markets are transparent and verifiable.",
    icon: Lock,
  },
  {
    title: "Global Access",
    description: "Available worldwide. 24/7 market access.",
    icon: Globe,
  },
  {
    title: "Built for Everyone",
    description: "Simple for beginners. Powerful for pros.",
    icon: Users,
  },
  {
    title: "Rewards & Incentives",
    description: "Earn rewards, airdrops and creator incentives.",
    icon: Trophy,
  },
];

function FooterSection({
  title,
  items,
}: {
  title: string;
  items: FooterItem[];
}) {
  return (
    <div>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-text-muted">
        {title}
      </h3>
      <ul className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.label}>
              <span className="inline-flex items-center gap-2 text-sm text-text-secondary">
                {Icon && <Icon className="h-3.5 w-3.5 text-text-muted" />}
                {item.label}
              </span>
            </li>
          );
        })}
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
            <FooterSection title="Markets" items={marketItems} />
          </div>
          <FooterSection title="Product" items={productItems} />
          <FooterSection title="Company" items={companyItems} />
          <FooterSection title="Support" items={supportItems} />
          <FooterSection title="Status" items={[{ label: "Status", icon: Zap }]} />
          <FooterSection title="Legal" items={legalItems} />
        </div>

        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex items-start gap-3 rounded-[12px] border border-border-light bg-background p-4"
              >
                <div className="mt-0.5 flex-shrink-0">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-text-primary">
                    {item.title}
                  </h4>
                  <p className="mt-0.5 text-xs leading-relaxed text-text-muted">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
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
