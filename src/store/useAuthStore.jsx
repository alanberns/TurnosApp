// src/store/useAuthStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      role: null,
      isAuthReady: false,
      setUser: (user, role) => set({ user, role, isAuthReady: true }),
      clearUser: () => set({ user: null, role: null, isAuthReady: false }),
    }),
    {
      name: "auth-storage",
    }
  )
);
