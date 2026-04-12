import apiClient from "./client";
import type { CheckoutResponse } from "@/types";

export type PaystackInitializeBody = {
  scope: "full_cart" | "single_item";
  cart_item_id?: number;
  promo_code?: string;
};

export type PaystackInitializeResponse = {
  success: boolean;
  data: {
    authorization_url: string;
    reference: string;
  };
};

export const paymentsApi = {
  initializePaystack: async (
    body: PaystackInitializeBody
  ): Promise<PaystackInitializeResponse> => {
    const response = await apiClient.post("/payments/paystack/initialize", body);
    return response.data;
  },

  verifyPaystack: async (reference: string): Promise<CheckoutResponse> => {
    const response = await apiClient.post("/payments/paystack/verify", {
      reference,
    });
    return response.data;
  },
};
