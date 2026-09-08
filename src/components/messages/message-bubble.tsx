"use client";

import { format } from "date-fns";

import { cn } from "@/lib/utils";
import type { Message } from "@/types";

export function MessageBubble({ message, isMine }: { message: Message; isMine: boolean }) {
  return (
    <div className={cn("flex flex-col", isMine ? "items-end" : "items-start")}>
      <div
        className={cn(
          "max-w-[78%] rounded-[14px] px-3.5 py-2.5 text-[13px] leading-relaxed",
          isMine
            ? "rounded-br-[4px] bg-primary text-white"
            : "rounded-bl-[4px] border border-border bg-background text-text-primary"
        )}
      >
        {message.content}
      </div>
      <span className="mt-1 px-1 text-[10px] text-text-muted">
        {format(new Date(message.timestamp), "MMM d, HH:mm")}
      </span>
    </div>
  );
}