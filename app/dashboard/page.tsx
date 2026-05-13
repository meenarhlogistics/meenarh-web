"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/ui";
import { OrderList } from "@/components/dashboard/OrderList";
import { OrderMetricsSummary } from "@/components/dashboard/OrderMetricsSummary";
import { ordersApi } from "@/lib/api/orders";
import { cn } from "@/lib/utils";
import type { Order } from "@/types";
import { Package, Layers } from "lucide-react";

const primaryLinkClass =
  "inline-flex items-center justify-center font-medium transition-all duration-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 bg-primary text-primary-foreground hover:brightness-110 focus:ring-primary shadow-md px-6 py-3 text-base";

export default function DashboardOverviewPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [trackingInput, setTrackingInput] = useState("");

  const fetchOrders = async () => {
    try {
      const response = await ordersApi.getOrders();
      if (response.success) {
        setOrders(response.data);
      }
    } catch (err) {
      console.error("Fetch orders error:", err);
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || "Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleQuickTrack = (e: FormEvent) => {
    e.preventDefault();
    const q = trackingInput.trim();
    if (!q) return;
    router.push(`/dashboard/track?tracking=${encodeURIComponent(q)}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <div className="h-9 w-48 bg-muted rounded-lg animate-pulse mb-2" />
          <div className="h-5 w-72 bg-muted rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-24 bg-card rounded-xl border border-border animate-pulse"
            />
          ))}
        </div>
        <div className="h-32 bg-card rounded-xl border border-border animate-pulse" />
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-48 bg-card rounded-xl border border-border animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-destructive"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Failed to load dashboard
        </h3>
        <p className="text-muted-foreground mb-6">{error}</p>
        <button
          type="button"
          onClick={() => {
            setError("");
            setIsLoading(true);
            fetchOrders();
          }}
          className="text-primary hover:underline font-medium"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Order metrics, delivery requests, and history
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Link
            href="/dashboard/create"
            className={cn(primaryLinkClass, "whitespace-nowrap")}
          >
            <Package className="w-4 h-4 mr-2 shrink-0" />
            Single delivery
          </Link>
          <Link
            href="/dashboard/create-bulk"
            className={cn(primaryLinkClass, "whitespace-nowrap bg-secondary text-secondary-foreground hover:brightness-95")}
          >
            <Layers className="w-4 h-4 mr-2 shrink-0" />
            Bulk delivery
          </Link>
        </div>
      </div>

      <section aria-labelledby="metrics-heading" className="space-y-3">
        <h2 id="metrics-heading" className="text-lg font-semibold text-foreground">
          Order metrics
        </h2>
        <OrderMetricsSummary orders={orders} />
      </section>

      <section aria-labelledby="track-heading" className="space-y-3">
        <h2 id="track-heading" className="text-lg font-semibold text-foreground">
          Track an order
        </h2>
        <p className="text-sm text-muted-foreground">
          Enter a tracking number to open the full status timeline.
        </p>
        <form
          onSubmit={handleQuickTrack}
          className="flex flex-col sm:flex-row gap-3 max-w-2xl"
        >
          <Input
            type="text"
            placeholder="e.g. MN-2026-0001"
            value={trackingInput}
            onChange={(e) => setTrackingInput(e.target.value)}
            className="font-mono flex-1"
            aria-label="Tracking number"
          />
          <Button type="submit" variant="primary" className="sm:w-auto shrink-0">
            View status
          </Button>
        </form>
        <p className="text-sm">
          <Link
            href="/dashboard/track"
            className="text-primary font-medium hover:underline"
          >
            Open full track page
          </Link>
        </p>
      </section>

      <section aria-labelledby="history-heading" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
          <h2 id="history-heading" className="text-lg font-semibold text-foreground">
            Order history
          </h2>
          <Link
            href="/dashboard/orders"
            className="text-sm text-primary font-medium hover:underline"
          >
            Dedicated orders page
          </Link>
        </div>
        <div className="max-h-[min(70vh,800px)] overflow-y-auto pr-1 -mr-1">
          <OrderList orders={orders} />
        </div>
      </section>
    </div>
  );
}
