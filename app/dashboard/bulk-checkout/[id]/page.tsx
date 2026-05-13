"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button, Card, Input } from "@/components/ui";
import { useCartStore } from "@/lib/store/cartStore";
import { useAuthStore } from "@/lib/store/authStore";
import apiClient from "@/lib/api/client";
import { paymentsApi } from "@/lib/api/payments";
import type { BulkCartEntry } from "@/types";

export default function BulkEntryCheckoutPage() {
  const router = useRouter();
  const params = useParams();
  const entryId = Number(params.id);
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

  const selectedEntry = items.find(
    (item): item is BulkCartEntry => item.kind === "bulk" && item.id === entryId
  );
  const totalAmount = Number(selectedEntry?.estimated_total ?? selectedEntry?.estimated_price) || 0;
  const finalAmount = promoResult?.valid ? (promoResult.new_total ?? totalAmount) : totalAmount;

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
        order_total: totalAmount,
      });
      setPromoResult(res.data.data);
    } catch (err) {
      const apiError = err as { response?: { data?: { data?: { message?: string } } } };
      setPromoResult({
        valid: false,
        message: apiError.response?.data?.data?.message || "Invalid promo code",
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
    if (!selectedEntry) {
      setError("Bulk delivery not found in cart");
      return;
    }

    setError("");
    if (!user?.is_email_verified) {
      router.push("/dashboard/verify-email");
      return;
    }

    setIsProcessing(true);
    try {
      const init = await paymentsApi.initializePaystack({
        scope: "bulk_order",
        cart_bulk_entry_id: entryId,
        promo_code: promoResult?.valid ? promoCode.trim().toUpperCase() : undefined,
      });
      const url = init.data?.authorization_url;
      if (!url) {
        setError("Could not start payment. Please try again.");
        return;
      }
      window.location.href = url;
    } catch (err) {
      console.error("Bulk checkout error:", err);
      const apiError = err as { response?: { data?: { message?: string } } };
      setError(
        apiError.response?.data?.message || "Failed to process payment. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (!selectedEntry && items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card className="p-6 sm:p-8">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading bulk delivery...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!selectedEntry) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card className="p-6 sm:p-8 text-center">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
            Bulk Delivery Not Found
          </h2>
          <p className="text-muted-foreground mb-6">
            The bulk delivery you are trying to checkout is no longer in your cart.
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

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2">
          Checkout Bulk Delivery
        </h1>
        <p className="text-muted-foreground">
          Complete payment for this grouped bulk delivery only
        </p>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
          {error}
        </div>
      )}

      <Card className="p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Promo Code
        </h2>
        {promoResult?.valid ? (
          <div className="flex items-center justify-between gap-3 rounded-lg border border-primary/20 bg-primary/10 p-3">
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
              onChange={(event) => {
                setPromoCode(event.target.value);
                setPromoResult(null);
              }}
              id="bulk-promo-code-input"
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

      <Card className="p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Bulk Delivery Summary
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Sender</p>
              <p className="text-sm font-medium text-foreground">
                {selectedEntry.sender_name || "N/A"}
              </p>
              <p className="text-xs text-muted-foreground">
                {selectedEntry.sender_phone || "N/A"}
              </p>
              <p className="text-xs text-muted-foreground">
                {selectedEntry.pickup_address || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Delivery Count</p>
              <p className="text-sm font-medium text-foreground">
                {selectedEntry.item_count} {selectedEntry.item_count === 1 ? "delivery" : "deliveries"}
              </p>
              <p className="text-xs text-muted-foreground">
                This payment will create one grouped bulk order.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase">Destinations</p>
            {selectedEntry.items.map((bulkItem) => (
              <div
                key={bulkItem.id}
                className="rounded-lg border border-border bg-muted/30 p-3 text-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-foreground">
                      {bulkItem.receiver_name} · {bulkItem.receiver_phone}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {bulkItem.delivery_address}
                    </p>
                    {bulkItem.package_description && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {bulkItem.package_description}
                      </p>
                    )}
                  </div>
                  <p className="font-semibold text-primary shrink-0">
                    ₦{Number(bulkItem.estimated_price || 0).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-3">
            {promoResult?.valid && (
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-primary">Promo Discount</span>
                <span className="font-medium text-primary">
                  -₦{(promoResult.discount ?? 0).toFixed(2)}
                </span>
              </div>
            )}
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
          You will be redirected to Paystack to complete payment. After payment,
          this bulk draft will be removed from your cart and created as a bulk order.
        </p>
      </Card>

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
