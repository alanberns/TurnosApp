import { db } from "../firebase";
import { doc, setDoc, onSnapshot, collection, addDoc, deleteDoc } from "firebase/firestore";
import { serializeHorarios, deserializeHorarios } from "../utils/horarios";

export function listenConfig(rolId, defaultHorarios, onData, onError) {
  const configRef = doc(db, "configuracion", rolId);
  return onSnapshot(
    configRef,
    snap => {
      if (snap.exists()) {
        const data = snap.data();
        onData({
          turnosSimultaneos: Number(data.turnosSimultaneos ?? 1),
          horarios: data.horarios ? deserializeHorarios(data.horarios) : defaultHorarios
        });
      } else {
        onData(null);
      }
    },
    err => onError(err)
  );
}

export function listenExcepciones(rolId, onData, onError) {
  const exRef = collection(db, "configuracion", rolId, "excepciones");
  return onSnapshot(
    exRef,
    snap => {
      const lista = [];
      snap.forEach(d => lista.push({ id: d.id, ...d.data() }));
      onData(lista);
    },
    err => onError(err)
  );
}

export function saveConfig(rolId, turnosSimultaneos, horarios) {
  return setDoc(
    doc(db, "configuracion", rolId),
    { turnosSimultaneos: Number(turnosSimultaneos), horarios: serializeHorarios(horarios) },
    { merge: true }
  );
}

export function addExcepcion(rolId, excepcion) {
  return addDoc(collection(db, "configuracion", rolId, "excepciones"), excepcion);
}

export function removeExcepcion(rolId, id) {
  return deleteDoc(doc(db, "configuracion", rolId, "excepciones", id));
}
