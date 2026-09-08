import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/layout/logo";

const links = [
  { label: "Markets", href: "/markets" },
  { label: "Trending", href: "/trending" },
  { label: "Features", href: "/#features" },
  { label: "Categories", href: "/#categories" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Pricing", href: "/pricing" },
];

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
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
            href="/onboarding"
            className="inline-flex h-9 items-center gap-1.5 rounded-[10px] bg-primary px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-hover"
          >
            Get started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}