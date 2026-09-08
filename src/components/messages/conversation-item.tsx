import { differenceInDays, differenceInHours, differenceInMinutes, format } from "date-fns";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Conversation } from "@/types";

export function formatShortTime(iso: string): string {
  const base = new Date(iso);
  const minutes = differenceInMinutes(new Date(), base);
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;
  const hours = differenceInHours(new Date(), base);
  if (hours < 24) return `${hours}h`;
  const days = differenceInDays(new Date(), base);
  if (days < 7) return `${days}d`;
  return format(base, "MMM d");
}

export function ConversationItem({
  conversation,
  selected,
  onClick,
}: {
  conversation: Conversation;
  selected: boolean;
  onClick: () => void;
}) {
  const { participant, lastMessage, timestamp, unreadCount } = conversation;
  const hasUnread = unreadCount > 0;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={selected ? "true" : undefined}
      className={cn(
        "flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset",
        selected && "bg-background"
      )}
    >
      <Avatar
        size="md"
        initials={participant.initials}
        alt={participant.displayName}
      />
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-semibold text-text-primary">
            {participant.displayName}
          </span>
          <span className="shrink-0 text-[11px] text-text-muted">
            {formatShortTime(timestamp)}
          </span>
        </span>
        <span className="mt-0.5 flex items-center justify-between gap-2">
          <span
            className={cn(
              "truncate text-xs",
              hasUnread ? "font-medium text-text-primary" : "text-text-secondary"
            )}
          >
            {lastMessage}
          </span>
          {hasUnread ? (
            <Badge variant="primary" aria-label={`${unreadCount} unread`}>
              {unreadCount}
            </Badge>
          ) : null}
        </span>
      </span>
    </button>
  );
}