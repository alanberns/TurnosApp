import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase"; 
import { useAuthStore } from "../store/useAuthStore";
import InfoMessage from "../components/InfoMessage";

export default function Perfil() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        if (!user) return;

        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setNombre(data.nombre || "");
          setApellido(data.apellido || "");
          setTelefono(data.telefono || "");
          setEmail(data.email || user.email);
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = auth.currentUser;
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, {
        nombre,
        apellido,
        telefono,
        email,
      });

      setSuccess("Datos actualizados correctamente");
    } catch (error) {
      console.error("Error al actualizar:", error);
      setError("Hubo un error al actualizar");
    }
  };

  if (loading) return <p className="p-4">Cargando perfil...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Mi Perfil</h2>
      {error && <InfoMessage type="error" message={error} />}
      {success && <InfoMessage type="success" message={success} />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Apellido</label>
          <input
            type="text"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Teléfono</label>
          <input
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Guardar cambios
        </button>
      </form>

    </div>
  );
}
