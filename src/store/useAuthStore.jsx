// src/store/useAuthStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      role: null,
      setUser: (user, role) => set({ user, role }),
      clearUser: () => set({ user: null, role: null }),
    }),
    {
      name: "auth-storage", // clave en localStorage
    }
  )
);
