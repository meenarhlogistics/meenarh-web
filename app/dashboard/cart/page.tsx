"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card } from "@/components/ui";
import { CartItem } from "@/components/dashboard/CartItem";
import { useCartStore } from "@/lib/store/cartStore";

export default function CartPage() {
  const router = useRouter();
  const { items, fetchCart, isLoading, clearCart, getTotalPrice } = useCartStore();
  const [isClearing, setIsClearing] = useState(false);
  const totalPrice = Number(getTotalPrice()) || 0;

  useEffect(() => {
    // Fetch cart items from backend
    fetchCart();
  }, [fetchCart]);

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your entire cart?")) {
      setIsClearing(true);
      try {
        await clearCart();
      } catch (error) {
        console.error("Failed to clear cart:", error);
      } finally {
        setIsClearing(false);
      }
    }
  };

  const handleCheckout = () => {
    // Navigate to create order form, which will show Step 2 (Review) if cart has items
    router.push("/dashboard");
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Shopping Cart</h1>
            <p className="text-muted-foreground mt-1">Loading your cart...</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-5 animate-pulse">
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-3 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Shopping Cart</h1>
            <p className="text-muted-foreground mt-1">Your delivery orders</p>
          </div>
        </div>

        <Card className="p-12 text-center">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Your cart is empty
          </h3>
          <p className="text-muted-foreground mb-6">
            Add delivery orders to your cart to continue
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => router.push("/dashboard")}
          >
            Create Order
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Shopping Cart</h1>
          <p className="text-muted-foreground mt-1">
            {items.length} {items.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleClearCart}
          disabled={isClearing}
        >
          {isClearing ? "Clearing..." : "Clear Cart"}
        </Button>
      </div>

      {/* Cart Items */}
      <div className="space-y-4">
        {items.map((item) => (
          <CartItem 
            key={item.id} 
            item={item}
            onCheckout={async (itemId) => {
              // Handle individual item checkout
              if (window.confirm("Checkout this item?")) {
                try {
                  // Navigate to payment with single item
                  router.push(`/dashboard/checkout/${itemId}`);
                } catch (error) {
                  console.error("Failed to checkout item:", error);
                }
              }
            }}
          />
        ))}
      </div>

      {/* Summary Card - Optimized for Mobile */}
      <Card className="p-4 sm:p-6 bg-muted/50 sticky bottom-2 sm:bottom-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Total Info */}
          <div className="space-y-1">
            <p className="text-xs sm:text-sm text-muted-foreground">Total Amount</p>
            <p className="text-2xl sm:text-3xl font-bold text-primary">
              ₦{totalPrice.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground">
              {items.length} {items.length === 1 ? "delivery" : "deliveries"}
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <Button
              variant="secondary"
              size="md"
              onClick={() => router.push("/dashboard")}
              className="w-full sm:w-auto text-sm"
            >
              Add More Items
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleCheckout}
              className="w-full sm:w-auto text-sm"
            >
              Checkout All
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
