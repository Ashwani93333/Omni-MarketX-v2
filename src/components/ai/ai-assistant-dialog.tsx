"use client";

import { Send, Sparkles } from "lucide-react";
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
import { aiService } from "@/services/ai.service";
import type { AiMessage, Market } from "@/types";

const SUGGESTED_PROMPTS = [
  "Should I buy YES?",
  "Break down the risks",
  "Summarize the market",
  "What's driving this market?",
];

export function AiAssistantDialog({ market }: { market: Market }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [input, setInput] = useState("");
  const idRef = useRef(0);

  const nextId = (prefix: string) => `omx-${prefix}-${++idRef.current}`;

  const send = (prompt: string) => {
    const text = prompt.trim();
    if (!text) return;
    const userMsg: AiMessage = {
      id: nextId("user"),
      role: "user",
      content: text,
    };
    const next = [...messages, userMsg];
    const reply = aiService.getAssistantReply(market, text, next);
    setMessages([...next, reply]);
    setInput("");
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="gap-1.5"
      >
        <Sparkles className="h-4 w-4 text-primary" />
        Ask AI
      </Button>
      <Modal open={open} onOpenChange={setOpen}>
        <ModalContent className="flex max-h-[80vh] max-w-md flex-col gap-0 overflow-hidden p-0 sm:max-w-md">
          <ModalHeader className="border-b border-border px-5 py-4 pr-10">
            <ModalTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Ask the AI Assistant
            </ModalTitle>
            <ModalDescription className="line-clamp-1">
              {market.title}
            </ModalDescription>
          </ModalHeader>

          <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
            {messages.length === 0 ? (
              <div className="rounded-[10px] bg-background p-3 text-xs text-text-secondary">
                Ask questions about this market — pricing, risks, catalysts and
                the NO side. Try one of these:
              </div>
            ) : null}
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
            {messages.length === 0 ? (
              <div className="mb-3 flex flex-wrap gap-1.5">
                {SUGGESTED_PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => send(p)}
                    className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-[11px] font-semibold text-text-secondary transition-colors hover:border-primary/50 hover:text-primary"
                  >
                    {p}
                  </button>
                ))}
              </div>
            ) : null}
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about this market…"
                className="flex-1"
              />
              <Button
                type="submit"
                size="icon"
                aria-label="Send"
                disabled={!input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
}