"use client";

import { useEffect, useState, useCallback } from "react";
import { adminApi } from "@/lib/api/admin";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

interface Overview {
  total_visitors: number;
  total_orders: number;
  total_revenue: number;
  total_signups: number;
  conversion_rate: number;
}

interface TrendPoint {
  date: string;
  visitors?: number;
  orders?: number;
  revenue?: number;
}

interface LocationStat {
  location: string;
  request_count: number;
}

export default function AdminDashboardPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [trends, setTrends] = useState<TrendPoint[]>([]);
  const [pickupLocations, setPickupLocations] = useState<LocationStat[]>([]);
  const [deliveryLocations, setDeliveryLocations] = useState<LocationStat[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [overviewRes, trendsRes, locationsRes] = await Promise.all([
        adminApi.getAnalyticsOverview(),
        adminApi.getAnalyticsTrends(),
        adminApi.getAnalyticsLocations(10),
      ]);

      setOverview(overviewRes.data);

      // Merge visitor and order trends by date
      const dateMap = new Map<string, TrendPoint>();
      for (const v of trendsRes.data.visitors || []) {
        const d = v.date?.split("T")[0] || v.date;
        dateMap.set(d, { ...dateMap.get(d), date: d, visitors: v.visitors });
      }
      for (const o of trendsRes.data.orders || []) {
        const d = o.date?.split("T")[0] || o.date;
        dateMap.set(d, { ...dateMap.get(d), date: d, orders: o.orders, revenue: o.revenue });
      }
      const merged = Array.from(dateMap.values()).sort((a, b) => a.date.localeCompare(b.date));
      setTrends(merged);

      setPickupLocations(locationsRes.data.pickup_locations || []);
      setDeliveryLocations(locationsRes.data.delivery_locations || []);
    } catch (err) {
      console.error("Failed to load analytics:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = [
    { label: "Total Visitors", value: overview?.total_visitors?.toLocaleString() || "0", color: "bg-primary/10 text-primary" },
    { label: "Total Orders", value: overview?.total_orders?.toLocaleString() || "0", color: "bg-chart-2/10 text-chart-2" },
    { label: "Revenue", value: `₦${(overview?.total_revenue || 0).toLocaleString()}`, color: "bg-chart-3/10 text-chart-3" },
    { label: "Conversion Rate", value: `${overview?.conversion_rate || 0}%`, color: "bg-chart-4/10 text-chart-4" },
    { label: "New Signups", value: overview?.total_signups?.toLocaleString() || "0", color: "bg-chart-5/10 text-chart-5" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Analytics Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Last 30 days overview</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
            <p className="text-xl font-semibold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Trends Chart */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg font-medium text-foreground mb-4">Visitor &amp; Order Trends</h2>
        {trends.length > 0 ? (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                tickFormatter={(v: string) => v.slice(5)}
              />
              <YAxis tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 13,
                }}
              />
              <Legend />
              <Bar dataKey="visitors" fill="var(--chart-1)" name="Visitors" radius={[4, 4, 0, 0]} />
              <Bar dataKey="orders" fill="var(--chart-2)" name="Orders" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-muted-foreground text-sm py-10 text-center">No trend data available yet.</p>
        )}
      </div>

      {/* Location Tables */}
      <div className="grid lg:grid-cols-2 gap-6">
        <LocationTable title="Most Requested Pickup Locations" data={pickupLocations} />
        <LocationTable title="Most Requested Delivery Locations" data={deliveryLocations} />
      </div>
    </div>
  );
}

function LocationTable({ title, data }: { title: string; data: { location: string; request_count: number }[] }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h2 className="text-lg font-medium text-foreground mb-4">{title}</h2>
      {data.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 text-muted-foreground font-medium">#</th>
                <th className="text-left py-2 text-muted-foreground font-medium">Location</th>
                <th className="text-right py-2 text-muted-foreground font-medium">Requests</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="py-2 text-muted-foreground">{i + 1}</td>
                  <td className="py-2 text-foreground">{item.location}</td>
                  <td className="py-2 text-right font-medium text-foreground">{item.request_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-muted-foreground text-sm py-6 text-center">No data available yet.</p>
      )}
    </div>
  );
}
