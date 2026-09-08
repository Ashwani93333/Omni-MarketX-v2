"use client";

import {
  Bell,
  CheckCheck,
  Info,
  MessageCircle,
  ShoppingBag,
  TrendingDown,
  UserPlus,
  Gift,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconButton } from "@/components/ui/icon-button";
import { notificationService } from "@/services/domain.service";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import type { NotificationItem } from "@/types";

const typeIcon: Record<NotificationItem["type"], React.ReactNode> = {
  trade: <ShoppingBag className="h-3.5 w-3.5" />,
  market: <TrendingDown className="h-3.5 w-3.5" />,
  follow: <UserPlus className="h-3.5 w-3.5" />,
  comment: <MessageCircle className="h-3.5 w-3.5" />,
  mention: <MessageCircle className="h-3.5 w-3.5" />,
  group: <Users className="h-3.5 w-3.5" />,
  reward: <Gift className="h-3.5 w-3.5" />,
  system: <Info className="h-3.5 w-3.5" />,
};

export function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { data } = useQuery({
    queryKey: ["notifications"],
    queryFn: notificationService.getNotifications,
    enabled: open,
  });

  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const items = (data ?? []).map((n) =>
    readIds.has(n.id) ? { ...n, read: true } : n
  );
  const unread = items.filter((n) => !n.read).length;

  const markAllRead = () => {
    if (!data) return;
    setReadIds(new Set(data.map((n) => n.id)));
    toast.success("All notifications marked as read");
  };

  const openNotification = (n: NotificationItem) => {
    if (!n.read) {
      setReadIds((prev) => new Set(prev).add(n.id));
    }
    setOpen(false);
    const route =
      n.type === "trade" || n.type === "market"
        ? "/markets"
        : n.type === "reward"
          ? "/leaderboard"
          : n.type === "system"
            ? "/settings"
            : "/social";
    router.push(route);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <IconButton
          aria-label={`Notifications${unread ? ` (${unread} unread)` : ""}`}
        >
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white ring-2 ring-surface">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </IconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[360px] max-w-[calc(100vw-2rem)] p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="text-sm font-bold text-text-primary">Notifications</p>
          {unread > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              <CheckCheck className="h-3.5 w-3.5" /> Mark all read
            </button>
          )}
        </div>
        <div className="scrollbar-thin max-h-[380px] overflow-y-auto">
          {!data ? (
            <NotificationSkeleton />
          ) : data.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-text-secondary">
              You{"'"}re all caught up.
            </p>
          ) : (
            items.map((n) => (
              <button
                key={n.id}
                onClick={() => openNotification(n)}
                className="flex w-full items-start gap-3 border-b border-border-light px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-background"
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                    n.read ? "bg-background text-text-muted" : "bg-primary-light text-primary"
                  )}
                >
                  {typeIcon[n.type]}
                </span>
                <span className="flex-1">
                  <span className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        n.read ? "text-text-secondary" : "text-text-primary"
                      )}
                    >
                      {n.title}
                    </span>
                    {!n.read && <Badge variant="primary" size="sm">New</Badge>}
                  </span>
                  <span className="mt-0.5 block text-xs text-text-secondary">
                    {n.description}
                  </span>
                  <span className="mt-1 block text-[11px] text-text-muted">
                    {n.time}
                  </span>
                </span>
              </button>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NotificationSkeleton() {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="skeleton h-16 rounded-lg" />
      ))}
    </div>
  );
}