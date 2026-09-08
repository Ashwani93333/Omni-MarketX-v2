"use client";

import { UserPlus, Users } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Avatar } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCopyStore } from "@/store/copy-store";

export function CopyTradingPanel() {
  const copied = useCopyStore((s) => s.copied);
  const stopCopy = useCopyStore((s) => s.stopCopy);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex flex-wrap items-center gap-2 text-[15px]">
          <Users className="h-4 w-4 text-primary" />
          Copy Trading
          {copied.length > 0 && (
            <span className="rounded-md bg-primary-light px-1.5 py-0.5 text-[10px] font-bold text-primary">
              {copied.length}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {copied.length === 0 ? (
          <div className="rounded-[10px] bg-background p-3">
            <Link
              href="/leaderboard"
              className="flex items-center justify-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              <UserPlus className="h-3.5 w-3.5" />
              Copy a trader from the leaderboard
            </Link>
          </div>
        ) : (
          <ul className="space-y-2">
            {copied.map((c) => (
              <li
                key={c.userId}
                className="flex items-center gap-2.5 rounded-[10px] border border-border bg-background px-3 py-2"
              >
                <Avatar size="sm" initials={c.initials} />
                <Link
                  href={`/users/${c.userId}`}
                  className="min-w-0 flex-1 truncate text-xs font-semibold text-text-primary transition-colors hover:text-primary"
                >
                  {c.displayName}
                </Link>
                <span className="number-tight rounded-md bg-success-light px-1.5 py-0.5 text-[10px] font-bold text-success">
                  {c.allocation}%
                </span>
                <button
                  onClick={() => {
                    stopCopy(c.userId);
                    toast.success(`Stopped copying ${c.displayName}`);
                  }}
                  className="rounded-md px-1.5 py-1 text-[11px] font-semibold text-text-muted transition-colors hover:bg-danger-light hover:text-danger"
                >
                  Stop
                </button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}