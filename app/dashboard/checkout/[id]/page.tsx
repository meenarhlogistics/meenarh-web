"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button, Card, Input } from "@/components/ui";
import { useCartStore } from "@/lib/store/cartStore";
import { useAuthStore } from "@/lib/store/authStore";
import apiClient from "@/lib/api/client";
import { paymentsApi } from "@/lib/api/payments";
import { getApiErrorMessage, showApiErrorToast } from "@/lib/errors/apiError";
import type { CartItem } from "@/types";

export default function SingleItemCheckoutPage() {
  const router = useRouter();
  const params = useParams();
  const itemId = Number(params.id);
  const { items, fetchCart } = useCartStore();
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

  const selectedItem = items.find(
    (item): item is CartItem & { kind: "single" } => item.kind === "single" && item.id === itemId
  );
  const baseAmount = Number(selectedItem?.estimated_price) || 0;
  const finalAmount = promoResult?.valid ? (promoResult.new_total ?? baseAmount) : baseAmount;

  useEffect(() => {
    if (items.length === 0) {
      fetchCart();
    }
  }, [items.length, fetchCart]);

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setPromoValidating(true);
    setPromoResult(null);
    try {
      const res = await apiClient.post("/promo-codes/validate", {
        code: promoCode.trim(),
        order_total: baseAmount,
      });
      setPromoResult(res.data.data);
    } catch (err) {
      setPromoResult({
        valid: false,
        message: getApiErrorMessage(err, "Invalid promo code"),
      });
    } finally {
      setPromoValidating(false);
    }
  };

  const handleRemovePromo = () => {
    setPromoCode("");
    setPromoResult(null);
  };

  const handleCheckout = async () => {
    if (!selectedItem) {
      setError("Item not found in cart");
      return;
    }

    setError("");
    if (!user?.is_phone_verified) {
      router.push("/dashboard/verify-phone");
      return;
    }
    setIsProcessing(true);

    try {
      const init = await paymentsApi.initializePaystack({
        scope: "single_item",
        cart_item_id: itemId,
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
      const msg = getApiErrorMessage(
        err,
        "Failed to process payment. Please try again."
      );
      setError(msg);
      showApiErrorToast(err, "Failed to process payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Loading State
  if (!selectedItem && items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card className="p-6 sm:p-8">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading item...</p>
          </div>
        </Card>
      </div>
    );
  }

  // Item not found
  if (!selectedItem) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card className="p-6 sm:p-8 text-center">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
            Item Not Found
          </h2>
          <p className="text-muted-foreground mb-6">
            The item you are trying to checkout is no longer in your cart.
          </p>
          <Button
            onClick={() => router.push("/dashboard/cart")}
            variant="primary"
            size="lg"
          >
            Back to Cart
          </Button>
        </Card>
      </div>
    );
  }

  // Payment Form
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2">
          Checkout Item
        </h1>
        <p className="text-muted-foreground">
          Complete payment for this delivery
        </p>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
          {error}
        </div>
      )}

      {/* Promo Code */}
      <Card className="p-4 sm:p-6">
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
            <button
              type="button"
              onClick={handleRemovePromo}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Input
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => {
                setPromoCode(e.target.value);
                setPromoResult(null);
              }}
              id="promo-code-input"
            />
            <Button
              variant="secondary"
              onClick={handleApplyPromo}
              disabled={promoValidating || !promoCode.trim()}
            >
              {promoValidating ? "..." : "Apply"}
            </Button>
          </div>
        )}
        {promoResult && !promoResult.valid && (
          <p className="text-destructive text-sm mt-2">{promoResult.message}</p>
        )}
      </Card>

      {/* Item Summary */}
      <Card className="p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Delivery Details
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">From</p>
              <p className="text-sm font-medium text-foreground">
                {selectedItem.sender_name || "N/A"}
              </p>
              <p className="text-xs text-muted-foreground">
                {selectedItem.pickup_address || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">To</p>
              <p className="text-sm font-medium text-foreground">
                {selectedItem.receiver_name}
              </p>
              <p className="text-xs text-muted-foreground">
                {selectedItem.delivery_address}
              </p>
            </div>
          </div>
          
          {selectedItem.package_description && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Package</p>
              <p className="text-sm text-foreground">{selectedItem.package_description}</p>
            </div>
          )}
          
          <div className="border-t border-border pt-3">
            <div className="flex items-center justify-between">
              <span className="text-base sm:text-lg font-semibold text-foreground">
                Total Amount
              </span>
              <span className="text-xl sm:text-2xl font-bold text-primary">
                ₦{finalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Payment</h2>
        <p className="text-sm text-muted-foreground">
          You will be redirected to Paystack to complete payment. You can return to this site from the receipt page to see your tracking number.
        </p>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={() => router.push("/dashboard/cart")}
          disabled={isProcessing}
          className="w-full sm:w-auto"
        >
          ← Back to Cart
        </Button>
        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={handleCheckout}
          disabled={isProcessing}
          className="w-full sm:w-auto"
        >
          {isProcessing ? "Redirecting…" : `Pay with Paystack ₦${finalAmount.toFixed(2)}`}
        </Button>
      </div>
    </div>
  );
}
