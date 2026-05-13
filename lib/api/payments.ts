import apiClient from "./client";
import type { CheckoutResponse, BulkOrderItemRequest } from "@/types";

export type PaystackInitializeBody =
  | {
      scope: "full_cart";
      promo_code?: string;
    }
  | {
      scope: "single_item";
      cart_item_id: number;
      promo_code?: string;
    }
  | {
      scope: "bulk_order";
      cart_bulk_entry_id: number;
      promo_code?: string;
    }
  | {
      scope: "bulk_order";
      sender_name?: string;
      sender_phone?: string;
      pickup_address?: string;
      items: BulkOrderItemRequest[];
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
