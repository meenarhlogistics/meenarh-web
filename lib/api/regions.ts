import apiClient from "./client";

export interface PickupRegion {
  id: number;
  name: string;
  slug: string | null;
  sort_order: number;
}

export interface DeliveryRegion {
  id: number;
  name: string;
  description: string | null;
  sort_order: number;
}

export interface RegionQuote {
  price_ngn: number;
  eta_min_hours: number;
  eta_max_hours: number;
  eta_label: string | null;
  eta_display: string | null;
  pickup_name: string;
  delivery_name: string;
}

export const regionsApi = {
  async getPickups(): Promise<PickupRegion[]> {
    const res = await apiClient.get<{ success: boolean; data: PickupRegion[] }>(
      "/regions/pickups"
    );
    return res.data.data ?? [];
  },

  async getDeliveriesForPickup(pickupRegionId: number): Promise<DeliveryRegion[]> {
    const res = await apiClient.get<{ success: boolean; data: DeliveryRegion[] }>(
      "/regions/deliveries",
      { params: { pickup_region_id: pickupRegionId } }
    );
    return res.data.data ?? [];
  },

  async getQuote(
    pickupRegionId: number,
    deliveryRegionId: number
  ): Promise<RegionQuote | null> {
    try {
      const res = await apiClient.get<{ success: boolean; data: RegionQuote }>(
        "/pricing/quote",
        { params: { pickup_region_id: pickupRegionId, delivery_region_id: deliveryRegionId } }
      );
      return res.data.data ?? null;
    } catch (e: unknown) {
      const err = e as { response?: { status?: number } };
      if (err.response?.status === 404) return null;
      throw e;
    }
  },
};
