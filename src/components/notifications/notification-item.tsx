"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  NOTIFICATION_TYPE_ICONS,
  getNotificationCategory,
} from "@/components/notifications/notification-utils";
import type { NotificationItem } from "@/types";

export function NotificationItemRow({
  item,
  onSelect,
  className,
}: {
  item: NotificationItem;
  onSelect: (item: NotificationItem) => void;
  className?: string;
}) {
  const Icon = NOTIFICATION_TYPE_ICONS[item.type];
  const category = getNotificationCategory(item.type);
  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      aria-label={`${item.title}${item.read ? "" : " (unread)"}`}
      className={cn(
        "flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset",
        className
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "relative mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px]",
          item.read
            ? "bg-background text-text-muted"
            : "bg-primary-light text-primary"
        )}
      >
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span
            className={cn(
              "truncate text-sm font-semibold",
              item.read ? "text-text-secondary" : "text-text-primary"
            )}
          >
            {item.title}
          </span>
          {!item.read && (
            <Badge variant="primary" size="sm">
              New
            </Badge>
          )}
          <span
            className={cn(
              "hidden shrink-0 rounded-full border border-border px-2 py-0.5 text-[10px] font-semibold sm:inline-block",
              category === "TRADE"
                ? "border-primary/20 bg-primary-light/40 text-primary"
                : "text-text-muted"
            )}
          >
            {category}
          </span>
        </span>
        <span className="mt-0.5 block overflow-hidden text-xs text-text-secondary [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
          {item.description}
        </span>
        <span className="mt-1 block text-[11px] text-text-muted">
          {item.time}
        </span>
      </span>
    </button>
  );
}