import {
  Award,
  Bell,
  LineChart,
  MessageCircle,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { ActivityPost } from "@/types";

const typeIcon = {
  trade: TrendingUp,
  market: LineChart,
  social: MessageCircle,
  alert: Bell,
  achievement: Award,
};

export function ActivityItem({ post }: { post: ActivityPost }) {
  const Icon = typeIcon[post.type];

  return (
    <div className="flex items-start gap-3 rounded-[12px] p-2.5 transition-colors hover:bg-background">
      <Avatar
        size="sm"
        src={post.user.avatarUrl}
        initials={post.user.initials}
        alt={post.user.displayName}
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-relaxed text-text-secondary">
          <Link
            href={`/users/${post.user.id}`}
            className="font-semibold text-text-primary transition-colors hover:text-primary"
          >
            {post.user.displayName}
          </Link>{" "}
          {post.action}{" "}
          {post.market ? (
            post.marketId ? (
              <a
                href={`/markets/${post.marketId}`}
                className="font-medium text-text-primary hover:text-primary"
              >
                {post.market}
              </a>
            ) : (
              <span className="font-medium text-text-primary">{post.market}</span>
            )
          ) : null}
        </p>
        <p className="mt-0.5 text-xs text-text-muted">{post.time}</p>
      </div>
      <span
        className={cn(
          "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[10px]",
          post.type === "trade" && "bg-success-light text-success",
          post.type === "market" && "bg-primary-light text-primary",
          post.type === "social" && "bg-blue/10 text-blue",
          post.type === "alert" && "bg-orange-light text-orange",
          post.type === "achievement" && "bg-purple/10 text-purple"
        )}
      >
        <Icon className="h-3.5 w-3.5" />
      </span>
    </div>
  );
}