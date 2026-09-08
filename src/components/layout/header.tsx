"use client";

import { Menu, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { GlobalSearch } from "@/components/layout/global-search";
import { NotificationsMenu } from "@/components/layout/notifications-menu";
import { ProfileMenu } from "@/components/layout/profile-menu";
import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/app-store";

export function Header() {
  const router = useRouter();
  const tradingMode = useAppStore((s) => s.tradingMode);
  const setTradingMode = useAppStore((s) => s.setTradingMode);
  const setMobileNavOpen = useAppStore((s) => s.setMobileNavOpen);

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border bg-surface/90 px-4 backdrop-blur-sm lg:px-6">
      <IconButton
        size="sm"
        className="lg:hidden"
        aria-label="Open menu"
        onClick={() => setMobileNavOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </IconButton>

      <GlobalSearch />

      <div className="ml-auto flex items-center gap-2.5">
        <div
          role="group"
          aria-label="Trading mode"
          className="hidden h-9 items-center gap-0.5 rounded-[10px] border border-border bg-background p-0.5 sm:flex"
        >
          <button
            onClick={() => setTradingMode("DEMO")}
            aria-pressed={tradingMode === "DEMO"}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors",
              tradingMode === "DEMO"
                ? "bg-orange-light text-orange"
                : "text-text-secondary hover:text-text-primary"
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-orange" aria-hidden="true" />
            Demo
          </button>
          <button
            onClick={() => setTradingMode("REAL")}
            aria-pressed={tradingMode === "REAL"}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors",
              tradingMode === "REAL"
                ? "bg-success-light text-success"
                : "text-text-secondary hover:text-text-primary"
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
            Real
          </button>
        </div>

        <IconButton
          aria-label="Messages"
          onClick={() => {
            router.push("/social");
            toast.info("Messages moved to the community feed");
          }}
        >
          <MessageCircle className="h-5 w-5" />
        </IconButton>

        <NotificationsMenu />
        <div className="hidden h-6 w-px bg-border sm:block" />
        <ProfileMenu />
      </div>
    </header>
  );
}