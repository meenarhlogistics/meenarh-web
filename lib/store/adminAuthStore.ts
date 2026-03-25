import { create } from "zustand";

export interface AdminUser {
  id?: number;
  name: string;
  email: string;
  role: string;
}

interface AdminAuthState {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setAuth: (token: string, user: AdminUser) => void;
  logout: () => void;
  loadAuth: () => void;
}

export const useAdminAuthStore = create<AdminAuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: (token: string, user: AdminUser) => {
    localStorage.setItem("meenarh_admin_token", token);
    localStorage.setItem("meenarh_admin_user", JSON.stringify(user));
    set({ token, user, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    localStorage.removeItem("meenarh_admin_token");
    localStorage.removeItem("meenarh_admin_user");
    set({ token: null, user: null, isAuthenticated: false, isLoading: false });
  },

  loadAuth: () => {
    try {
      const token = localStorage.getItem("meenarh_admin_token");
      const userString = localStorage.getItem("meenarh_admin_user");
      if (token && userString) {
        const user = JSON.parse(userString) as AdminUser;
        set({ token, user, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },
}));
