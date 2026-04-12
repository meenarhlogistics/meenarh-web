import type { OrderDetail } from "@/types";

interface OrderTimelineProps {
  order: OrderDetail;
}

function etaSummary(order: OrderDetail): string | null {
  if (order.eta_label && String(order.eta_label).trim()) return order.eta_label.trim();
  if (order.eta_min_hours != null && order.eta_max_hours != null) {
    if (order.eta_min_hours === order.eta_max_hours) return `${order.eta_min_hours} hrs`;
    return `${order.eta_min_hours}–${order.eta_max_hours} hrs`;
  }
  return null;
}

export function OrderTimeline({ order }: OrderTimelineProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Determine if event is completed (all events up to current status)
  const currentStatusIndex = order.events.findIndex(
    (e) => e.status === order.status
  );

  return (
    <div className="space-y-6">
      {/* Order Details */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-4">
              Sender Information
            </h3>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="text-foreground">{order.sender_name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="text-foreground">{order.sender_phone}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pickup Address</p>
                <p className="text-foreground">{order.pickup_address}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-4">
              Receiver Information
            </h3>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="text-foreground">{order.receiver_name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="text-foreground">{order.receiver_phone}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Delivery Address
                </p>
                <p className="text-foreground">{order.delivery_address}</p>
              </div>
            </div>
          </div>
        </div>

        {order.package_description && (
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground">Package Description</p>
            <p className="text-foreground mt-1">{order.package_description}</p>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Price</p>
            <p className="text-xl font-semibold text-foreground">
              {order.price != null
                ? `₦${Number(order.price).toFixed(2)}`
                : "—"}
            </p>
          </div>
          {etaSummary(order) && (
            <div>
              <p className="text-xs text-muted-foreground">Estimated delivery</p>
              <p className="text-lg font-medium text-foreground">{etaSummary(order)}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-muted-foreground">Current Status</p>
            <p className="text-lg font-medium text-primary">{order.status}</p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-6">
          Delivery Timeline
        </h3>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

          {/* Events */}
          <div className="space-y-6">
            {order.events.map((event, index) => {
              const isCompleted = index <= currentStatusIndex;
              const isActive = index === currentStatusIndex;

              return (
                <div key={event.id} className="relative flex items-start gap-6">
                  {/* Status Dot */}
                  <div
                    className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isCompleted
                        ? "bg-primary"
                        : isActive
                        ? "bg-primary/30 ring-4 ring-primary/20"
                        : "bg-border"
                    }`}
                  >
                    {isCompleted && !isActive && (
                      <svg
                        className="w-4 h-4 text-primary-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                    {isActive && (
                      <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                    )}
                  </div>

                  {/* Event Details */}
                  <div className="flex-1 pb-6">
                    <div
                      className={`py-3 px-5 rounded-xl ${
                        isActive || isCompleted
                          ? "bg-accent/50"
                          : "bg-muted"
                      }`}
                    >
                      <p
                        className={`font-medium mb-1 ${
                          isActive || isCompleted
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {event.status}
                      </p>
                      {event.description && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {event.description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {formatDate(event.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
