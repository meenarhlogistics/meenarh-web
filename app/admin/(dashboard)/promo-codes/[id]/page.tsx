"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { adminApi } from "@/lib/api/admin";
import { Badge } from "@/components/ui";

interface PromoDetail {
  id: number;
  code: string;
  discount_type: string;
  discount_value: number;
  min_order_value: number | null;
  max_uses: number | null;
  current_uses: number;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
  usage: UsageEntry[];
}

interface UsageEntry {
  id: number;
  discount_applied: number;
  used_at: string;
  customer_name: string;
  customer_email: string;
  tracking_number: string;
}

export default function PromoCodeDetailPage() {
  const params = useParams();
  const codeId = Number(params.id);
  const [promo, setPromo] = useState<PromoDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPromo = useCallback(async () => {
    try {
      const res = await adminApi.getPromoCode(codeId);
      setPromo(res.data);
    } catch (err) {
      console.error("Failed to fetch promo code:", err);
    } finally {
      setLoading(false);
    }
  }, [codeId]);

  useEffect(() => {
    fetchPromo();
  }, [fetchPromo]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!promo) {
    return <p className="text-muted-foreground py-10 text-center">Promo code not found.</p>;
  }

  const isExpired = promo.expires_at && new Date(promo.expires_at) < new Date();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/admin/promo-codes" className="hover:text-foreground transition-colors">Promo Codes</Link>
        <span>/</span>
        <span className="text-foreground font-mono">{promo.code}</span>
      </div>

      {/* Info Card */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-2xl font-semibold font-mono text-foreground">{promo.code}</h1>
          <Badge variant={promo.is_active && !isExpired ? "success" : "error"}>
            {promo.is_active ? (isExpired ? "Expired" : "Active") : "Inactive"}
          </Badge>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Discount</p>
            <p className="font-medium text-foreground">
              {promo.discount_type === "percentage" ? `${promo.discount_value}%` : `₦${promo.discount_value.toLocaleString()}`}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Min Order</p>
            <p className="font-medium text-foreground">{promo.min_order_value ? `₦${promo.min_order_value.toLocaleString()}` : "None"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Usage</p>
            <p className="font-medium text-foreground">{promo.current_uses}{promo.max_uses ? ` / ${promo.max_uses}` : " (unlimited)"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Expires</p>
            <p className="font-medium text-foreground">{promo.expires_at ? new Date(promo.expires_at).toLocaleDateString() : "Never"}</p>
          </div>
        </div>
      </div>

      {/* Usage Log */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-medium text-foreground">Usage History</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left p-4 font-medium text-muted-foreground">Customer</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Order</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Discount Applied</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Date</th>
            </tr>
          </thead>
          <tbody>
            {(!promo.usage || promo.usage.length === 0) ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-muted-foreground">No usage recorded yet.</td>
              </tr>
            ) : (
              promo.usage.map((u) => (
                <tr key={u.id} className="border-b border-border/50">
                  <td className="p-4">
                    <p className="text-foreground">{u.customer_name}</p>
                    <p className="text-xs text-muted-foreground">{u.customer_email}</p>
                  </td>
                  <td className="p-4 font-mono text-xs text-foreground">{u.tracking_number}</td>
                  <td className="p-4 text-foreground">₦{u.discount_applied.toLocaleString()}</td>
                  <td className="p-4 text-muted-foreground">{new Date(u.used_at).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
