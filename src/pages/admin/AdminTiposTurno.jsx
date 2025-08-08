import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function Adminservicio() {
  const [tipos, setTipos] = useState([]);
  const [nuevo, setNuevo] = useState({ nombre: "", precio: "", duracion: "" });

  const cargarTipos = async () => {
    const ref = collection(db, "servicio");
    const snap = await getDocs(ref);
    const lista = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setTipos(lista);
  };

  useEffect(() => {
    cargarTipos();
  }, []);

  const agregar = async () => {
    const ref = collection(db, "servicio");
    await addDoc(ref, {
      nombre: nuevo.nombre,
      precio: parseFloat(nuevo.precio),
      duracion: parseInt(nuevo.duracion),
    });
    setNuevo({ nombre: "", precio: "", duracion: "" });
    cargarTipos();
  };

  const eliminar = async (id) => {
    await deleteDoc(doc(db, "servicio", id));
    cargarTipos();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-indigo-600 mb-4">Tipos de turno</h1>

      <div className="mb-6 grid grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Nombre"
          value={nuevo.nombre}
          onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Precio"
          value={nuevo.precio}
          onChange={(e) => setNuevo({ ...nuevo, precio: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Duración (min)"
          value={nuevo.duracion}
          onChange={(e) => setNuevo({ ...nuevo, duracion: e.target.value })}
          className="border p-2 rounded"
        />
      </div>

      <button onClick={agregar} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 mb-6">
        Agregar tipo de turno
      </button>

      <ul className="space-y-3">
        {tipos.map((tipo) => (
          <li key={tipo.id} className="border p-3 rounded">
            <div className="grid grid-cols-3 gap-4 items-center">
              <input
                type="text"
                value={tipo.nombre}
                onChange={(e) =>
                  setTipos((prev) =>
                    prev.map((t) =>
                      t.id === tipo.id ? { ...t, nombre: e.target.value } : t
                    )
                  )
                }
                className="border p-2 rounded"
              />
              <input
                type="number"
                value={tipo.precio}
                onChange={(e) =>
                  setTipos((prev) =>
                    prev.map((t) =>
                      t.id === tipo.id ? { ...t, precio: e.target.value } : t
                    )
                  )
                }
                className="border p-2 rounded"
              />
              <input
                type="number"
                value={tipo.duracion}
                onChange={(e) =>
                  setTipos((prev) =>
                    prev.map((t) =>
                      t.id === tipo.id ? { ...t, duracion: e.target.value } : t
                    )
                  )
                }
                className="border p-2 rounded"
              />
            </div>

            <div className="flex justify-end mt-2 gap-4">
              <button
                onClick={() => eliminar(tipo.id)}
                className="text-red-500 hover:underline"
              >
                Eliminar
              </button>
              <button
                onClick={async () => {
                  const ref = doc(db, "servicio", tipo.id);
                  await updateDoc(ref, {
                    nombre: tipo.nombre,
                    precio: parseFloat(tipo.precio),
                    duracion: parseInt(tipo.duracion),
                  });
                  cargarTipos(); // refresca
                }}
                className="text-indigo-600 hover:underline"
              >
                Guardar cambios
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
