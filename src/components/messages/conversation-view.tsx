"use client";

import { ArrowLeft, MoreVertical } from "lucide-react";
import { useEffect, useRef } from "react";

import { MessageBubble } from "@/components/messages/message-bubble";
import { MessageComposer } from "@/components/messages/message-composer";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Conversation, Message } from "@/types";

const CONVERSATION_TYPE_LABEL: Record<string, string> = {
  MESSAGE: "Private message",
  STORY_REACTION: "Story reaction",
  SYSTEM: "System",
};

export function ConversationView({
  conversation,
  messages,
  onSend,
  onBack,
  className,
}: {
  conversation: Conversation;
  messages: Message[];
  onSend: (content: string) => void;
  onBack: () => void;
  className?: string;
}) {
  const endRef = useRef<HTMLDivElement | null>(null);
  const { participant } = conversation;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", className)}>
      <div className="flex items-center gap-3 border-b border-border-light px-4 py-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to conversations"
          className="rounded-lg p-1.5 text-text-secondary transition-colors hover:bg-background hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:hidden"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <Avatar
          size="md"
          initials={participant.initials}
          alt={participant.displayName}
        />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-bold text-text-primary">
            {participant.displayName}
          </span>
          <span className="block text-[11px] text-text-muted">
            {CONVERSATION_TYPE_LABEL[conversation.type ?? "MESSAGE"] ?? "Message"}
          </span>
        </span>
        <button
          type="button"
          aria-label="More options"
          className="rounded-lg p-1.5 text-text-secondary transition-colors hover:bg-background hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>

      <div className="scrollbar-thin flex-1 space-y-4 overflow-y-auto bg-background/40 px-4 py-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <Avatar size="lg" initials={participant.initials} alt={participant.displayName} />
            <p className="text-sm font-semibold text-text-primary">
              Say hi to {participant.displayName}
            </p>
            <p className="max-w-xs text-xs text-text-secondary">
              This is the start of your conversation. Send the first message.
            </p>
          </div>
        ) : (
          messages.map((m) => (
            <MessageBubble
              key={m.id}
              message={m}
              isMine={m.senderId === "user-me"}
            />
          ))
        )}
        <div ref={endRef} />
      </div>

      <MessageComposer onSend={onSend} />
    </div>
  );
}