import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";

export async function fetchServicios() {
  try {
    // Referencia a la colección 'servicios'
    const serviciosRef = collection(db, "servicios");

    // Filtrar por campo activo === true
    const q = query(serviciosRef, where("activo", "==", true));

    // Obtener documentos
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.warn("No se encontraron servicios activos");
      return [];
    }

    // Mapear datos con id incluido
    const servicios = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return servicios;
  } catch (error) {
    console.error("Error al obtener servicios:", error);
    return [];
  }
}
