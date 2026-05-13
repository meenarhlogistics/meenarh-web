import apiClient from './client';
import {
  CreateBulkOrderRequest,
  CartItem,
  CartResponse,
  AddToCartResponse,
  CheckoutResponse,
} from '@/types';

export const cartApi = {
  // Add item to cart
  addToCart: async (
    item: Omit<CartItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ): Promise<AddToCartResponse> => {
    const response = await apiClient.post('/cart', item);
    return response.data;
  },

  addBulkToCart: async (entry: CreateBulkOrderRequest): Promise<AddToCartResponse> => {
    const response = await apiClient.post('/cart/bulk', entry);
    return response.data;
  },

  // Get user's cart
  getCart: async (): Promise<CartResponse> => {
    const response = await apiClient.get('/cart');
    return response.data;
  },

  // Update cart item
  updateCartItem: async (
    id: number,
    data: Partial<CartItem>
  ): Promise<AddToCartResponse> => {
    const response = await apiClient.patch(`/cart/${id}`, data);
    return response.data;
  },

  updateBulkCartEntry: async (
    id: number,
    data: CreateBulkOrderRequest
  ): Promise<AddToCartResponse> => {
    const response = await apiClient.patch(`/cart/bulk/${id}`, data);
    return response.data;
  },

  // Remove item from cart
  removeCartItem: async (id: number): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/cart/${id}`);
    return response.data;
  },

  removeBulkCartEntry: async (id: number): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/cart/bulk/${id}`);
    return response.data;
  },

  // Clear entire cart
  clearCart: async (): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete('/cart');
    return response.data;
  },

  // Checkout - create orders from cart items
  checkout: async (): Promise<CheckoutResponse> => {
    const response = await apiClient.post('/cart/checkout');
    return response.data;
  },

  // Checkout single item - create order from one cart item
  checkoutSingleItem: async (itemId: number): Promise<CheckoutResponse> => {
    const response = await apiClient.post(`/cart/checkout/${itemId}`);
    return response.data;
  },
};
