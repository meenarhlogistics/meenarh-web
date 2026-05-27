"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { BulkOrderDetail, BulkOrderItem, OrderEvent } from "@/types";
import { OrderRouteSummary } from "@/components/orders/OrderRouteSummary";
import { Badge } from "@/components/ui";
import { cn } from "@/lib/utils";

const PENDING_PAYMENT_STATUS = "Pending Payment";
const BRANCH_AFTER_STATUS = "Order Created";

interface BulkShipmentTimelineProps {
  bulk: BulkOrderDetail;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
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

function splitParentEvents(events: OrderEvent[]) {
  const idx = events.findIndex((e) => e.status === BRANCH_AFTER_STATUS);
  if (idx === -1) {
    return { trunk: events, tail: [] as OrderEvent[] };
  }
  return {
    trunk: events.slice(0, idx + 1),
    tail: events.slice(idx + 1),
  };
}

function defaultOpenItemId(items: BulkOrderItem[]): number | null {
  if (items.length === 0) return null;
  const inProgress = items.find((i) => i.status !== "Delivered");
  return inProgress?.id ?? items[0].id;
}

function shortRouteLabel(item: BulkOrderItem): string {
  const parts: string[] = [];
  if (item.delivery_region_name) parts.push(item.delivery_region_name);
  if (item.delivery_region_area_name) parts.push(item.delivery_region_area_name);
  if (parts.length > 0) return parts.join(" · ");
  return item.delivery_address;
}

function ItemTimeline({ item }: { item: BulkOrderItem }) {
  const events = item.events || [];
  const currentIndex = events.findIndex((e) => e.status === item.status);

  if (events.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">No status updates yet for this item.</p>
    );
  }

