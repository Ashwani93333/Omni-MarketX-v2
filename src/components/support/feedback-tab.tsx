"use client";

import { MessageSquareText } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { Textarea, FieldLabel } from "@/components/ui/input";

const FEEDBACK_TYPES = ["Bug", "Idea", "Improvement", "Other"] as const;

export function FeedbackTab() {
  const [open, setOpen] = useState(false);
  const [feedbackType, setFeedbackType] =
    useState<(typeof FEEDBACK_TYPES)[number]>("Idea");
  const [message, setMessage] = useState("");

  const submit = () => {
    if (!message.trim()) {
      toast.error("Please describe your feedback first");
      return;
    }
    toast.success("Thanks for the feedback!", {
      description: `Reported as "${feedbackType}". Our team will review it.`,
    });
    setMessage("");
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open feedback form"
        title="Feedback"
        className="fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 items-center gap-1.5 rounded-l-[12px] border border-r-0 border-border bg-surface px-2.5 py-2 text-xs font-bold uppercase tracking-wider text-text-secondary shadow-[var(--shadow-sm)] transition-colors hover:bg-primary-light hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:flex [writing-mode:vertical-rl]"
      >
        <MessageSquareText className="h-4 w-4" />
        Feedback
      </button>

      <Modal open={open} onOpenChange={setOpen}>
        <ModalContent className="max-w-md">
          <ModalHeader>
            <ModalTitle>Send feedback</ModalTitle>
            <ModalDescription>
              Help us improve OmniMarketX. Reports stay private.
            </ModalDescription>
          </ModalHeader>
          <div className="space-y-4">
            <Card>
              <CardHeader className="p-4 pb-1">
                <CardTitle className="text-sm">Type</CardTitle>
                <CardDescription className="text-xs">
                  What kind of feedback is this?
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-1.5 p-4">
                {FEEDBACK_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFeedbackType(t)}
                    aria-pressed={feedbackType === t}
                    className={
                      feedbackType === t
                        ? "rounded-full border border-primary/30 bg-primary-light px-3 py-1 text-xs font-semibold text-primary"
                        : "rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-text-secondary transition-colors hover:border-primary/40 hover:text-primary"
                    }
                  >
                    {t}
                  </button>
                ))}
              </CardContent>
            </Card>
            <div>
              <FieldLabel htmlFor="feedback-message">Your message</FieldLabel>
              <Textarea
                id="feedback-message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what happened or what you'd love to see…"
              />
            </div>
          </div>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submit} disabled={!message.trim()}>
              Submit feedback
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}