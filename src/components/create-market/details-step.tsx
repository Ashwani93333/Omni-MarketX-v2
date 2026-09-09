"use client";

import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { useState, type KeyboardEvent } from "react";
import { toast } from "sonner";

import {
  Button,
  buttonVariants,
} from "@/components/ui/button";
import { FieldError, FieldLabel, Input, Textarea } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  MAX_DESCRIPTION_LENGTH,
  MAX_IMAGE_BYTES,
  MAX_TAGS,
  type CreateMarketDraft,
} from "./create-market.types";

const IMAGE_INPUT_ID = "create-market-cover";

export function DetailsStep({
  draft,
  errors,
  update,
}: {
  draft: CreateMarketDraft;
  errors: Record<string, string>;
  update: (patch: Partial<CreateMarketDraft>) => void;
}) {
  const [tagInput, setTagInput] = useState("");

  const addTag = () => {
    const tag = tagInput.trim().replace(/^#/, "").toLowerCase();
    if (!tag) return;
    if (draft.tags.includes(tag)) {
      toast.error("That tag already exists");
      return;
    }
    if (draft.tags.length >= MAX_TAGS) {
      toast.error(`You can add up to ${MAX_TAGS} tags`);
      return;
    }
    update({ tags: [...draft.tags, tag] });
    setTagInput("");
  };

  const removeTag = (tag: string) =>
    update({ tags: draft.tags.filter((t) => t !== tag) });

  const handleTagKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
    if (e.key === "Backspace" && !tagInput && draft.tags.length > 0) {
      removeTag(draft.tags[draft.tags.length - 1]);
    }
  };

  const onImageFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("That file is not an image");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      toast.error("Image must be under 1.5 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      update({ image: String(reader.result), imageName: file.name });
      toast.success("Image added");
    };
    reader.onerror = () => toast.error("Could not read that image");
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div>
        <FieldLabel htmlFor="market-description">Description</FieldLabel>
        <Textarea
          id="market-description"
          value={draft.description}
          maxLength={MAX_DESCRIPTION_LENGTH}
          rows={4}
          placeholder="Explain what this market is about, the key context, and what traders should know."
          onChange={(e) => update({ description: e.target.value })}
        />
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <FieldError>{errors.description}</FieldError>
          <span
            className={cn(
              "number-tight ml-auto text-[11px] font-medium text-text-muted",
              draft.description.length >= MAX_DESCRIPTION_LENGTH - 20 && "text-orange"
            )}
          >
            {draft.description.length}/{MAX_DESCRIPTION_LENGTH}
          </span>
        </div>
      </div>

      <div>
        <FieldLabel>Cover image</FieldLabel>
        {draft.image ? (
          <div className="mt-2 space-y-2">
            <div className="relative h-44 w-full overflow-hidden rounded-[14px] border border-border">
              <Image
                src={draft.image}
                alt=""
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <label
                htmlFor={IMAGE_INPUT_ID}
                className={buttonVariants({ variant: "secondary", size: "sm" })}
              >
                Replace image
              </label>
              <Button
                variant="destructive"
                size="sm"
                onClick={() =>
                  update({ image: undefined, imageName: undefined })
                }
              >
                Remove image
              </Button>
            </div>
          </div>
        ) : (
          <label
            htmlFor={IMAGE_INPUT_ID}
            className="mt-2 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[14px] border border-dashed border-border bg-background px-4 py-8 text-center transition-colors hover:border-primary/50 hover:bg-surface"
          >
            <ImagePlus className="h-6 w-6 text-text-muted" />
            <span className="text-sm font-semibold text-text-secondary">
              Upload a cover image
            </span>
            <span className="text-xs text-text-muted">
              PNG or JPG, up to 1.5 MB
            </span>
          </label>
        )}
        <input
          id={IMAGE_INPUT_ID}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => {
            onImageFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>

      <div>
        <FieldLabel>Tags</FieldLabel>
        {draft.tags.length > 0 ? (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {draft.tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => removeTag(tag)}
                aria-label={`Remove tag ${tag}`}
                className="group inline-flex items-center gap-1 rounded-full bg-primary-light px-2.5 py-1 text-xs font-bold text-primary transition-colors hover:bg-danger-light hover:text-danger"
              >
                #{tag}
                <X className="h-3 w-3" />
              </button>
            ))}
          </div>
        ) : null}
        <div className="flex max-w-md gap-2">
          <div className="flex-1">
            <Input
              value={tagInput}
              maxLength={20}
              placeholder="Add a tag and press Enter"
              aria-label="Add a tag"
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKey}
            />
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={addTag}
            disabled={!tagInput.trim()}
          >
            Add
          </Button>
        </div>
        <p className="mt-1.5 text-xs text-text-muted">
          {draft.tags.length}/{MAX_TAGS} tags — 3 or more boosts your market
          score
        </p>
      </div>
    </div>
  );
}