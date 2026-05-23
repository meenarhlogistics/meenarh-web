"use client";

import { useEffect, useState } from "react";
import { Card, Select } from "@/components/ui";
import {
  regionsApi,
  type PickupRegion,
  type DeliveryRegion,
  type DeliveryRegionArea,
  type RegionQuote,
} from "@/lib/api/regions";

interface PriceCalculatorProps {
  title: string;
  disclaimer: string;
}

export function PriceCalculator({ title, disclaimer }: PriceCalculatorProps) {
  const [pickups, setPickups] = useState<PickupRegion[]>([]);
  const [deliveries, setDeliveries] = useState<DeliveryRegion[]>([]);
  const [deliveryAreas, setDeliveryAreas] = useState<DeliveryRegionArea[]>([]);
  const [pickupId, setPickupId] = useState<number | undefined>();
  const [deliveryId, setDeliveryId] = useState<number | undefined>();
  const [areaId, setAreaId] = useState<number | undefined>();
  const [quote, setQuote] = useState<RegionQuote | null>(null);
  const [pickupsLoading, setPickupsLoading] = useState(true);
  const [deliveriesLoading, setDeliveriesLoading] = useState(false);
  const [areasLoading, setAreasLoading] = useState(false);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setPickupsLoading(true);
    regionsApi
      .getPickups()
      .then((data) => {
        if (!cancelled) setPickups(data);
      })
      .catch(() => {
        if (!cancelled) setPickups([]);
      })
      .finally(() => {
        if (!cancelled) setPickupsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!pickupId) {
      setDeliveries([]);
      setDeliveryId(undefined);
      return;
    }
    let cancelled = false;
    setDeliveriesLoading(true);
    regionsApi
      .getDeliveriesForPickup(pickupId)
      .then((data) => {
        if (!cancelled) setDeliveries(data);
      })
      .catch(() => {
        if (!cancelled) setDeliveries([]);
      })
      .finally(() => {
        if (!cancelled) setDeliveriesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [pickupId]);

  useEffect(() => {
    if (!deliveryId) {
      setDeliveryAreas([]);
      setAreaId(undefined);
      return;
    }
    let cancelled = false;
    setAreasLoading(true);
    regionsApi
      .getAreasForDelivery(deliveryId)
      .then((data) => {
        if (!cancelled) setDeliveryAreas(data);
      })
      .catch(() => {
        if (!cancelled) setDeliveryAreas([]);
      })
      .finally(() => {
        if (!cancelled) setAreasLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [deliveryId]);

  useEffect(() => {
    if (!pickupId || !deliveryId) {
      setQuote(null);
      setQuoteError("");
      return;
    }
    let cancelled = false;
    setQuoteLoading(true);
    setQuoteError("");
    regionsApi
      .getQuote(pickupId, deliveryId)
      .then((q) => {
        if (cancelled) return;
        if (!q) {
          setQuote(null);
          setQuoteError("No active rate for this route.");
          return;
        }
        setQuote(q);
      })
      .catch(() => {
        if (!cancelled) {
          setQuote(null);
          setQuoteError("Could not load price estimate.");
        }
      })
      .finally(() => {
        if (!cancelled) setQuoteLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [pickupId, deliveryId]);

  const formatNgn = (n: number) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(n);

  return (
    <Card className="p-6 sm:p-8">
      <h2 className="text-xl font-semibold text-foreground mb-6">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Pickup area"
          name="pickup_region_id"
          value={pickupId ? String(pickupId) : ""}
          onChange={(e) => {
            setPickupId(e.target.value ? Number(e.target.value) : undefined);
            setDeliveryId(undefined);
            setAreaId(undefined);
          }}
          options={[
            { value: "", label: pickupsLoading ? "Loading…" : "Select pickup area" },
            ...pickups.map((p) => ({ value: String(p.id), label: p.name })),
          ]}
        />
        <Select
          label="Delivery area"
          name="delivery_region_id"
          value={deliveryId ? String(deliveryId) : ""}
          onChange={(e) => {
            setDeliveryId(e.target.value ? Number(e.target.value) : undefined);
            setAreaId(undefined);
          }}
          options={[
            {
              value: "",
              label: !pickupId
                ? "Select pickup first"
                : deliveriesLoading
                  ? "Loading…"
                  : "Select delivery area",
            },
            ...deliveries.map((d) => ({ value: String(d.id), label: d.name })),
          ]}
        />
        {deliveryAreas.length > 0 ? (
          <Select
            label="Delivery sub-area (optional)"
            name="delivery_region_area_id"
            value={areaId ? String(areaId) : ""}
            onChange={(e) => setAreaId(e.target.value ? Number(e.target.value) : undefined)}
            options={[
              { value: "", label: areasLoading ? "Loading…" : "Optional sub-area" },
              ...deliveryAreas.map((a) => ({ value: String(a.id), label: a.name })),
            ]}
          />
        ) : null}
      </div>

      <div className="mt-6 rounded-lg bg-muted/60 p-4 min-h-[5rem] flex flex-col justify-center">
        {quoteLoading ? (
          <p className="text-sm text-muted-foreground">Calculating price…</p>
        ) : quote ? (
          <div className="space-y-1">
            <p className="text-2xl font-semibold text-foreground">{formatNgn(quote.price_ngn)}</p>
            <p className="text-sm text-muted-foreground">
              {quote.pickup_name} → {quote.delivery_name}
            </p>
            {quote.eta_display || quote.eta_label ? (
              <p className="text-sm text-foreground">
                ETA: {quote.eta_display || quote.eta_label}
              </p>
            ) : null}
          </div>
        ) : pickupId && deliveryId ? (
          <p className="text-sm text-destructive">{quoteError || "No quote available."}</p>
        ) : (
          <p className="text-sm text-muted-foreground">Select pickup and delivery areas to see a price.</p>
        )}
      </div>

      <p className="mt-4 text-xs text-muted-foreground">{disclaimer}</p>
    </Card>
  );
}
