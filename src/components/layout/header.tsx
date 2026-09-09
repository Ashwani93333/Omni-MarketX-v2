"use client";

import { Menu, MessageCircle, PlusSquare } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { GlobalSearch } from "@/components/layout/global-search";
import { NotificationsMenu } from "@/components/layout/notifications-menu";
import { ProfileMenu } from "@/components/layout/profile-menu";
import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/app-store";
import { selectUnreadCount, useMessagesStore } from "@/store/messages-store";

export function Header() {
  const router = useRouter();
  const unreadMessages = useMessagesStore(selectUnreadCount);
  const tradingMode = useAppStore((s) => s.tradingMode);
  const setTradingMode = useAppStore((s) => s.setTradingMode);
  const setMobileNavOpen = useAppStore((s) => s.setMobileNavOpen);
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen);

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border bg-surface/90 px-4 backdrop-blur-sm lg:px-6">
      <IconButton
        size="sm"
        className={cn(sidebarOpen ? "lg:hidden" : "")}
        aria-label={sidebarOpen ? "Open menu" : "Show sidebar"}
        onClick={() =>
          sidebarOpen ? setMobileNavOpen(true) : setSidebarOpen(true)
        }
      >
        <Menu className="h-5 w-5" />
      </IconButton>

      <GlobalSearch />

      <div className="ml-auto flex items-center gap-2.5">
        <Link
          href="/create-market"
          className="hidden items-center gap-1.5 rounded-[10px] bg-primary px-3 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-primary-hover md:inline-flex"
        >
          <PlusSquare className="h-4 w-4" />
          Create
        </Link>

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
          aria-label={`Messages${unreadMessages ? ` (${unreadMessages} unread)` : ""}`}
          onClick={() => router.push("/messages")}
        >
          <MessageCircle className="h-5 w-5" />
          {unreadMessages > 0 && (
            <span
              aria-hidden="true"
              className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white ring-2 ring-surface"
            >
              {unreadMessages > 9 ? "9+" : unreadMessages}
            </span>
          )}
        </IconButton>

        <NotificationsMenu />
        <div className="hidden h-6 w-px bg-border sm:block" />
        <ProfileMenu />
      </div>
    </header>
  );
}