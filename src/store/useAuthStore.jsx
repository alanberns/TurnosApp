import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      role: null,
      info: null,
      turnos: null,
      isAuthReady: false,
      setUser: ({ user, role, info, turnos }) =>
        set({ user, role, info, turnos, isAuthReady: true }),      
      clearUser: () => set({ user: null, role: null, info: null, turnos: null, isAuthReady: false }),
    }),
    {
      name: "auth-storage",
    }
  )
);
