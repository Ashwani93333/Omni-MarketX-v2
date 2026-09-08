import { X } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

export interface SearchInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, value, onClear, onChange, ...props }, ref) => (
    <div className="relative">
      <svg
        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        ref={ref}
        value={value}
        onChange={onChange}
        className={cn(
          "h-10 w-full rounded-[10px] border border-border bg-surface pl-10 pr-9 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/15",
          className
        )}
        {...props}
      />
      {value ? (
        <button
          type="button"
          onClick={() => {
            onClear?.();
            onChange?.({
              target: { value: "" },
            } as React.ChangeEvent<HTMLInputElement>);
          }}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-text-muted transition-colors hover:bg-background hover:text-text-primary"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </div>
  )
);
SearchInput.displayName = "SearchInput";

export { SearchInput };