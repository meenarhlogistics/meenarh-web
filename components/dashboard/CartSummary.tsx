"use client";

import React from "react";
import { Card } from "@/components/ui";
import { CartItem } from "./CartItem";
import { useCartStore } from "@/lib/store/cartStore";

export function CartSummary() {
  const { items, getTotalPrice, isLoading } = useCartStore();
  const totalPrice = Number(getTotalPrice()) || 0;

  if (isLoading) {
    return (
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
    );
  }

  if (items.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-muted-foreground"
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
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Your cart is empty
        </h3>
        <p className="text-sm text-muted-foreground">
          Add items to your cart to continue
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cart Items */}
      <div className="space-y-4">
        {items.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>

      {/* Summary Card */}
      <Card className="p-6 bg-muted/50">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Items</span>
            <span className="font-medium text-foreground">{items.length}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium text-foreground">
              ₦{totalPrice.toFixed(2)}
            </span>
          </div>
          <div className="border-t border-border pt-3">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-foreground">
                Total Amount
              </span>
              <span className="text-2xl font-bold text-primary">
                ₦{totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
