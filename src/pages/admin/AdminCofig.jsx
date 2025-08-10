// src/components/AdminConfig.jsx
import { useState, useEffect, useMemo } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import {
  doc,
  setDoc,
  onSnapshot,
  collection,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase";

const diasSemana = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

// Cambiá a true si querés autocrear la config con defaults cuando no exista
const AUTO_CREATE_DEFAULT = false;

// ---- Helpers para serializar / deserializar horarios ----
// UI: array de 7 posiciones (una por día), cada una es un array de franjas {inicio, fin}
// Firestore: objeto { "0": [...franjas], "1": [...], ..., "6": [...] } (mapa, no array de arrays)

function serializeHorarios(horariosArray) {
  const obj = {};
  for (let i = 0; i < diasSemana.length; i++) {
    const franjas = Array.isArray(horariosArray?.[i]) ? horariosArray[i] : [];
    obj[String(i)] = franjas; // array de objetos (permitido)
  }
  return obj;
}

function deserializeHorarios(horariosDoc) {
  // Acepta tanto un objeto (nuevo formato) como un array (por compatibilidad)
  if (Array.isArray(horariosDoc)) {
    // Ya es array de arrays (UI). Lo devolvemos tal cual, pero normalizado a 7 días.
    const arr = [];
    for (let i = 0; i < diasSemana.length; i++) {
      arr[i] = Array.isArray(horariosDoc[i]) ? horariosDoc[i] : [];
    }
    return arr;
  }

  // Si es objeto (mapa), lo convertimos al array de arrays de la UI
  const arr = [];
  for (let i = 0; i < diasSemana.length; i++) {
    const key = String(i);
    const franjas = horariosDoc && Array.isArray(horariosDoc[key]) ? horariosDoc[key] : [];
    arr[i] = franjas;
  }
  return arr;
}

export default function AdminConfig() {
  const { user, info, isAuthReady } = useAuthStore();
  // Ojo: el rolId viene del doc de users (info), no del objeto de Auth (user)
  const rolId = info?.rolId; // ej: "admin"

  const defaultHorarios = useMemo(
    () => diasSemana.map(() => [{ inicio: "09:00", fin: "18:00" }]),
    []
  );

  const [turnosSimultaneos, setTurnosSimultaneos] = useState(1);
  const [horarios, setHorarios] = useState(defaultHorarios);
  const [excepciones, setExcepciones] = useState([]);
  const [nuevaExcepcion, setNuevaExcepcion] = useState({
    fecha: "",
    tipo: "cerrado",
    inicio: "",
    fin: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Cargar config en tiempo real
  useEffect(() => {
    // Esperar a que AuthStore esté listo
    if (!isAuthReady) return;

    // Si no hay rol, dejamos de cargar y mostramos mensaje
    if (!rolId) {
      setLoading(false);
      return;
    }

    const configRef = doc(db, "configuracion", rolId);

    let unsubConfig = () => {};
    let unsubEx = () => {};

    unsubConfig = onSnapshot(
      configRef,
      async (snap) => {
        try {
          if (snap.exists()) {
            const data = snap.data();
            setTurnosSimultaneos(Number(data.turnosSimultaneos ?? 1));
            // Convertimos lo que venga (objeto o array) a array de arrays para la UI
            const uiHorarios = data.horarios
              ? deserializeHorarios(data.horarios)
              : defaultHorarios;
            setHorarios(uiHorarios);
          } else if (AUTO_CREATE_DEFAULT) {
            await setDoc(
              configRef,
              {
                turnosSimultaneos: 1,
                // Guardamos en Firestore como mapa (sin nested arrays)
                horarios: serializeHorarios(defaultHorarios),
              },
              { merge: true }
            );
            setHorarios(defaultHorarios);
          }
        } catch (e) {
          console.error(e);
          setError("Error cargando configuración: " + e.message);
        } finally {
          setLoading(false);
        }
      },
      (e) => {
        console.error(e);
        setError("Error cargando configuración: " + e.message);
        setLoading(false);
      }
    );

    const exRef = collection(db, "configuracion", rolId, "excepciones");
    unsubEx = onSnapshot(
      exRef,
      (querySnap) => {
        const lista = [];
        querySnap.forEach((docu) => lista.push({ id: docu.id, ...docu.data() }));
        setExcepciones(lista);
      },
      (e) => {
        console.error(e);
        setError("Error cargando excepciones: " + e.message);
      }
    );

    return () => {
      unsubConfig && unsubConfig();
      unsubEx && unsubEx();
    };
  }, [rolId, isAuthReady, defaultHorarios]);

  const guardarConfig = async () => {
    if (!rolId) {
      setError("No se detectó un rol para este usuario.");
      return;
    }
    try {
      setError("");
      await setDoc(
        doc(db, "configuracion", rolId),
        {
          turnosSimultaneos: Number(turnosSimultaneos),
          // Serializamos a mapa antes de guardar para evitar nested arrays
          horarios: serializeHorarios(horarios),
        },
        { merge: true }
      );
      alert("Configuración guardada para rol: " + rolId);
    } catch (err) {
      console.error(err);
      setError("Error al guardar configuración: " + err.message);
    }
  };

  const agregarFranja = (diaIdx) => {
    const nuevos = [...horarios];
    nuevos[diaIdx] = [...(nuevos[diaIdx] || []), { inicio: "09:00", fin: "18:00" }];
    setHorarios(nuevos);
  };

  const actualizarFranja = (diaIdx, franjaIdx, campo, valor) => {
    const nuevos = [...horarios];
    const franjas = [...(nuevos[diaIdx] || [])];
    const franja = { ...(franjas[franjaIdx] || { inicio: "", fin: "" }) };
    franja[campo] = valor;
    franjas[franjaIdx] = franja;
    nuevos[diaIdx] = franjas;
    setHorarios(nuevos);
  };

  const eliminarFranja = (diaIdx, franjaIdx) => {
    const nuevos = [...horarios];
    const franjas = [...(nuevos[diaIdx] || [])];
    franjas.splice(franjaIdx, 1);
    nuevos[diaIdx] = franjas;
    setHorarios(nuevos);
  };

  const agregarExcepcion = async () => {
    if (!rolId) {
      setError("No se detectó un rol para este usuario.");
      return;
    }
    if (!nuevaExcepcion.fecha) return;
    try {
      await addDoc(
        collection(db, "configuracion", rolId, "excepciones"),
        nuevaExcepcion
      );
      setNuevaExcepcion({ fecha: "", tipo: "cerrado", inicio: "", fin: "" });
    } catch (err) {
      setError("Error al agregar excepción: " + err.message);
    }
  };

  const eliminarExcepcion = async (id) => {
    if (!rolId) return;
    try {
      await deleteDoc(doc(db, "configuracion", rolId, "excepciones", id));
    } catch (err) {
      setError("Error al eliminar excepción: " + err.message);
    }
  };

  if (!isAuthReady) return <p>Cargando usuario...</p>;
  if (!rolId) return <p>No hay rol asociado al usuario. Verificá users.rolId.</p>;
  if (loading) return <p>Cargando configuración...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Configuración para rol: {rolId}</h2>
      {error && <p className="text-red-500">{error}</p>}

      <label className="block mt-4">
        Turnos simultáneos:
        <input
          type="number"
          min="1"
          value={turnosSimultaneos}
          onChange={(e) => setTurnosSimultaneos(Number(e.target.value))}
          className="border p-1 ml-2"
        />
      </label>

      <h3 className="mt-6 font-semibold">Horarios semanales</h3>
      {diasSemana.map((dia, idxDia) => (
        <div key={dia} className="mb-2">
          <strong>{dia}</strong>
          {(horarios[idxDia] || []).map((franja, idxFranja) => (
            <div key={idxFranja} className="flex gap-2 items-center">
              <input
                type="time"
                value={franja.inicio}
                onChange={(e) =>
                  actualizarFranja(idxDia, idxFranja, "inicio", e.target.value)
                }
              />
              <input
                type="time"
                value={franja.fin}
                onChange={(e) =>
                  actualizarFranja(idxDia, idxFranja, "fin", e.target.value)
                }
              />
              <button onClick={() => eliminarFranja(idxDia, idxFranja)}>🗑</button>
            </div>
          ))}
          <button
            onClick={() => agregarFranja(idxDia)}
            className="text-blue-500"
          >
            + Franja
          </button>
        </div>
      ))}

      <h3 className="mt-6 font-semibold">Excepciones</h3>
      <div className="flex gap-2 items-center mb-2">
        <input
          type="date"
          value={nuevaExcepcion.fecha}
          onChange={(e) =>
            setNuevaExcepcion({ ...nuevaExcepcion, fecha: e.target.value })
          }
        />
        <select
          value={nuevaExcepcion.tipo}
          onChange={(e) =>
            setNuevaExcepcion({ ...nuevaExcepcion, tipo: e.target.value })
          }
        >
          <option value="cerrado">Cerrado</option>
          <option value="abierto">Abierto especial</option>
        </select>
        {nuevaExcepcion.tipo === "abierto" && (
          <>
            <input
              type="time"
              value={nuevaExcepcion.inicio}
              onChange={(e) =>
                setNuevaExcepcion({ ...nuevaExcepcion, inicio: e.target.value })
              }
            />
            <input
              type="time"
              value={nuevaExcepcion.fin}
              onChange={(e) =>
                setNuevaExcepcion({ ...nuevaExcepcion, fin: e.target.value })
              }
            />
          </>
        )}
        <button
          onClick={agregarExcepcion}
          className="bg-green-500 text-white px-2 py-1 rounded"
        >
          Agregar
        </button>
      </div>

      <ul>
        {excepciones.map((ex) => (
          <li key={ex.id}>
            {ex.fecha} - {ex.tipo}{" "}
            {ex.tipo === "abierto" && `${ex.inicio} a ${ex.fin}`}{" "}
            <button onClick={() => eliminarExcepcion(ex.id)}>🗑</button>
          </li>
        ))}
      </ul>

      <button
        onClick={guardarConfig}
        className="mt-6 bg-indigo-600 text-white px-4 py-2 rounded"
      >
        Guardar Configuración
      </button>
    </div>
  );
}
