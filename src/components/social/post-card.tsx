"use client";

import { MessageCircle, Repeat2, ThumbsUp } from "lucide-react";
import { useState } from "react";

import { MarketCategoryChip } from "@/components/market/market-probability";
import { Avatar } from "@/components/ui/avatar";
import { ProgressBar } from "@/components/ui/progress-bar";
import { cn } from "@/lib/utils";
import type { Poll, Post } from "@/types";

export function PostCard({ post }: { post: Post }) {
  const [likes, setLikes] = useState(post.likes);
  const [liked, setLiked] = useState(post.liked);
  const [comments, setComments] = useState(post.comments);
  const [commenting, setCommenting] = useState(false);
  const [comment, setComment] = useState("");
  const [shares, setShares] = useState(post.shares);
  const [reposted, setReposted] = useState(false);

  const toggleLike = () => {
    setLikes((l) => (liked ? l - 1 : l + 1));
    setLiked((v) => !v);
  };

  const toggleRepost = () => {
    setShares((s) => (reposted ? s - 1 : s + 1));
    setReposted((v) => !v);
  };

  const submitComment = () => {
    if (!comment.trim()) return;
    setComments((c) => c + 1);
    setComment("");
    setCommenting(false);
  };

  return (
    <article className="rounded-[16px] border border-border bg-surface p-5">
      <div className="flex items-start gap-3">
        <Avatar
          size="md"
          src={post.user.avatarUrl}
          initials={post.user.initials}
          alt={post.user.displayName}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-text-primary">
              {post.user.displayName}
            </p>
            <span className="text-xs text-text-muted">
              @{post.user.username} · {post.time}
            </span>
          </div>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-text-primary">
            {post.content}
          </p>
        </div>
      </div>

      {post.market ? (
        <a
          href={`/markets/${post.market.id}`}
          className="mt-4 flex flex-col gap-3 rounded-[12px] border border-border bg-background p-4 transition-colors hover:border-primary/40"
        >
          <div className="flex items-center gap-2">
            <MarketCategoryChip category={post.market.category} />
            <span className="text-xs text-text-muted">
              {post.market.traderCount.toLocaleString()} traders
            </span>
          </div>
          <p className="line-clamp-1 text-sm font-semibold text-text-primary">
            {post.market.title}
          </p>
          <div className="flex items-center justify-between gap-3">
            <ProgressBar
              value={post.market.probability}
              tone="success"
              className="flex-1"
            />
            <span className="number-tight shrink-0 text-sm font-bold text-success">
              {post.market.probability}%
            </span>
          </div>
        </a>
      ) : null}

      {post.poll ? <PostPoll poll={post.poll} /> : null}

      <div className="mt-4 flex items-center gap-1 border-t border-border-light pt-3">
        <button
          onClick={toggleLike}
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors",
            liked
              ? "text-primary"
              : "text-text-muted hover:bg-background hover:text-text-primary"
          )}
        >
          <ThumbsUp
            className="h-4 w-4"
            fill={liked ? "currentColor" : "none"}
          />
          {likes.toLocaleString()}
        </button>
        <button
          onClick={() => setCommenting((v) => !v)}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-text-muted transition-colors hover:bg-background hover:text-text-primary"
        >
          <MessageCircle className="h-4 w-4" />
          {comments}
        </button>
        <button
          onClick={toggleRepost}
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors",
            reposted
              ? "text-success"
              : "text-text-muted hover:bg-background hover:text-text-primary"
          )}
        >
          <Repeat2 className="h-4 w-4" />
          {shares}
        </button>
      </div>

      {commenting && (
        <div className="mt-3 flex items-center gap-2">
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submitComment();
            }}
            placeholder="Write a comment\u2026"
            autoFocus
            className="h-9 flex-1 rounded-lg border border-border bg-background px-3 text-sm text-text-primary placeholder:text-text-muted focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/15"
          />
          <button
            onClick={submitComment}
            disabled={!comment.trim()}
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 hover:bg-primary/90"
          >
            Reply
          </button>
        </div>
      )}
    </article>
  );
}

function PostPoll({ poll }: { poll: Poll }) {
  const [pollVotes, setPollVotes] = useState<number[] | null>(null);
  const total = pollVotes?.reduce((s, v) => s + v, 0) ?? poll.totalVotes;

  return (
    <div className="mt-4 rounded-[12px] border border-border bg-background p-4">
      <p className="text-sm font-bold text-text-primary">{poll.question}</p>
      <div className="mt-3 space-y-2">
        {poll.options.map((option, i) => {
          const votes = pollVotes?.[i] ?? option.votes;
          const pct = Math.round((votes / total) * 100);
          return (
            <button
              key={option.label}
              onClick={() => {
                if (pollVotes) return;
                const next = poll.options.map((_, idx) =>
                  idx === i ? option.votes + 1 : option.votes
                );
                setPollVotes(next);
              }}
              disabled={Boolean(pollVotes)}
              className="group relative w-full overflow-hidden rounded-[10px] bg-surface px-3 py-2.5 text-left ring-1 ring-border transition-colors disabled:cursor-default"
            >
              <span
                className={cn(
                  "absolute inset-y-0 left-0 rounded-[10px] transition-all duration-500",
                  i === 0 ? "bg-success-light" : "bg-primary-light"
                )}
                style={{ width: `${pct}%` }}
              />
              <span className="relative flex items-center justify-between gap-2 text-sm">
                <span className="font-semibold text-text-primary">
                  {option.label}
                </span>
                <span className="number-tight font-bold text-text-secondary">
                  {pct}%
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}