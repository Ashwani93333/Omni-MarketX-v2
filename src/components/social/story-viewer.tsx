"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Eye } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Story, StoryItem } from "@/types";

interface StoryViewerProps {
  story: Story;
  onClose: () => void;
  onSeen: (storyId: string) => void;
}

const STORY_DURATION = 5000;

function formatTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function StoryViewer({ story, onClose, onSeen }: StoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);

  const items = story.items;
  const current: StoryItem | undefined = items[currentIndex];

  const goNext = useCallback(() => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex((i) => i + 1);
      setProgress(0);
    } else {
      onSeen(story.id);
      onClose();
    }
  }, [currentIndex, items.length, story.id, onSeen, onClose]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setProgress(0);
    }
  }, [currentIndex]);

  useEffect(() => {
    setProgress(0);
  }, [currentIndex]);

  useEffect(() => {
    if (paused || !current) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          goNext();
          return 0;
        }
        return p + 100 / (STORY_DURATION / 50);
      });
    }, 50);
    return () => clearInterval(interval);
  }, [paused, current, goNext]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goNext();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev, onClose]);

  if (!current) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90"
      >
        <div
          className="relative flex h-full w-full max-w-[420px] flex-col overflow-hidden rounded-none bg-black sm:rounded-[20px] sm:h-[85vh]"
          onMouseDown={() => setPaused(true)}
          onMouseUp={() => setPaused(false)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
        >
          {/* Progress bars */}
          <div className="absolute left-0 right-0 top-0 z-20 flex gap-1 px-3 pt-3">
            {items.map((item, i) => (
              <div
                key={item.id}
                className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/30"
              >
                <div
                  className="h-full bg-white transition-none"
                  style={{
                    width:
                      i < currentIndex
                        ? "100%"
                        : i === currentIndex
                          ? `${progress}%`
                          : "0%",
                  }}
                />
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="absolute left-0 right-0 top-4 z-20 flex items-center gap-3 px-4 pt-2">
            <Avatar
              size="sm"
              initials={story.user.initials}
              src={story.user.avatarUrl}
              alt={story.user.displayName}
            />
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {story.user.displayName}
              </p>
              <p className="text-xs text-white/60">
                {formatTime(current.createdAt)}
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSeen(story.id);
                onClose();
              }}
              className="rounded-full p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="relative flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0"
              >
                {current.type === "image" && current.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={current.imageUrl}
                    alt="Story"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div
                    className="flex h-full items-center justify-center p-8"
                    style={{
                      background: `linear-gradient(135deg, ${current.gradientFrom ?? "#f21f68"}, ${current.gradientTo ?? "#ff6b35"})`,
                    }}
                  >
                    <p className="text-center text-xl font-semibold leading-relaxed text-white drop-shadow-md">
                      {current.content}
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Tap zones */}
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-0 top-0 z-10 h-full w-1/3"
              aria-label="Previous story"
            />
            <button
              type="button"
              onClick={goNext}
              className="absolute right-0 top-0 z-10 h-full w-1/3"
              aria-label="Next story"
            />
          </div>

          {/* Nav arrows (desktop) */}
          {currentIndex > 0 && (
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-2 top-1/2 z-30 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white/80 transition-colors hover:bg-black/60 hover:text-white hidden sm:block"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          {currentIndex < items.length - 1 && (
            <button
              type="button"
              onClick={goNext}
              className="absolute right-2 top-1/2 z-30 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white/80 transition-colors hover:bg-black/60 hover:text-white hidden sm:block"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}

          {/* Viewers count */}
          <div className="absolute bottom-4 left-0 right-0 z-20 flex items-center justify-center gap-1.5 text-white/50">
            <Eye className="h-3.5 w-3.5" />
            <span className="text-xs">{current.viewers.length} views</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
