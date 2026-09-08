"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { AuthCard } from "@/components/auth/auth-card";
import { PasswordStrength } from "@/components/auth/password-strength";
import { Button } from "@/components/ui/button";
import { FieldError, FieldLabel, Input } from "@/components/ui/input";

const registerSchema = z
  .object({
    displayName: z
      .string()
      .min(2, "Display name must be at least 2 characters")
      .max(50, "Display name is too long"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .regex(/^[a-z0-9_]+$/, "Lowercase letters, numbers and underscores only"),
    email: z.string().email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Za-z]/, "Include at least one letter")
      .regex(/[0-9]/, "Include at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
    defaultValues: {
      displayName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (values: RegisterForm) => {
    try {
      void values;
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Account created!", {
        description: "Welcome to OmniMarketX. You're all set to trade.",
      });
      router.push("/onboarding");
    } catch {
      toast.error("Sign up failed", {
        description: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <AuthCard
      title="Create your account"
      subtitle="Start trading. Start earning. Start talking."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <FieldLabel htmlFor="displayName">Display name</FieldLabel>
          <Input
            id="displayName"
            autoComplete="name"
            placeholder="Alex River"
            invalid={Boolean(errors.displayName)}
            {...register("displayName")}
          />
          <FieldError>{errors.displayName?.message}</FieldError>
        </div>

        <div>
          <FieldLabel htmlFor="username">Username</FieldLabel>
          <Input
            id="username"
            autoComplete="username"
            placeholder="alexriver"
            invalid={Boolean(errors.username)}
            {...register("username")}
          />
          <FieldError>{errors.username?.message}</FieldError>
        </div>

        <div>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            invalid={Boolean(errors.email)}
            {...register("email")}
          />
          <FieldError>{errors.email?.message}</FieldError>
        </div>

        <div>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              invalid={Boolean(errors.password)}
              className="pr-10"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted transition-colors hover:text-text-primary"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          <PasswordStrength password={password ?? ""} />
          <FieldError>{errors.password?.message}</FieldError>
        </div>

        <div>
          <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              invalid={Boolean(errors.confirmPassword)}
              className="pr-10"
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted transition-colors hover:text-text-primary"
            >
              {showConfirm ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          <FieldError>{errors.confirmPassword?.message}</FieldError>
        </div>

        <Button type="submit" className="h-11 w-full" loading={isSubmitting}>
          {isSubmitting ? "Creating account…" : "Create Account"}
        </Button>

        <p className="text-center text-xs leading-relaxed text-text-muted">
  By creating an account, you agree to our Terms of Service and Privacy
  Policy.
</p>
      </form>

      <div className="mt-5 text-center text-sm text-text-secondary">
        Already have an account?
        <Link
          href="/login"
          className="ml-1.5 font-semibold text-primary hover:underline"
        >
          Login
        </Link>
      </div>
    </AuthCard>
  );
}