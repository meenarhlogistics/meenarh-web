"use client";

import { useState, useEffect } from "react";
import { OrderList } from "@/components/dashboard/OrderList";
import { ordersApi } from "@/lib/api/orders";
import type { Order, BulkOrder, OrderHistoryEntry } from "@/types";
import { getApiErrorMessage, showApiErrorToast } from "@/lib/errors/apiError";

type OrderTab = "single" | "bulk";

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<OrderTab>("single");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // GET /user/orders now returns a combined + sorted list of single and bulk orders
      const response = await ordersApi.getOrders();
      if (response.success) {
        setOrders(response.data as OrderHistoryEntry[]);
      }
    } catch (err) {
      console.error("Fetch orders error:", err);
      const msg = getApiErrorMessage(err, "Failed to load orders");
      setError(msg);
      showApiErrorToast(err, "Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  const singleOrders = orders.filter((o) => o.type !== "bulk") as Order[];
  const bulkOrders = orders.filter((o) => o.type === "bulk") as BulkOrder[];

  useEffect(() => {
    if (activeTab === "single" && singleOrders.length === 0 && bulkOrders.length > 0) {
      setActiveTab("bulk");
    }

    if (activeTab === "bulk" && bulkOrders.length === 0 && singleOrders.length > 0) {
      setActiveTab("single");
    }
  }, [activeTab, singleOrders.length, bulkOrders.length]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold text-foreground">My Orders</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
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
          Failed to load orders
        </h3>
        <p className="text-muted-foreground mb-6">{error}</p>
        <button
          onClick={fetchOrders}
          className="text-primary hover:underline font-medium"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-3xl font-semibold text-foreground">My Orders</h1>
        <p className="text-muted-foreground">
          {orders.length} {orders.length === 1 ? "order" : "orders"}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("single")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "single"
              ? "bg-primary text-primary-foreground"
              : "bg-card text-muted-foreground hover:text-foreground"
          }`}
        >
          Single Deliveries ({singleOrders.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("bulk")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "bulk"
              ? "bg-primary text-primary-foreground"
              : "bg-card text-muted-foreground hover:text-foreground"
          }`}
        >
          Bulk Deliveries ({bulkOrders.length})
        </button>
      </div>

      <OrderList
        orders={activeTab === "single" ? singleOrders : bulkOrders}
        emptyTitle={
          activeTab === "single" ? "No single deliveries yet" : "No bulk deliveries yet"
        }
        emptyDescription={
          activeTab === "single"
            ? "Create a single delivery to see it here."
            : "Create a bulk delivery to see it here."
        }
      />
    </div>
  );
}
