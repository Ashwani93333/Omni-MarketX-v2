"use client";

import { useQuery } from "@tanstack/react-query";
import { Heart, MessageCircle, Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { MOCK_CURRENT_USER } from "@/constants";
import { formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { marketService } from "@/services/market.service";
import { useUserStore } from "@/store/user-store";
import type { MarketDiscussionComment } from "@/types";

export function MarketDiscussion({ marketId }: { marketId: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["discussion", marketId],
    queryFn: () => marketService.getMarketDiscussion(marketId),
  });

  const currentAvatar = useUserStore((s) => s.avatarUrl);

  const [mine, setMine] = useState<MarketDiscussionComment[]>([]);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [draft, setDraft] = useState("");

  const all = [...mine, ...(data ?? [])];

  const handlePost = (e: FormEvent) => {
    e.preventDefault();
    const content = draft.trim();
    if (!content) return;
    setMine((prev) => [
      {
        id: `mine-${Date.now()}`,
        marketId,
        author: {
          id: MOCK_CURRENT_USER.id,
          username: MOCK_CURRENT_USER.username,
          displayName: MOCK_CURRENT_USER.displayName,
          initials: MOCK_CURRENT_USER.initials,
          avatarUrl: currentAvatar,
        },
        content,
        time: new Date().toISOString(),
        likes: 0,
      },
      ...prev,
    ]);
    setDraft("");
    toast.success("Comment posted");
  };

  const toggleLike = (id: string) => {
    setLikedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <Card>
      <CardHeader className="flex-row items-center gap-2">
        <MessageCircle className="h-4 w-4 text-text-muted" />
        <CardTitle className="text-lg">Market Discussion</CardTitle>
        <span className="ml-auto text-xs font-bold text-text-muted">
          {isLoading ? "…" : all.length}
        </span>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handlePost} className="flex items-center gap-2">
          <Avatar
            size="sm"
            initials={MOCK_CURRENT_USER.initials}
            src={currentAvatar}
          />
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Add to the discussion…"
            aria-label="Add a comment"
            className="flex-1"
          />
          <Button
            type="submit"
            size="icon"
            variant="secondary"
            disabled={!draft.trim()}
            aria-label="Post comment"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <p className="rounded-[10px] bg-background px-3 py-2 text-xs text-text-secondary">
            Discussion unavailable right now.
          </p>
        ) : all.length === 0 ? (
          <p className="rounded-[10px] bg-background px-3 py-2 text-xs text-text-secondary">
            Be the first to comment on this market.
          </p>
        ) : (
          <ul className="space-y-3">
            {all.map((c) => {
              const liked = likedIds.includes(c.id);
              return (
                <li key={c.id} className="flex gap-3">
                  <Avatar size="sm" initials={c.author.initials} src={c.author.avatarUrl} />
                  <div className="min-w-0 flex-1 rounded-[12px] bg-background px-3.5 py-2.5">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <span className="text-xs font-bold text-text-primary">
                        {c.author.displayName}
                      </span>
                      <span className="text-[11px] text-text-muted">
                        @{c.author.username} ·{" "}
                        {formatRelativeTime(c.time)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                      {c.content}
                    </p>
                    <button
                      onClick={() => toggleLike(c.id)}
                      aria-pressed={liked}
                      aria-label="Like comment"
                      className={cn(
                        "mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold transition-colors",
                        liked ? "text-danger" : "text-text-muted hover:text-text-primary"
                      )}
                    >
                      <Heart
                        className="h-3.5 w-3.5"
                        fill={liked ? "currentColor" : "none"}
                      />
                      {c.likes + (liked ? 1 : 0)}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}