"use client";

import { useCallback, useEffect, useState } from "react";
import { adminApi } from "@/lib/api/admin";
import { Button, Input, Badge } from "@/components/ui";

type Tab = "pickups" | "deliveries" | "rates";

interface PickupRow {
  id: number;
  name: string;
  slug: string | null;
  sort_order: number;
  is_active: number | boolean;
}

interface DeliveryRow {
  id: number;
  name: string;
  description: string | null;
  sort_order: number;
  is_active: number | boolean;
}

interface RateRow {
  id: number;
  pickup_region_id: number;
  delivery_region_id: number;
  price_ngn: string | number;
  eta_min_hours: number;
  eta_max_hours: number;
  eta_label: string | null;
  is_active: number | boolean;
  pickup_name: string;
  delivery_name: string;
}

function bool(v: number | boolean | undefined) {
  return v === true || v === 1;
}

export default function RegionRatesPage() {
  const [tab, setTab] = useState<Tab>("pickups");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Delivery rates</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Pickup hubs, delivery areas, and flat price plus ETA for each pair.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-border pb-2">
        {(
          [
            ["pickups", "Pickup areas"],
            ["deliveries", "Delivery areas"],
            ["rates", "Rate matrix"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "pickups" && <PickupsPanel />}
      {tab === "deliveries" && <DeliveriesPanel />}
      {tab === "rates" && <RatesPanel />}
    </div>
  );
}

function PickupsPanel() {
  const [rows, setRows] = useState<PickupRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [sortOrder, setSortOrder] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.listRegionPickups();
      setRows((res as { data?: PickupRow[] }).data || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await adminApi.createRegionPickup({
      name: name.trim(),
      slug: slug.trim() || null,
      sort_order: Number(sortOrder) || 0,
      is_active: true,
    });
    setName("");
    setSlug("");
    setSortOrder(0);
    load();
  };

  const toggle = async (row: PickupRow) => {
    await adminApi.updateRegionPickup(row.id, { is_active: !bool(row.is_active) });
    load();
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this pickup area? Related rates may be removed by the database.")) return;
    await adminApi.deleteRegionPickup(id);
    load();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleCreate}
        className="bg-card border border-border rounded-xl p-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
      >
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input label="Slug (optional)" value={slug} onChange={(e) => setSlug(e.target.value)} />
        <Input
          label="Sort order"
          type="number"
          value={sortOrder}
          onChange={(e) => setSortOrder(Number(e.target.value))}
        />
        <Button type="submit" variant="primary">
          Add pickup
        </Button>
      </form>

      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Slug</th>
              <th className="p-3">Sort</th>
              <th className="p-3">Active</th>
              <th className="p-3 w-40">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-border/60">
                <td className="p-3 font-mono">{r.id}</td>
                <td className="p-3">{r.name}</td>
                <td className="p-3 text-muted-foreground">{r.slug || "—"}</td>
                <td className="p-3">{r.sort_order}</td>
                <td className="p-3">
                  <Badge variant={bool(r.is_active) ? "default" : "error"}>
                    {bool(r.is_active) ? "Yes" : "No"}
                  </Badge>
                </td>
                <td className="p-3 flex flex-wrap gap-2">
                  <Button type="button" size="sm" variant="secondary" onClick={() => toggle(r)}>
                    Toggle
                  </Button>
                  <Button type="button" size="sm" variant="secondary" onClick={() => remove(r.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DeliveriesPanel() {
  const [rows, setRows] = useState<DeliveryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.listRegionDeliveries();
      setRows((res as { data?: DeliveryRow[] }).data || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await adminApi.createRegionDelivery({
      name: name.trim(),
      description: description.trim() || null,
      sort_order: Number(sortOrder) || 0,
      is_active: true,
    });
    setName("");
    setDescription("");
    setSortOrder(0);
    load();
  };

  const toggle = async (row: DeliveryRow) => {
    await adminApi.updateRegionDelivery(row.id, { is_active: !bool(row.is_active) });
    load();
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this delivery area?")) return;
    await adminApi.deleteRegionDelivery(id);
    load();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleCreate}
        className="bg-card border border-border rounded-xl p-6 space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input
            label="Sort order"
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
          />
        </div>
        <Input
          label="Internal description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button type="submit" variant="primary">
          Add delivery area
        </Button>
      </form>

      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Description</th>
              <th className="p-3">Sort</th>
              <th className="p-3">Active</th>
              <th className="p-3 w-40">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-border/60">
                <td className="p-3 font-mono">{r.id}</td>
                <td className="p-3">{r.name}</td>
                <td className="p-3 text-muted-foreground max-w-xs truncate">{r.description || "—"}</td>
                <td className="p-3">{r.sort_order}</td>
                <td className="p-3">
                  <Badge variant={bool(r.is_active) ? "default" : "error"}>
                    {bool(r.is_active) ? "Yes" : "No"}
                  </Badge>
                </td>
                <td className="p-3 flex flex-wrap gap-2">
                  <Button type="button" size="sm" variant="secondary" onClick={() => toggle(r)}>
                    Toggle
                  </Button>
                  <Button type="button" size="sm" variant="secondary" onClick={() => remove(r.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RatesPanel() {
  const [pickups, setPickups] = useState<PickupRow[]>([]);
  const [deliveries, setDeliveries] = useState<DeliveryRow[]>([]);
  const [hubId, setHubId] = useState<number | "">("");
  const [rates, setRates] = useState<RateRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState<RateRow | null>(null);

  const [dId, setDId] = useState<number | "">("");
  const [price, setPrice] = useState("");
  const [etaMin, setEtaMin] = useState("8");
  const [etaMax, setEtaMax] = useState("12");
  const [etaLabel, setEtaLabel] = useState("");

  const loadPickupsDeliveries = useCallback(async () => {
    const [pr, dr] = await Promise.all([
      adminApi.listRegionPickups(),
      adminApi.listRegionDeliveries(),
    ]);
    const p = (pr as { data?: PickupRow[] }).data || [];
    const d = (dr as { data?: DeliveryRow[] }).data || [];
    setPickups(p);
    setDeliveries(d);
    setHubId((hid) => (hid === "" && p.length ? p[0].id : hid));
  }, []);

  const loadRates = useCallback(async (pickupId: number | "") => {
    if (pickupId === "") {
      setRates([]);
      return;
    }
    const res = await adminApi.listRegionRates(pickupId);
    setRates((res as { data?: RateRow[] }).data || []);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        await loadPickupsDeliveries();
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadPickupsDeliveries]);

  useEffect(() => {
    if (hubId === "") return;
    loadRates(hubId);
  }, [hubId, loadRates]);

  const handleCreateRate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hubId === "" || dId === "") return;
    await adminApi.createRegionRate({
      pickup_region_id: Number(hubId),
      delivery_region_id: Number(dId),
      price_ngn: Number(price),
      eta_min_hours: Number(etaMin),
      eta_max_hours: Number(etaMax),
      eta_label: etaLabel.trim() || null,
      is_active: true,
    });
    setPrice("");
    setEtaLabel("");
    loadRates(Number(hubId));
  };

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!edit) return;
    await adminApi.updateRegionRate(edit.id, {
      price_ngn: Number(price),
      eta_min_hours: Number(etaMin),
      eta_max_hours: Number(etaMax),
      eta_label: etaLabel.trim() || null,
    });
    setEdit(null);
    if (hubId !== "") loadRates(hubId);
  };

  const startEdit = (r: RateRow) => {
    setEdit(r);
    setPrice(String(r.price_ngn));
    setEtaMin(String(r.eta_min_hours));
    setEtaMax(String(r.eta_max_hours));
    setEtaLabel(r.eta_label || "");
  };

  const cancelEdit = () => {
    setEdit(null);
    setPrice("");
    setEtaLabel("");
  };

  const removeRate = async (id: number) => {
    if (!confirm("Delete this rate?")) return;
    await adminApi.deleteRegionRate(id);
    if (hubId !== "") loadRates(hubId);
  };

  const toggleRate = async (r: RateRow) => {
    await adminApi.updateRegionRate(r.id, { is_active: !bool(r.is_active) });
    loadRates(Number(hubId));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const hubOptions = pickups.map((p) => (
    <option key={p.id} value={p.id}>
      {p.name}
    </option>
  ));

  const deliveryOptions = [
    { value: "", label: "Select delivery area" },
    ...deliveries.map((d) => ({ value: String(d.id), label: d.name })),
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
        <div className="w-full sm:w-64">
          <label className="block text-sm font-medium text-foreground mb-2">Pickup hub</label>
          <select
            className="w-full px-4 py-3 rounded-lg border border-input bg-muted text-foreground"
            value={hubId === "" ? "" : String(hubId)}
            onChange={(e) => setHubId(e.target.value ? Number(e.target.value) : "")}
          >
            {pickups.length === 0 ? <option value="">No pickups yet</option> : hubOptions}
          </select>
        </div>
      </div>

      {edit ? (
        <form
          onSubmit={saveEdit}
          className="bg-card border border-border rounded-xl p-6 space-y-4"
        >
          <h2 className="text-lg font-medium text-foreground">
            Edit rate — {edit.delivery_name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Input label="Price (₦)" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
            <Input label="ETA min (hours)" type="number" value={etaMin} onChange={(e) => setEtaMin(e.target.value)} required />
            <Input label="ETA max (hours)" type="number" value={etaMax} onChange={(e) => setEtaMax(e.target.value)} required />
            <Input label="ETA label (optional)" value={etaLabel} onChange={(e) => setEtaLabel(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <Button type="submit" variant="primary">
              Save
            </Button>
            <Button type="button" variant="secondary" onClick={cancelEdit}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <form
          onSubmit={handleCreateRate}
          className="bg-card border border-border rounded-xl p-6 space-y-4"
        >
          <h2 className="text-lg font-medium text-foreground">Add rate for this hub</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Delivery area</label>
              <select
                className="w-full px-4 py-3 rounded-lg border border-input bg-muted text-foreground"
                value={dId === "" ? "" : String(dId)}
                onChange={(e) => setDId(e.target.value ? Number(e.target.value) : "")}
                required
              >
                {deliveryOptions.map((o) => (
                  <option key={o.value || "empty"} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <Input label="Price (₦)" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
            <Input label="ETA min (hours)" type="number" value={etaMin} onChange={(e) => setEtaMin(e.target.value)} required />
            <Input label="ETA max (hours)" type="number" value={etaMax} onChange={(e) => setEtaMax(e.target.value)} required />
            <Input label="ETA label (optional)" value={etaLabel} onChange={(e) => setEtaLabel(e.target.value)} />
          </div>
          <Button type="submit" variant="primary" disabled={hubId === ""}>
            Add rate
          </Button>
        </form>
      )}

      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="p-3">Delivery</th>
              <th className="p-3">Price ₦</th>
              <th className="p-3">ETA</th>
              <th className="p-3">Label</th>
              <th className="p-3">Active</th>
              <th className="p-3 w-44">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rates.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-muted-foreground">
                  No rates for this pickup. Add one above.
                </td>
              </tr>
            ) : (
              rates.map((r) => (
                <tr key={r.id} className="border-b border-border/60">
                  <td className="p-3">{r.delivery_name}</td>
                  <td className="p-3 font-mono">{Number(r.price_ngn).toLocaleString()}</td>
                  <td className="p-3">
                    {r.eta_min_hours}–{r.eta_max_hours} hrs
                  </td>
                  <td className="p-3 text-muted-foreground">{r.eta_label || "—"}</td>
                  <td className="p-3">
                    <Badge variant={bool(r.is_active) ? "default" : "error"}>
                      {bool(r.is_active) ? "Yes" : "No"}
                    </Badge>
                  </td>
                  <td className="p-3 flex flex-wrap gap-2">
                    <Button type="button" size="sm" variant="secondary" onClick={() => startEdit(r)}>
                      Edit
                    </Button>
                    <Button type="button" size="sm" variant="secondary" onClick={() => toggleRate(r)}>
                      Toggle
                    </Button>
                    <Button type="button" size="sm" variant="secondary" onClick={() => removeRate(r.id)}>
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
