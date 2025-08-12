import { db } from "../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";

const colRef = collection(db, "servicios");

export async function getServicios() {
  const snap = await getDocs(colRef);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export function addServicio(servicio) {
  return addDoc(colRef, {
    ...servicio,
    duracionMinutos: Number(servicio.duracionMinutos),
    precio: Number(servicio.precio)
  });
}

export function updateServicio(id, servicio) {
  return updateDoc(doc(db, "servicios", id), {
    ...servicio,
    duracionMinutos: Number(servicio.duracionMinutos),
    precio: Number(servicio.precio)
  });
}

export function deleteServicio(id) {
  return deleteDoc(doc(db, "servicios", id));
}
