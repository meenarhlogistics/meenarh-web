"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { regionsApi } from "@/lib/api/regions";
import type {
  PickupRegion,
  DeliveryRegion,
  DeliveryRegionArea,
  RegionQuote,
} from "@/lib/api/regions";
import type { BulkOrderItemRequest } from "@/types";
import { Button, Input, Textarea, Toggle } from "@/components/ui";
import { ChevronDown } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import { useCartStore } from "@/lib/store/cartStore";
import { getApiErrorMessage } from "@/lib/errors/apiError";

function newLineId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `line-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const EMPTY_ITEM = (): BulkOrderItemRequest => ({
  pickup_region_id: 0,
  delivery_region_id: 0,
  delivery_address: "",
  receiver_name: "",
  receiver_phone: "",
  quantity: 1,
  is_fragile: false,
});

type LineRoutePricing =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; priceNgn: number }
  | { status: "error" };

interface BulkLine {
  id: string;
  item: BulkOrderItemRequest;
}

function isItemFilled(item: BulkOrderItemRequest): boolean {
  return !!(
    item.pickup_region_id &&
    item.delivery_region_id &&
    item.delivery_address?.trim() &&
    item.receiver_name?.trim() &&
    item.receiver_phone?.trim()
  );
}

// ─── ItemRow (form step) ──────────────────────────────────────────────────────

interface ItemRowProps {
  lineId: string;
  index: number;
  item: BulkOrderItemRequest;
  pickupRegions: PickupRegion[];
  pickupsLoading: boolean;
  onChange: (updated: BulkOrderItemRequest) => void;
  onRemove: () => void;
  canRemove: boolean;
  forcedExpanded: boolean | null;
  onLeaveSyncedPanels: () => void;
  onRoutePricing: (lineId: string, pricing: LineRoutePricing) => void;
}

function ItemRow({
  lineId,
  index,
  item,
  pickupRegions,
  pickupsLoading,
  onChange,
  onRemove,
  canRemove,
  forcedExpanded,
  onLeaveSyncedPanels,
  onRoutePricing,
}: ItemRowProps) {
  const [localOpen, setLocalOpen] = useState(true);
  const open = forcedExpanded !== null ? forcedExpanded : localOpen;
  const filled = isItemFilled(item);

  const [deliveries, setDeliveries] = useState<DeliveryRegion[]>([]);
  const [deliveriesLoading, setDeliveriesLoading] = useState(false);
  const [deliveryAreas, setDeliveryAreas] = useState<DeliveryRegionArea[]>([]);
  const [deliveryAreasLoading, setDeliveryAreasLoading] = useState(false);
  const [quote, setQuote] = useState<RegionQuote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const loadDeliveries = async () => {
      if (!item.pickup_region_id) {
        return [];
      }
      setDeliveriesLoading(true);
      try {
        return await regionsApi.getDeliveriesForPickup(item.pickup_region_id);
      } catch {
        return [];
      } finally {
        if (!cancelled) setDeliveriesLoading(false);
      }
    };

    loadDeliveries().then((d) => {
      if (!cancelled) setDeliveries(d);
    });

    return () => { cancelled = true; };
  }, [item.pickup_region_id]);

  useEffect(() => {
    let cancelled = false;
    const loadDeliveryAreas = async () => {
      if (!item.delivery_region_id) {
        return [];
      }
      setDeliveryAreasLoading(true);
      try {
        return await regionsApi.getAreasForDelivery(item.delivery_region_id);
      } catch {
        return [];
      } finally {
        if (!cancelled) setDeliveryAreasLoading(false);
      }
    };

    loadDeliveryAreas().then((a) => {
      if (!cancelled) setDeliveryAreas(a);
    });

    return () => { cancelled = true; };
  }, [item.delivery_region_id]);

  useEffect(() => {
    let cancelled = false;
    const loadQuote = async () => {
      if (!item.pickup_region_id || !item.delivery_region_id) {
        return { quote: null as RegionQuote | null, quoteError: "", pricing: { status: "idle" } as LineRoutePricing };
      }
      setQuoteLoading(true);
      onRoutePricing(lineId, { status: "loading" });
      try {
        const q = await regionsApi.getQuote(item.pickup_region_id, item.delivery_region_id);
        if (q) {
          return {
            quote: q,
            quoteError: "",
            pricing: { status: "ready", priceNgn: Number(q.price_ngn) } as LineRoutePricing,
          };
        } else {
          return {
            quote: null,
            quoteError: "",
            pricing: { status: "error" } as LineRoutePricing,
          };
        }
      } catch {
        return {
          quote: null,
          quoteError: "Could not load price for this route.",
          pricing: { status: "error" } as LineRoutePricing,
        };
      } finally {
        if (!cancelled) setQuoteLoading(false);
      }
    };

    loadQuote().then(({ quote: q, quoteError: err, pricing }) => {
      if (cancelled) return;
      setQuote(q);
      setQuoteError(err);
      onRoutePricing(lineId, pricing);
    });

    return () => { cancelled = true; };
  }, [lineId, item.pickup_region_id, item.delivery_region_id, onRoutePricing]);

  const pickupName = pickupRegions.find((r) => r.id === item.pickup_region_id)?.name;
  const deliveryName = deliveries.find((r) => r.id === item.delivery_region_id)?.name;

  const collapsedSummary = (() => {
    const parts: string[] = [];
    if (item.receiver_name) parts.push(item.receiver_name);
    if (pickupName && deliveryName) parts.push(`${pickupName} → ${deliveryName}`);
    else if (item.delivery_address) parts.push(item.delivery_address);
    return parts.join(" · ") || "Incomplete";
  })();

  const collapsedPriceLabel = (() => {
    if (!item.pickup_region_id || !item.delivery_region_id) return "—";
    if (quoteLoading) return "…";
    if (quote) return `₦${Number(quote.price_ngn).toLocaleString()}`;
    if (quoteError) return "—";
    return "—";
  })();

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => {
          onLeaveSyncedPanels();
          setLocalOpen((o) => !o);
        }}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-card hover:bg-muted/40 transition-colors text-left"
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className={`shrink-0 w-2 h-2 rounded-full ${filled ? "bg-green-500" : "bg-amber-400"}`} />
          <span className="text-sm font-semibold text-foreground shrink-0">Item #{index + 1}</span>
          {!open && (
            <span className="text-xs text-muted-foreground truncate">{collapsedSummary}</span>
          )}
        </div>
        {!open && (
          <span className="text-xs font-semibold tabular-nums text-primary shrink-0 mr-1">
            {collapsedPriceLabel}
          </span>
        )}
        <div className="flex items-center gap-3 shrink-0">
          {canRemove && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") { e.stopPropagation(); onRemove(); }
              }}
              className="text-xs text-destructive hover:underline"
            >
              Remove
            </span>
          )}
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 pt-2 space-y-6 border-t border-border bg-card">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Receiver</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Receiver Name"
                value={item.receiver_name}
                onChange={(e) => onChange({ ...item, receiver_name: e.target.value })}
                placeholder="Recipient's name"
                required
                id={`receiver-name-${index}`}
              />
              <Input
                label="Receiver Phone"
                type="tel"
                value={item.receiver_phone}
                onChange={(e) => onChange({ ...item, receiver_phone: e.target.value })}
                placeholder="08098765432"
                required
                id={`receiver-phone-${index}`}
              />
            </div>
            <Textarea
              label="Delivery Address"
              value={item.delivery_address}
              onChange={(e) => onChange({ ...item, delivery_address: e.target.value })}
              placeholder="Enter full delivery address"
              required
              id={`delivery-address-${index}`}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Package details</h3>
            <Textarea
              label="Package Description (Optional)"
              value={item.package_description || ""}
              onChange={(e) => onChange({ ...item, package_description: e.target.value || undefined })}
              placeholder="Brief description of package contents"
              id={`pkg-desc-${index}`}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Item Value (₦)"
                type="number"
                step="0.01"
                min="0"
                value={item.item_value != null ? String(item.item_value) : ""}
                onChange={(e) => {
                  const v = e.target.value;
                  onChange({ ...item, item_value: v === "" ? undefined : Number(v) });
                }}
                placeholder="e.g. 5000"
                id={`item-value-${index}`}
              />
              <Input
                label="Quantity"
                type="number"
                min={1}
                value={item.quantity ?? 1}
                onChange={(e) => {
                  const n = parseInt(e.target.value, 10);
                  onChange({ ...item, quantity: Number.isFinite(n) && n >= 1 ? n : 1 });
                }}
                id={`quantity-${index}`}
              />
            </div>
            <Toggle
              checked={item.is_fragile ?? false}
              onChange={(checked) => onChange({ ...item, is_fragile: checked })}
              label="Fragile Item"
            />

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Pickup area <span className="text-destructive">*</span>
              </label>
              <select
                value={item.pickup_region_id || ""}
                disabled={pickupsLoading || pickupRegions.length === 0}
                onChange={(e) => {
                  const id = e.target.value ? Number(e.target.value) : 0;
                  onChange({ ...item, pickup_region_id: id, delivery_region_id: 0, delivery_region_area_id: undefined });
                }}
                className="w-full px-4 py-3 bg-muted border border-input rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all disabled:opacity-60"
                required
              >
                <option value="">{pickupsLoading ? "Loading…" : "Select pickup zone…"}</option>
                {pickupRegions.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>

            <Input
              label="Pickup Address Override (optional)"
              value={item.pickup_address || ""}
              onChange={(e) => onChange({ ...item, pickup_address: e.target.value || undefined })}
              placeholder="Leave blank to use the shared default"
              id={`pickup-address-${index}`}
            />

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Delivery area <span className="text-destructive">*</span>
              </label>
              <select
                value={item.delivery_region_id || ""}
                disabled={!item.pickup_region_id || deliveriesLoading || deliveries.length === 0}
                onChange={(e) => {
                  const id = e.target.value ? Number(e.target.value) : 0;
                  onChange({ ...item, delivery_region_id: id, delivery_region_area_id: undefined });
                }}
                className="w-full px-4 py-3 bg-muted border border-input rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all disabled:opacity-60"
                required
              >
                <option value="">
                  {!item.pickup_region_id ? "Select a pickup area first" : deliveriesLoading ? "Loading…" : "Select delivery region…"}
                </option>
                {deliveries.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>

            {deliveryAreas.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Delivery sub-area (optional)
                </label>
                <select
                  value={item.delivery_region_area_id ?? ""}
                  disabled={deliveryAreasLoading}
                  onChange={(e) => onChange({ ...item, delivery_region_area_id: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full px-4 py-3 bg-muted border border-input rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all disabled:opacity-60"
                >
                  <option value="">None</option>
                  {deliveryAreas.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>
            )}

            {item.pickup_region_id && !deliveriesLoading && deliveries.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No delivery areas are configured for this pickup yet. Choose another pickup or contact support.
              </p>
            )}

            {(quoteLoading || quote || quoteError) && (
              <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm">
                {quoteLoading && <p className="text-muted-foreground">Loading price and ETA…</p>}
                {!quoteLoading && quoteError && <p className="text-destructive">{quoteError}</p>}
                {!quoteLoading && quote && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Estimated delivery</p>
                      <p className="font-medium text-foreground">
                        {quote.eta_display ||
                          (quote.eta_min_hours != null && quote.eta_max_hours != null
                            ? `${quote.eta_min_hours}–${quote.eta_max_hours} hrs`
                            : "—")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Flat rate</p>
                      <p className="text-xl font-semibold text-primary">₦{Number(quote.price_ngn).toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ReviewStep (step 2 – read-only summary + Paystack CTA) ──────────────────

interface ReviewStepProps {
  senderName: string;
  senderPhone: string;
  pickupAddress: string;
  lines: BulkLine[];
  pickupRegions: PickupRegion[];
  routePricingByLineId: Record<string, LineRoutePricing>;
  estimatedTotal: number;
  onBack: () => void;
  onAddToCart: () => void;
  submitting: boolean;
  submitError: string;
}

function ReviewStep({
  senderName,
  senderPhone,
  pickupAddress,
  lines,
  pickupRegions,
  routePricingByLineId,
  estimatedTotal,
  onBack,
  onAddToCart,
  submitting,
  submitError,
}: ReviewStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">Review Bulk Order</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Confirm details before adding this grouped bulk delivery to your cart.
        </p>
      </div>

      {submitError && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
          {submitError}
        </div>
      )}

      {/* Sender summary */}
      {(senderName || senderPhone || pickupAddress) && (
        <section className="bg-card border border-border rounded-xl p-4 sm:p-5 space-y-1">
          <h2 className="text-sm font-semibold text-foreground mb-2">Sender</h2>
          {senderName && (
            <div className="flex gap-2 text-sm">
              <span className="text-muted-foreground w-28 shrink-0">Name</span>
              <span className="text-foreground">{senderName}</span>
            </div>
          )}
          {senderPhone && (
            <div className="flex gap-2 text-sm">
              <span className="text-muted-foreground w-28 shrink-0">Phone</span>
              <span className="text-foreground">{senderPhone}</span>
            </div>
          )}
          {pickupAddress && (
            <div className="flex gap-2 text-sm">
              <span className="text-muted-foreground w-28 shrink-0">Default pickup</span>
              <span className="text-foreground">{pickupAddress}</span>
            </div>
          )}
        </section>
      )}

      {/* Items summary */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Items ({lines.length})</h2>
        {lines.map((line, i) => {
          const { item } = line;
          const pricingState = routePricingByLineId[line.id];
          const priceLabel =
            pricingState?.status === "ready"
              ? `₦${pricingState.priceNgn.toLocaleString()}`
              : pricingState?.status === "loading"
                ? "…"
                : "—";
          const pickupName = pickupRegions.find((r) => r.id === item.pickup_region_id)?.name;

          return (
            <div key={line.id} className="bg-card border border-border rounded-xl p-4 text-sm space-y-1">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-foreground">Item #{i + 1}</span>
                <span className="font-semibold text-primary tabular-nums">{priceLabel}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-muted-foreground w-28 shrink-0">Receiver</span>
                <span className="text-foreground">{item.receiver_name} · {item.receiver_phone}</span>
              </div>
              {pickupName && (
                <div className="flex gap-2">
                  <span className="text-muted-foreground w-28 shrink-0">Pickup area</span>
                  <span className="text-foreground">{pickupName}</span>
                </div>
              )}
              {item.pickup_address && (
                <div className="flex gap-2">
                  <span className="text-muted-foreground w-28 shrink-0">Pickup address</span>
                  <span className="text-foreground">{item.pickup_address}</span>
                </div>
              )}
              <div className="flex gap-2">
                <span className="text-muted-foreground w-28 shrink-0">Delivery</span>
                <span className="text-foreground">{item.delivery_address}</span>
              </div>
              {item.package_description && (
                <div className="flex gap-2">
                  <span className="text-muted-foreground w-28 shrink-0">Package</span>
                  <span className="text-foreground">{item.package_description}</span>
                </div>
              )}
              {(item.quantity ?? 1) > 1 && (
                <div className="flex gap-2">
                  <span className="text-muted-foreground w-28 shrink-0">Quantity</span>
                  <span className="text-foreground">{item.quantity}</span>
                </div>
              )}
              {item.is_fragile && (
                <div className="flex gap-2">
                  <span className="text-muted-foreground w-28 shrink-0">Fragile</span>
                  <span className="text-foreground">Yes</span>
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* Total */}
      <div className="rounded-xl border border-border bg-muted/30 p-4 flex items-baseline justify-between">
        <span className="text-sm font-medium text-foreground">Estimated total</span>
        <span className="text-xl font-bold text-primary tabular-nums">
          ₦{estimatedTotal.toLocaleString()}
        </span>
      </div>

      <p className="text-xs text-muted-foreground">
        After this is added to your cart, you can review your combined cart and pay once for both
        single and bulk deliveries.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button type="button" variant="secondary" onClick={onBack} className="sm:flex-1" disabled={submitting}>
          ← Back
        </Button>
        <Button type="button" variant="primary" onClick={onAddToCart} disabled={submitting} className="sm:flex-1">
          {submitting ? "Adding to cart…" : "Add Bulk Delivery to Cart"}
        </Button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CreateBulkOrderPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const addBulkEntry = useCartStore((s) => s.addBulkEntry);

  const [step, setStep] = useState<1 | 2>(1);

  // Shared sender / default pickup
  const [senderName, setSenderName] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");

  const [lines, setLines] = useState<BulkLine[]>(() => [
    { id: newLineId(), item: EMPTY_ITEM() },
    { id: newLineId(), item: EMPTY_ITEM() },
  ]);
  const [routePricingByLineId, setRoutePricingByLineId] = useState<
    Record<string, LineRoutePricing>
  >({});

  const handleRoutePricing = useCallback((lineId: string, pricing: LineRoutePricing) => {
    setRoutePricingByLineId((prev) => ({ ...prev, [lineId]: pricing }));
  }, []);

  const pricingSummary = useMemo(() => {
    let total = 0;
    let ready = 0;
    let loading = 0;
    for (const line of lines) {
      const p = routePricingByLineId[line.id];
      if (!p || p.status === "idle") continue;
      if (p.status === "loading") loading++;
      if (p.status === "ready") { ready++; total += p.priceNgn; }
    }
    return { total, ready, loading, lineCount: lines.length };
  }, [lines, routePricingByLineId]);

  const [pickupRegions, setPickupRegions] = useState<PickupRegion[]>([]);
  const [pickupsLoading, setPickupsLoading] = useState(true);

  const [formError, setFormError] = useState("");
  const [forcedExpanded, setForcedExpanded] = useState<boolean | null>(true);

  // Step 2 state
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    let cancelled = false;
    regionsApi
      .getPickups()
      .then((p) => { if (!cancelled) setPickupRegions(p); })
      .catch(console.error)
      .finally(() => { if (!cancelled) setPickupsLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const updateLine = (id: string, item: BulkOrderItemRequest) =>
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, item } : l)));

  const addLine = () =>
    setLines((prev) => [...prev, { id: newLineId(), item: EMPTY_ITEM() }]);

  const removeLine = (id: string) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
    setRoutePricingByLineId((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  // Step 1 → Step 2: validate then show review
  const handleReview = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    // Email verification gate (same as PaymentStep.tsx)
    if (user?.email_verification_enforced !== false && !user?.is_email_verified) {
      router.push("/dashboard/verify-email");
      return;
    }

    for (let i = 0; i < lines.length; i++) {
      const item = lines[i].item;
      if (
        !item.pickup_region_id ||
        !item.delivery_region_id ||
        !item.delivery_address ||
        !item.receiver_name ||
        !item.receiver_phone
      ) {
        setFormError(`Item #${i + 1} is incomplete. Please fill all required fields.`);
        return;
      }
    }

    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Step 2: add grouped bulk draft to cart and continue in the shared review flow
  const handleAddToCart = async () => {
    setSubmitError("");
    setSubmitting(true);
    try {
      await addBulkEntry({
        sender_name: senderName || undefined,
        sender_phone: senderPhone || undefined,
        pickup_address: pickupAddress || undefined,
        items: lines.map((l) => l.item),
      });
      router.push("/dashboard/create?step=review");
    } catch (err) {
      setSubmitError(
        getApiErrorMessage(err, "Failed to add bulk delivery to cart. Please try again.")
      );
      setSubmitting(false);
    }
  };

  if (step === 2) {
    return (
      <div className="max-w-2xl mx-auto">
        <ReviewStep
          senderName={senderName}
          senderPhone={senderPhone}
          pickupAddress={pickupAddress}
          lines={lines}
          pickupRegions={pickupRegions}
          routePricingByLineId={routePricingByLineId}
          estimatedTotal={pricingSummary.total}
          onBack={() => { setStep(1); setSubmitError(""); }}
          onAddToCart={handleAddToCart}
          submitting={submitting}
          submitError={submitError}
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">New Bulk Order</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Send multiple packages in one shipment. Set a shared pickup address, then specify a pickup
          zone and delivery destination for each item.
        </p>
      </div>

      {formError && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
          {formError}
        </div>
      )}

      <form onSubmit={handleReview} className="space-y-8">
        {/* Shared sender / pickup */}
        <section className="bg-card border border-border rounded-xl p-4 sm:p-6 space-y-4">
          <h2 className="text-base font-semibold text-foreground">Sender &amp; Default Pickup</h2>
          <p className="text-xs text-muted-foreground">
            These default to your profile values. The pickup address applies to all items unless
            overridden per item.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Sender Name (optional)"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="Defaults to your profile name"
              id="sender-name"
            />
            <Input
              label="Sender Phone (optional)"
              value={senderPhone}
              onChange={(e) => setSenderPhone(e.target.value)}
              placeholder="Defaults to your profile phone"
              id="sender-phone"
            />
          </div>
          <Input
            label="Default Pickup Address (optional)"
            value={pickupAddress}
            onChange={(e) => setPickupAddress(e.target.value)}
            placeholder="Defaults to your saved address"
            id="pickup-address"
          />
        </section>

        {/* Items */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">Items ({lines.length})</h2>
            <button
              type="button"
              onClick={() => setForcedExpanded((f) => (f === true ? false : true))}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {forcedExpanded === true ? "Collapse all" : "Expand all"}
            </button>
          </div>

          {lines.map((line, i) => (
            <ItemRow
              key={line.id}
              lineId={line.id}
              index={i}
              item={line.item}
              pickupRegions={pickupRegions}
              pickupsLoading={pickupsLoading}
              onChange={(updated) => updateLine(line.id, updated)}
              onRemove={() => removeLine(line.id)}
              canRemove={lines.length > 2}
              forcedExpanded={forcedExpanded}
              onLeaveSyncedPanels={() => setForcedExpanded(null)}
              onRoutePricing={handleRoutePricing}
            />
          ))}

          <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-2">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-sm font-medium text-foreground">Estimated total (routing)</span>
              <div className="text-right">
                <span className="text-xl font-bold text-primary tabular-nums">
                  {pricingSummary.loading > 0 && pricingSummary.ready === 0
                    ? "…"
                    : `₦${pricingSummary.total.toLocaleString()}`}
                </span>
                {pricingSummary.loading > 0 && pricingSummary.ready > 0 && (
                  <p className="text-xs text-muted-foreground mt-0.5">Updating some routes…</p>
                )}
                {pricingSummary.loading === 0 && pricingSummary.ready < pricingSummary.lineCount && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {pricingSummary.ready} of {pricingSummary.lineCount} lines priced — choose
                    pickup and delivery on each line for the full total.
                  </p>
                )}
                {pricingSummary.loading === 0 &&
                  pricingSummary.ready === pricingSummary.lineCount &&
                  pricingSummary.lineCount > 0 && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Sum of per-line region rates. Confirmed total is returned after payment.
                    </p>
                  )}
              </div>
            </div>
          </div>

          <Button type="button" variant="secondary" onClick={addLine} className="w-full">
            + Add Item
          </Button>
        </section>

        <Button type="submit" variant="primary" className="w-full">
          Review &amp; Pay →
        </Button>
      </form>
    </div>
  );
}
