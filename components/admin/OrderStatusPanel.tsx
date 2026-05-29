"use client";

import { useState } from "react";
import { adminApi } from "@/lib/api/admin";
import { Button, Input, FormErrorAlert } from "@/components/ui";
import { PaystackReferenceCopy } from "@/components/admin/PaystackReferenceCopy";
import { ReconcilePaystackButton } from "@/components/admin/ReconcilePaystackButton";
import { getApiErrorDetails, showApiErrorToast, type ParsedApiError } from "@/lib/errors/apiError";

const PENDING_PAYMENT_STATUS = "Pending Payment";

const LOGISTICS_STATUSES = [
  "Order Created",
  "Picked Up",
  "In Transit",
  "Out for Delivery",
  "Delivered",
];

export interface OrderStatusPanelOrder {
  id: number;
  tracking_number: string;
  receiver_name: string;
  status: string;
  paystack_reference?: string | null;
}

interface OrderStatusPanelProps {
  order: OrderStatusPanelOrder;
  onUpdated: () => void;
  variant?: "card" | "modal";
  onClose?: () => void;
}

export function OrderStatusPanel({
  order,
  onUpdated,
  variant = "card",
  onClose,
}: OrderStatusPanelProps) {
  const isPendingPayment = order.status === PENDING_PAYMENT_STATUS;
  const [status, setStatus] = useState(order.status);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorDetails, setErrorDetails] = useState<ParsedApiError | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setErrorDetails(null);
    try {
      const statusToSend = isPendingPayment ? PENDING_PAYMENT_STATUS : status;
      await adminApi.updateOrderStatus(order.id, statusToSend, note || undefined);
      onUpdated();
      onClose?.();
      setNote("");
    } catch (err) {
      const details = getApiErrorDetails(err, "Failed to update status");
      setErrorDetails(details);
      showApiErrorToast(err, "Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  const canSave = isPendingPayment ? !!note.trim() : status !== order.status || !!note.trim();

  const content = (
    <div className="space-y-4">
      {variant === "modal" && (
        <h2 className="text-lg font-semibold text-foreground">
          {isPendingPayment ? "Pending payment order" : "Update Order Status"}
        </h2>
      )}
      {variant === "card" && (
        <h2 className="text-lg font-semibold text-foreground">Update status</h2>
      )}

      <div className="text-sm text-muted-foreground">
        <span className="font-mono text-foreground font-medium">{order.tracking_number}</span>
        {" — "}
        {order.receiver_name}
      </div>

      <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-1">
        <p className="text-xs font-medium text-muted-foreground">Paystack reference</p>
        <PaystackReferenceCopy reference={order.paystack_reference} />
      </div>

      {isPendingPayment && (
        <div className="space-y-3">
          <p className="text-sm text-amber-700 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
            Payment has not been confirmed yet. You can add an internal note only, or check Paystack
            now if the customer has already paid. Delivery status updates unlock after payment is
            confirmed.
          </p>
          <ReconcilePaystackButton
            reference={order.paystack_reference}
            onReconciled={() => {
              onUpdated();
              onClose?.();
            }}
            variant="primary"
            className="w-full"
          />
        </div>
      )}

      <FormErrorAlert message={errorDetails?.message} items={errorDetails?.items} />

      {isPendingPayment ? (
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Status</label>
          <p className="px-4 py-3 bg-muted border border-input rounded-lg text-foreground">
            {PENDING_PAYMENT_STATUS}
          </p>
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">New status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-3 bg-muted border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          >
            {LOGISTICS_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      )}

      <Input
        label={isPendingPayment ? "Note" : "Note (optional)"}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder={
          isPendingPayment
            ? "e.g. Customer called about bank transfer delay"
            : "e.g. Package delivered to gateman"
        }
        id={`status-note-${order.id}`}
      />

      <div className={`flex gap-2 ${variant === "modal" ? "flex-col-reverse sm:flex-row sm:justify-end" : ""}`}>
        {onClose && (
          <Button variant="secondary" onClick={onClose} disabled={saving} className="w-full sm:w-auto">
            Cancel
          </Button>
        )}
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={saving || !canSave}
          className={variant === "modal" ? "w-full sm:w-auto" : "w-full"}
        >
          {saving ? "Saving..." : isPendingPayment ? "Add note" : "Update status"}
        </Button>
      </div>
    </div>
  );

  if (variant === "modal") {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
        <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-6">{content}</div>
  );
}
