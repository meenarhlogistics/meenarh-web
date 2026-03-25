"use client";

import { useState, useEffect } from "react";
import { Button, Input, Select, Textarea, Card, Toggle } from "@/components/ui";
import { OrderStepper } from "./OrderStepper";
import { CartSummary } from "./CartSummary";
import { PaymentStep } from "./PaymentStep";
import { useAuthStore } from "@/lib/store/authStore";
import { useCartStore } from "@/lib/store/cartStore";
import type { CreateOrderRequest } from "@/types";

const ZONES = [
  { value: "", label: "Select zone" },
  { value: "1", label: "Mainland" },
  { value: "2", label: "Island" },
  { value: "3", label: "Expanding" },
];

const STEPS = [
  { id: 1, label: "Delivery Details", description: "Package information" },
  { id: 2, label: "Review", description: "Review cart" },
  { id: 3, label: "Payment", description: "Complete order" },
];

export function CreateOrderForm() {
  const user = useAuthStore((state) => state.user);
  const { addItem, items } = useCartStore();
  
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
    zone_id: undefined,
    distance_km: undefined,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "zone_id" || name === "distance_km" || name === "item_value" || name === "quantity"
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
        zone_id: formData.zone_id,
        distance_km: formData.distance_km,
      });
      
      // Reset only receiver and package fields
      setFormData((prev) => ({
        ...prev,
        receiver_name: "",
        receiver_phone: "",
        delivery_address: "",
        package_description: "",
        item_value: undefined,
        quantity: 1,
        is_fragile: false,
        zone_id: undefined,
        distance_km: undefined,
      }));
    } catch (err) {
      console.error("Add to cart error:", err);
      const error = err as { response?: { data?: { message?: string } } };
      setError(
        error.response?.data?.message || "Failed to add to cart. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueToReview = () => {
    if (items.length === 0) {
      setError("Please add at least one item to your cart");
      return;
    }
    setCurrentStep(2);
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

        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
            {error}
          </div>
        )}

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
                  label="Zone"
                  name="zone_id"
                  options={ZONES}
                  value={formData.zone_id || ""}
                  onChange={handleChange}
                  id="zone_id"
                />
                <Input
                  label="Distance (km)"
                  name="distance_km"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 15.5"
                  value={formData.distance_km || ""}
                  onChange={handleChange}
                  id="distance_km"
                />
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            <Button
              type="submit"
              variant="secondary"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add to Cart"}
            </Button>
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={handleContinueToReview}
              disabled={items.length === 0}
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
