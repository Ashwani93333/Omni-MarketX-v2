"use client";

import { Image as ImageIcon, Type, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import type { StoryItem } from "@/types";

interface StoryCreatorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (item: Omit<StoryItem, "id" | "createdAt" | "viewers">) => void;
}

const GRADIENT_PRESETS: [string, string][] = [
  ["#f21f68", "#ff6b35"],
  ["#6366f1", "#8b5cf6"],
  ["#10b981", "#059669"],
  ["#f59e0b", "#ef4444"],
  ["#0ea5e9", "#6366f1"],
  ["#ec4899", "#8b5cf6"],
];

type CreatorTab = "text" | "image";

export function StoryCreator({
  open,
  onOpenChange,
  onCreate,
}: StoryCreatorProps) {
  const [tab, setTab] = useState<CreatorTab>("text");
  const [textContent, setTextContent] = useState("");
  const [gradientIndex, setGradientIndex] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const gradient = GRADIENT_PRESETS[gradientIndex];

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    },
    []
  );

  const handleCreate = () => {
    if (tab === "text" && textContent.trim()) {
      onCreate({
        type: "text",
        content: textContent.trim(),
        gradientFrom: gradient[0],
        gradientTo: gradient[1],
      });
    } else if (tab === "image" && imagePreview) {
      onCreate({
        type: "image",
        imageUrl: imagePreview,
      });
    }
    resetAndClose();
  };

  const resetAndClose = () => {
    setTextContent("");
    setImagePreview(null);
    setTab("text");
    setGradientIndex(0);
    onOpenChange(false);
  };

  const canSubmit =
    (tab === "text" && textContent.trim().length > 0) ||
    (tab === "image" && imagePreview !== null);

  return (
    <Modal open={open} onOpenChange={resetAndClose}>
      <ModalContent className="max-w-[420px] p-0 overflow-hidden">
        <ModalHeader className="p-4 pb-0">
          <ModalTitle>Create Story</ModalTitle>
        </ModalHeader>

        {/* Tab switcher */}
        <div className="flex gap-1 px-4">
          <button
            type="button"
            onClick={() => setTab("text")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
              tab === "text"
                ? "bg-primary text-white"
                : "bg-background text-text-secondary hover:text-text-primary"
            )}
          >
            <Type className="h-3.5 w-3.5" />
            Text
          </button>
          <button
            type="button"
            onClick={() => setTab("image")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
              tab === "image"
                ? "bg-primary text-white"
                : "bg-background text-text-secondary hover:text-text-primary"
            )}
          >
            <ImageIcon className="h-3.5 w-3.5" />
            Image
          </button>
        </div>

        {/* Content area */}
        <div className="px-4 pt-3">
          {tab === "text" ? (
            <div className="space-y-3">
              <div
                className="flex min-h-[220px] items-center justify-center rounded-[12px] p-6"
                style={{
                  background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
                }}
              >
                {textContent ? (
                  <p className="text-center text-lg font-semibold leading-relaxed text-white drop-shadow-md">
                    {textContent}
                  </p>
                ) : (
                  <p className="text-center text-sm text-white/60">
                    Type something for your story...
                  </p>
                )}
              </div>
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="What's on your mind?"
                rows={2}
                maxLength={200}
                className="w-full resize-none rounded-xl border border-border bg-background p-3 text-sm text-text-primary placeholder:text-text-muted focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/15"
              />
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-muted">Gradient:</span>
                {GRADIENT_PRESETS.map((g, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setGradientIndex(i)}
                    className={cn(
                      "h-6 w-6 rounded-full border-2 transition-transform",
                      i === gradientIndex
                        ? "border-text-primary scale-110"
                        : "border-transparent"
                    )}
                    style={{
                      background: `linear-gradient(135deg, ${g[0]}, ${g[1]})`,
                    }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {imagePreview ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full rounded-[12px] object-cover max-h-[300px]"
                  />
                  <button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex min-h-[220px] w-full flex-col items-center justify-center gap-2 rounded-[12px] border-2 border-dashed border-border bg-background transition-colors hover:border-primary/40 hover:bg-primary-light/20"
                >
                  <ImageIcon className="h-10 w-10 text-text-muted" />
                  <p className="text-sm font-medium text-text-secondary">
                    Click to upload an image
                  </p>
                  <p className="text-xs text-text-muted">JPG, PNG up to 10MB</p>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-4 pb-4 pt-2">
          <Button variant="ghost" size="sm" onClick={resetAndClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={!canSubmit}
            onClick={handleCreate}
          >
            Share Story
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
}
