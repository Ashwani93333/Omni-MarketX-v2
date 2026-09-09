import { cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const inputVariants = cva(
  "w-full rounded-[10px] border border-border bg-surface px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      invalid: {
        true: "border-danger focus:border-danger focus:ring-danger/15",
      },
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(inputVariants({ invalid }), className)}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid, ...props }, ref) => (
    <textarea
      className={cn(inputVariants({ invalid }), "resize-none", className)}
      ref={ref}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

export function FieldLabel({
  children,
  htmlFor,
  className,
}: {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "mb-1.5 block text-sm font-medium text-text-primary",
        className
      )}
    >
      {children}
    </label>
  );
}

export function FieldError({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return (
    <p className="mt-1.5 text-xs font-medium text-danger" role="alert">
      {children}
    </p>
  );
}

export function InputHint({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return (
    <p className="mt-1.5 text-xs text-text-muted" id="input-hint">
      {children}
    </p>
  );
}

export { Input, Textarea, inputVariants };