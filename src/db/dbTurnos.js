import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    updateDoc,
    doc,
    serverTimestamp,
    Timestamp,
  } from "firebase/firestore";
  import { db } from "../firebase";
  
  /**
   * Crea (o asegura) un slot en la DB.
   * @param {Slot} slot
   * @returns {Promise<string>} ID del slot en DB
   */
  export async function ensureSlot(slot) {
    // Buscamos si ya existe un slot con esa fecha/hora
    const q = query(
      collection(db, "slots"),
      where("fechaHoraInicio", "==", Timestamp.fromDate(slot.fechaHoraInicio)),
      where("fechaHoraFin", "==", Timestamp.fromDate(slot.fechaHoraFin))
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      // Ya existe, devolvemos su id
      return snap.docs[0].id;
    }
  
    const docRef = await addDoc(collection(db, "slots"), {
      fechaHoraInicio: Timestamp.fromDate(slot.fechaHoraInicio),
      fechaHoraFin: Timestamp.fromDate(slot.fechaHoraFin),
      capacidad: slot.capacidad,
      disponibles: slot.capacidad, // inicialmente igual a capacidad
      fechaCreacion: serverTimestamp(),
    });
    return docRef.id;
  }
  
  /**
   * Obtiene horas que ya están llenas para un día.
   */
  export async function fetchHorasLlenas(fechaISO) {
    const inicioDia = new Date(`${fechaISO}T00:00:00`);
    const finDia = new Date(`${fechaISO}T23:59:59.999`);
    const q = query(
      collection(db, "slots"),
      where("fechaHoraInicio", ">=", inicioDia),
      where("fechaHoraInicio", "<=", finDia),
      where("disponibles", "<=", 0)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d =>
      d.data().fechaHoraInicio.toDate().toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    );
}
  /**
   * Reserva un turno en un slot dado.
   */
  export async function crearTurno({ user, servicio, slot }) {
    // Aseguramos slot en DB
    const slotId = await ensureSlot(slot);
  
    // Obtenemos el documento del slot
    const slotRef = doc(db, "slots", slotId);
    const slotSnap = await getDocs(query(
      collection(db, "slots"),
      where("__name__", "==", slotId)
    ));
    const slotData = slotSnap.docs[0].data();
    if (slotData.disponibles <= 0) {
      return { ok: false, error: "No hay más lugares en ese horario." };
    }
  
    // Creamos turno
    const turnoRef = await addDoc(collection(db, "turnos"), {
      userId: user.id,
      servicioId: servicio.id,
      slotId,
      estado: "pendiente",
      fechaCreacion: serverTimestamp(),
    });
  
    // Bajamos la disponibilidad
    await updateDoc(slotRef, { disponibles: slotData.disponibles - 1 });
  
    return { ok: true, turnoId: turnoRef.id };
  }

  /**
 * Trae todos los slots de una fecha concreta
 * @param {string} fechaISO formato YYYY-MM-DD
 * @returns {Promise<Slot[]>}
 */
export async function fetchSlotsDelDia(fechaISO) {
    const inicio = new Date(`${fechaISO}T00:00:00`);
    const fin = new Date(`${fechaISO}T23:59:59.999`);
  
    const q = query(
      collection(db, "slots"),
      where("fechaHoraInicio", ">=", inicio),
      where("fechaHoraInicio", "<=", fin)
    );
    const snap = await getDocs(q);
  
    return snap.docs.map(d => {
      const data = d.data();
      return {
        id: d.id,
        fechaHoraInicio: data.fechaHoraInicio.toDate(),
        fechaHoraFin: data.fechaHoraFin.toDate(),
        capacidad: data.capacidad,
        disponible: data.disponibles > 0,
        disponibles: data.disponibles
      };
    });
    }
