import type { BulkOrderDetail } from "@/types";
import { Badge } from "@/components/ui";
import { BulkShipmentTimeline } from "@/components/dashboard/BulkShipmentTimeline";

interface BulkTrackViewProps {
  bulk: BulkOrderDetail;
}

function statusVariant(
  status: string
): "default" | "success" | "warning" | "error" | "info" {
  if (status === "Delivered") return "success";
  if (status === "In Transit" || status === "Out for Delivery") return "warning";
  if (status === "Picked Up" || status === "Order Created") return "info";
  if (status === "Pending Payment") return "warning";
  return "default";
}

export function BulkTrackView({ bulk }: BulkTrackViewProps) {
  const paymentPending = bulk.status === "Pending Payment";

  return (
    <div className="space-y-6">
      {paymentPending && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <p className="text-sm text-amber-800 dark:text-amber-300">
            We are waiting for your payment to clear. Your bulk shipment is reserved; delivery
            updates will begin once payment is confirmed.
          </p>
        </div>
      )}

      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold text-foreground">Bulk shipment</h3>
          <Badge variant={statusVariant(bulk.status)}>{bulk.status}</Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Sender</p>
            <p className="font-medium text-foreground">{bulk.sender_name}</p>
            {bulk.sender_phone && (
              <p className="text-muted-foreground">{bulk.sender_phone}</p>
            )}
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Default pickup address</p>
            <p className="text-foreground">{bulk.pickup_address}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Total price</p>
            <p className="text-xl font-semibold text-foreground">
              ₦{Number(bulk.price || 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-6">Delivery progress</h3>
        <BulkShipmentTimeline bulk={bulk} />
      </div>
    </div>
  );
}
