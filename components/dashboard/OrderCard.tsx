import Link from "next/link";
import { Card } from "@/components/ui";
import type { BulkOrder, Order, OrderHistoryEntry } from "@/types";

interface OrderCardProps {
  order: Order | BulkOrder | OrderHistoryEntry;
}

const STATUS_COLORS: Record<string, string> = {
  "Pending Payment": "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  "Order Created": "bg-muted text-muted-foreground",
  "Picked Up": "bg-chart-2/20 text-chart-2",
  "In Transit": "bg-chart-4/20 text-chart-4",
  "Out for Delivery": "bg-chart-1/20 text-chart-1",
  "Delivered": "bg-primary/20 text-primary",
};

export function OrderCard({ order }: OrderCardProps) {
  const isBulkOrder = !("receiver_name" in order);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const copyTrackingNumber = () => {
    navigator.clipboard.writeText(order.tracking_number);
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={copyTrackingNumber}
            className="font-mono font-semibold text-foreground hover:text-primary transition-colors"
            title="Click to copy"
          >
            {order.tracking_number}
          </button>
          <svg
            className="w-4 h-4 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </div>
        
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            STATUS_COLORS[order.status] || STATUS_COLORS["Order Created"]
          }`}
        >
          {order.status}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        {isBulkOrder ? (
          <>
            <div>
              <p className="text-sm text-muted-foreground">Bulk Delivery</p>
              <p className="font-medium text-foreground">
                {(order.item_count ?? 0).toLocaleString()}{" "}
                {(order.item_count ?? 0) === 1 ? "destination" : "destinations"}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Default Pickup Address</p>
              <p className="text-sm text-foreground">{order.pickup_address}</p>
            </div>
          </>
        ) : (
          <>
            <div>
              <p className="text-sm text-muted-foreground">Receiver</p>
              <p className="font-medium text-foreground">{order.receiver_name}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Delivery Address</p>
              <p className="text-sm text-foreground">{order.delivery_address}</p>
            </div>
          </>
        )}
        
        <div className="flex flex-wrap gap-4">
          {isBulkOrder ? (
            <div>
              <p className="text-sm text-muted-foreground">Sender</p>
              <p className="text-sm text-foreground">{order.sender_name}</p>
            </div>
          ) : null}

          <div>
            <p className="text-sm text-muted-foreground">Price</p>
            <p className="font-semibold text-foreground">
              {order.price != null
                ? `₦${Number(order.price).toFixed(2)}`
                : "—"}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Created</p>
            <p className="text-sm text-foreground">
              {formatDate(order.created_at)}
            </p>
          </div>
        </div>
      </div>

      <Link
        href={`/dashboard/track?tracking=${order.tracking_number}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
      >
        Track Order
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </Link>
    </Card>
  );
}
