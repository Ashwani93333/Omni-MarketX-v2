"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BarChart3,
  Flame,
  Image,
  Smile,
  Sparkles,
  TrendingUp,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { FollowButton } from "@/components/social/follow-button";
import { PostCard } from "@/components/social/post-card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { marketService } from "@/services/market.service";
import { socialService } from "@/services/domain.service";
import { useFollowStore } from "@/store/follow-store";
import { useUserStore } from "@/store/user-store";
import { useWatchlistStore } from "@/store/watchlist-store";
import type { Post, User } from "@/types";

const FEED_TABS = ["For You", "Following", "Top", "Latest"] as const;

const REEL_KEY = "s-001";

export default function SocialPage() {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState("");
  const [activeTab, setActiveTab] = useState<string>("For You");
  const [attachImage, setAttachImage] = useState(false);
  const [attachPoll, setAttachPoll] = useState(false);
  const initials = useUserStore((s) => s.initials);
  const displayName = useUserStore((s) => s.displayName);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState<[string, string]>(["", ""]);

  const followedIds = useFollowStore((s) => s.followedIds);
  const watchedIds = useWatchlistStore((s) => s.ids);

  const EMOJIS = ["\u{1F600}", "\u{1F525}", "\u{1F44D}", "\u{1F680}", "\u{1F40D}", "\u{2764}\u{FE0F}"];

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["social-posts"],
    queryFn: socialService.getPosts,
  });

  const { data: trending } = useQuery({
    queryKey: ["trending-markets"],
    queryFn: marketService.getTrendingMarkets,
  });

  const { data: suggested } = useQuery({
    queryKey: ["suggested-traders"],
    queryFn: socialService.getSuggestedTraders,
  });

  const createPost = useMutation({
    mutationFn: () => {
      const filled = pollOptions.filter((o) => o.trim());
      const poll =
        attachPoll && filled.length >= 2
          ? {
              question: pollQuestion.trim() || "Poll",
              options: filled.map((label) => ({ label: label.trim(), votes: 0 })),
              totalVotes: 0,
            }
          : undefined;
      return socialService.createPost(draft.trim(), poll);
    },
    onSuccess: (post: Post) => {
      queryClient.setQueryData<Post[]>(["social-posts"], (old) =>
        old ? [post, ...old] : [post]
      );
      setDraft("");
      setAttachPoll(false);
      setPollQuestion("");
      setPollOptions(["", ""]);
      toast.success("Post published");
    },
    onError: () => toast.error("Couldn\u2019t publish your post"),
  });

  const feed = useMemo(() => {
    if (!data) return undefined;

    const isMe = (user: User) => user.id === REEL_KEY;
    const isFollowed = (user: User) => followedIds.includes(user.id);
    const engagement = (post: Post) =>
      post.likes * 2 + post.comments * 4 + post.shares * 6;

    const personalize = (post: Post) => {
      let score = Math.min(6, engagement(post) / 60);
      if (isFollowed(post.user)) score += 8;
      if (isMe(post.user)) score += 2;
      if (post.market && watchedIds.includes(post.market.id)) score += 4;
      return score;
    };

    switch (activeTab) {
      case "Following":
        return data
          .filter((post) => isFollowed(post.user) || isMe(post.user))
          .sort((a, b) => personalize(b) - personalize(a));
      case "Top":
        return data
          .filter((post) => (post.likes ?? 0) > 5)
          .sort((a, b) => engagement(b) - engagement(a));
      case "For You":
        return [...data].sort((a, b) => personalize(b) - personalize(a));
      case "Latest":
      default:
        return data;
    }
  }, [data, activeTab, followedIds, watchedIds]);

  const curatedTraders = followedIds.length;
  const curatedMarkets = data?.filter(
    (post) => post.market && watchedIds.includes(post.market.id)
  ).length;

  const suggestedTraders = suggested?.filter(
    (trader) => !followedIds.includes(trader.id)
  );

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-text-primary">Social</h1>
          <p className="text-sm text-text-secondary">
            Follow traders, share takes and join the conversation.
          </p>
        </div>

        <div className="rounded-[16px] border border-border bg-surface p-4">
          <div className="flex items-start gap-3">
