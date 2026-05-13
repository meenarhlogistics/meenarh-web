"use client";

import React from "react";
import { Card, Badge, Button, ConfirmationDialog } from "@/components/ui";
import { CartEntry } from "@/types";
import { useCartStore } from "@/lib/store/cartStore";

interface CartItemProps {
  item: CartEntry;
  onEdit?: (item: CartEntry) => void;
  onCheckout?: (item: CartEntry) => void;
}

function formatEta(item: {
  eta_label?: string | null;
  eta_min_hours?: number | null;
  eta_max_hours?: number | null;
}): string | null {
  if (item.eta_label && String(item.eta_label).trim()) return item.eta_label.trim();
  if (item.eta_min_hours != null && item.eta_max_hours != null) {
    if (item.eta_min_hours === item.eta_max_hours) return `${item.eta_min_hours} hrs`;
    return `${item.eta_min_hours}–${item.eta_max_hours} hrs`;
  }
  return null;
}

export function CartItem({ item, onEdit, onCheckout }: CartItemProps) {
  const { removeItem, removeBulkEntry } = useCartStore();
  const [isRemoving, setIsRemoving] = React.useState(false);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = React.useState(false);

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      if (item.kind === "bulk") {
        await removeBulkEntry(item.id);
      } else {
        await removeItem(item.id);
      }
      setIsRemoveDialogOpen(false);
    } catch (error) {
      console.error("Failed to remove item:", error);
    } finally {
      setIsRemoving(false);
    }
  };

  if (item.kind === "bulk") {
    const totalPrice = Number(item.estimated_total ?? item.estimated_price) || 0;
    return (
      <>
        <Card className="p-5 hover:border-primary/50 transition-colors">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex gap-2 flex-wrap">
                <Badge variant="default">Bulk Delivery</Badge>
                <Badge variant="info">{item.item_count} destinations</Badge>
              </div>
              <button
                onClick={() => setIsRemoveDialogOpen(true)}
                disabled={isRemoving}
                className="p-2 hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50"
                title="Remove bulk delivery"
                type="button"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase">Sender</p>
                <p className="text-sm font-medium text-foreground">{item.sender_name || "N/A"}</p>
                <p className="text-xs text-muted-foreground">{item.sender_phone || "N/A"}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{item.pickup_address || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase">Summary</p>
                <p className="text-sm font-medium text-foreground">
                  {item.item_count} {item.item_count === 1 ? "delivery" : "deliveries"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Combined checkout as one grouped bulk order
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase">Destinations</p>
              <div className="space-y-2">
                {item.items.map((bulkItem) => (
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
                      <div className="text-right shrink-0">
                        <p className="font-semibold text-primary">
                          ₦{Number(bulkItem.estimated_price || 0).toFixed(2)}
                        </p>
                        {formatEta(bulkItem) && (
                          <p className="text-xs text-muted-foreground mt-1">
                            ETA: {formatEta(bulkItem)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-3 border-t border-border">
              <div>
                <p className="text-xs text-muted-foreground">Grouped subtotal</p>
                <p className="text-xl font-semibold text-primary">₦{totalPrice.toFixed(2)}</p>
              </div>
              {onCheckout && totalPrice > 0 && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onCheckout(item)}
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
        <ConfirmationDialog
          open={isRemoveDialogOpen}
          title="Remove bulk delivery?"
          description="This grouped bulk delivery will be removed from your cart."
          confirmLabel="Remove"
          cancelLabel="Keep in cart"
          variant="danger"
          isConfirming={isRemoving}
          onConfirm={handleRemove}
          onCancel={() => setIsRemoveDialogOpen(false)}
        />
      </>
    );
  }

  return (
    <>
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
                onClick={() => setIsRemoveDialogOpen(true)}
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
                onClick={() => onCheckout(item)}
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
      <ConfirmationDialog
        open={isRemoveDialogOpen}
        title="Remove delivery?"
        description="This delivery will be removed from your cart."
        confirmLabel="Remove"
        cancelLabel="Keep in cart"
        variant="danger"
        isConfirming={isRemoving}
        onConfirm={handleRemove}
        onCancel={() => setIsRemoveDialogOpen(false)}
      />
    </>
  );
}
