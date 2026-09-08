"use client";

import { MessageCircle, Send, X } from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import type { AiMessage } from "@/types";

const GREETING: AiMessage = {
  id: "support-greeting",
  role: "assistant",
  content:
    "Hi! I'm the OmniMarketX support assistant. Ask about markets, trading, or your account.",
};

export function SupportChatButton() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<AiMessage[]>([GREETING]);
  const [draft, setDraft] = useState("");
  const idRef = useRef(0);

  const send = () => {
    const content = draft.trim();
    if (!content) return;
    const userMessage: AiMessage = {
      id: `support-user-${++idRef.current}`,
      role: "user",
      content,
    };
    setMessages((prev) => [...prev, userMessage]);
    setDraft("");
    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `support-reply-${++idRef.current}`,
          role: "assistant",
          content:
            "Thanks for your message! A support member will follow up shortly. Meanwhile, you can check Settings or the FAQ for answers.",
        },
      ]);
    }, 700);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open support chat"
        title="Support"
        className="fixed bottom-20 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-[var(--shadow-md)] transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 md:bottom-6 md:right-6"
      >
        <MessageCircle className="h-5 w-5" />
      </button>

      <Modal open={open} onOpenChange={setOpen}>
        <ModalContent className="flex max-h-[76vh] max-w-sm flex-col gap-0 overflow-hidden p-0">
          <ModalHeader className="border-b border-border px-5 py-4 pr-10">
            <ModalTitle className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-primary" />
              Customer Support
            </ModalTitle>
            <ModalDescription>Typically replies in a few minutes.</ModalDescription>
          </ModalHeader>

          <div className="scrollbar-thin flex-1 space-y-3 overflow-y-auto px-5 py-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "max-w-[85%] rounded-[10px] px-3.5 py-2.5 text-[13px] leading-relaxed",
                  m.role === "user"
                    ? "ml-auto bg-primary text-white"
                    : "border border-border bg-background text-text-primary"
                )}
              >
                {m.content}
              </div>
            ))}
          </div>

          <div className="border-t border-border p-3">
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
            >
              <Input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Write a message…"
                aria-label="Support message"
                className="flex-1"
              />
              <Button
                type="submit"
                size="icon"
                aria-label="Send"
                disabled={!draft.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close support chat"
            className="absolute right-4 top-4 rounded-lg p-1 text-text-muted transition-colors hover:bg-background hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <X className="h-4 w-4" />
          </button>
        </ModalContent>
      </Modal>
    </>
  );
}