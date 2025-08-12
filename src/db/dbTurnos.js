import { getDoc, collection, query, where, getDocs, addDoc, updateDoc, doc, Timestamp, runTransaction, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
/**
 * @typedef {Object} Slot
 * @property {string} id
 * @property {Date} fechaHoraInicio
 * @property {Date} fechaHoraFin
 * @property {number} capacidad
 * @property {boolean} disponible
 */

/**
 * @param {Date} fecha - fecha que quiere el usuario
 * @returns {Promise<{ horarioAtencion: {inicio: string, fin: string}[], turnosSimultaneos: number, slotsRegistrados: Slot[] }>}
 */
export async function obtenerConfigYSlots(fecha) {
  const fechaISO = fecha.toISOString().slice(0, 10);
  let diaSemana = (fecha.getDay() + 6) % 7; // 0=Dom, 1=Lun, ..., 6=Sáb (JS) Ajustar a 0=Lun, 1=Mar, ..., 6=Dom (BD)
  

  // 1) Config base
  const configSnap = await getDoc(doc(db, "configuracion", "admin"));
  if (!configSnap.exists()) throw new Error("Configuración no encontrada");

  const configData = configSnap.data();
  const horariosDoc = configData.horarios ?? {};
  let horarioAtencion = Array.isArray(horariosDoc)
    ? (horariosDoc[diaSemana] ?? [])
    : (horariosDoc[String(diaSemana)] ?? []);
  const turnosSimultaneos = Number(configData.turnosSimultaneos ?? 1);
  const minutosSlot = Number(configData.minutosSlot ?? 15);

  // 2) Excepciones del día
  const exSnap = await getDocs(
    query(
      collection(db, "configuracion", "admin", "excepciones"),
      where("fecha", "==", fechaISO)
    )
  );

  if (!exSnap.empty) {
    const excepcion = exSnap.docs[0].data();
    if (excepcion.tipo === "cerrado") {
      horarioAtencion = [];
    } else if (excepcion.tipo === "abierto") {
      horarioAtencion = [{ inicio: excepcion.inicio, fin: excepcion.fin }];
    }
  }

  // 3) Slots registrados del día
  const inicioDia = new Date(`${fechaISO}T00:00:00`);
  const finDia = new Date(`${fechaISO}T23:59:59.999`);

  const slotsSnap = await getDocs(
    query(
      collection(db, "slots"),
      where("fechaHoraInicio", ">=", inicioDia),
      where("fechaHoraInicio", "<=", finDia)
    )
  );

  const slotsRegistrados = slotsSnap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      fechaHoraInicio: data.fechaHoraInicio.toDate
        ? data.fechaHoraInicio.toDate()
        : new Date(data.fechaHoraInicio),
      fechaHoraFin: data.fechaHoraFin.toDate
        ? data.fechaHoraFin.toDate()
        : new Date(data.fechaHoraFin),
      // Si el doc no trae capacidad, usamos turnosSimultaneos como default
      capacidad: typeof data.capacidad === "number" ? data.capacidad : turnosSimultaneos,
    };
  });
  
  return { horarioAtencion, turnosSimultaneos, slotsRegistrados, minutosSlot };
}

export function generarSlotsOfrecibles(
  fecha,
  horarioAtencion,
  minutosSlot,
  slotsRegistrados,
  turnosSimultaneos,
  duracionMinutos
) {
  const ofrecibles = [];

  horarioAtencion.forEach(({ inicio, fin }) => {
    const inicioBloque = new Date(`${fecha.toISOString().slice(0,10)}T${inicio}`);
    const finBloque   = new Date(`${fecha.toISOString().slice(0,10)}T${fin}`);

    for (
      let hora = new Date(inicioBloque);
      hora < finBloque;
      hora.setMinutes(hora.getMinutes() + minutosSlot)
    ) {
      const finServicio = new Date(hora.getTime() + duracionMinutos * 60000);

      // 1️⃣ Si no entra completo antes del cierre → descartar
      if (finServicio > finBloque) continue;

      // 2️⃣ Recorrer todos los sub-bloques dentro de la duración y verificar capacidad
      let conflict = false;
      for (
        let t = new Date(hora);
        t < finServicio;
        t.setMinutes(t.getMinutes() + minutosSlot)
      ) {
        const slotOcupado = slotsRegistrados.find(s =>
          s.fechaHoraInicio.getTime() === t.getTime()
        );
        if (slotOcupado && slotOcupado.capacidad === 0) {
          conflict = true;
          break;
        }
      }
      if (conflict) continue;

      // 3️⃣ Si hay un slot en ese inicio, usar sus datos; si no, generar uno nuevo
      const slotExistente = slotsRegistrados.find(s =>
        s.fechaHoraInicio.getTime() === hora.getTime()
      );

      if (!slotExistente || slotExistente.capacidad > 0) {
        ofrecibles.push({
          id: slotExistente?.id ?? `gen-${hora.getTime()}`,
          fechaHoraInicio: new Date(hora),
          fechaHoraFin: finServicio,
          capacidad: slotExistente?.capacidad ?? turnosSimultaneos,
          disponible: (slotExistente?.capacidad ?? turnosSimultaneos) > 0
        });
      }
    }
  });

  return ofrecibles;
}

