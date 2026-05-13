"use client";

import { useEffect } from "react";
import { Button } from "./ButtonLegacy";
import { Card } from "./Card";

interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "primary" | "danger";
  isConfirming?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export function ConfirmationDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "primary",
  isConfirming = false,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isConfirming) {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, isConfirming, onCancel]);

  if (!open) return null;

  const confirmClassName =
    variant === "danger"
      ? "bg-destructive text-destructive-foreground hover:brightness-110 focus:ring-destructive shadow-md"
      : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close confirmation dialog"
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={isConfirming ? undefined : onCancel}
      />
      <div role="dialog" aria-modal="true" className="relative w-full max-w-md">
        <Card className="border border-border p-6 shadow-2xl">
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">{title}</h2>
            <p className="text-sm leading-6 text-muted-foreground">{description}</p>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isConfirming}
              className="w-full sm:w-auto"
            >
              {cancelLabel}
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={onConfirm}
              disabled={isConfirming}
              className={`w-full sm:w-auto ${confirmClassName}`}
            >
              {isConfirming ? "Please wait..." : confirmLabel}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
