import apiClient from "./client";
import type {
  CreateOrderRequest,
  OrderResponse,
  OrdersResponse,
  TrackOrderResponse,
} from "@/types";

export const ordersApi = {
  // Create a new order
  async createOrder(orderData: CreateOrderRequest): Promise<OrderResponse> {
    const response = await apiClient.post<OrderResponse>("/orders", orderData);
    return response.data;
  },

  // Get user's order history
  async getOrders(): Promise<OrdersResponse> {
    const response = await apiClient.get<OrdersResponse>("/user/orders");
    return response.data;
  },

  // Track an order by tracking number
  async trackOrder(trackingNumber: string): Promise<TrackOrderResponse> {
    const response = await apiClient.get<TrackOrderResponse>(
      `/track/${trackingNumber}`
    );
    return response.data;
  },
};
