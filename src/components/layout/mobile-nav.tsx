"use client";

import { Home, ChartLine, TrendingUp, Briefcase, Menu, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/app-store";

const items: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Home", href: "/home", icon: Home },
  { label: "Markets", href: "/markets", icon: ChartLine },
  { label: "Trending", href: "/trending", icon: TrendingUp },
  { label: "Portfolio", href: "/portfolio", icon: Briefcase },
];

export function MobileNav() {
  const pathname = usePathname();
  const setMobileNavOpen = useAppStore((s) => s.setMobileNavOpen);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      aria-label="Mobile"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <div className="mx-auto grid h-16 max-w-md grid-cols-5 items-center">
        {items.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-1 text-[10px] font-medium transition-colors",
                active ? "text-primary" : "text-text-muted hover:text-text-primary"
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={active ? 2.25 : 2} />
              {item.label}
            </Link>
          );
        })}
        <button
          onClick={() => setMobileNavOpen(true)}
          className="flex flex-col items-center justify-center gap-1 py-1 text-[10px] font-medium text-text-muted transition-colors hover:text-text-primary"
        >
          <Menu className="h-5 w-5" />
          Menu
        </button>
      </div>
    </nav>
  );
}