"use client";

import { Bell, CheckCheck, Info, ShoppingBag, Users } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { NotificationItem } from "@/types";

function StatCell({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-[12px] border border-border-light bg-background/60 p-3">
      <span
        aria-hidden="true"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-surface text-text-muted"
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-medium text-text-muted">
          {label}
        </span>
        <span className="block text-lg font-bold leading-tight text-text-primary">
          {value}
        </span>
      </span>
    </div>
  );
}

export function NotificationSummary({
  notifications,
}: {
  notifications: NotificationItem[];
}) {
  const unread = notifications.filter((n) => !n.read).length;
  const trades = notifications.filter((n) => n.category === "TRADE").length;
  const social = notifications.filter((n) => n.category === "SOCIAL").length;
  const system = notifications.filter((n) => n.category === "SYSTEM").length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-primary-light text-primary">
            <Bell className="h-4 w-4" />
          </span>
          Notification Summary
        </CardTitle>
        <CardDescription>
          Derived live from your notification feed.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <StatCell label="Unread" value={unread} icon={<CheckCheck className="h-4 w-4" />} />
        <StatCell label="Trades" value={trades} icon={<ShoppingBag className="h-4 w-4" />} />
        <StatCell label="Social" value={social} icon={<Users className="h-4 w-4" />} />
        <StatCell label="System" value={system} icon={<Info className="h-4 w-4" />} />
      </CardContent>
    </Card>
  );
}