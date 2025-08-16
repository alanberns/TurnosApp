// store/serviciosStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fetchServicios as fetchServiciosFromDB } from "../db/service/fetchServicios";

export const useServiciosStore = create(
  persist(
    (set, get) => ({
      servicios: null,
      isLoading: false,

      // Método para obtener servicios, sólo si no hay en memoria
      fetchServicios: async () => {
        const { servicios } = get();
        if (servicios && servicios.length > 0) {
          return servicios; // Devolver cache
        }
        set({ isLoading: true });
        const data = await fetchServiciosFromDB();
        set({ servicios: data, isLoading: false });
        return data;
      },

      // Método para forzar actualización desde la base
      refreshServicios: async () => {
        set({ isLoading: true });
        const data = await fetchServiciosFromDB();
        set({ servicios: data, isLoading: false });
        return data;
      },

      clearServicios: () => set({ servicios: null })
    }),
    {
      name: "servicios-storage", // clave de persistencia
    }
  )
);
