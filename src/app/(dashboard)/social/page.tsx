"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BarChart3, Flame, Image, Smile, TrendingUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PostCard } from "@/components/social/post-card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MOCK_CURRENT_USER } from "@/constants";
import { cn } from "@/lib/utils";
import { marketService } from "@/services/market.service";
import { socialService } from "@/services/domain.service";
import type { Post } from "@/types";

const FEED_TABS = ["For You", "Following", "Top", "Latest"] as const;

export default function SocialPage() {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState("");
  const [activeTab, setActiveTab] = useState<string>("For You");
  const [attachImage, setAttachImage] = useState(false);
  const [attachPoll, setAttachPoll] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState<[string, string]>(["", ""]);

  const EMOJIS = ["\u{1F600}", "\u{1F525}", "\u{1F44D}", "\u{1F680}", "\u{1F40D}", "\u{2764}\u{FE0F}"];

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["social-posts"],
    queryFn: socialService.getPosts,
  });

  const { data: trending } = useQuery({
    queryKey: ["trending-markets"],
    queryFn: marketService.getTrendingMarkets,
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

  const filteredPosts = data?.filter((post) => {
    if (activeTab === "Following") return false;
    if (activeTab === "Top") return (post.likes ?? 0) > 5;
    return true;
  });

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
              initials={MOCK_CURRENT_USER.initials}
              alt={MOCK_CURRENT_USER.displayName}
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
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-40 rounded-[16px]" />
                ))}
              </div>
            ) : isError ? (
              <ErrorState onRetry={() => refetch()} />
            ) : !filteredPosts || filteredPosts.length === 0 ? (
              <EmptyState
                title="Nothing here yet"
                description="Follow traders and communities to personalize your feed."
              />
            ) : (
              <div className="space-y-4">
                {filteredPosts.map((post) => (
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
      </aside>
    </div>
  );
}
