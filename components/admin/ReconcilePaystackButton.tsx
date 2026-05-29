"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { adminApi } from "@/lib/api/admin";
import { Button } from "@/components/ui";
import { showApiErrorToast } from "@/lib/errors/apiError";

interface ReconcilePaystackButtonProps {
  reference?: string | null;
  onReconciled?: () => void;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ReconcilePaystackButton({
  reference,
  onReconciled,
  variant = "secondary",
  size = "md",
  className,
}: ReconcilePaystackButtonProps) {
  const [loading, setLoading] = useState(false);

  if (!reference) {
    return null;
  }

  const handleReconcile = async () => {
    setLoading(true);
    try {
      const res = await adminApi.reconcilePayment(reference);
      if (res.payment_state === "confirmed") {
        toast.success(res.message || "Payment confirmed with Paystack");
        onReconciled?.();
      } else {
        toast.info(res.message || "Paystack still reports this payment as pending");
      }
    } catch (err) {
      showApiErrorToast(err, "Failed to check payment with Paystack");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleReconcile}
      disabled={loading}
      className={className}
    >
      <RefreshCw className={`w-4 h-4 mr-2 shrink-0 ${loading ? "animate-spin" : ""}`} />
      {loading ? "Checking…" : "Check Paystack"}
    </Button>
  );
}
