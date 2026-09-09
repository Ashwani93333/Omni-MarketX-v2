"use client";

import { Plus } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Story, User } from "@/types";

interface StoryBubblesProps {
  stories: Story[];
  currentUser: User;
  onAddStory: () => void;
  onViewStory: (story: Story) => void;
}

export function StoryBubbles({
  stories,
  currentUser,
  onAddStory,
  onViewStory,
}: StoryBubblesProps) {
  const meStory = stories.find((s) => s.user.id === currentUser.id);
  const hasMyStory = !!meStory && meStory.hasStory && meStory.items.length > 0;
  const otherStories = stories.filter((s) => s.user.id !== currentUser.id);

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
      <button
        type="button"
        onClick={() => (hasMyStory ? onViewStory(meStory) : onAddStory())}
        className="flex shrink-0 flex-col items-center gap-1.5"
      >
        <span
          className={cn(
            "relative block rounded-full p-[2px]",
            hasMyStory
              ? "bg-gradient-to-br from-primary via-purple-500 to-orange"
              : "bg-border"
          )}
        >
          <span className="block rounded-full bg-surface p-[2px]">
            <Avatar
              size="lg"
              initials={currentUser.initials}
              src={currentUser.avatarUrl}
              alt={currentUser.displayName}
            />
          </span>
          <span
            aria-hidden="true"
            className={cn(
              "absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-surface text-white",
              hasMyStory ? "bg-success" : "bg-primary"
            )}
          >
            <Plus className="h-3 w-3" />
          </span>
        </span>
        <span className="max-w-[64px] truncate text-[11px] font-medium text-text-secondary">
          Your Story
        </span>
      </button>

      {otherStories.map((story) => {
        const hasContent = story.hasStory && story.items.length > 0;
        return (
          <button
            key={story.id}
            type="button"
            onClick={() => hasContent && onViewStory(story)}
            disabled={!hasContent}
            className={cn(
              "flex shrink-0 flex-col items-center gap-1.5",
              !hasContent && "cursor-default opacity-40"
            )}
          >
            <span
              className={cn(
                "rounded-full p-[2px]",
                hasContent && !story.seen
                  ? "bg-gradient-to-br from-primary via-purple-500 to-orange"
                  : hasContent
                    ? "bg-text-muted"
                    : "bg-border"
              )}
            >
              <span className="block rounded-full bg-surface p-[2px]">
                <Avatar
                  size="lg"
                  initials={story.user.initials}
                  src={story.user.avatarUrl}
                  alt={story.user.displayName}
                />
              </span>
            </span>
            <span className="max-w-[64px] truncate text-[11px] font-medium text-text-secondary">
              {story.user.displayName.split(" ")[0]}
            </span>
          </button>
        );
      })}
    </div>
  );
}