"use client";

import React, { useState } from "react";
import { Button, Card, Input } from "@/components/ui";
import { OrderStepper } from "./OrderStepper";
import { useCartStore } from "@/lib/store/cartStore";
import { useAuthStore } from "@/lib/store/authStore";
import apiClient from "@/lib/api/client";
import { paymentsApi } from "@/lib/api/payments";
import { useRouter } from "next/navigation";

interface PaymentStepProps {
  onBack: () => void;
}

const STEPS = [
  { id: 1, label: "Delivery Details", description: "Package information" },
  { id: 2, label: "Review", description: "Review cart" },
  { id: 3, label: "Payment", description: "Complete order" },
];

export function PaymentStep({ onBack }: PaymentStepProps) {
  const router = useRouter();
  const { getTotalPrice, getItemCount } = useCartStore();
  const user = useAuthStore((s) => s.user);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const [promoCode, setPromoCode] = useState("");
  const [promoValidating, setPromoValidating] = useState(false);
  const [promoResult, setPromoResult] = useState<{
    valid: boolean;
    message?: string;
    discount?: number;
    new_total?: number;
  } | null>(null);

  const totalPrice = Number(getTotalPrice()) || 0;
  const deliveryCount = getItemCount();

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setPromoValidating(true);
    setPromoResult(null);
    try {
      const res = await apiClient.post("/promo-codes/validate", {
        code: promoCode.trim(),
        order_total: totalPrice,
      });
      setPromoResult(res.data.data);
    } catch (err) {
      const e = err as { response?: { data?: { data?: { message?: string } } } };
      setPromoResult({ valid: false, message: e.response?.data?.data?.message || "Invalid promo code" });
    } finally {
      setPromoValidating(false);
    }
  };

  const handleRemovePromo = () => {
    setPromoCode("");
    setPromoResult(null);
  };

  const finalPrice = promoResult?.valid ? (promoResult.new_total ?? totalPrice) : totalPrice;

  const handleCheckout = async () => {
    setError("");
    if (!user?.is_email_verified) {
      router.push("/dashboard/verify-email");
      return;
    }
    setIsProcessing(true);

    try {
      const init = await paymentsApi.initializePaystack({
        scope: "full_cart",
        promo_code: promoResult?.valid ? promoCode.trim().toUpperCase() : undefined,
      });
      const url = init.data?.authorization_url;
      if (!url) {
        setError("Could not start payment. Please try again.");
        return;
      }
      window.location.href = url;
    } catch (err) {
      console.error("Checkout error:", err);
      const error = err as { response?: { data?: { message?: string } } };
      setError(
        error.response?.data?.message || "Failed to process payment. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <OrderStepper currentStep={3} steps={STEPS} />
      
      <div>
        <h1 className="text-3xl font-semibold text-foreground mb-2">
          Complete Payment
        </h1>
        <p className="text-muted-foreground">
          Review your order and complete the payment
        </p>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
          {error}
        </div>
      )}

      {/* Promo Code */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Promo Code
        </h2>
        {promoResult?.valid ? (
          <div className="flex items-center justify-between p-3 bg-primary/10 border border-primary/20 rounded-lg">
            <div>
              <p className="text-sm font-medium text-primary">
                Code &quot;{promoCode}&quot; applied — ₦{(promoResult.discount ?? 0).toFixed(2)} off
              </p>
            </div>
            <button onClick={handleRemovePromo} className="text-sm text-muted-foreground hover:text-foreground">
              Remove
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Input
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => { setPromoCode(e.target.value); setPromoResult(null); }}
              id="promo-code-input"
            />
            <Button variant="secondary" onClick={handleApplyPromo} disabled={promoValidating || !promoCode.trim()}>
              {promoValidating ? "..." : "Apply"}
            </Button>
          </div>
        )}
        {promoResult && !promoResult.valid && (
          <p className="text-destructive text-sm mt-2">{promoResult.message}</p>
        )}
      </Card>

      {/* Order Summary */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Order Summary
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Deliveries</span>
            <span className="font-medium text-foreground">{deliveryCount}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Delivery Fee</span>
            <span className="font-medium text-foreground">
              ₦{totalPrice.toFixed(2)}
            </span>
          </div>
          {promoResult?.valid && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-primary">Promo Discount</span>
              <span className="font-medium text-primary">
                -₦{(promoResult.discount ?? 0).toFixed(2)}
              </span>
            </div>
          )}
          <div className="border-t border-border pt-3">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-foreground">
                Total Amount
              </span>
              <span className="text-2xl font-bold text-primary">
                ₦{finalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Payment</h2>
        <p className="text-sm text-muted-foreground">
          You will be redirected to Paystack to pay securely by card or bank. After payment you will return here to see your tracking numbers.
        </p>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={onBack}
          disabled={isProcessing}
        >
          ← Back to Review
        </Button>
        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={handleCheckout}
          disabled={isProcessing || deliveryCount === 0}
        >
          {isProcessing ? "Redirecting…" : `Pay with Paystack (₦${finalPrice.toFixed(2)})`}
        </Button>
      </div>
    </div>
  );
}