  return (
    <div className="relative pl-6 space-y-3">
      <div className="absolute left-2 top-1 bottom-1 w-0.5 bg-border" />
      {events.map((event, index) => {
        const isCompleted = index <= currentIndex;
        const isActive = index === currentIndex;
        return (
          <div key={event.id} className="relative">
            <div
              className={cn(
                "absolute -left-4 top-1.5 w-3 h-3 rounded-full border-2 border-card",
                isCompleted ? "bg-primary" : "bg-border",
                isActive && "ring-2 ring-primary/30"
              )}
            />
            <p className="text-sm font-medium text-foreground">{event.status}</p>
            {event.description && (
              <p className="text-xs text-muted-foreground">{event.description}</p>
            )}
            <p className="text-xs text-muted-foreground mt-0.5">
              {formatDate(event.created_at)}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function ParentTrunk({
  events,
  currentStatus,
}: {
  events: OrderEvent[];
  currentStatus: string;
}) {
  const currentIndex = events.findIndex((e) => e.status === currentStatus);

  if (events.length === 0) return null;

  return (
    <>
      {events.map((event, index) => {
        const isCompleted = index <= currentIndex;
        const isActive = index === currentIndex;
        const isLast = index === events.length - 1;
        return (
          <div
            key={event.id}
            className={cn("relative flex items-start gap-4", !isLast && "pb-6")}
          >
            <div
              className={cn(
                "relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                isCompleted ? "bg-primary" : isActive ? "bg-primary/30 ring-4 ring-primary/20" : "bg-border"
              )}
            >
              {isActive && (
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
              )}
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <p className="font-medium text-foreground">{event.status}</p>
              {event.description && (
                <p className="text-sm text-muted-foreground">{event.description}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {formatDate(event.created_at)}
              </p>
            </div>
          </div>
        );
      })}
    </>
  );
}

function ParentTailEvents({ events }: { events: OrderEvent[] }) {
  if (events.length === 0) return null;
  return (
    <div className="relative flex items-start gap-4 pb-6">
      <div className="relative z-10 w-8 h-8 rounded-full bg-muted flex-shrink-0" />
      <div className="flex-1 space-y-2 pt-1">
        {events.map((event) => (
          <div key={event.id}>
            <p className="text-sm font-medium text-foreground">{event.status}</p>
            {event.description && (
              <p className="text-xs text-muted-foreground">{event.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function BranchHub({ itemCount, deliveredCount }: { itemCount: number; deliveredCount: number }) {
  return (
    <div className="relative flex items-start gap-4 pb-2">
      <div className="relative z-10 w-8 h-8 rounded-full border-2 border-primary bg-card flex items-center justify-center flex-shrink-0">
        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
      </div>
      <div className="flex-1 min-w-0 pt-1.5">
        <p className="font-medium text-foreground">
          {itemCount} {itemCount === 1 ? "delivery" : "deliveries"}
        </p>
        <p className="text-sm text-muted-foreground">
          {deliveredCount} of {itemCount} delivered
        </p>
      </div>
    </div>
  );
}

interface BulkItemBranchProps {
  item: BulkOrderItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}

function BulkItemBranch({ item, index, isOpen, onToggle }: BulkItemBranchProps) {
  const panelId = `bulk-item-panel-${item.id}`;

  return (
    <div className="relative">
      <div className="absolute -left-4 top-5 w-3 h-px bg-border" aria-hidden />
      <button
        type="button"
        id={`bulk-item-trigger-${item.id}`}
        className="w-full flex items-start gap-3 py-3 pr-1 text-left rounded-lg hover:bg-muted/40 transition-colors -ml-1 pl-1"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        <span
          className="mt-2 w-2 h-2 rounded-full bg-primary shrink-0 ring-2 ring-card"
          aria-hidden
        />
        <span className="flex-1 min-w-0">
          <span className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground">#{index + 1}</span>
            <span className="font-medium text-foreground">{item.receiver_name}</span>
            <Badge variant={statusVariant(item.status)} className="text-xs">
              {item.status}
            </Badge>
          </span>
          <span className="block text-xs text-muted-foreground mt-1 truncate">
            {shortRouteLabel(item)}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "w-5 h-5 shrink-0 text-muted-foreground transition-transform mt-1",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div
          id={panelId}
          role="region"
          aria-labelledby={`bulk-item-trigger-${item.id}`}
          className="ml-3 mb-4 pl-4 border-l-2 border-primary/30 space-y-4"
        >
          <OrderRouteSummary
            pickupRegionName={item.pickup_region_name}
            pickupAddress={item.pickup_address}
            deliveryRegionName={item.delivery_region_name}
            deliveryRegionAreaName={item.delivery_region_area_name}
            deliveryAddress={item.delivery_address}
          />

          <div className="flex flex-wrap gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Receiver phone</p>
              <p className="text-foreground">{item.receiver_phone}</p>
            </div>
            {item.package_description && (
              <div>
                <p className="text-xs text-muted-foreground">Package</p>
                <p className="text-foreground">{item.package_description}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-muted-foreground">Price</p>
              <p className="font-medium text-foreground">
                ₦{Number(item.price_ngn || 0).toLocaleString()}
                {item.eta_label && (
                  <span className="text-muted-foreground font-normal ml-1">
                    · {item.eta_label}
                  </span>
                )}
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Item timeline</h4>
            <ItemTimeline item={item} />
          </div>
        </div>
      )}
    </div>
  );
}

export function BulkShipmentTimeline({ bulk }: BulkShipmentTimelineProps) {
  const paymentPending = bulk.status === PENDING_PAYMENT_STATUS;
  const parentEvents = bulk.events ?? [];
  const { trunk, tail } = splitParentEvents(parentEvents);
  const deliveredCount = bulk.items.filter((i) => i.status === "Delivered").length;

  const initialOpenId = useMemo(() => defaultOpenItemId(bulk.items), [bulk.items]);
  const [openItemId, setOpenItemId] = useState<number | null>(initialOpenId);

  const toggleItem = (id: number) => {
    setOpenItemId((prev) => (prev === id ? null : id));
  };

  const showBranches = !paymentPending && bulk.items.length > 0;

  if (parentEvents.length === 0 && !showBranches) {
    return (
      <p className="text-sm text-muted-foreground">No timeline updates yet.</p>
    );
  }

  return (
    <div className="relative">
      <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-border" aria-hidden />

      <div className="relative pl-0">
        <ParentTrunk events={trunk} currentStatus={bulk.status} />
        {showBranches ? (
          <>
            <BranchHub itemCount={bulk.items.length} deliveredCount={deliveredCount} />
            <div className="relative ml-8 pl-4 border-l border-border">
              {bulk.items.map((item, i) => (
                <BulkItemBranch
                  key={item.id}
                  item={item}
                  index={i}
                  isOpen={openItemId === item.id}
                  onToggle={() => toggleItem(item.id)}
                />
              ))}
            </div>
          </>
        ) : (
          !paymentPending && bulk.items.length === 0 && (
            <p className="text-sm text-muted-foreground ml-10">No delivery items found.</p>
          )
        )}
        <ParentTailEvents events={tail} />
      </div>
    </div>
  );
}
