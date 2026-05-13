import { create } from 'zustand';
import { CartEntry, CartItem, CreateBulkOrderRequest } from '@/types';
import { cartApi } from '@/lib/api/cart';

interface CartStore {
  items: CartEntry[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addItem: (item: Omit<CartItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  addBulkEntry: (entry: CreateBulkOrderRequest) => Promise<void>;
  updateItem: (id: number, data: Partial<CartItem>) => Promise<void>;
  updateBulkEntry: (id: number, data: CreateBulkOrderRequest) => Promise<void>;
  removeItem: (id: number) => Promise<void>;
  removeBulkEntry: (id: number) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
  checkout: () => Promise<{ orders: Array<{ tracking_number: string; price: number }>; total_orders: number; total_price: number }>;
  getTotalPrice: () => number;
  getItemCount: () => number;
  getEntryCount: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  addItem: async (item) => {
    try {
      set({ isLoading: true, error: null });
      await cartApi.addToCart(item);
      
      // Fetch updated cart
      await get().fetchCart();
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || 'Failed to add item to cart' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  addBulkEntry: async (entry) => {
    try {
      set({ isLoading: true, error: null });
      await cartApi.addBulkToCart(entry);
      await get().fetchCart();
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || 'Failed to add bulk delivery to cart' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateItem: async (id, data) => {
    try {
      set({ isLoading: true, error: null });
      await cartApi.updateCartItem(id, data);
      
      // Fetch updated cart
      await get().fetchCart();
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || 'Failed to update item' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateBulkEntry: async (id, data) => {
    try {
      set({ isLoading: true, error: null });
      await cartApi.updateBulkCartEntry(id, data);
      await get().fetchCart();
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || 'Failed to update bulk delivery' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  removeItem: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await cartApi.removeCartItem(id);
      
      // Remove from local state
      set((state) => ({
        items: state.items.filter((item) => !(item.kind === 'single' && item.id === id)),
      }));
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || 'Failed to remove item' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  removeBulkEntry: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await cartApi.removeBulkCartEntry(id);
      set((state) => ({
        items: state.items.filter((item) => !(item.kind === 'bulk' && item.id === id)),
      }));
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || 'Failed to remove bulk delivery' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  clearCart: async () => {
    try {
      set({ isLoading: true, error: null });
      await cartApi.clearCart();
      set({ items: [] });
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || 'Failed to clear cart' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCart: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await cartApi.getCart();
      set({ items: response.data });
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || 'Failed to fetch cart' });
    } finally {
      set({ isLoading: false });
    }
  },

  checkout: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await cartApi.checkout();
      
      // Clear cart after successful checkout
      set({ items: [] });
      
      return response.data;
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || 'Failed to checkout' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  getTotalPrice: () => {
    const { items } = get();
    const total = items.reduce((sum, item) => {
      const price =
        item.kind === 'bulk'
          ? Number(item.estimated_total ?? item.estimated_price) || 0
          : Number(item.estimated_price) || 0;
      return sum + price;
    }, 0);
    return Number(total) || 0;
  },

  getItemCount: () => {
    const { items } = get();
    return items.reduce((sum, item) => {
      if (item.kind === 'bulk') {
        return sum + (Number(item.item_count) || item.items.length || 0);
      }
      return sum + 1;
    }, 0);
  },

  getEntryCount: () => {
    const { items } = get();
    return items.length;
  },
}));
