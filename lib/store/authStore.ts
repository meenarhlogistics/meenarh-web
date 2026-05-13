import { create } from "zustand";
import type { User } from "@/types";
import apiClient from "@/lib/api/client";
import { authApi } from "@/lib/api/auth";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setAuth: (user: User) => void;
  logout: () => Promise<void>;
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

  // Logout user — clears the server session cookie, then wipes local state.
  // Local state is cleared even if the network request fails so the user
  // never ends up in a "stuck logged in" state on the client.
  logout: async () => {
    try {
      await authApi.logout();
    } catch {
      // Swallow: an expired/invalid cookie would 401 here, but the cookie is
      // already useless so we still want to complete the local cleanup.
    } finally {
      // Best-effort local cleanup of anything user-scoped.
      try {
        localStorage.removeItem("meenarh_user");
        // Stale admin-side state should not survive a customer logout either.
        localStorage.removeItem("meenarh_admin_user");
      } catch {
        // localStorage may be unavailable (private mode, SSR) — ignore.
      }

      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
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
