import { useState, useEffect, useMemo } from "react";
import {
  listenConfig,
  listenExcepciones,
  saveConfig,
  addExcepcion,
  removeExcepcion
} from "../db/configService";

export function useAdminConfig(rolId, isAuthReady) {
  const defaultHorarios = useMemo(
    () => Array.from({ length: 7 }, () => [{ inicio: "09:00", fin: "18:00" }]),
    []
  );

  const [turnosSimultaneos, setTurnosSimultaneos] = useState(1);
  const [minutosSlot, setMinutosSlot] = useState(15); 
  const [horarios, setHorarios] = useState(defaultHorarios);
  const [excepciones, setExcepciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthReady || !rolId) return;

    const unsubConfig = listenConfig(
      rolId,
      defaultHorarios,
      data => {
        if (data) {
          setTurnosSimultaneos(data.turnosSimultaneos ?? 1);
          setMinutosSlot(data.minutosSlot ?? 15); 
          setHorarios(data.horarios ?? defaultHorarios);
        }
        setLoading(false);
      },
      err => {
        setError(err.message);
        setLoading(false);
      }
    );

    const unsubEx = listenExcepciones(
      rolId,
      lista => setExcepciones(lista),
      err => setError(err.message)
    );

    return () => {
      unsubConfig();
      unsubEx();
    };
  }, [rolId, isAuthReady, defaultHorarios]);

  return {
    turnosSimultaneos,
    setTurnosSimultaneos,
    minutosSlot,              
    setMinutosSlot,
    horarios,
    setHorarios,
    excepciones,
    loading,
    error,
    defaultHorarios,
    saveConfig: () =>
      saveConfig(rolId, turnosSimultaneos, minutosSlot, horarios),
    addExcepcion: exc => addExcepcion(rolId, exc),
    removeExcepcion: id => removeExcepcion(rolId, id)
  };
}
