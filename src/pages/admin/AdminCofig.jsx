import { useAuthStore } from "../../store/useAuthStore";
import { useAdminConfig } from "../../utils/useAdminConfig";
import { TurnosSimultaneosInput } from "../../components/adminConfig/TurnosSimultaneosInput";
import { HorarioSemana } from "../../components/adminConfig/HorarioSemana";
import { ExcepcionesForm } from "../../components/adminConfig/ExcepcionesForm";
import { ExcepcionesLista } from "../../components/adminConfig/ExcepcionesLista";
import { useState } from "react";

const diasSemana = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];

export default function AdminConfig() {
  const { info, isAuthReady } = useAuthStore();
  const rolId = info?.rolId;

  const {
    turnosSimultaneos, setTurnosSimultaneos,
    minutosSlot, setMinutosSlot,
    horarios, setHorarios,
    excepciones, loading, error,
    defaultHorarios, saveConfig,
    addExcepcion, removeExcepcion
  } = useAdminConfig(rolId, isAuthReady);

  const [nuevaExcepcion, setNuevaExcepcion] = useState({
    fecha: "",
    tipo: "cerrado",
    franjas: []   
  });
 

  const agregarFranja = (diaIdx) => {
    const nuevos = [...horarios];
    nuevos[diaIdx] = [...(nuevos[diaIdx] || []), { inicio: "09:00", fin: "18:00" }];
    setHorarios(nuevos);
  };

  const actualizarFranja = (diaIdx, franjaIdx, campo, valor) => {
    const nuevos = [...horarios];
    nuevos[diaIdx] = nuevos[diaIdx].map((f, idx) =>
      idx === franjaIdx ? { ...f, [campo]: valor } : f
    );
    setHorarios(nuevos);
  };

  const eliminarFranja = (diaIdx, franjaIdx) => {
    const nuevos = [...horarios];
    nuevos[diaIdx] = nuevos[diaIdx].filter((_, idx) => idx !== franjaIdx);
    setHorarios(nuevos);
  };

  if (!isAuthReady) return <p>Cargando usuario...</p>;
  if (!rolId) return <p>No hay rol asociado al usuario</p>;
  if (loading) return <p>Cargando configuración...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Configuración </h2>
      {error && <p className="text-red-500">{error}</p>}

      {/* Turnos simultáneos */}
      <TurnosSimultaneosInput value={turnosSimultaneos} onChange={setTurnosSimultaneos} />

      {/* Minutos por slot */}
      <div className="mt-4">
        <label className="block font-medium mb-1">Minutos por bloque</label>
        <input
          type="number"
          min="5"
          step="5"
          value={minutosSlot ?? 15}
          onChange={(e) => setMinutosSlot(Number(e.target.value))}
          className="border border-gray-300 rounded px-3 py-1 w-28"
        />
      </div>

      {/* Horarios semanales */}
      <HorarioSemana
        diasSemana={diasSemana}
        horarios={horarios}
        onAgregar={agregarFranja}
        onActualizar={actualizarFranja}
        onEliminar={eliminarFranja}
      />

      {/* Excepciones */}
      <h3 className="mt-6 font-semibold">Excepciones</h3>
      <ExcepcionesForm
        nuevaExcepcion={nuevaExcepcion}
        setNuevaExcepcion={setNuevaExcepcion}
        onAdd={() => {
          if (
            nuevaExcepcion.tipo === "abierto" &&
            (!nuevaExcepcion.franjas || nuevaExcepcion.franjas.length === 0)
          ) {
            alert("Agregá al menos una franja");
            return;
          }
          addExcepcion(nuevaExcepcion).then(() =>
            setNuevaExcepcion({ fecha: "", tipo: "cerrado", franjas: [] })
          );
        }}
      />
      <ExcepcionesLista excepciones={excepciones} onDelete={removeExcepcion} />

      {/* Guardar */}
      <button
        onClick={saveConfig}
        className="mt-6 bg-indigo-600 text-white px-4 py-2 rounded"
      >
        Guardar Configuración
      </button>
    </div>
  );
}