// Construye ID estable para un slot: YYYY-MM-DDTHH:mm en hora local
function slotIdFromDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${d}T${hh}:${mm}`;
}

/**
 * Reserva todos los slots necesarios y crea el documento de turno.
 * - Si un slot no existe, lo crea con capacidad = turnosSimultaneos y luego decrementa.
 * - Si existe, valida capacidad > 0 y decrementa.
 * - Crea un doc en 'turnos' con referencias e info básica.
 *
 * @param {Date} slotInicio - inicio del turno elegido (fecha+hora local)
 * @param {number} duracionMinutos - duración del servicio
 * @param {number} minutosSlot - tamaño del slot (p.ej., 15)
 * @param {number} turnosSimultaneos - cupo por slot
 * @param {string} userUid
 * @param {string} servicioUid
 * @returns {Promise<{ turnoId: string, slotIds: string[] }>}
 */
export async function reservarTurnoYSlots({
  slotInicio,
  duracionMinutos,
  userUid,
  servicioUid
}) {
  const configSnap = await getDoc(doc(db, "configuracion", "admin"));

  const minutosSlot = configSnap.data().minutosSlot;
  const turnosSimultaneos = configSnap.data().turnosSimultaneos;

  const necesarios = Math.max(1, Math.ceil(duracionMinutos / minutosSlot));

  const inicios = Array.from({ length: necesarios }, (_, i) =>
    new Date(slotInicio.getTime() + i * minutosSlot * 60000)
  );
  const slotIds = inicios.map(slotIdFromDate);
  const slotRefs = slotIds.map((id) => doc(db, "slots", id));

  const finTurno = new Date(slotInicio.getTime() + duracionMinutos * 60000);
  const turnoId = crypto.randomUUID();
  const turnoRef = doc(db, "turnos", turnoId);

  await runTransaction(db, async (tx) => {
    const slotData = [];
  
    // 1. Leer todos los slots primero
    for (let i = 0; i < slotRefs.length; i++) {
      const ref = slotRefs[i];
      const inicio = inicios[i];
      const snap = await tx.get(ref);
  
      slotData.push({ ref, inicio, snap });
    }
  
    // 2. Validar y preparar escrituras
    for (let i = 0; i < slotData.length; i++) {
      const { ref, inicio, snap } = slotData[i];
      let capActual;
  
      if (!snap.exists()) {
        capActual = turnosSimultaneos;
  
        tx.set(ref, {
          fechaHoraInicio: Timestamp.fromDate(inicio),
          fechaHoraFin: Timestamp.fromDate(
            new Date(inicio.getTime() + minutosSlot * 60000)
          ),
          capacidad: capActual - 1,
          creadoEn: serverTimestamp(),
          actualizadoEn: serverTimestamp()
        });
      } else {
        const data = snap.data();
        capActual = typeof data.capacidad === "number"
          ? data.capacidad
          : turnosSimultaneos;
  
        if (capActual <= 0) {
          throw new Error("Sin disponibilidad en uno de los tramos.");
        }
  
        tx.update(ref, {
          capacidad: capActual - 1,
          actualizadoEn: serverTimestamp()
        });
      }
    }
  
    // 3. Crear el turno
    tx.set(turnoRef, {
      userId: userUid,
      servicioId: servicioUid,
      inicio: Timestamp.fromDate(slotInicio),
      fin: Timestamp.fromDate(finTurno),
      duracionMinutos,
      slotIds,
      estado: "confirmado",
      fechaCreacion: serverTimestamp()
    });
  });

  return { turnoId, slotIds };
}
