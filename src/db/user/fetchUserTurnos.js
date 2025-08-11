import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

export async function fetchUserTurnos(uid) {
  try {
    const turnosRef = collection(db, "turnos");
    const q = query(turnosRef, where("uid", "==", uid));
    const querySnapshot = await getDocs(q);

    const turnos = [];
    querySnapshot.forEach((doc) => {
      turnos.push({ id: doc.id, ...doc.data() });
    });

    return turnos;
  } catch (error) {
    console.error("Error al obtener turnos:", error);
    return [];
  }
}
