"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button, Input, Select, Textarea, Card, Toggle, FormErrorAlert } from "@/components/ui";
import { getApiErrorMessage, showApiErrorToast } from "@/lib/errors/apiError";
import { OrderStepper } from "./OrderStepper";
import { CartSummary } from "./CartSummary";
import { PaymentStep } from "./PaymentStep";
import { useAuthStore } from "@/lib/store/authStore";
import { useCartStore } from "@/lib/store/cartStore";
import type { CreateOrderRequest } from "@/types";
import {
  regionsApi,
  type PickupRegion,
  type DeliveryRegion,
  type DeliveryRegionArea,
  type RegionQuote,
} from "@/lib/api/regions";

const STEPS = [
  { id: 1, label: "Delivery Details", description: "Package information" },
  { id: 2, label: "Review", description: "Review cart" },
  { id: 3, label: "Payment", description: "Complete order" },
];

export function CreateOrderForm() {
  const searchParams = useSearchParams();
  const user = useAuthStore((state) => state.user);
  const { addItem, items } = useCartStore();
  const isEmailVerified = Boolean(user?.is_email_verified);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CreateOrderRequest>({
    sender_name: user?.name || "",
    sender_phone: user?.phone || "",
    pickup_address: user?.default_address || "",
    receiver_name: "",
    receiver_phone: "",
    delivery_address: "",
    package_description: "",
    item_value: undefined,
    quantity: 1,
    is_fragile: false,
    pickup_region_id: undefined,
    delivery_region_id: undefined,
    delivery_region_area_id: undefined,
  });

  const [pickups, setPickups] = useState<PickupRegion[]>([]);
  const [deliveries, setDeliveries] = useState<DeliveryRegion[]>([]);
  const [deliveryAreas, setDeliveryAreas] = useState<DeliveryRegionArea[]>([]);
  const [quote, setQuote] = useState<RegionQuote | null>(null);
  const [pickupsLoading, setPickupsLoading] = useState(true);
  const [deliveriesLoading, setDeliveriesLoading] = useState(false);
  const [deliveryAreasLoading, setDeliveryAreasLoading] = useState(false);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Allow deep-linking into review step (used by cart "Checkout All")
  useEffect(() => {
    const step = searchParams.get("step");
    if (step === "review") {
      setCurrentStep(2);
    }
  }, [searchParams]);

  // Auto-fill sender info when user data loads
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        sender_name: user.name || prev.sender_name,
        sender_phone: user.phone || prev.sender_phone,
        pickup_address: user.default_address || prev.pickup_address,
      }));
    }
  }, [user]);

  useEffect(() => {
    let cancelled = false;
    setPickupsLoading(true);
    regionsApi
      .getPickups()
      .then((data) => {
        if (!cancelled) setPickups(data);
      })
      .catch((err) => {
        if (!cancelled) {
          const msg = getApiErrorMessage(err, "Could not load pickup areas. Please refresh.");
          setError(msg);
          showApiErrorToast(err, "Could not load pickup areas. Please refresh.");
        }
      })
      .finally(() => {
        if (!cancelled) setPickupsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!formData.pickup_region_id) {
      setDeliveries([]);
      setDeliveryAreas([]);
      return;
    }
    let cancelled = false;
    setDeliveriesLoading(true);
    regionsApi
      .getDeliveriesForPickup(formData.pickup_region_id)
      .then((data) => {
        if (!cancelled) setDeliveries(data);
      })
      .catch(() => {
        if (!cancelled) setDeliveries([]);
      })
      .finally(() => {
        if (!cancelled) setDeliveriesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [formData.pickup_region_id]);

  useEffect(() => {
    if (!formData.delivery_region_id) {
      setDeliveryAreas([]);
      return;
    }
    let cancelled = false;
    setDeliveryAreasLoading(true);
    regionsApi
      .getAreasForDelivery(formData.delivery_region_id)
      .then((data) => {
        if (!cancelled) setDeliveryAreas(data);
      })
      .catch(() => {
        if (!cancelled) setDeliveryAreas([]);
      })
      .finally(() => {
        if (!cancelled) setDeliveryAreasLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [formData.delivery_region_id]);

  useEffect(() => {
    if (!formData.pickup_region_id || !formData.delivery_region_id) {
      setQuote(null);
      setQuoteError("");
      return;
    }
    let cancelled = false;
    setQuoteLoading(true);
    setQuoteError("");
    regionsApi
      .getQuote(formData.pickup_region_id, formData.delivery_region_id)
      .then((q) => {
        if (cancelled) return;
        if (!q) {
          setQuote(null);
          setQuoteError("No active rate for this combination.");
          return;
        }
        setQuote(q);
      })
      .catch(() => {
        if (!cancelled) {
          setQuote(null);
          setQuoteError("Could not load price estimate.");
        }
      })
      .finally(() => {
        if (!cancelled) setQuoteLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [formData.pickup_region_id, formData.delivery_region_id]);

  const pickupOptions = [
    { value: "", label: pickupsLoading ? "Loading…" : "Select pickup area" },
    ...pickups.map((p) => ({ value: String(p.id), label: p.name })),
  ];

  const deliveryOptions = [
    {
      value: "",
      label: !formData.pickup_region_id
        ? "Select pickup first"
        : deliveriesLoading
          ? "Loading…"
          : "Select delivery area",
    },
    ...deliveries.map((d) => ({ value: String(d.id), label: d.name })),
  ];

  const deliveryAreaOptions = [
    {
      value: "",
      label: deliveryAreasLoading ? "Loading…" : "Select delivery sub-area (optional)",
    },
    ...deliveryAreas.map((a) => ({ value: String(a.id), label: a.name })),
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "pickup_region_id") {
      setFormData((prev) => ({
        ...prev,
        pickup_region_id: value ? Number(value) : undefined,
        delivery_region_id: undefined,
        delivery_region_area_id: undefined,
      }));
      setError("");
      setQuoteError("");
      return;
    }
    if (name === "delivery_region_id") {
      setFormData((prev) => ({
        ...prev,
        delivery_region_id: value ? Number(value) : undefined,
        delivery_region_area_id: undefined,
      }));
      setError("");
      setQuoteError("");
      return;
    }
    if (name === "delivery_region_area_id") {
      setFormData((prev) => ({
        ...prev,
        delivery_region_area_id: value ? Number(value) : undefined,
      }));
      setError("");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "item_value" || name === "quantity"
          ? value
            ? Number(value)
            : undefined
          : value,
    }));
    setError("");
  };

  const handleToggleChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_fragile: checked }));
  };

  const handleAddToCart = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!formData.pickup_region_id || !formData.delivery_region_id) {
      setError("Select pickup area and delivery area.");
      return;
    }
    if (!quote) {
      setError(quoteError || "No price available for this route.");
      return;
    }
    setIsLoading(true);

    try {
      await addItem({
        sender_name: formData.sender_name,
        sender_phone: formData.sender_phone,
        pickup_address: formData.pickup_address,
        receiver_name: formData.receiver_name,
        receiver_phone: formData.receiver_phone,
        delivery_address: formData.delivery_address,
        package_description: formData.package_description,
        item_value: formData.item_value,
        quantity: formData.quantity,
        is_fragile: formData.is_fragile,
        pickup_region_id: formData.pickup_region_id,
        delivery_region_id: formData.delivery_region_id,
        delivery_region_area_id: formData.delivery_region_area_id,
      });

      // Reset only receiver, package, and region fields
      setFormData((prev) => ({
        ...prev,
        receiver_name: "",
        receiver_phone: "",
        delivery_address: "",
        package_description: "",
        item_value: undefined,
        quantity: 1,
        is_fragile: false,
        pickup_region_id: undefined,
        delivery_region_id: undefined,
        delivery_region_area_id: undefined,
      }));
    } catch (err) {
      console.error("Add to cart error:", err);
      setError(getApiErrorMessage(err, "Failed to add to cart. Please try again."));
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueToReview = async () => {
    setError("");

    // If cart already has items, proceed.
    if (items.length > 0) {
      setCurrentStep(2);
      return;
    }

    // Otherwise, create a single draft line from the current form and proceed.
    if (!formData.pickup_region_id || !formData.delivery_region_id) {
      setError("Select pickup area and delivery area.");
      return;
    }
    if (!quote) {
      setError(quoteError || "No price available for this route.");
      return;
    }

    setIsLoading(true);
    try {
      await addItem({
        sender_name: formData.sender_name,
        sender_phone: formData.sender_phone,
        pickup_address: formData.pickup_address,
        receiver_name: formData.receiver_name,
        receiver_phone: formData.receiver_phone,
        delivery_address: formData.delivery_address,
        package_description: formData.package_description,
        item_value: formData.item_value,
        quantity: formData.quantity,
        is_fragile: formData.is_fragile,
        pickup_region_id: formData.pickup_region_id,
        delivery_region_id: formData.delivery_region_id,
        delivery_region_area_id: formData.delivery_region_area_id,
      });
      setCurrentStep(2);
    } catch (err) {
      console.error("Continue to review error:", err);
      setError(
        getApiErrorMessage(err, "Failed to proceed to review. Please try again.")
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1: Delivery Details Form
  if (currentStep === 1) {
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        <OrderStepper currentStep={currentStep} steps={STEPS} />
        
        <div>
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            Create Delivery Order
          </h1>
          <p className="text-muted-foreground">
            Add items to your cart before proceeding to checkout
          </p>
        </div>

        {!isEmailVerified && (
          <div className="p-4 rounded-lg border bg-primary/10 border-primary/20 text-sm text-primary">
            Please verify your email before placing an order. You can build your cart now, but payment requires email verification.
          </div>
        )}

        <FormErrorAlert message={error || undefined} />

        <form onSubmit={handleAddToCart} className="space-y-6">
          {/* Sender Information */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Sender Information
            </h2>
            <div className="space-y-4">
              <Input
                label="Sender Name"
                name="sender_name"
                placeholder="Your name"
                value={formData.sender_name}
                onChange={handleChange}
                id="sender_name"
              />
              <Input
                label="Sender Phone"
                name="sender_phone"
                type="tel"
                placeholder="08012345678"
                value={formData.sender_phone}
                onChange={handleChange}
                id="sender_phone"
              />
              <Textarea
                label="Pickup Address"
                name="pickup_address"
                placeholder="Enter pickup location"
                value={formData.pickup_address}
                onChange={handleChange}
                id="pickup_address"
              />
            </div>
          </Card>

          {/* Receiver Information */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Receiver Information
            </h2>
            <div className="space-y-4">
              <Input
                label="Receiver Name"
                name="receiver_name"
                placeholder="Recipient's name"
                value={formData.receiver_name}
                onChange={handleChange}
                required
                id="receiver_name"
              />
              <Input
                label="Receiver Phone"
                name="receiver_phone"
                type="tel"
                placeholder="08098765432"
                value={formData.receiver_phone}
                onChange={handleChange}
                required
                id="receiver_phone"
              />
              <Textarea
                label="Delivery Address"
                name="delivery_address"
                placeholder="Enter full delivery address"
                value={formData.delivery_address}
                onChange={handleChange}
                required
                id="delivery_address"
              />
            </div>
          </Card>

          {/* Package Details */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Package Details
            </h2>
            <div className="space-y-4">
              <Textarea
                label="Package Description (Optional)"
                name="package_description"
                placeholder="Brief description of package contents"
                value={formData.package_description}
                onChange={handleChange}
                id="package_description"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Item Value (₦)"
                  name="item_value"
                  type="number"
                  step="0.01"
                  placeholder="e.g., 5000"
                  value={formData.item_value || ""}
                  onChange={handleChange}
                  id="item_value"
                />
                <Input
                  label="Quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  placeholder="1"
                  value={formData.quantity || 1}
                  onChange={handleChange}
                  id="quantity"
                />
              </div>
              <div className="pt-2">
                <Toggle
                  checked={formData.is_fragile || false}
                  onChange={handleToggleChange}
                  label="Fragile Item"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Pickup area"
                  name="pickup_region_id"
                  options={pickupOptions}
                  value={formData.pickup_region_id ?? ""}
                  onChange={handleChange}
                  id="pickup_region_id"
                  disabled={pickupsLoading || pickups.length === 0}
                />
                <Select
                  label="Delivery area"
                  name="delivery_region_id"
                  options={deliveryOptions}
                  value={formData.delivery_region_id ?? ""}
                  onChange={handleChange}
                  id="delivery_region_id"
                  disabled={
                    !formData.pickup_region_id ||
                    deliveriesLoading ||
                    deliveries.length === 0
                  }
                />
              </div>
              {deliveryAreas.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Delivery sub-area (optional)"
                    name="delivery_region_area_id"
                    options={deliveryAreaOptions}
                    value={formData.delivery_region_area_id ?? ""}
                    onChange={handleChange}
                    id="delivery_region_area_id"
                    disabled={deliveryAreasLoading}
                  />
                  <div />
                </div>
              )}
              {formData.pickup_region_id &&
                !deliveriesLoading &&
                deliveries.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No delivery areas are configured for this pickup yet. Choose another pickup or
                    contact support.
                  </p>
                )}

              {(quoteLoading || quote || quoteError) && (
                <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm">
                  {quoteLoading && (
                    <p className="text-muted-foreground">Loading price and ETA…</p>
                  )}
                  {!quoteLoading && quoteError && (
                    <p className="text-destructive">{quoteError}</p>
                  )}
                  {!quoteLoading && quote && (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                          Estimated delivery
                        </p>
                        <p className="font-medium text-foreground">
                          {quote.eta_display ||
                            (quote.eta_min_hours != null && quote.eta_max_hours != null
                              ? `${quote.eta_min_hours}–${quote.eta_max_hours} hrs`
                              : "—")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                          Flat rate
                        </p>
                        <p className="text-xl font-semibold text-primary">
                          ₦{Number(quote.price_ngn).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            <Button
              type="submit"
              variant="secondary"
              size="lg"
              disabled={
                isLoading ||
                pickups.length === 0 ||
                !quote ||
                !formData.pickup_region_id ||
                !formData.delivery_region_id
              }
            >
              {isLoading ? "Adding..." : "Add to Cart"}
            </Button>
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={handleContinueToReview}
              disabled={isLoading}
            >
              Continue to Review ({items.length})
            </Button>
          </div>
        </form>
      </div>
    );
  }

  // Step 2: Review Cart
  if (currentStep === 2) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <OrderStepper currentStep={currentStep} steps={STEPS} />
        
        <div>
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            Review Your Cart
          </h1>
          <p className="text-muted-foreground">
            Review your orders before proceeding to payment
          </p>
        </div>

        <CartSummary />

        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={() => setCurrentStep(1)}
          >
            ← Add More Items
          </Button>
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={() => setCurrentStep(3)}
            disabled={items.length === 0}
          >
            Continue to Payment
          </Button>
        </div>
      </div>
    );
  }

  // Step 3: Payment
  if (currentStep === 3) {
    return <PaymentStep onBack={() => setCurrentStep(2)} />;
  }

  return null;
}
