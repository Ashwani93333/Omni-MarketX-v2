import { cn } from "@/lib/utils";

interface PlanBadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function PlanBadge({ children, className }: PlanBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-gradient-brand px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-white shadow-sm",
        className
      )}
    >
      {children}
    </span>
  );
}