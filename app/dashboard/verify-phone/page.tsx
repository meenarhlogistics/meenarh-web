"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Input } from "@/components/ui";
import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/store/authStore";

function formatSeconds(s: number) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  if (m <= 0) return `${r}s`;
  return `${m}m ${String(r).padStart(2, "0")}s`;
}

export default function VerifyPhonePage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const loadAuth = useAuthStore((s) => s.loadAuth);

  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "verifying">("idle");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const isVerified = Boolean(user?.is_phone_verified);
  const canResend = cooldown <= 0 && status === "idle";

  const phoneLabel = useMemo(() => {
    const p = user?.phone?.trim();
    if (!p) return null;
    // Show last 4 digits for reassurance
    const tail = p.slice(-4);
    return `•••• ${tail}`;
  }, [user?.phone]);

  useEffect(() => {
    if (isVerified) {
      router.replace("/dashboard");
    }
  }, [isVerified, router]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => {
      setCooldown((c) => Math.max(0, c - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const requestCode = async () => {
    setError("");
    setInfo("");
    setStatus("sending");
    try {
      const res = await authApi.requestPhoneVerificationCode();
      if (res.success) {
        setInfo("Verification code sent on WhatsApp.");
        setCooldown(30);
      } else {
        setError(res.message || "Could not send code. Please try again.");
      }
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || "Could not send code. Please try again.");
    } finally {
      setStatus("idle");
    }
  };

  const verify = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError("");
    setInfo("");
    const normalized = code.replace(/\s/g, "");
    if (!/^\d{6}$/.test(normalized)) {
      setError("Enter the 6-digit code sent to your WhatsApp.");
      return;
    }
    setStatus("verifying");
    try {
      const res = await authApi.verifyPhoneCode(normalized);
      if (!res.success) {
        setError(res.message || "Invalid verification code.");
        return;
      }
      // Refresh auth so the dashboard reflects is_phone_verified immediately
      await loadAuth();
      router.replace("/dashboard");
    } catch (err) {
      const e = err as { response?: { data?: { message?: string; reason?: string } } };
      const msg = e.response?.data?.message || "Invalid verification code.";
      setError(msg);
    } finally {
      setStatus("idle");
    }
  };

  useEffect(() => {
    // Best-effort auto-send on first mount
    if (!isVerified && user?.phone) {
      requestCode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.phone]);

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2">
          Verify your phone
        </h1>
        <p className="text-muted-foreground">
          To place orders, verify your WhatsApp number{phoneLabel ? ` (${phoneLabel})` : ""}.
        </p>
      </div>

      {(error || info) && (
        <div
          className={`p-4 rounded-lg text-sm border ${
            error
              ? "bg-destructive/10 border-destructive/20 text-destructive"
              : "bg-primary/10 border-primary/20 text-primary"
          }`}
        >
          {error || info}
        </div>
      )}

      <Card className="p-6 space-y-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">Step 1</p>
          <p className="text-sm text-muted-foreground">
            We’ll send a 6-digit verification code to your WhatsApp.
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={requestCode}
          disabled={!canResend || !user?.phone}
        >
          {status === "sending"
            ? "Sending…"
            : cooldown > 0
              ? `Resend code in ${formatSeconds(cooldown)}`
              : "Send code"}
        </Button>
      </Card>

      <Card className="p-6 space-y-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">Step 2</p>
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit code you received.
          </p>
        </div>

        <form onSubmit={verify} className="space-y-3">
          <Input
            label="Verification code"
            inputMode="numeric"
            placeholder="123456"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.replace(/[^\d\s]/g, ""));
              setError("");
            }}
            id="verification-code"
          />
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="submit"
              variant="primary"
              disabled={status !== "idle"}
            >
              {status === "verifying" ? "Verifying…" : "Verify"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push("/dashboard")}
              disabled={status !== "idle"}
            >
              Back to overview
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

