import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types/api";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string) => void;
  logout: () => void;
  initializeAuth: () => void;
}

 export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: !!localStorage.getItem("access_token"),

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      setToken: (token) => {
        localStorage.setItem("access_token", token);
        set({ isAuthenticated: true });
      },

      logout: () => {
        localStorage.removeItem("access_token");
        set({ user: null, isAuthenticated: false });
      },
      initializeAuth: () => {
        const token = localStorage.getItem("access_token");
        if (token) {
          set({ isAuthenticated: true });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

