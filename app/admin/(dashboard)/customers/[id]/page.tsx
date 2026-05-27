"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { adminApi } from "@/lib/api/admin";
import { Badge, Button } from "@/components/ui";
import type { BulkOrder } from "@/types";

interface CustomerDetail {
  id: number;
  name: string;
  email: string;
  phone?: string;
  default_address?: string;
  created_at: string;
  order_count: number;
  total_spent: number;
}

interface Order {
  id: number;
  tracking_number: string;
  receiver_name: string;
  delivery_address: string;
  price: number;
  status: string;
  created_at: string;
}

interface CartItem {
  id: number;
  receiver_name: string;
  delivery_address: string;
  package_description?: string;
  estimated_price?: number;
  created_at: string;
}

type OrderSubTab = "single" | "bulk";

export default function CustomerDetailPage() {
  const params = useParams();
  const customerId = Number(params.id);

  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [bulkOrders, setBulkOrders] = useState<BulkOrder[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"orders" | "cart">("orders");
  const [orderSubTab, setOrderSubTab] = useState<OrderSubTab>("single");

  const fetchData = useCallback(async () => {
    try {
      const [customerRes, ordersRes, bulkRes, cartRes] = await Promise.all([
        adminApi.getCustomer(customerId),
        adminApi.getCustomerOrders(customerId),
        adminApi.getCustomerBulkOrders(customerId),
        adminApi.getCustomerCart(customerId),
      ]);
      setCustomer(customerRes.data);
      setOrders(ordersRes.data || []);
      setBulkOrders(bulkRes.data || []);
      setCart(cartRes.data || []);
    } catch (err) {
      console.error("Failed to fetch customer:", err);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (orderSubTab === "single" && orders.length === 0 && bulkOrders.length > 0) {
      setOrderSubTab("bulk");
    }
    if (orderSubTab === "bulk" && bulkOrders.length === 0 && orders.length > 0) {
      setOrderSubTab("single");
    }
  }, [orderSubTab, orders.length, bulkOrders.length]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!customer) {
    return <p className="text-muted-foreground py-10 text-center">Customer not found.</p>;
  }

  const statusColor = (status: string) => {
    if (status === "Delivered") return "success";
    if (status === "In Transit" || status === "Out for Delivery") return "warning";
    return "default";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/admin/customers" className="hover:text-foreground transition-colors">Customers</Link>
        <span>/</span>
        <span className="text-foreground">{customer.name}</span>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-semibold text-primary shrink-0">
            {customer.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-semibold text-foreground">{customer.name}</h1>
            <p className="text-muted-foreground text-sm">{customer.email}</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 text-sm">
              <span className="text-muted-foreground">Phone: <span className="text-foreground">{customer.phone || "—"}</span></span>
              <span className="text-muted-foreground">Address: <span className="text-foreground">{customer.default_address || "—"}</span></span>
              <span className="text-muted-foreground">Orders: <span className="text-foreground font-medium">{customer.order_count}</span></span>
              <span className="text-muted-foreground">Total Spent: <span className="text-foreground font-medium">₦{customer.total_spent.toLocaleString()}</span></span>
              <span className="text-muted-foreground">Joined: <span className="text-foreground">{new Date(customer.created_at).toLocaleDateString()}</span></span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          variant={tab === "orders" ? "primary" : "secondary"}
          size="sm"
          onClick={() => setTab("orders")}
          className="w-full sm:w-auto"
        >
          Orders ({orders.length + bulkOrders.length})
        </Button>
        <Button
          variant={tab === "cart" ? "primary" : "secondary"}
          size="sm"
          onClick={() => setTab("cart")}
          className="w-full sm:w-auto"
        >
          Cart ({cart.length})
        </Button>
      </div>

      {tab === "orders" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 border-b border-border pb-3">
            <button
              type="button"
              onClick={() => setOrderSubTab("single")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                orderSubTab === "single"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              Single orders ({orders.length})
            </button>
            <button
              type="button"
              onClick={() => setOrderSubTab("bulk")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                orderSubTab === "bulk"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              Bulk orders ({bulkOrders.length})
            </button>
          </div>

          {orderSubTab === "single" && (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[640px]">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left p-4 font-medium text-muted-foreground">Tracking</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Receiver</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Destination</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Price</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Date</th>
                      <th className="text-right p-4 font-medium text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No single orders yet.</td></tr>
                    ) : (
                      orders.map((o) => (
                        <tr key={o.id} className="border-b border-border/50">
                          <td className="p-4 font-mono text-xs text-foreground">{o.tracking_number}</td>
                          <td className="p-4 text-foreground">{o.receiver_name}</td>
                          <td className="p-4 text-muted-foreground max-w-[200px] truncate">{o.delivery_address}</td>
                          <td className="p-4 text-foreground">₦{(o.price || 0).toLocaleString()}</td>
                          <td className="p-4"><Badge variant={statusColor(o.status)}>{o.status}</Badge></td>
                          <td className="p-4 text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</td>
                          <td className="p-4 text-right">
                            <Link href={`/admin/orders/${o.id}`}>
                              <Button variant="secondary" size="sm">View</Button>
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {orderSubTab === "bulk" && (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[640px]">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left p-4 font-medium text-muted-foreground">Tracking</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Items</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Price</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Date</th>
                      <th className="text-right p-4 font-medium text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bulkOrders.length === 0 ? (
                      <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No bulk orders yet.</td></tr>
                    ) : (
                      bulkOrders.map((b) => (
                        <tr key={b.id} className="border-b border-border/50">
                          <td className="p-4 font-mono text-xs text-foreground">{b.tracking_number}</td>
                          <td className="p-4 text-foreground">{b.item_count ?? "—"}</td>
                          <td className="p-4 text-foreground">₦{(b.price || 0).toLocaleString()}</td>
                          <td className="p-4"><Badge variant={statusColor(b.status)}>{b.status}</Badge></td>
                          <td className="p-4 text-muted-foreground">{new Date(b.created_at).toLocaleDateString()}</td>
                          <td className="p-4 text-right">
                            <Link href={`/admin/bulk-orders?highlight=${b.id}`}>
                              <Button variant="secondary" size="sm">View</Button>
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "cart" && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left p-4 font-medium text-muted-foreground">Receiver</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Destination</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Description</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Est. Price</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Added</th>
              </tr>
            </thead>
            <tbody>
              {cart.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Cart is empty.</td></tr>
              ) : (
                cart.map((item) => (
                  <tr key={item.id} className="border-b border-border/50">
                    <td className="p-4 text-foreground">{item.receiver_name}</td>
                    <td className="p-4 text-muted-foreground max-w-[200px] truncate">{item.delivery_address}</td>
                    <td className="p-4 text-muted-foreground">{item.package_description || "—"}</td>
                    <td className="p-4 text-foreground">₦{(item.estimated_price || 0).toLocaleString()}</td>
                    <td className="p-4 text-muted-foreground">{new Date(item.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
}
