"use client";

import { useEffect, useState, useCallback } from "react";
import { adminApi } from "@/lib/api/admin";
import { Badge, Button, Input } from "@/components/ui";
import type { BulkOrder, BulkOrderDetail, BulkOrderItem } from "@/types";

const ITEM_STATUSES = ["Pending", "Picked Up", "In Transit", "Out for Delivery", "Delivered"] as const;

function statusVariant(status: string): "default" | "success" | "warning" | "error" | "info" {
  switch (status) {
    case "Delivered": return "success";
    case "In Transit":
    case "Out for Delivery": return "warning";
    case "Picked Up": return "info";
    case "Pending": return "default";
    default: return "default";
  }
}

// ─── Item status modal ────────────────────────────────────────────────────────

interface ItemStatusModalProps {
  bulkId: number;
  item: BulkOrderItem;
  onClose: () => void;
  onUpdated: () => void;
}

function ItemStatusModal({ bulkId, item, onClose, onUpdated }: ItemStatusModalProps) {
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Compute the only valid next status
  const nextStatusMap: Record<string, string | null> = {
    Pending: "Picked Up",
    "Picked Up": "In Transit",
    "In Transit": "Out for Delivery",
    "Out for Delivery": "Delivered",
    Delivered: null,
  };
  const nextStatus = nextStatusMap[item.status];

  const handleSave = async () => {
    if (!nextStatus) return;
    setSaving(true);
    setError("");
    try {
      await adminApi.updateBulkItemStatus(bulkId, item.id, nextStatus, note || undefined);
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
      <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-md p-4 sm:p-6 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Advance Item Status</h2>
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{item.receiver_name}</span>
          {" → "}
          <span className="text-xs">{item.delivery_address}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Badge variant={statusVariant(item.status)}>{item.status}</Badge>
          {nextStatus && (
            <>
              <span className="text-muted-foreground">→</span>
              <Badge variant={statusVariant(nextStatus)}>{nextStatus}</Badge>
            </>
          )}
        </div>

        {!nextStatus && (
          <p className="text-sm text-muted-foreground">This item has already been delivered.</p>
        )}

        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
            {error}
          </div>
        )}

        {nextStatus && (
          <Input
            label="Note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Picked up from sender"
            id="item-status-note"
          />
        )}

        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end pt-2">
          <Button variant="secondary" onClick={onClose} disabled={saving} className="w-full sm:w-auto">
            Cancel
          </Button>
          {nextStatus && (
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={saving}
              className="w-full sm:w-auto"
            >
              {saving ? "Saving..." : `Set "${nextStatus}"`}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Bulk detail drawer ───────────────────────────────────────────────────────

interface BulkDetailProps {
  bulk: BulkOrderDetail;
  onClose: () => void;
  onUpdated: () => void;
}

function BulkDetailDrawer({ bulk, onClose, onUpdated }: BulkDetailProps) {
  const [selectedItem, setSelectedItem] = useState<BulkOrderItem | null>(null);

  return (
    <>
      {selectedItem && (
        <ItemStatusModal
          bulkId={bulk.id}
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onUpdated={() => {
            setSelectedItem(null);
            onUpdated();
          }}
        />
      )}

      <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-40 px-0 sm:px-4">
        <div className="bg-card border border-border rounded-t-2xl sm:rounded-xl shadow-xl w-full sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-card border-b border-border p-4 sm:p-6 flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Bulk Order</h2>
              <p className="font-mono text-sm text-muted-foreground">{bulk.tracking_number}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="p-4 sm:p-6 space-y-6">
            {/* Bulk summary */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground text-xs mb-0.5">Sender</p>
                <p className="font-medium text-foreground">{bulk.sender_name}</p>
                <p className="text-muted-foreground">{bulk.sender_phone}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-0.5">Default Pickup</p>
                <p className="text-foreground">{bulk.pickup_address}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-0.5">Total Price</p>
                <p className="font-semibold text-foreground">₦{(bulk.price || 0).toLocaleString()}</p>
              </div>
            </div>

            {/* Line items */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Items ({bulk.items.length})
              </h3>
              <div className="space-y-3">
                {bulk.items.map((item, i) => (
                  <div
                    key={item.id}
                    className="border border-border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground font-mono">#{i + 1}</span>
                          <span className="font-medium text-foreground text-sm">{item.receiver_name}</span>
                          <Badge variant={statusVariant(item.status)} className="text-xs">
                            {item.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{item.delivery_address}</p>
                        <p className="text-xs text-muted-foreground">
                          Pickup zone ID: {item.pickup_region_id}
                          {item.pickup_address && ` — ${item.pickup_address}`}
                        </p>
                        <p className="text-xs font-medium text-foreground">
                          ₦{(item.price_ngn || 0).toLocaleString()}
                          {item.eta_label && (
                            <span className="text-muted-foreground font-normal ml-1">
                              · {item.eta_label}
                            </span>
                          )}
                        </p>
                      </div>
                      {item.status !== "Delivered" && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setSelectedItem(item)}
                          className="shrink-0"
                        >
                          Advance
                        </Button>
                      )}
                    </div>

                    {/* Item events */}
                    {item.events && item.events.length > 0 && (
                      <div className="border-t border-border/50 pt-2 space-y-1">
                        {item.events.map((evt, j) => (
                          <div key={j} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="w-2 h-2 rounded-full bg-muted-foreground/40 shrink-0" />
                            <span>{evt.status}</span>
                            {evt.description && <span>— {evt.description}</span>}
                            <span className="ml-auto whitespace-nowrap">
                              {new Date(evt.created_at).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function BulkOrdersPage() {
  const [bulkOrders, setBulkOrders] = useState<BulkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedBulk, setSelectedBulk] = useState<BulkOrderDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const fetchBulkOrders = useCallback(async () => {
    try {
      const res = await adminApi.getBulkOrders();
      setBulkOrders(res.data || []);
    } catch (err) {
      console.error("Failed to fetch bulk orders:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBulkOrders();
  }, [fetchBulkOrders]);

  const openDetail = async (id: number) => {
    setLoadingDetail(true);
    try {
      const res = await adminApi.getBulkOrder(id);
      setSelectedBulk(res.data);
    } catch (err) {
      console.error("Failed to load bulk order detail:", err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const filtered = bulkOrders.filter((b) => {
    const q = search.toLowerCase();
    return (
      b.tracking_number.toLowerCase().includes(q) ||
      b.sender_name.toLowerCase().includes(q)
    );
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
      {selectedBulk && (
        <BulkDetailDrawer
          bulk={selectedBulk}
          onClose={() => setSelectedBulk(null)}
          onUpdated={() => {
            fetchBulkOrders();
            // Re-fetch the detail to show updated statuses
            openDetail(selectedBulk.id);
          }}
        />
      )}

      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">Bulk Orders</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {bulkOrders.length} bulk shipment{bulkOrders.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex-1">
        <Input
          placeholder="Search by tracking number or sender name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          id="bulk-search"
        />
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left p-4 font-medium text-muted-foreground whitespace-nowrap">Tracking</th>
                <th className="text-left p-4 font-medium text-muted-foreground whitespace-nowrap">Sender</th>
                <th className="text-left p-4 font-medium text-muted-foreground whitespace-nowrap">Items</th>
                <th className="text-left p-4 font-medium text-muted-foreground whitespace-nowrap">Total</th>
                <th className="text-left p-4 font-medium text-muted-foreground whitespace-nowrap">Status</th>
                <th className="text-left p-4 font-medium text-muted-foreground whitespace-nowrap">Date</th>
                <th className="text-right p-4 font-medium text-muted-foreground whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    {search ? "No bulk orders match your search." : "No bulk orders yet."}
                  </td>
                </tr>
              ) : (
                filtered.map((bulk) => (
                  <tr
                    key={bulk.id}
                    className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                  >
                    <td className="p-4">
                      <span className="font-mono text-xs font-medium text-foreground">
                        {bulk.tracking_number}
                      </span>
                    </td>
                    <td className="p-4 text-foreground">{bulk.sender_name}</td>
                    <td className="p-4 text-muted-foreground">{bulk.item_count ?? "—"}</td>
                    <td className="p-4 text-foreground font-medium">
                      ₦{(bulk.price || 0).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <Badge variant="default">{bulk.status}</Badge>
                    </td>
                    <td className="p-4 text-muted-foreground whitespace-nowrap">
                      {new Date(bulk.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={loadingDetail}
                        onClick={() => openDetail(bulk.id)}
                      >
                        View / Update
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
