import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function AdminConfig() {
  const [horarios, setHorarios] = useState({});
  const dias = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];

  useEffect(() => {
    const cargar = async () => {
      const ref = doc(db, "configuracion", "horariosAtencion");
      const snap = await getDoc(ref);
      if (snap.exists()) setHorarios(snap.data());
    };
    cargar();
  }, []);

  const handleChange = (dia, valor) => {
    const horas = valor.split(",").map((h) => h.trim());
    setHorarios((prev) => ({ ...prev, [dia]: horas }));
  };

  const guardar = async () => {
    const ref = doc(db, "configuracion", "horariosAtencion");
    await setDoc(ref, horarios);
    alert("Horarios guardados correctamente");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-indigo-600 mb-4">Configurar horarios de atención</h1>
      {dias.map((dia) => (
        <div key={dia} className="mb-4">
          <label className="block font-semibold capitalize">{dia}</label>
          <input
            type="text"
            value={horarios[dia]?.join(", ") || ""}
            onChange={(e) => handleChange(dia, e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Ej: 09:00, 10:00, 11:00"
          />
        </div>
      ))}
      <button onClick={guardar} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
        Guardar cambios
      </button>
    </div>
  );
}
