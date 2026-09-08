"use client";

import { Check, Plus, Star, Users } from "lucide-react";
import { useState } from "react";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Group } from "@/types";

export function GroupCard({
  group,
  featured = false,
}: {
  group: Group;
  featured?: boolean;
}) {
  const [joined, setJoined] = useState(false);

  return (
    <div className="flex flex-col gap-3 rounded-[16px] border border-border bg-surface p-5 transition-all hover:shadow-[var(--shadow-md)]">
      <div className="flex items-center gap-3">
        <Avatar
          size="lg"
          src={group.avatarUrl}
          initials={group.initials}
          alt={group.name}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-sm font-bold text-text-primary">
              {group.name}
            </p>
            {featured && (
              <Badge variant="orange" size="sm">
                <Star className="h-3 w-3" />
                Featured
              </Badge>
            )}
          </div>
          <p
            className={cn(
              "mt-0.5 inline-flex rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
              "bg-background text-text-muted"
            )}
          >
            {group.category}
          </p>
        </div>
      </div>

      <p className="line-clamp-2 text-sm leading-relaxed text-text-secondary">
        {group.description}
      </p>

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-border-light pt-3">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-text-muted">
          <Users className="h-3.5 w-3.5" />
          {group.memberCount.toLocaleString()} members
        </span>
        <Button
          size="sm"
          variant={joined ? "outline" : "primary"}
          onClick={() => setJoined((v) => !v)}
        >
          {joined ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {joined ? "Joined" : "Join"}
        </Button>
      </div>
    </div>
  );
}