"use client";

import { Bot, Send, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { AiMessage } from "@/types";

const GREETING: AiMessage = {
  id: "ai-greeting",
  role: "assistant",
  content:
    "Hi! I'm the OmniMarketX AI assistant. Ask me anything about prediction markets, trading, or how the platform works.",
};

const SUGGESTED_PROMPTS = [
  "How do prediction markets work?",
  "What can I trade here?",
  "How do I create a market?",
  "Explain YES/NO shares",
  "What are the fees?",
];

const REPLY_MAP: { pattern: RegExp; reply: string }[] = [
  {
    pattern: /\b(predict|prediction|how.*work|what.*market)\b/i,
    reply:
      "Prediction markets let you trade on the outcome of real-world events. You buy YES or NO shares — if you're right, shares pay out $1; if wrong, they're worth $0. Prices reflect the crowd's probability estimate.",
  },
  {
    pattern: /\b(trade|trading|buy|sell|what.*trade)\b/i,
    reply:
      "You can trade across categories like Crypto, Politics, Sports, Economy, Entertainment, and Tech. Each market has YES and NO shares — buy the side you think will win.",
  },
  {
    pattern: /\b(create|make|new.*market)\b/i,
    reply:
      "To create a market, go to Create Market from the sidebar or header. You'll set the question, resolution source, end date, and liquidity. Anyone can become a market creator!",
  },
  {
    pattern: /\b(yes|no|share|shares)\b/i,
    reply:
      "YES and NO shares represent the two possible outcomes. YES shares pay $1 if the event happens, NO shares pay $1 if it doesn't. The current price is the market's implied probability.",
  },
  {
    pattern: /\b(fee|fees|cost|charge|price)\b/i,
    reply:
      "OmniMarketX charges a small fee on winning trades. There are no fees for depositing or creating markets. Check the Fees & Limits page for full details.",
  },
  {
    pattern: /\b(risk|safe|security|secure)\b/i,
    reply:
      "All funds are held securely. Markets are transparent and verifiable on-chain. Never risk more than you can afford to lose — prediction markets carry real financial risk.",
  },
  {
    pattern: /\b(portfolio|balance|wallet|account)\b/i,
    reply:
      "Your portfolio tracks all your open positions, balances, and P&L. Visit the Wallet page to see your demo funds, or the Portfolio page for a full breakdown.",
  },
  {
    pattern: /\b(hello|hi|hey|help|what.*do)\b/i,
    reply:
      "Hey! I can help with how prediction markets work, trading basics, creating markets, fees, and platform features. What would you like to know?",
  },
  {
    pattern: /\b(thank|thanks|appreciate)\b/i,
    reply:
      "You're welcome! Let me know if you have any other questions about OmniMarketX.",
  },
];

const DEFAULT_REPLY =
  "Great question! I'm a demo assistant, but I can help with prediction market basics, trading, creating markets, and platform features. Try one of the suggested prompts below!";

function getReply(_input: string): string {
  const lower = _input.toLowerCase();
  for (const { pattern, reply } of REPLY_MAP) {
    if (pattern.test(lower)) return reply;
  }
  return DEFAULT_REPLY;
}

export function AiChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<AiMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const idRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const send = (text: string) => {
    const content = text.trim();
    if (!content) return;
    const userMsg: AiMessage = {
      id: `ai-user-${++idRef.current}`,
      role: "user",
      content,
    };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");

    setTimeout(() => {
      const reply: AiMessage = {
        id: `ai-reply-${++idRef.current}`,
        role: "assistant",
        content: getReply(content),
      };
      setMessages((prev) => [...prev, reply]);
    }, 500);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open AI chatbot"
        title="AI Assistant"
        className="fixed bottom-20 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-brand text-white shadow-[var(--shadow-glow)] transition-shadow hover:shadow-[0_0_20px_rgba(242,31,104,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 md:bottom-6 md:right-6"
      >
        <Bot className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-36 right-4 z-50 flex w-[340px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-[16px] border border-border bg-surface shadow-[var(--shadow-lg)] md:bottom-20 md:right-6"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-brand text-white">
                  <Sparkles className="h-3.5 w-3.5" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary">
                    AI Assistant
                  </h3>
                  <p className="text-[11px] text-text-muted">
                    Ask anything about OmniMarketX
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close AI chat"
                className="rounded-lg p-1 text-text-muted transition-colors hover:bg-background hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div
              ref={scrollRef}
              className="scrollbar-thin flex-1 space-y-3 overflow-y-auto px-4 py-4"
              style={{ maxHeight: "360px" }}
            >
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
              {messages.length <= 1 ? (
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
                  placeholder="Ask a question…"
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
