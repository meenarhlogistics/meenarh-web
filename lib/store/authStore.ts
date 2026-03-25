import { create } from "zustand";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  loadAuth: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  // Set authentication data
  setAuth: (token: string, user: User) => {
    // Store in localStorage
    localStorage.setItem("meenarh_token", token);
    localStorage.setItem("meenarh_user", JSON.stringify(user));
    
    // Update state
    set({
      token,
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  // Logout user
  logout: () => {
    // Clear localStorage
    localStorage.removeItem("meenarh_token");
    localStorage.removeItem("meenarh_user");
    
    // Clear state
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  // Load auth from localStorage on app startup
  loadAuth: () => {
    try {
      const token = localStorage.getItem("meenarh_token");
      const userString = localStorage.getItem("meenarh_user");
      
      if (token && userString) {
        const user = JSON.parse(userString) as User;
        set({
          token,
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error("Failed to load auth from localStorage:", error);
      set({ isLoading: false });
    }
  },

  // Update user data
  setUser: (user: User) => {
    localStorage.setItem("meenarh_user", JSON.stringify(user));
    set({ user });
  },
}));
