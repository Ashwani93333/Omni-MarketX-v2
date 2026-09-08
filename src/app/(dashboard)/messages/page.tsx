"use client";

import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

import { PageHeader } from "@/components/layout/page-header";
import { ConversationList } from "@/components/messages/conversation-list";
import { ConversationView } from "@/components/messages/conversation-view";
import { FeedbackTab } from "@/components/support/feedback-tab";
import { SupportChatButton } from "@/components/support/support-chat-button";
import { ErrorState } from "@/components/ui/error-state";
import { cn } from "@/lib/utils";
import { useMessagesStore } from "@/store/messages-store";

export default function MessagesPage() {
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  const conversations = useMessagesStore((s) => s.conversations);
  const messagesByConversation = useMessagesStore(
    (s) => s.messagesByConversation
  );
  const loading = useMessagesStore((s) => s.loading);
  const error = useMessagesStore((s) => s.error);
  const load = useMessagesStore((s) => s.load);
  const markConversationRead = useMessagesStore((s) => s.markConversationRead);
  const sendMessage = useMessagesStore((s) => s.sendMessage);

  useEffect(() => {
    void load();
  }, [load]);

  const selected = conversations.find((c) => c.id === selectedId);

  const selectConversation = (id: string) => {
    markConversationRead(id);
    setSelectedId(id);
  };

  const send = (content: string) => {
    if (!selectedId) return;
    sendMessage(selectedId, content);
  };

  return (
    <>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Inbox"
          title="Messages"
          description="Keep in touch with the traders you follow."
        />

        {error && conversations.length === 0 ? (
          <ErrorState onRetry={() => void load()} />
        ) : (
          <div className="grid gap-0 overflow-hidden rounded-[16px] border border-border bg-surface shadow-[var(--shadow-sm)] md:grid-cols-[340px_1fr]">
            <div
              className={cn(
                "min-h-[60dvh] flex-col border-border-light md:flex md:h-[70dvh] md:border-r",
                selected ? "hidden" : "flex"
              )}
            >
              <div className="border-b border-border px-4 py-3">
                <p className="text-sm font-bold text-text-primary">Messages</p>
                <p className="mt-0.5 text-[11px] text-text-muted">
                  {loading
                    ? "Loading conversations…"
                    : `${conversations.length} conversation${
                        conversations.length === 1 ? "" : "s"
                      }`}
                </p>
              </div>
              <ConversationList
                conversations={conversations}
                selectedId={selectedId}
                loading={loading}
                onSelect={selectConversation}
              />
            </div>

            <div
              className={cn(
                "min-h-[60dvh] flex-col md:flex md:h-[70dvh]",
                selected ? "flex" : "hidden"
              )}
            >
              {selected ? (
                <ConversationView
                  key={selected.id}
                  conversation={selected}
                  messages={messagesByConversation[selected.id] ?? []}
                  onSend={send}
                  onBack={() => setSelectedId(undefined)}
                />
              ) : (
                <div className="flex h-full min-h-[60dvh] flex-col items-center justify-center gap-4 px-6 py-12 text-center md:min-h-[70dvh]">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-light/60 text-primary">
                    <MessageCircle className="h-8 w-8" />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-base font-bold text-text-primary">
                      Select a conversation
                    </h2>
                    <p className="mx-auto max-w-sm text-sm text-text-secondary">
                      Choose a conversation from the list or start a new one from
                      someone&apos;s profile.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <FeedbackTab />
      <SupportChatButton />
    </>
  );
}