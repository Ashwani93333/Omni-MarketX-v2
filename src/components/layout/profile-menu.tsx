"use client";

import {
  ChartSpline,
  ChevronDown,
  CircleUser,
  Crown,
  HelpCircle,
  LogOut,
  Settings,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

import { applyTheme, useAppStore } from "@/store/app-store";
import { useAuthStore } from "@/store/auth-store";
import { useOnboardingStore } from "@/store/onboarding-store";
import { useUserStore } from "@/store/user-store";

function ThemeDropdownItem() {
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);
  const cycles = ["light", "dark"] as const;

  const cycleTheme = () => {
    const next = cycles[(cycles.indexOf(theme) + 1) % cycles.length];
    setTheme(next);
    applyTheme(next);
  };

  return (
    <button
      onClick={cycleTheme}
      className="flex w-full cursor-pointer select-none items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium text-text-secondary outline-none transition-colors hover:bg-background hover:text-text-primary"
    >
      <ChartSpline className="h-4 w-4" />
      Theme: {theme.charAt(0).toUpperCase() + theme.slice(1)}
    </button>
  );
}

export function ProfileMenu() {
  const router = useRouter();
  const tradingMode = useAppStore((s) => s.tradingMode);
  const setTradingMode = useAppStore((s) => s.setTradingMode);
  const plan = useOnboardingStore((s) => s.plan);
  const displayName = useUserStore((s) => s.displayName);
  const username = useUserStore((s) => s.username);
  const initials = useUserStore((s) => s.initials);
  const avatarUrl = useUserStore((s) => s.avatarUrl);
  const logout = useAuthStore((s) => s.logout);
  const resetProfile = useUserStore((s) => s.resetProfile);
  const resetOnboarding = useOnboardingStore((s) => s.reset);

  const handleLogout = () => {
    logout();
    resetProfile();
    resetOnboarding();
    toast.success("Signed out", { description: "See you soon." });
    router.push("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full py-1 pl-1 pr-1.5 transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <Avatar size="sm" initials={initials} src={avatarUrl} />
          <span className="hidden items-center gap-1 text-sm font-semibold text-text-primary lg:flex">
            {username}
            <ChevronDown className="h-3.5 w-3.5 text-text-muted" />
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[220px]">
        <DropdownMenuLabel>
          <p className="text-sm text-text-primary">
            {displayName}
          </p>
          <p className="text-xs font-normal text-text-muted">
            @{username}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <CircleUser className="h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/portfolio">
            <ChartSpline className="h-4 w-4" />
            Portfolio
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings#plan">
            <Crown className="h-4 w-4 text-orange" />
            {plan === "PRO" ? "Manage Pro" : "Upgrade to Pro"}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/achievements">
            <Trophy className="h-4 w-4 text-orange" />
            Achievements
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {tradingMode === "DEMO" && (
          <>
            <DropdownMenuItem
              onClick={() => setTradingMode("REAL")}
            >
              <ChartSpline className="h-4 w-4 text-orange" />
              Exit Demo
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <ThemeDropdownItem />
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <HelpCircle className="h-4 w-4" />
            Help
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-danger hover:bg-danger-light focus:bg-danger-light focus:text-danger"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}