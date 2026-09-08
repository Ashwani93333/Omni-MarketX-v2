import { cn } from "@/lib/utils";

export function ProgressBar({
  value,
  className,
  barClassName,
  tone = "primary",
}: {
  value: number;
  className?: string;
  barClassName?: string;
  tone?: "primary" | "success" | "orange" | "blue";
}) {
  const toneClass = {
    primary: "bg-primary",
    success: "bg-success",
    orange: "bg-orange",
    blue: "bg-blue",
  }[tone];

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-background",
        className
      )}
    >
      <div
        className={cn("h-full rounded-full transition-all duration-500", toneClass, barClassName)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}