import { collection, query, where, getDocs, getDoc, documentId, doc, updateDoc, writeBatch, increment  } from "firebase/firestore";
import dayjs from "dayjs";
import { db } from "../firebase";

export async function cambiarEstadoATurno(turnoId, nuevoEstado) {
    const turnoRef = doc(db, "turnos", turnoId);
    await updateDoc(turnoRef, {
      estado: nuevoEstado
    });
  }

export async function aceptarTurno(turnoId) {
    return cambiarEstadoATurno(turnoId, "confirmado");
}

export async function rechazarTurno(turnoId) {
  liberarSlots(turnoId);
  return cambiarEstadoATurno(turnoId, "rechazado");
}

export async function cancelarTurno(turnoId) {
  liberarSlots(turnoId);
  return cambiarEstadoATurno(turnoId, "cancelado");
}
  

export async function getTurnosPendientesDesdeHoy() {
  const hoy = dayjs().startOf("day").toDate();

  // 1️⃣ Consulta base
  const qTurnos = query(
    collection(db, "turnos"),
    where("estado", "==", "pendiente"),
    where("inicio", ">=", hoy)
  );

  const snapTurnos = await getDocs(qTurnos);
  const turnos = snapTurnos.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  if (turnos.length === 0) return [];

  // 2️⃣ IDs únicos
  const userIds = [...new Set(turnos.map(t => t.userId))];
  const servicioIds = [...new Set(turnos.map(t => t.servicioId))];

  // 3️⃣ Usuarios
  let usuariosMap = {};
  if (userIds.length) {
    const qUsers = query(
      collection(db, "users"),
      where(documentId(), "in", userIds)
    );
    const snapUsers = await getDocs(qUsers);
    snapUsers.forEach(doc => {
      usuariosMap[doc.id] = doc.data();
    });
  }

  // 4️⃣ Servicios
  let serviciosMap = {};
  if (servicioIds.length) {
    const qServicios = query(
      collection(db, "servicios"),
      where(documentId(), "in", servicioIds)
    );
    const snapServicios = await getDocs(qServicios);
    snapServicios.forEach(doc => {
      serviciosMap[doc.id] = doc.data();
    });
  }

  // 5️⃣ Unir datos
  const turnosEnriquecidos = turnos.map(t => ({
    ...t,
    usuario: usuariosMap[t.userId] || null,
    servicio: serviciosMap[t.servicioId] || null
  }));

  return turnosEnriquecidos;
}


export async function getTurnosPorFechaOptimizado(fecha) {
  const inicioDia = dayjs(fecha).startOf("day").toDate();
  const finDia = dayjs(fecha).endOf("day").toDate();

  // 1️⃣ Consulta de turnos
  const qTurnos = query(
    collection(db, "turnos"),
    where("inicio", ">=", inicioDia),
    where("inicio", "<=", finDia)
  );

  const snapTurnos = await getDocs(qTurnos);
  const turnos = snapTurnos.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  if (turnos.length === 0) return [];

  // 2️⃣ Obtener IDs únicos
  const userIds = [...new Set(turnos.map(t => t.userId))];
  const servicioIds = [...new Set(turnos.map(t => t.servicioId))];

  // 3️⃣ Traer usuarios en bloque
  const qUsers = query(
    collection(db, "users"),
    where(documentId(), "in", userIds)
  );
  const snapUsers = await getDocs(qUsers);
  const usuariosMap = {};
  snapUsers.forEach(doc => {
    usuariosMap[doc.id] = doc.data();
  });

  // 4️⃣ Traer servicios en bloque
  const qServicios = query(
    collection(db, "servicios"),
    where(documentId(), "in", servicioIds)
  );
  const snapServicios = await getDocs(qServicios);
  const serviciosMap = {};
  snapServicios.forEach(doc => {
    serviciosMap[doc.id] = doc.data();
  });

  // 5️⃣ Unir datos
  const turnosEnriquecidos = turnos.map(t => ({
    ...t,
    usuario: usuariosMap[t.userId] || null,
    servicio: serviciosMap[t.servicioId] || null
  }));

  return turnosEnriquecidos;
}

export async function liberarSlots(turnoId) {
  const turnoRef = doc(db, "turnos", turnoId);
  const turnoSnap = await getDoc(turnoRef);

  if (!turnoSnap.exists()) return;

  const { slotIds = [] } = turnoSnap.data();

  const batch = writeBatch(db);

  // Sumar capacidad de todos los slots
  for (const slotId of slotIds) {
    const slotRef = doc(db, "slots", slotId);
    batch.update(slotRef, { capacidad: increment(1) });
  }

  // Vaciar el array de slotIds en el turno
  batch.update(turnoRef, { slotIds: [] });

  // Enviar todo junto
  await batch.commit();
}