import * as React from "react";

import { cn } from "@/lib/utils";

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md";
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, size = "md", type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-[10px] border border-border bg-surface text-text-secondary transition-all hover:border-border hover:bg-background hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50",
        size === "md" ? "h-10 w-10" : "h-8 w-8",
        className
      )}
      {...props}
    />
  )
);
IconButton.displayName = "IconButton";

export { IconButton };