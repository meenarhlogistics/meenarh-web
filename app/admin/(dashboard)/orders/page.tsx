"use client";

import { useEffect, useState, useCallback } from "react";
import { adminApi } from "@/lib/api/admin";
import { Badge, Button, Input } from "@/components/ui";

interface Order {
  id: number;
  tracking_number: string;
  sender_name: string;
  receiver_name: string;
  pickup_address: string;
  delivery_address: string;
  package_description?: string;
  price: number;
  status: string;
  created_at: string;
  updated_at: string;
}

const VALID_STATUSES = [
  "Order Created",
  "Picked Up",
  "In Transit",
  "Out for Delivery",
  "Delivered",
];

function statusVariant(status: string): "default" | "success" | "warning" | "error" | "info" {
  switch (status) {
    case "Delivered": return "success";
    case "In Transit":
    case "Out for Delivery": return "warning";
    case "Picked Up": return "info";
    default: return "default";
  }
}

interface StatusModalProps {
  order: Order;
  onClose: () => void;
  onUpdated: () => void;
}

function StatusModal({ order, onClose, onUpdated }: StatusModalProps) {
  const [status, setStatus] = useState(order.status);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await adminApi.updateOrderStatus(order.id, status, note || undefined);
      onUpdated();
      onClose();
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || "Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-6 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Update Order Status</h2>
        <div className="text-sm text-muted-foreground">
          <span className="font-mono text-foreground font-medium">{order.tracking_number}</span>
          {" — "}
          {order.receiver_name}
        </div>

        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">New Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-3 bg-muted border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          >
            {VALID_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <Input
          label="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. Package delivered to gateman"
          id="status-note"
        />

        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end pt-2">
          <Button variant="secondary" onClick={onClose} disabled={saving} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={saving || status === order.status} className="w-full sm:w-auto">
            {saving ? "Saving..." : "Update Status"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await adminApi.getOrders();
      setOrders(res.data || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    const matchesSearch =
      o.tracking_number.toLowerCase().includes(q) ||
      o.sender_name.toLowerCase().includes(q) ||
      o.receiver_name.toLowerCase().includes(q) ||
      o.delivery_address.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {selectedOrder && (
        <StatusModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdated={fetchOrders}
        />
      )}

      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">Orders</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {orders.length} total order{orders.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search by tracking number, name, or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="order-search"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-muted border border-input rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
        >
          <option value="all">All Statuses</option>
          {VALID_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {VALID_STATUSES.map((s) => {
          const count = orders.filter((o) => o.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(statusFilter === s ? "all" : s)}
              className={`
                bg-card border rounded-xl p-3 text-center transition-colors cursor-pointer
                ${statusFilter === s ? "border-primary" : "border-border hover:border-primary/50"}
              `}
            >
              <p className="text-xl font-semibold text-foreground">{count}</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-tight">{s}</p>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left p-4 font-medium text-muted-foreground whitespace-nowrap">Tracking</th>
                <th className="text-left p-4 font-medium text-muted-foreground whitespace-nowrap">Sender</th>
                <th className="text-left p-4 font-medium text-muted-foreground whitespace-nowrap">Receiver</th>
                <th className="text-left p-4 font-medium text-muted-foreground whitespace-nowrap">Destination</th>
                <th className="text-left p-4 font-medium text-muted-foreground whitespace-nowrap">Price</th>
                <th className="text-left p-4 font-medium text-muted-foreground whitespace-nowrap">Status</th>
                <th className="text-left p-4 font-medium text-muted-foreground whitespace-nowrap">Date</th>
                <th className="text-right p-4 font-medium text-muted-foreground whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-muted-foreground">
                    {search || statusFilter !== "all" ? "No orders match your filters." : "No orders yet."}
                  </td>
                </tr>
              ) : (
                filtered.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                  >
                    <td className="p-4">
                      <span className="font-mono text-xs font-medium text-foreground">
                        {order.tracking_number}
                      </span>
                    </td>
                    <td className="p-4 text-foreground">{order.sender_name}</td>
                    <td className="p-4 text-foreground">{order.receiver_name}</td>
                    <td className="p-4 text-muted-foreground max-w-[180px] truncate">
                      {order.delivery_address}
                    </td>
                    <td className="p-4 text-foreground font-medium">
                      ₦{(order.price || 0).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <Badge variant={statusVariant(order.status)}>{order.status}</Badge>
                    </td>
                    <td className="p-4 text-muted-foreground whitespace-nowrap">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        Update Status
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
