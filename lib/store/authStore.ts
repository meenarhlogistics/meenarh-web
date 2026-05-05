import { create } from "zustand";
import type { User } from "@/types";
import apiClient from "@/lib/api/client";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setAuth: (user: User) => void;
  logout: () => void;
  loadAuth: () => Promise<void>;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  // Set authentication data
  setAuth: (user: User) => {
    localStorage.setItem("meenarh_user", JSON.stringify(user));
    
    // Update state
    set({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  // Logout user
  logout: () => {
    // Clear localStorage
    localStorage.removeItem("meenarh_user");
    
    // Clear state
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  // Load auth from localStorage on app startup
  loadAuth: async () => {
    try {
      set({ isLoading: true });
      const res = await apiClient.get("/user/me");
      if (res.data?.success && res.data?.data) {
        const user = res.data.data as User;
        localStorage.setItem("meenarh_user", JSON.stringify(user));
        set({ user, isAuthenticated: true, isLoading: false });
        return;
      }
      localStorage.removeItem("meenarh_user");
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch {
      localStorage.removeItem("meenarh_user");
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  // Update user data
  setUser: (user: User) => {
    localStorage.setItem("meenarh_user", JSON.stringify(user));
    set({ user });
  },
}));
