"use client";

import { useState, useEffect } from "react";
import { OrderList } from "@/components/dashboard/OrderList";
import { ordersApi } from "@/lib/api/orders";
import type { Order } from "@/types";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await ordersApi.getOrders();
      if (response.success) {
        setOrders(response.data);
      }
    } catch (err) {
      console.error("Fetch orders error:", err);
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-foreground">My Orders</h1>
        <p className="text-muted-foreground">
          {orders.length} {orders.length === 1 ? "order" : "orders"}
        </p>
      </div>
      <OrderList orders={orders} />
    </div>
  );
}
