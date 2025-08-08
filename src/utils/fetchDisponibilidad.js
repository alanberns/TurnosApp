// src/utils/fetchDisponibilidad.js
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export async function fetchDisponibilidad() {
  const ref = collection(db, "turnos");
  const snapshot = await getDocs(ref);

  const resultado = {};
  snapshot.forEach((doc) => {
    const { fecha, abierto, turnosDisponibles } = doc.data();
    resultado[fecha] = abierto && turnosDisponibles > 0;
  });

  return resultado;
}
