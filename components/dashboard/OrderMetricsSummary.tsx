import { Card } from "@/components/ui";
import type { Order } from "@/types";

interface OrderMetricsSummaryProps {
  orders: Order[];
}

function formatCurrency(n: number) {
  return `₦${n.toFixed(2)}`;
}

function formatShortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function OrderMetricsSummary({ orders }: OrderMetricsSummaryProps) {
  const total = orders.length;
  const delivered = orders.filter((o) => o.status === "Delivered").length;
  const inProgress = total - delivered;
  const totalSpent = orders.reduce((sum, o) => {
    if (o.price == null || Number.isNaN(Number(o.price))) return sum;
    return sum + Number(o.price);
  }, 0);
  const lastOrder = orders.reduce<Order | null>((latest, o) => {
    if (!latest) return o;
    return new Date(o.created_at) > new Date(latest.created_at) ? o : latest;
  }, null);

  const items = [
    { label: "Total orders", value: String(total) },
    { label: "In progress", value: String(inProgress) },
    { label: "Delivered", value: String(delivered) },
    {
      label: "Total spent",
      value: totalSpent > 0 ? formatCurrency(totalSpent) : "—",
    },
    {
      label: "Last order",
      value: lastOrder ? formatShortDate(lastOrder.created_at) : "—",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
      {items.map((item) => (
        <Card key={item.label} className="p-4 sm:p-5">
          <p className="text-xs sm:text-sm text-muted-foreground mb-1">
            {item.label}
          </p>
          <p className="text-lg sm:text-xl font-semibold text-foreground tabular-nums">
            {item.value}
          </p>
        </Card>
      ))}
    </div>
  );
}
