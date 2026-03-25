"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button, Card } from "@/components/ui";
import { useCartStore } from "@/lib/store/cartStore";
import { cartApi } from "@/lib/api/cart";

export default function SingleItemCheckoutPage() {
  const router = useRouter();
  const params = useParams();
  const itemId = Number(params.id);
  const { items, fetchCart, removeItem } = useCartStore();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{
    tracking_number: string;
    price: number;
  } | null>(null);

  const selectedItem = items.find((item) => item.id === itemId);

  useEffect(() => {
    if (items.length === 0) {
      fetchCart();
    }
  }, [items.length, fetchCart]);

  const handleCheckout = async () => {
    if (!selectedItem) {
      setError("Item not found in cart");
      return;
    }

    setError("");
    setIsProcessing(true);

    try {
      // Create a single order from this cart item
      const response = await cartApi.checkoutSingleItem(itemId);
      
      if (response.success && response.data.orders.length > 0) {
        setSuccess({
          tracking_number: response.data.orders[0].tracking_number,
          price: response.data.orders[0].price,
        });
        
        // Remove item from cart after successful checkout
        await removeItem(itemId);
      } else {
        setError("Failed to create order");
      }
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
      <div className="max-w-3xl mx-auto">
        <Card className="p-6 sm:p-8 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10 text-primary"
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
          
          <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2">
            Payment Successful!
          </h2>
          
          <p className="text-muted-foreground mb-8">
            Your order has been created successfully
          </p>
          
          <div className="bg-muted rounded-lg p-4 sm:p-6 mb-8">
            <p className="text-sm text-muted-foreground mb-4">Tracking Number</p>
            <div className="bg-background rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-center sm:text-left">
                <p className="font-mono text-lg sm:text-xl font-semibold text-foreground">
                  {success.tracking_number}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <p className="text-sm sm:text-base font-semibold text-primary">
                  ₦{Number(success.price).toFixed(2)}
                </p>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(success.tracking_number)
                  }
                  className="text-xs text-muted-foreground hover:text-foreground"
                  title="Copy tracking number"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => router.push("/dashboard/cart")}
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
            >
              Back to Cart
            </Button>
            <Button
              onClick={() => router.push("/dashboard/orders")}
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
            >
              View My Orders
            </Button>
          </div>
        </Card>
      </div>
    );
  }

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
            The item you're trying to checkout is no longer in your cart.
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
                ₦{Number(selectedItem.estimated_price).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Payment Method */}
      <Card className="p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Payment Method
        </h2>
        <div className="space-y-3">
          <div className="p-4 bg-muted rounded-lg border-2 border-primary">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center flex-shrink-0">
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
          {isProcessing ? "Processing..." : `Pay ₦${Number(selectedItem.estimated_price).toFixed(2)}`}
        </Button>
      </div>
    </div>
  );
}
