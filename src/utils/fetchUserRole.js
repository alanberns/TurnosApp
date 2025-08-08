import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase"; 

export async function fetchUserRole(uid) {
  try {
    const userRef = doc(db, "roles", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      return data.role || null;
    } else {
      console.warn("No se encontró el documento del usuario");
      return null;
    }
  } catch (error) {
    console.error("Error al obtener el rol:", error);
    return null;
  }
}
