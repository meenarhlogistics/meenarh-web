"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button, Input, FormErrorAlert } from "@/components/ui";
import apiClient from "@/lib/api/client";
import { getApiErrorDetails, type ParsedApiError } from "@/lib/errors/apiError";

const PASSWORD_RESET_EMAIL_KEY = "password_reset_email";

export function ResetPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorDetails, setErrorDetails] = useState<ParsedApiError | null>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(PASSWORD_RESET_EMAIL_KEY);
      if (stored) setEmail(stored);
    } catch {
      // ignore
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorDetails(null);
    setMessage("");

    if (!email.trim()) {
      setErrorDetails({ message: "Enter the email you used when requesting the code." });
      return;
    }

    const normalizedCode = code.replace(/\s/g, "");
    if (!/^\d{6}$/.test(normalizedCode)) {
      setErrorDetails({ message: "Enter the 6-digit code sent to your email." });
      return;
    }

    if (password !== confirmPassword) {
      setErrorDetails({ message: "Passwords do not match" });
      return;
    }

    if (password.length < 6) {
      setErrorDetails({ message: "Password must be at least 6 characters" });
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiClient.post("/auth/reset-password", {
        email: email.trim(),
        code: normalizedCode,
        newPassword: password,
      });

      if (response.data?.success) {
        try {
          sessionStorage.removeItem(PASSWORD_RESET_EMAIL_KEY);
        } catch {
          // ignore
        }
        setMessage("Password reset successful. Redirecting to login...");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setErrorDetails({
          message: response.data?.message || "Failed to reset password",
        });
      }
    } catch (err: unknown) {
      console.error("Reset password error:", err);
      setErrorDetails(
        getApiErrorDetails(
          err,
          "Invalid or expired code. Request a new code from Forgot password."
        )
      );
    } finally {
      setIsLoading(false);
    }
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
              Reset password
            </h1>
            <p className="text-muted-foreground">
              Enter the code from your email and choose a new password.
            </p>
          </div>

          <FormErrorAlert
            message={errorDetails?.message}
            items={errorDetails?.items}
          />

          {message && (
            <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-500 text-sm">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Email"
              name="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              id="reset-email"
            />

            <Input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              label="Verification code"
              name="code"
              placeholder="123456"
              value={code}
              onChange={(e) =>
                setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              required
              id="reset-code"
            />

            <Input
              type="password"
              label="New password"
              name="password"
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              id="password"
            />

            <Input
              type="password"
              label="Confirm password"
              name="confirmPassword"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              id="confirmPassword"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Updating password..." : "Update password"}
            </Button>
          </form>

          <div className="mt-6 text-center flex flex-col gap-2">
            <Link
              href="/forgot-password"
              className="text-sm text-muted-foreground hover:underline font-medium"
            >
              Didn&apos;t get a code? Send again
            </Link>
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
