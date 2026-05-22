"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Card, FormErrorAlert } from "@/components/ui";
import { authApi } from "@/lib/api/auth";
import { getApiErrorDetails, type ParsedApiError } from "@/lib/errors/apiError";
import { useAuthStore } from "@/lib/store/authStore";

function VerifyEmailInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  const user = useAuthStore((s) => s.user);
  const loadAuth = useAuthStore((s) => s.loadAuth);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [errorDetails, setErrorDetails] = useState<ParsedApiError | null>(null);
  const [info, setInfo] = useState("");
  const [sending, setSending] = useState(false);

  const isVerified = Boolean(user?.is_email_verified);

  useEffect(() => {
    if (isVerified) {
      router.replace("/dashboard");
    }
  }, [isVerified, router]);

  useEffect(() => {
    if (status !== "verified") return;
    void (async () => {
      await loadAuth();
      if (useAuthStore.getState().user?.is_email_verified) {
        router.replace("/dashboard");
      }
    })();
  }, [status, loadAuth, router]);

  const resend = async () => {
    setErrorDetails(null);
    setInfo("");
    setSending(true);
    try {
      const res = await authApi.requestEmailVerification();
      if (res.success) {
        setInfo("Verification email sent. Check your inbox.");
      } else {
        setErrorDetails({ message: res.message || "Could not send email." });
      }
    } catch (err) {
      setErrorDetails(getApiErrorDetails(err, "Could not send email."));
    } finally {
      setSending(false);
    }
  };

  const statusHint =
    status === "expired"
      ? "That link has expired. Request a new verification email below."
      : status === "invalid"
        ? "That verification link is invalid. Request a new email below."
        : status === "already_used"
          ? "This link was already used. Request a new email if you still need access."
          : status === "verified"
            ? "Your email was verified."
            : null;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2">
          Verify your email
        </h1>
        <p className="text-muted-foreground">
          We sent a verification link to{" "}
          <span className="font-medium text-foreground">{user?.email || "your email"}</span>.
          Open it on any device to activate your account.
        </p>
      </div>

      {statusHint && (
        <div className="p-4 rounded-lg text-sm border bg-primary/10 border-primary/20 text-foreground">
          {statusHint}
          {status === "verified" && !isAuthenticated && (
            <p className="mt-2 text-muted-foreground">
              Sign in with your email and password to continue.
            </p>
          )}
        </div>
      )}

      <FormErrorAlert
        message={errorDetails?.message}
        items={errorDetails?.items}
      />

      {info && (
        <div className="p-4 rounded-lg text-sm border bg-primary/10 border-primary/20 text-primary">
          {info}
        </div>
      )}

      <Card className="p-6 space-y-4">
        <p className="text-sm text-muted-foreground">
          Didn&apos;t get the email? Check spam, then resend. You can request a new link every minute.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            type="button"
            variant="primary"
            onClick={resend}
            disabled={sending || !isAuthenticated}
          >
            {sending ? "Sending…" : "Resend verification email"}
          </Button>
          {!isAuthenticated && (
            <Link
              href="/login"
              className="inline-flex items-center justify-center font-medium transition-all duration-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 bg-secondary text-secondary-foreground border border-border hover:bg-accent focus:ring-ring px-6 py-3 text-base"
            >
              Go to sign in
            </Link>
          )}
        </div>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="text-muted-foreground text-center py-12">Loading…</div>
      }
    >
      <VerifyEmailInner />
    </Suspense>
  );
}
