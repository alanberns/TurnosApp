// src/utils/fetchUserRole.js
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase"; // tu instancia de Firestore

export async function fetchUserRole(uid) {
  try {
    const userRef = doc(db, "users", uid);
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
