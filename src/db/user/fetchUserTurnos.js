import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

export async function fetchUserTurnos(uid) {
  try {
    const turnosRef = collection(db, "turnos");
    const q = query(turnosRef, where("userId", "==", uid));
    const querySnapshot = await getDocs(q);

    const turnos = [];

    for (const docSnap of querySnapshot.docs) {
      const turnoData = docSnap.data();
      const servicioRef = doc(db, "servicios", turnoData.servicioId);
      const servicioSnap = await getDoc(servicioRef);

      const servicioData = servicioSnap.exists() ? servicioSnap.data() : null;

      turnos.push({
        id: docSnap.id,
        ...turnoData,
        servicio: servicioData, // ahora tenés nombre, precio, duración
      });
    }

    return turnos;
  } catch (error) {
    console.error("Error al obtener turnos:", error);
    return [];
  }
}

