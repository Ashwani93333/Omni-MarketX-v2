"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { AuthCard } from "@/components/auth/auth-card";
import { PasswordStrength } from "@/components/auth/password-strength";
import { Button } from "@/components/ui/button";
import { FieldError, FieldLabel, Input } from "@/components/ui/input";

const resetSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Za-z]/, "Include at least one letter")
    .regex(/[0-9]/, "Include at least one number"),
});

type ResetForm = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
    mode: "onBlur",
    defaultValues: { password: "" },
  });

  const password = watch("password");

  const onSubmit = async (values: ResetForm) => {
    try {
      void values;
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Password updated", {
        description: "You can now sign in with your new password.",
      });
    } catch {
      toast.error("Something went wrong", {
        description: "Please try again.",
      });
    }
  };

  return (
    <AuthCard title="Create a new password" subtitle="Choose a strong password you haven't used before." social={false}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <FieldLabel htmlFor="password">New password</FieldLabel>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            invalid={Boolean(errors.password)}
            {...register("password")}
          />
          <PasswordStrength password={password ?? ""} />
          <FieldError>{errors.password?.message}</FieldError>
        </div>

        {!isSubmitting && password && !errors.password ? (
          <p className="flex items-center gap-2 rounded-[12px] bg-success-light px-3.5 py-2.5 text-xs font-semibold text-success">
            <CheckCircle2 className="h-4 w-4" />
            Looks good — you{"'"}re ready for a fresh start.
          </p>
        ) : null}

        <Button type="submit" className="h-11 w-full" loading={isSubmitting}>
          {isSubmitting ? "Updating…" : "Update Password"}
        </Button>

        <Link
          href="/login"
          className="block text-center text-sm font-semibold text-text-secondary hover:text-text-primary"
        >
          Back to login
        </Link>
      </form>
    </AuthCard>
  );
}