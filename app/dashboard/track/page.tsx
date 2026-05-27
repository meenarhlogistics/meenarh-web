"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button, Input } from "@/components/ui";
import { OrderTimeline } from "@/components/dashboard/OrderTimeline";
import { BulkTrackView } from "@/components/dashboard/BulkTrackView";
import { ordersApi } from "@/lib/api/orders";
import type { OrderDetail, BulkOrderDetail } from "@/types";
import { FormErrorAlert } from "@/components/ui";
import { getApiErrorDetails, type ParsedApiError } from "@/lib/errors/apiError";

type TrackResult =
  | (OrderDetail & { type?: "single" })
  | (BulkOrderDetail & { type: "bulk" });

function isBulkOrder(data: TrackResult): data is BulkOrderDetail & { type: "bulk" } {
  return data.type === "bulk" || data.tracking_number.startsWith("MN-B-");
}

export default function TrackOrderPage() {
  const searchParams = useSearchParams();
  const trackingParam = searchParams.get("tracking");

  const [trackingNumber, setTrackingNumber] = useState(trackingParam || "");
  const [trackResult, setTrackResult] = useState<TrackResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState<ParsedApiError | null>(null);

  useEffect(() => {
    if (trackingParam) {
      handleTrack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackingParam]);

  const handleTrack = async () => {
    if (!trackingNumber.trim()) {
      setErrorDetails({ message: "Please enter a tracking number" });
      return;
    }

    setErrorDetails(null);
    setIsLoading(true);
    setTrackResult(null);

    try {
      const response = await ordersApi.trackOrder(trackingNumber.trim());
      if (response.success) {
        setTrackResult(response.data as TrackResult);
      }
    } catch (err) {
      console.error("Track order error:", err);
      setErrorDetails(
        getApiErrorDetails(err, "Failed to track order. Please try again.")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleTrack();
  };

  const singleOrder =
    trackResult && !isBulkOrder(trackResult) ? trackResult : null;
  const bulkOrder = trackResult && isBulkOrder(trackResult) ? trackResult : null;

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

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Enter tracking number (e.g., MN-2026-0001 or MN-B-2026-0001)"
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

      <div className="max-w-2xl">
        <FormErrorAlert
          message={errorDetails?.message}
          items={errorDetails?.items}
        />
      </div>

      {isLoading && (
        <div className="text-center py-16">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Tracking order...</p>
        </div>
      )}

      {singleOrder && !isLoading && (
        <div className="max-w-4xl">
          {singleOrder.status === "Pending Payment" && (
            <div className="mb-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <p className="text-sm text-amber-800 dark:text-amber-300">
                We are waiting for your payment to clear. Your order is reserved; delivery updates
                will begin once payment is confirmed.
              </p>
            </div>
          )}
          <div className="mb-6 p-4 bg-accent/30 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground mb-1">
              Tracking Number
            </p>
            <p className="text-xl font-bold text-foreground font-mono">
              {singleOrder.tracking_number}
            </p>
          </div>
          <OrderTimeline order={singleOrder} />
        </div>
      )}

      {bulkOrder && !isLoading && (
        <div className="max-w-4xl">
          <div className="mb-6 p-4 bg-accent/30 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground mb-1">
              Tracking Number
            </p>
            <p className="text-xl font-bold text-foreground font-mono">
              {bulkOrder.tracking_number}
            </p>
          </div>
          <BulkTrackView bulk={bulkOrder} />
        </div>
      )}

      {!trackResult && !isLoading && !errorDetails && (
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
