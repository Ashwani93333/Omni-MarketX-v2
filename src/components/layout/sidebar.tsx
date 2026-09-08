"use client";

import { Medal, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "@/components/layout/logo";
import { navIconByKey } from "@/components/layout/nav-icons";
import { APP_NAME, NAV_ITEMS } from "@/constants";
import { cn } from "@/lib/utils";
import { applyTheme, useAppStore, type Theme } from "@/store/app-store";

function NavItem({
  href,
  label,
  icon,
  active,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: string;
  active: boolean;
  onNavigate?: () => void;
}) {
  const Icon = navIconByKey[icon as keyof typeof navIconByKey];
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group flex h-9 items-center gap-3 rounded-[10px] px-3 text-sm font-medium transition-colors",
        active
          ? "bg-primary-light text-primary"
          : "text-text-secondary hover:bg-background hover:text-text-primary"
      )}
    >
      <Icon
        className={cn(
          "h-[18px] w-[18px] shrink-0 transition-colors",
          active ? "text-primary" : "text-text-muted group-hover:text-text-primary"
        )}
        strokeWidth={active ? 2.25 : 2}
      />
      <span className={cn(active && "font-semibold")}>{label}</span>
    </Link>
  );
}

function ThemeSelector() {
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);

  const options: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: "light", label: "Light", icon: <Sun className="h-3.5 w-3.5" /> },
    { value: "dark", label: "Dark", icon: <Moon className="h-3.5 w-3.5" /> },
    { value: "system", label: "System", icon: <Medal className="h-3.5 w-3.5" /> },
  ];

  return (
    <div className="rounded-[12px] border border-border bg-surface p-2">
      <div className="flex items-center gap-2 px-1 pb-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">
          Theme
        </span>
      </div>
      <div className="grid grid-cols-3 gap-1">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => {
              setTheme(opt.value);
              applyTheme(opt.value);
            }}
            aria-pressed={theme === opt.value}
            className={cn(
              "flex flex-col items-center gap-1 rounded-lg px-1 py-1.5 text-[11px] font-medium transition-colors",
              theme === opt.value
                ? "bg-primary-light text-primary"
                : "text-text-secondary hover:bg-background"
            )}
          >
            {opt.icon}
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div className="flex h-full flex-col">
      <div className="px-5 pb-5 pt-6">
        <Logo href="/home" />
      </div>

      <nav
        aria-label="Primary"
        className="scrollbar-thin flex-1 space-y-0.5 overflow-y-auto px-3 pb-3"
      >
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            active={isActive(item.href)}
            onNavigate={onNavigate}
          />
        ))}

        <div className="my-3 border-t border-border-light" />

        <NavItem
          href="/invite"
          label="Invite & Earn"
          icon="Gift"
          active={isActive("/invite")}
          onNavigate={onNavigate}
        />
      </nav>

      <div className="space-y-3 border-t border-border-light p-4">
        <ThemeSelector />
        <p className="px-1 text-center text-[11px] text-text-muted">
          {APP_NAME} · Prediction markets
        </p>
      </div>
    </div>
  );
}