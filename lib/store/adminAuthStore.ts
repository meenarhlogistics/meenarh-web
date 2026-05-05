import { create } from "zustand";
import adminClient from "@/lib/api/admin";

export interface AdminUser {
  id?: number;
  name: string;
  email: string;
  role: string;
}

interface AdminAuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setAuth: (user: AdminUser) => void;
  logout: () => void;
  loadAuth: () => Promise<void>;
}

export const useAdminAuthStore = create<AdminAuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: (user: AdminUser) => {
    localStorage.setItem("meenarh_admin_user", JSON.stringify(user));
    set({ user, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    localStorage.removeItem("meenarh_admin_user");
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  loadAuth: async () => {
    try {
      set({ isLoading: true });
      const res = await adminClient.get("/admin/me");
      if (res.data?.success && res.data?.data) {
        const user = res.data.data as AdminUser;
        localStorage.setItem("meenarh_admin_user", JSON.stringify(user));
        set({ user, isAuthenticated: true, isLoading: false });
        return;
      }
      localStorage.removeItem("meenarh_admin_user");
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch {
      localStorage.removeItem("meenarh_admin_user");
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
