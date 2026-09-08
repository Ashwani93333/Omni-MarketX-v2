"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { FieldError, FieldLabel, Input } from "@/components/ui/input";

const forgotSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type ForgotForm = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: ForgotForm) => {
    try {
      void values;
      await new Promise((resolve) => setTimeout(resolve, 900));
      toast.success("Reset link sent", {
        description: "Check your inbox for instructions to reset your password.",
      });
      router.push("/login");
    } catch {
      toast.error("Couldn't send reset link", {
        description: "Please try again in a moment.",
      });
    }
  };

  return (
    <AuthCard title="Reset your password" subtitle="We'll email you a reset link." social={false}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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

        <Button type="submit" className="h-11 w-full" loading={isSubmitting}>
          {isSubmitting ? "Sending link…" : "Send Reset Link"}
        </Button>
      </form>
    </AuthCard>
  );
}