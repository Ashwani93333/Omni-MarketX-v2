"use client";

import { Bell, CheckCheck } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { NotificationItemRow } from "@/components/notifications/notification-item";
import { getNotificationRoute } from "@/components/notifications/notification-utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconButton } from "@/components/ui/icon-button";
import {
  selectUnreadCount,
  useNotificationsStore,
} from "@/store/notifications-store";
import type { NotificationItem } from "@/types";

export function NotificationsMenu() {
  const router = useRouter();
  const notifications = useNotificationsStore((s) => s.notifications);
  const loading = useNotificationsStore((s) => s.loading);
  const unread = useNotificationsStore(selectUnreadCount);
  const load = useNotificationsStore((s) => s.load);
  const markAsRead = useNotificationsStore((s) => s.markAsRead);
  const markAllAsRead = useNotificationsStore((s) => s.markAllAsRead);

  useEffect(() => {
    void load();
  }, [load]);

  const handleMarkAllRead = () => {
    if (unread === 0) return;
    markAllAsRead();
    toast.success("All notifications marked as read");
  };

  const openNotification = (n: NotificationItem) => {
    if (!n.read) markAsRead(n.id);
    router.push(getNotificationRoute(n));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton
          aria-label={`Notifications${unread ? ` (${unread} unread)` : ""}`}
        >
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span
              aria-hidden="true"
              className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white ring-2 ring-surface"
            >
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </IconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[360px] max-w-[calc(100vw-2rem)] p-0"
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="text-sm font-bold text-text-primary">Notifications</p>
          {unread > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              <CheckCheck className="h-3.5 w-3.5" /> Mark all read
            </button>
          )}
        </div>
        <div className="scrollbar-thin max-h-[380px] overflow-y-auto">
          {loading && notifications.length === 0 ? (
            <div className="space-y-3 p-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton h-16 rounded-lg" />
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-text-secondary">
              {"You're all caught up."}
            </p>
          ) : (
            notifications
              .slice(0, 5)
              .map((n) => (
                <NotificationItemRow
                  key={n.id}
                  item={n}
                  onSelect={openNotification}
                  className="border-b border-border-light last:border-b-0"
                />
              ))
          )}
        </div>
        <DropdownMenuSeparator />
        <button
          onClick={() => router.push("/notifications")}
          className="flex w-full items-center justify-center gap-1.5 px-4 py-3 text-xs font-bold text-primary transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          View all notifications
          <span aria-hidden="true">→</span>
        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}