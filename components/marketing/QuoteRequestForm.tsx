"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Input, Select, Textarea } from "@/components/ui";
import {
  regionsApi,
  type PickupRegion,
  type DeliveryRegion,
  type DeliveryRegionArea,
} from "@/lib/api/regions";
import { useAuthStore } from "@/lib/store/authStore";
import { saveQuoteDraft } from "@/lib/quoteDraft";
import { setPostAuthRedirect } from "@/lib/auth/postAuthRedirect";

const CREATE_PATH = "/dashboard/create";

interface QuoteRequestFormProps {
  title: string;
  subtitle: string;
  deliveryTypes: { value: string; label: string }[];
  packageSizes: { value: string; label: string }[];
}

export function QuoteRequestForm({
  title,
  subtitle,
  deliveryTypes,
  packageSizes,
}: QuoteRequestFormProps) {
  const router = useRouter();
  const { isAuthenticated, loadAuth } = useAuthStore();

  const [pickups, setPickups] = useState<PickupRegion[]>([]);
  const [deliveries, setDeliveries] = useState<DeliveryRegion[]>([]);
  const [deliveryAreas, setDeliveryAreas] = useState<DeliveryRegionArea[]>([]);
  const [pickupsLoading, setPickupsLoading] = useState(true);
  const [deliveriesLoading, setDeliveriesLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    pickup_region_id: "",
    delivery_region_id: "",
    delivery_region_area_id: "",
    pickup_address: "",
    delivery_address: "",
    sender_phone: "",
    package_description: "",
    package_size: "",
    delivery_type: deliveryTypes[0]?.value ?? "standard",
  });

  useEffect(() => {
    loadAuth();
  }, [loadAuth]);

  useEffect(() => {
    let cancelled = false;
    regionsApi
      .getPickups()
      .then((data) => {
        if (!cancelled) setPickups(data);
      })
      .finally(() => {
        if (!cancelled) setPickupsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!form.pickup_region_id) {
      setDeliveries([]);
      return;
    }
    let cancelled = false;
    setDeliveriesLoading(true);
    regionsApi
      .getDeliveriesForPickup(Number(form.pickup_region_id))
      .then((data) => {
        if (!cancelled) setDeliveries(data);
      })
      .finally(() => {
        if (!cancelled) setDeliveriesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [form.pickup_region_id]);

  useEffect(() => {
    if (!form.delivery_region_id) {
      setDeliveryAreas([]);
      return;
    }
    let cancelled = false;
    regionsApi
      .getAreasForDelivery(Number(form.delivery_region_id))
      .then((data) => {
        if (!cancelled) setDeliveryAreas(data);
      });
    return () => {
      cancelled = true;
    };
  }, [form.delivery_region_id]);

  const deliveryLabel =
    deliveryTypes.find((t) => t.value === form.delivery_type)?.label ?? form.delivery_type;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.pickup_region_id || !form.delivery_region_id) {
      setError("Select pickup and delivery areas.");
      return;
    }
    if (!form.pickup_address.trim() || !form.delivery_address.trim()) {
      setError("Enter pickup and delivery addresses.");
      return;
    }
    if (!form.sender_phone.trim()) {
      setError("Enter your phone number.");
      return;
    }
    if (!form.package_description.trim()) {
      setError("Describe what you are sending.");
      return;
    }

    setSubmitting(true);

    saveQuoteDraft({
      pickup_region_id: Number(form.pickup_region_id),
      delivery_region_id: Number(form.delivery_region_id),
      delivery_region_area_id: form.delivery_region_area_id
        ? Number(form.delivery_region_area_id)
        : undefined,
      pickup_address: form.pickup_address.trim(),
      delivery_address: form.delivery_address.trim(),
      sender_phone: form.sender_phone.trim(),
      package_description: form.package_description.trim(),
      package_size: form.package_size || undefined,
      delivery_type_label: deliveryLabel,
    });

    if (isAuthenticated) {
      router.push(CREATE_PATH);
      setSubmitting(false);
      return;
    }

    setPostAuthRedirect(CREATE_PATH);
    router.push(`/signup?next=${encodeURIComponent(CREATE_PATH)}`);
    setSubmitting(false);
  };

  return (
    <div id="quote" className="scroll-mt-28">
    <Card className="p-6 sm:p-8">
      <h2 className="text-xl font-semibold text-foreground mb-2">{title}</h2>
      <p className="text-sm text-muted-foreground mb-6">{subtitle}</p>

      {error ? (
        <p className="mb-4 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Pickup area"
            name="pickup_region_id"
            value={form.pickup_region_id}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                pickup_region_id: e.target.value,
                delivery_region_id: "",
                delivery_region_area_id: "",
              }))
            }
            options={[
              { value: "", label: pickupsLoading ? "Loading…" : "Select pickup area" },
              ...pickups.map((p) => ({ value: String(p.id), label: p.name })),
            ]}
            required
          />
          <Select
            label="Delivery area"
            name="delivery_region_id"
            value={form.delivery_region_id}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                delivery_region_id: e.target.value,
                delivery_region_area_id: "",
              }))
            }
            options={[
              {
                value: "",
                label: !form.pickup_region_id
                  ? "Select pickup first"
                  : deliveriesLoading
                    ? "Loading…"
                    : "Select delivery area",
              },
              ...deliveries.map((d) => ({ value: String(d.id), label: d.name })),
            ]}
            required
          />
        </div>

        {deliveryAreas.length > 0 ? (
          <Select
            label="Delivery sub-area (optional)"
            name="delivery_region_area_id"
            value={form.delivery_region_area_id}
            onChange={(e) =>
              setForm((f) => ({ ...f, delivery_region_area_id: e.target.value }))
            }
            options={[
              { value: "", label: "Optional sub-area" },
              ...deliveryAreas.map((a) => ({ value: String(a.id), label: a.name })),
            ]}
          />
        ) : null}

        <Input
          label="Pickup address"
          name="pickup_address"
          value={form.pickup_address}
          onChange={(e) => setForm((f) => ({ ...f, pickup_address: e.target.value }))}
          required
        />
        <Input
          label="Delivery address"
          name="delivery_address"
          value={form.delivery_address}
          onChange={(e) => setForm((f) => ({ ...f, delivery_address: e.target.value }))}
          required
        />
        <Input
          label="Your phone"
          name="sender_phone"
          type="tel"
          value={form.sender_phone}
          onChange={(e) => setForm((f) => ({ ...f, sender_phone: e.target.value }))}
          required
        />
        <Textarea
          label="Item description"
          name="package_description"
          value={form.package_description}
          onChange={(e) => setForm((f) => ({ ...f, package_description: e.target.value }))}
          required
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Package size"
            name="package_size"
            value={form.package_size}
            onChange={(e) => setForm((f) => ({ ...f, package_size: e.target.value }))}
            options={[{ value: "", label: "Select size" }, ...packageSizes]}
          />
          <Select
            label="Delivery type"
            name="delivery_type"
            value={form.delivery_type}
            onChange={(e) => setForm((f) => ({ ...f, delivery_type: e.target.value }))}
            options={deliveryTypes.map((t) => ({ value: t.value, label: t.label }))}
          />
        </div>

        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={submitting}>
          {submitting ? "Continuing…" : isAuthenticated ? "Continue to booking" : "Sign up to continue"}
        </Button>
      </form>
    </Card>
    </div>
  );
}
