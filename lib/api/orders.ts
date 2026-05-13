import apiClient from "./client";
import type {
  CreateOrderRequest,
  OrderResponse,
  OrdersResponse,
  TrackOrderResponse,
  CreateBulkOrderRequest,
  BulkOrderResponse,
  BulkOrdersResponse,
  BulkOrderDetailResponse,
} from "@/types";

export const ordersApi = {
  // ── Single order ────────────────────────────────────────────────────────────

  async createOrder(orderData: CreateOrderRequest): Promise<OrderResponse> {
    const response = await apiClient.post<OrderResponse>("/orders", orderData);
    return response.data;
  },

  /** Combined single + bulk order history, sorted newest-first */
  async getOrders(): Promise<OrdersResponse> {
    const response = await apiClient.get<OrdersResponse>("/user/orders");
    return response.data;
  },

  /** Resolve any tracking number — single (MN-…) or bulk (MN-B-…) */
  async trackOrder(trackingNumber: string): Promise<TrackOrderResponse> {
    const response = await apiClient.get<TrackOrderResponse>(
      `/track/${trackingNumber}`
    );
    return response.data;
  },

  // ── Bulk orders ─────────────────────────────────────────────────────────────

  async createBulkOrder(data: CreateBulkOrderRequest): Promise<BulkOrderResponse> {
    const response = await apiClient.post<BulkOrderResponse>("/bulk-orders", data);
    return response.data;
  },

  async getBulkOrders(): Promise<BulkOrdersResponse> {
    const response = await apiClient.get<BulkOrdersResponse>("/user/bulk-orders");
    return response.data;
  },

  async getBulkOrder(id: number): Promise<BulkOrderDetailResponse> {
    const response = await apiClient.get<BulkOrderDetailResponse>(
      `/user/bulk-orders/${id}`
    );
    return response.data;
  },
};
