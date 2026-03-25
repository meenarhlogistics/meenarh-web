"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button, Input } from "@/components/ui";
import { OrderTimeline } from "@/components/dashboard/OrderTimeline";
import { ordersApi } from "@/lib/api/orders";
import type { OrderDetail } from "@/types";

export default function TrackOrderPage() {
  const searchParams = useSearchParams();
  const trackingParam = searchParams.get("tracking");

  const [trackingNumber, setTrackingNumber] = useState(trackingParam || "");
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Auto-track if tracking number in URL
    if (trackingParam) {
      handleTrack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackingParam]);

  const handleTrack = async () => {
    if (!trackingNumber.trim()) {
      setError("Please enter a tracking number");
      return;
    }

    setError("");
    setIsLoading(true);
    setOrder(null);

    try {
      const response = await ordersApi.trackOrder(trackingNumber.trim());
      if (response.success) {
        setOrder(response.data);
      }
    } catch (err) {
      console.error("Track order error:", err);
      const error = err as { response?: { status?: number; data?: { message?: string } } };
      if (error.response?.status === 404) {
        setError("Order not found. Please check the tracking number.");
      } else {
        setError(
          error.response?.data?.message ||
            "Failed to track order. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleTrack();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground mb-2">
          Track Order
        </h1>
        <p className="text-muted-foreground">
          Enter your tracking number to view order status
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Enter tracking number (e.g., MN-2026-0001)"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="font-mono"
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
            className="whitespace-nowrap"
          >
            {isLoading ? "Tracking..." : "Track"}
          </Button>
        </div>
      </form>

      {/* Error State */}
      {error && (
        <div className="max-w-2xl p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-16">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Tracking order...</p>
        </div>
      )}

      {/* Order Timeline */}
      {order && !isLoading && (
        <div className="max-w-4xl">
          <div className="mb-6 p-4 bg-accent/30 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground mb-1">
              Tracking Number
            </p>
            <p className="text-xl font-bold text-foreground font-mono">
              {order.tracking_number}
            </p>
          </div>
          <OrderTimeline order={order} />
        </div>
      )}

      {/* Empty State */}
      {!order && !isLoading && !error && (
        <div className="text-center py-16">
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Ready to track
          </h3>
          <p className="text-muted-foreground">
            Enter a tracking number above to view order details
          </p>
        </div>
      )}
    </div>
  );
}
