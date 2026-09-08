"use client";

import { Send } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input, FieldLabel } from "@/components/ui/input";

export function MessageComposer({
  onSend,
  ariaLabel,
}: {
  onSend: (content: string) => void;
  ariaLabel?: string;
}) {
  const [draft, setDraft] = useState("");

  const submit = () => {
    const content = draft.trim();
    if (!content) return;
    onSend(content);
    setDraft("");
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="flex items-center gap-2 border-t border-border-light p-3"
    >
      <div className="min-w-0 flex-1">
        <FieldLabel htmlFor="message-composer" className="sr-only">
          Write a message
        </FieldLabel>
        <Input
          id="message-composer"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={ariaLabel ?? "Write a message…"}
          autoComplete="off"
          aria-label={ariaLabel ?? "Write a message"}
        />
      </div>
      <Button
        type="submit"
        size="icon"
        aria-label="Send message"
        disabled={!draft.trim()}
        title="Send"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}