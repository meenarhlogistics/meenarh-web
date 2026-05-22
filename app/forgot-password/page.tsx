"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button, Input, FormErrorAlert } from "@/components/ui";
import apiClient from "@/lib/api/client";

const PASSWORD_RESET_EMAIL_KEY = "password_reset_email";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email is required");
      return;
    }

    setIsLoading(true);

    try {
      await apiClient.post("/auth/forgot-password", { email: email.trim() });
    } catch (err) {
      console.error("Forgot password error:", err);
      // Same opaque UX as backend: proceed to reset screen with email prefilled.
    }

    try {
      sessionStorage.setItem(PASSWORD_RESET_EMAIL_KEY, email.trim());
    } catch {
      // ignore quota / privacy mode
    }
    setIsLoading(false);
    router.push("/reset-password");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl opacity-40 animate-float"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl opacity-40 animate-float-delayed"
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <Image
            src="/meenarh logo.svg"
            alt="Meenarh Logistics"
            width={40}
            height={40}
            className="w-10 h-10"
          />
          <span className="text-xl font-semibold text-foreground">
            Meenarh Logistics
          </span>
        </Link>

        <div className="bg-card rounded-xl shadow-lg border border-border p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              Forgot password
            </h1>
            <p className="text-muted-foreground">
              Enter the email linked to your account. We&apos;ll send a
              verification code so you can set a new password.
            </p>
          </div>

          <FormErrorAlert message={error || undefined} />

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Email"
              name="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              id="email"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Sending code..." : "Send verification code"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-sm text-primary hover:underline font-medium"
            >
              ← Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
