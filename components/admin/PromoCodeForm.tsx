"use client";

import { useState } from "react";
import { Button, Input, FormErrorAlert } from "@/components/ui";
import { getApiErrorDetails, type ParsedApiError } from "@/lib/errors/apiError";

interface PromoFormData {
  code: string;
  discount_type: string;
  discount_value: number;
  min_order_value: number | null;
  max_uses: number | null;
  expires_at: string;
}

interface PromoCodeFormProps {
  initialData?: Partial<PromoFormData>;
  onSubmit: (data: PromoFormData) => Promise<void>;
  submitLabel: string;
}

export function PromoCodeForm({ initialData, onSubmit, submitLabel }: PromoCodeFormProps) {
  const [form, setForm] = useState<PromoFormData>({
    code: initialData?.code || "",
    discount_type: initialData?.discount_type || "percentage",
    discount_value: initialData?.discount_value || 0,
    min_order_value: initialData?.min_order_value ?? null,
    max_uses: initialData?.max_uses ?? null,
    expires_at: initialData?.expires_at ? initialData.expires_at.split("T")[0] : "",
  });
  const [saving, setSaving] = useState(false);
  const [errorDetails, setErrorDetails] = useState<ParsedApiError | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorDetails(null);

    if (!form.code.trim()) {
      setErrorDetails({ message: "Code is required" });
      return;
    }
    if (form.discount_value <= 0) {
      setErrorDetails({ message: "Discount value must be positive" });
      return;
    }

    setSaving(true);
    try {
      await onSubmit(form);
    } catch (err) {
      setErrorDetails(getApiErrorDetails(err, "Failed to save promo code"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormErrorAlert
        message={errorDetails?.message}
        items={errorDetails?.items}
      />

      <Input
        label="Promo Code"
        value={form.code}
        onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
        placeholder="e.g. SAVE20"
        id="promo-code"
      />

      <div className="w-full">
        <label htmlFor="promo-type" className="block text-sm font-medium text-foreground mb-2">
          Discount Type
        </label>
        <select
          id="promo-type"
          value={form.discount_type}
          onChange={(e) => setForm({ ...form, discount_type: e.target.value })}
          className="w-full px-5 py-3 bg-muted border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-300"
        >
          <option value="percentage">Percentage (%)</option>
          <option value="fixed">Fixed Amount (₦)</option>
        </select>
      </div>

      <Input
        label={form.discount_type === "percentage" ? "Discount (%)" : "Discount Amount (₦)"}
        type="number"
        value={form.discount_value || ""}
        onChange={(e) => setForm({ ...form, discount_value: parseFloat(e.target.value) || 0 })}
        placeholder="e.g. 20"
        id="promo-value"
      />

      <Input
        label="Minimum Order Value (₦) — optional"
        type="number"
        value={form.min_order_value ?? ""}
        onChange={(e) => setForm({ ...form, min_order_value: e.target.value ? parseFloat(e.target.value) : null })}
        placeholder="e.g. 5000"
        id="promo-min"
      />

      <Input
        label="Maximum Uses — optional (leave empty for unlimited)"
        type="number"
        value={form.max_uses ?? ""}
        onChange={(e) => setForm({ ...form, max_uses: e.target.value ? parseInt(e.target.value) : null })}
        placeholder="e.g. 100"
        id="promo-max"
      />

      <Input
        label="Expiry Date — optional"
        type="date"
        value={form.expires_at}
        onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
        id="promo-expires"
      />

      <Button type="submit" variant="primary" disabled={saving}>
        {saving ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
