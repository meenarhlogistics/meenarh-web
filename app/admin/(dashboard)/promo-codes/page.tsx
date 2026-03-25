"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { adminApi } from "@/lib/api/admin";
import { Button, Badge } from "@/components/ui";
import { PromoCodeForm } from "@/components/admin/PromoCodeForm";

interface PromoCode {
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
}

export default function PromoCodesPage() {
  const [codes, setCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchCodes = useCallback(async () => {
    try {
      const res = await adminApi.getPromoCodes();
      setCodes(res.data || []);
    } catch (err) {
      console.error("Failed to fetch promo codes:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCodes();
  }, [fetchCodes]);

  const handleCreate = async (data: {
    code: string;
    discount_type: string;
    discount_value: number;
    min_order_value: number | null;
    max_uses: number | null;
    expires_at: string;
  }) => {
    await adminApi.createPromoCode({
      ...data,
      expires_at: data.expires_at || null,
    });
    setShowForm(false);
    fetchCodes();
  };

  const handleToggle = async (id: number) => {
    await adminApi.togglePromoCode(id);
    fetchCodes();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this promo code?")) return;
    await adminApi.deletePromoCode(id);
    fetchCodes();
  };

  const isExpired = (date: string | null) => date && new Date(date) < new Date();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Promo Codes</h1>
          <p className="text-muted-foreground text-sm mt-1">{codes.length} promo code{codes.length !== 1 ? "s" : ""}</p>
        </div>
        <Button variant="primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "New Code"}
        </Button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-medium text-foreground mb-4">Create Promo Code</h2>
          <PromoCodeForm onSubmit={handleCreate} submitLabel="Create Code" />
        </div>
      )}

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left p-4 font-medium text-muted-foreground">Code</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Discount</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Usage</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Expires</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
              <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {codes.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground">No promo codes yet.</td>
              </tr>
            ) : (
              codes.map((c) => (
                <tr key={c.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="p-4">
                    <Link href={`/admin/promo-codes/${c.id}`} className="font-mono font-medium text-foreground hover:text-primary transition-colors">
                      {c.code}
                    </Link>
                  </td>
                  <td className="p-4 text-foreground">
                    {c.discount_type === "percentage" ? `${c.discount_value}%` : `₦${c.discount_value.toLocaleString()}`}
                    {c.min_order_value ? <span className="text-muted-foreground text-xs ml-1">(min ₦{c.min_order_value.toLocaleString()})</span> : ""}
                  </td>
                  <td className="p-4 text-foreground">
                    {c.current_uses}{c.max_uses ? ` / ${c.max_uses}` : ""}
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {c.expires_at ? (
                      <span className={isExpired(c.expires_at) ? "text-destructive" : ""}>
                        {new Date(c.expires_at).toLocaleDateString()}
                        {isExpired(c.expires_at) && " (expired)"}
                      </span>
                    ) : (
                      "No expiry"
                    )}
                  </td>
                  <td className="p-4">
                    <Badge variant={c.is_active && !isExpired(c.expires_at) ? "success" : "error"}>
                      {c.is_active ? (isExpired(c.expires_at) ? "Expired" : "Active") : "Inactive"}
                    </Badge>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <Button variant="secondary" size="sm" onClick={() => handleToggle(c.id)}>
                      {c.is_active ? "Deactivate" : "Activate"}
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => handleDelete(c.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
