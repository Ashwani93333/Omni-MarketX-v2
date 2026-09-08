import Link from "next/link";

import { Logo } from "@/components/layout/logo";

const links = [
  { label: "Markets", href: "/markets" },
  { label: "Pricing", href: "/pricing" },
  { label: "Trending", href: "/trending" },
];

export function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
        <Logo />
        <nav className="flex items-center gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-text-muted transition-colors hover:text-text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="text-sm text-text-muted">
          OmniMarketX — a demo prediction-market experience.
        </p>
      </div>
    </footer>
  );
}