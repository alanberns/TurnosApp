import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      info: null,
      turnos: null,
      isAuthReady: false,
      setUser: ({ user, info, turnos }) =>
        set({ user, info, turnos, isAuthReady: true }),      
      clearUser: () => set({ user: null, info: null, turnos: null, isAuthReady: false }),
    }),
    {
      name: "auth-storage",
    }
  )
);