<Avatar
                size="md"
                initials={initials}
                alt={displayName}
              />
            <div className="min-w-0 flex-1 space-y-3">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="What are you thinking?"
                rows={3}
                className="w-full resize-none rounded-xl border border-border bg-background p-3 text-sm text-text-primary placeholder:text-text-muted focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/15"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-text-muted">
                  <button
                    aria-label="Attach market"
                    onClick={() =>
                      toast.info("Attach a market to your post", {
                        description: "Select a market to link.",
                      })
                    }
                    className="rounded-lg p-2 transition-colors hover:bg-background hover:text-text-primary"
                  >
                    <TrendingUp className="h-4 w-4" />
                  </button>
                  <button
                    aria-label="Attach image"
                    onClick={() => setAttachImage((v) => !v)}
                    className={cn(
                      "rounded-lg p-2 transition-colors hover:bg-background",
                      attachImage
                        ? "bg-primary-light text-primary"
                        : "hover:text-text-primary"
                    )}
                  >
                    <Image className="h-4 w-4" />
                  </button>
                  <button
                    aria-label="Add poll"
                    onClick={() => setAttachPoll((v) => !v)}
                    className={cn(
                      "rounded-lg p-2 transition-colors hover:bg-background",
                      attachPoll
                        ? "bg-primary-light text-primary"
                        : "hover:text-text-primary"
                    )}
                  >
                    <BarChart3 className="h-4 w-4" />
                  </button>
                  <button
                    aria-label="Add emoji"
                    onClick={() => setEmojiOpen((v) => !v)}
                    className="rounded-lg p-2 transition-colors hover:bg-background hover:text-text-primary"
                  >
                    <Smile className="h-4 w-4" />
                  </button>
                </div>
                <Button
                  size="sm"
                  disabled={!draft.trim() || createPost.isPending}
                  onClick={() => createPost.mutate()}
                  loading={createPost.isPending}
                >
                  Post
                </Button>
              </div>

              {emojiOpen && (
                <div className="flex items-center gap-1.5 rounded-[10px] border border-border bg-background p-2">
                  {EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => {
                        setDraft((d) => `${d}${emoji}`);
                        setEmojiOpen(false);
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-lg transition-colors hover:bg-surface"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}

              {attachImage && (
                <div className="flex items-center gap-2 rounded-[10px] border border-dashed border-border bg-background px-3 py-2 text-xs text-text-secondary">
                  <Image className="h-4 w-4 text-text-muted" />
                  An image will be attached to this post.
                  <button
                    type="button"
                    onClick={() => setAttachImage(false)}
                    className="ml-auto font-semibold text-primary hover:underline"
                  >
                    Remove
                  </button>
                </div>
              )}

              {attachPoll && (
                <div className="space-y-2 rounded-[12px] border border-border bg-background p-3">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-text-muted" />
                    <p className="text-sm font-semibold text-text-primary">
                      Add a poll
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setAttachPoll(false);
                        setPollQuestion("");
                        setPollOptions(["", ""]);
                      }}
                      className="ml-auto text-xs font-semibold text-primary hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                  <Input
                    value={pollQuestion}
                    onChange={(e) => setPollQuestion(e.target.value)}
                    placeholder="Poll question"
                    maxLength={120}
                  />
                  {pollOptions.map((option, i) => (
                    <Input
                      key={i}
                      value={option}
                      onChange={(e) =>
                        setPollOptions((prev) => {
                          const next: [string, string] = [...prev];
                          next[i] = e.target.value;
                          return next;
                        })
                      }
                      placeholder={`Option ${i + 1}`}
                      maxLength={60}
                    />
                  ))}
                  <p className="text-[11px] text-text-muted">
                    Two options required to attach the poll.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            {FEED_TABS.map((tab) => (
              <TabsTrigger key={tab} value={tab}>
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab} className="pt-4">
            {activeTab === "For You" ? (
              <p className="mb-4 flex items-center gap-1.5 text-xs text-text-muted">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                {curatedTraders > 0 || curatedMarkets
                  ? `Curated from ${curatedTraders} trader${
                      curatedTraders === 1 ? "" : "s"
                    } and ${curatedMarkets ?? 0} markets you follow.`
                  : "Follow traders and watch markets to sharpen your recommendations."}
              </p>
            ) : null}

            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-40 rounded-[16px]" />
                ))}
              </div>
            ) : isError ? (
              <ErrorState onRetry={() => refetch()} />
            ) : !feed || feed.length === 0 ? (
              activeTab === "Following" ? (
                <EmptyState
                  title="Nobody to show yet"
                  description="Follow traders to surface their posts here. Suggestions below are a great place to start."
                  actionLabel="Find traders"
                  onAction={() =>
                    document
                      .getElementById("suggested-traders")
                      ?.scrollIntoView({ behavior: "smooth", block: "center" })
                  }
                />
              ) : (
                <EmptyState
                  title="Nothing here yet"
                  description="Follow traders and communities to personalize your feed."
                />
              )
            ) : (
              <div className="space-y-4">
                {feed.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <aside className="space-y-5">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-[15px]">
              <Flame className="h-4 w-4 text-orange" />
              Trending Now
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {trending ? (
              <ol className="space-y-2.5">
                {trending.slice(0, 5).map((m, i) => (
                  <li key={m.id}>
                    <a
                      href={`/markets/${m.id}`}
                      className="flex items-center justify-between gap-2 rounded-[10px] px-2 py-1.5 transition-colors hover:bg-background"
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <span className="number-tight w-5 shrink-0 text-sm font-extrabold text-text-muted">
                          {i + 1}
                        </span>
                        <span className="line-clamp-1 text-sm font-medium text-text-primary">
                          {m.title}
                        </span>
                      </span>
                      <span className="number-tight shrink-0 font-bold text-success">
                        {m.probability}%
                      </span>
                    </a>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="space-y-2.5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 rounded-[10px]" />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card id="suggested-traders">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-[15px]">
              <UserPlus className="h-4 w-4 text-primary" />
              Suggested to Follow
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {suggestedTraders && suggestedTraders.length > 0 ? (
              <ul className="space-y-2">
                {suggestedTraders.map((trader) => (
                  <li
                    key={trader.id}
                    className="flex items-center gap-2 rounded-[12px] border border-border-light bg-background p-2.5"
                  >
                    <Link
                      href={`/users/${trader.id}`}
                      className="flex min-w-0 flex-1 items-center gap-2.5"
                    >
                      <Avatar
                        size="sm"
                        initials={trader.initials}
                        alt={trader.displayName}
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-text-primary">
                          {trader.displayName}
                        </p>
                        <p className="truncate text-xs text-text-muted">
                          @{trader.username}
                        </p>
                      </div>
                    </Link>
                    <FollowButton userId={trader.id} />
                  </li>
                ))}
              </ul>
            ) : suggested && suggested.length > 0 ? (
              <p className="px-2 py-3 text-center text-xs text-text-muted">
                You&rsquo;re following everyone recommended. Nice taste.
              </p>
            ) : (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 rounded-[12px]" />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}