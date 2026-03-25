"use client";

import React, { useState } from "react";
import { Button, Card, Input } from "@/components/ui";
import { OrderStepper } from "./OrderStepper";
import { useCartStore } from "@/lib/store/cartStore";
import apiClient from "@/lib/api/client";

interface PaymentStepProps {
  onBack: () => void;
}

const STEPS = [
  { id: 1, label: "Delivery Details", description: "Package information" },
  { id: 2, label: "Review", description: "Review cart" },
  { id: 3, label: "Payment", description: "Complete order" },
];

export function PaymentStep({ onBack }: PaymentStepProps) {
  const { checkout, getTotalPrice, getItemCount } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{
    orders: Array<{ tracking_number: string; price: number }>;
    total_orders: number;
    total_price: number;
  } | null>(null);

  const [promoCode, setPromoCode] = useState("");
  const [promoValidating, setPromoValidating] = useState(false);
  const [promoResult, setPromoResult] = useState<{
    valid: boolean;
    message?: string;
    discount?: number;
    new_total?: number;
  } | null>(null);

  const totalPrice = Number(getTotalPrice()) || 0;
  const itemCount = getItemCount();

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
    setIsProcessing(true);

    try {
      const result = await checkout();
      setSuccess(result);
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

  // Success State
  if (success) {
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        <OrderStepper currentStep={3} steps={STEPS} />
        
        <Card className="p-8 text-center">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          
          <h2 className="text-3xl font-semibold text-foreground mb-2">
            Payment Successful!
          </h2>
          
          <p className="text-muted-foreground mb-8">
            {success.total_orders} {success.total_orders === 1 ? "order" : "orders"} created successfully
          </p>
          
          <div className="bg-muted rounded-lg p-6 mb-8">
            <p className="text-sm text-muted-foreground mb-4">Tracking Numbers</p>
            <div className="space-y-3">
              {success.orders.map((order, index) => (
                <div
                  key={order.tracking_number}
                  className="bg-background rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground mb-1">
                      Order {index + 1}
                    </p>
                    <p className="font-mono text-lg font-semibold text-foreground">
                      {order.tracking_number}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-primary">
                      ₦{Number(order.price).toFixed(2)}
                    </p>
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(order.tracking_number)
                      }
                      className="text-xs text-muted-foreground hover:text-foreground mt-1"
                      title="Copy tracking number"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-border mt-6 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-foreground">
                  Total Paid
                </span>
                <span className="text-2xl font-bold text-primary">
                  ₦{success.total_price.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => (window.location.href = "/dashboard")}
              variant="primary"
              size="lg"
            >
              Create New Order
            </Button>
            <Button
              onClick={() => (window.location.href = "/dashboard/orders")}
              variant="secondary"
              size="lg"
            >
              View My Orders
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Payment Form
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
            <span className="text-muted-foreground">Total Items</span>
            <span className="font-medium text-foreground">{itemCount}</span>
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

      {/* Mock Payment Method */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Payment Method
        </h2>
        <div className="space-y-3">
          <div className="p-4 bg-muted rounded-lg border-2 border-primary">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
              </div>
              <div>
                <p className="font-medium text-foreground">Pay on Delivery</p>
                <p className="text-xs text-muted-foreground">
                  Payment will be collected during delivery
                </p>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            * This is a demo payment. No actual payment will be processed.
          </p>
        </div>
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
          disabled={isProcessing || itemCount === 0}
        >
          {isProcessing ? "Processing..." : `Process Payment (₦${finalPrice.toFixed(2)})`}
        </Button>
      </div>
    </div>
  );
}
