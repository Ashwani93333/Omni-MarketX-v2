"use client";

import { Check, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFollowStore } from "@/store/follow-store";

export function FollowButton({
  userId,
  size = "sm",
  className,
}: {
  userId: string;
  size?: "sm" | "default";
  className?: string;
}) {
  const followedIds = useFollowStore((s) => s.followedIds);
  const toggle = useFollowStore((s) => s.toggle);
  const following = followedIds.includes(userId);

  return (
    <Button
      variant={following ? "secondary" : "primary"}
      size={size}
      onClick={() => toggle(userId)}
      aria-pressed={following}
      className={cn(following && "text-text-secondary", className)}
    >
      {following ? (
        <Check className="h-4 w-4" />
      ) : (
        <UserPlus className="h-4 w-4" />
      )}
      {following ? "Following" : "Follow"}
    </Button>
  );
}