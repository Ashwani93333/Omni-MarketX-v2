import { cn } from "@/lib/utils";

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
}: {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex h-9 items-center gap-1 rounded-[10px] bg-background p-1",
        className
      )}
    >
      {options.map((option) => (
        <button
          key={option}
          role="tab"
          aria-selected={value === option}
          onClick={() => onChange(option)}
          className={cn(
            "rounded-lg px-3 py-1.5 text-xs font-semibold text-text-secondary transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            value === option &&
              "bg-surface text-text-primary shadow-[var(--shadow-sm)]",
            value !== option && "hover:text-text-primary"
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}