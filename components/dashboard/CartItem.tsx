"use client";

import React from "react";
import { Card, Badge, Button } from "@/components/ui";
import { CartItem as CartItemType } from "@/types";
import { useCartStore } from "@/lib/store/cartStore";

interface CartItemProps {
  item: CartItemType;
  onEdit?: (item: CartItemType) => void;
  onCheckout?: (itemId: number) => void;
}

function formatEta(item: CartItemType): string | null {
  if (item.eta_label && String(item.eta_label).trim()) return item.eta_label.trim();
  if (item.eta_min_hours != null && item.eta_max_hours != null) {
    if (item.eta_min_hours === item.eta_max_hours) return `${item.eta_min_hours} hrs`;
    return `${item.eta_min_hours}–${item.eta_max_hours} hrs`;
  }
  return null;
}

export function CartItem({ item, onEdit, onCheckout }: CartItemProps) {
  const { removeItem } = useCartStore();
  const [isRemoving, setIsRemoving] = React.useState(false);

  const handleRemove = async () => {
    if (window.confirm("Are you sure you want to remove this item?")) {
      setIsRemoving(true);
      try {
        await removeItem(item.id);
      } catch (error) {
        console.error("Failed to remove item:", error);
      } finally {
        setIsRemoving(false);
      }
    }
  };

  return (
    <Card className="p-5 hover:border-primary/50 transition-colors">
      <div className="space-y-4">
        {/* Header with badges */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex gap-2 flex-wrap">
            {item.quantity && item.quantity > 1 && (
              <Badge variant="info">Qty: {item.quantity}</Badge>
            )}
            {item.is_fragile && (
              <Badge variant="error">⚠️ Fragile</Badge>
            )}
            {item.item_value && (
              <Badge variant="default">₦{Number(item.item_value).toLocaleString()}</Badge>
            )}
          </div>
          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(item)}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
                title="Edit item"
              >
                <svg
                  className="w-4 h-4 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
            )}
            <button
              onClick={handleRemove}
              disabled={isRemoving}
              className="p-2 hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50"
              title="Remove item"
            >
              <svg
                className="w-4 h-4 text-destructive"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Delivery Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* From */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase">From</p>
            <p className="text-sm font-medium text-foreground">
              {item.sender_name || "N/A"}
            </p>
            <p className="text-xs text-muted-foreground">
              {item.sender_phone || "N/A"}
            </p>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {item.pickup_address || "N/A"}
            </p>
          </div>

          {/* To */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase">To</p>
            <p className="text-sm font-medium text-foreground">
              {item.receiver_name}
            </p>
            <p className="text-xs text-muted-foreground">
              {item.receiver_phone}
            </p>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {item.delivery_address}
            </p>
          </div>
        </div>

        {/* Package Description */}
        {item.package_description && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase">
              Package
            </p>
            <p className="text-sm text-foreground">{item.package_description}</p>
          </div>
        )}

        {/* Footer with price and checkout */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between sm:justify-start gap-2 flex-1">
            <div className="text-xs text-muted-foreground space-y-0.5">
              {formatEta(item) && <p>ETA: {formatEta(item)}</p>}
              {item.distance_km != null && Number(item.distance_km) > 0 && (
                <p>{item.distance_km} km (legacy)</p>
              )}
            </div>
            <p className="text-lg sm:text-xl font-semibold text-primary">
              {item.estimated_price != null
                ? `₦${Number(item.estimated_price).toFixed(2)}`
                : "Price TBD"}
            </p>
          </div>

          {/* Individual Checkout Button */}
          {onCheckout && item.estimated_price != null && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onCheckout(item.id)}
              className="w-full sm:w-auto"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              Checkout
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
