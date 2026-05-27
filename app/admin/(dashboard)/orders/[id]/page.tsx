"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { adminApi } from "@/lib/api/admin";
import { OrderTimeline } from "@/components/dashboard/OrderTimeline";
import { OrderStatusPanel } from "@/components/admin/OrderStatusPanel";
import type { OrderDetail } from "@/types";
import { showApiErrorToast } from "@/lib/errors/apiError";

export default function AdminOrderDetailPage() {
  const params = useParams();
  const orderId = Number(params.id);

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = useCallback(async () => {
    try {
      const res = await adminApi.getOrder(orderId);
      setOrder(res.data);
    } catch (err) {
      console.error("Failed to fetch order:", err);
      showApiErrorToast(err, "Failed to load order");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-4">
        <Link href="/admin/orders" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to orders
        </Link>
        <p className="text-muted-foreground py-10 text-center">Order not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/admin/orders" className="hover:text-foreground transition-colors">
          Orders
        </Link>
        <span>/</span>
        <span className="text-foreground font-mono">{order.tracking_number}</span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Order detail</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Customer view — same information shown on the track page
            </p>
          </div>

          {order.status === "Pending Payment" && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <p className="text-sm text-amber-800 dark:text-amber-300">
                Payment has not been confirmed yet. Delivery status updates unlock after payment
                is confirmed.
              </p>
            </div>
          )}

          <div className="p-4 bg-accent/30 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground mb-1">Tracking number</p>
            <p className="text-xl font-bold text-foreground font-mono">
              {order.tracking_number}
            </p>
          </div>

          <OrderTimeline order={order} />
        </div>

        <div className="xl:col-span-1">
          <OrderStatusPanel
            key={`${order.id}-${order.status}-${order.events.length}`}
            order={{
              id: order.id,
              tracking_number: order.tracking_number,
              receiver_name: order.receiver_name,
              status: order.status,
              paystack_reference: order.paystack_reference,
            }}
            onUpdated={fetchOrder}
            variant="card"
          />
        </div>
      </div>
    </div>
  );
}
