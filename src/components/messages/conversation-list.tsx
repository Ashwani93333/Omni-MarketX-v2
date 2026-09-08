"use client";

import { useState } from "react";

import { ConversationItem } from "@/components/messages/conversation-item";
import { SearchInput } from "@/components/ui/search-input";
import { Skeleton } from "@/components/ui/skeleton";
import type { Conversation } from "@/types";

export function ConversationList({
  conversations,
  selectedId,
  loading,
  onSelect,
}: {
  conversations: Conversation[];
  selectedId?: string;
  loading: boolean;
  onSelect: (id: string) => void;
}) {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? conversations.filter((c) =>
        `${c.participant.displayName} ${c.participant.username} ${c.lastMessage}`
          .toLowerCase()
          .includes(query.trim().toLowerCase())
      )
    : conversations;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-b border-border-light p-3">
        <SearchInput
          placeholder="Search conversations"
          aria-label="Search conversations"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onClear={() => setQuery("")}
        />
      </div>
      <div className="scrollbar-thin flex-1 overflow-y-auto">
        {loading ? (
          <div className="space-y-2 p-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-[64px] rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-text-secondary">
            No conversations found
          </p>
        ) : (
          filtered.map((c) => (
            <ConversationItem
              key={c.id}
              conversation={c}
              selected={c.id === selectedId}
              onClick={() => onSelect(c.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}