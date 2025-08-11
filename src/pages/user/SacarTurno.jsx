// src/pages/SacarTurno.jsx
import { useEffect, useState } from "react";
import {
  fetchSlotsDelDia,
  crearTurno
} from "../../db/dbTurnos";
import { generarSlots } from "../../utils/generarSlots";
import { fetchServicios } from "../../db/fetchServicios";

export default function SacarTurno({ user, config }) {
  const [servicios, setServicios] = useState([]);
  const [loadingServicios, setLoadingServicios] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [step, setStep] = useState(1);
  const [servicioSel, setServicioSel] = useState(null);

  const [fecha, setFecha] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  });

  const [slots, setSlots] = useState([]);
  const [loadingHoras, setLoadingHoras] = useState(false);
  const [horaSel, setHoraSel] = useState("");

  const [confirming, setConfirming] = useState(false);

  // Paso 1: cargar servicios
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoadingServicios(true);
        const data = await fetchServicios();
        if (alive) setServicios(data);
      } catch {
        if (alive) setError("No pudimos cargar los servicios.");
      } finally {
        if (alive) setLoadingServicios(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Paso 2: cargar slots disponibles
  useEffect(() => {
    if (!servicioSel || !config?.horarioAtencion) return;
  
    let alive = true;
    (async () => {
      try {
        setLoadingHoras(true);
        const fechaISO = fecha.toISOString().slice(0, 10);
  
        // Slots reales de ese día con ocupación
        const slotsDia = await fetchSlotsDelDia(fechaISO);
  
        console.log(slotsDia)
        // Slots posibles según config y duración
        const todos = generarSlots(
          fecha,
          servicioSel.duracionMinutos,
          config
        );
  
        // Combinar datos
        const mezclados = todos.map(slot => {
          const slotDb = slotsDia.find(
            dbs => dbs.fechaHoraInicio.getTime() === slot.fechaHoraInicio.getTime()
          );
  
          if (!slotDb) {
            // No existe en DB: está libre
            return { ...slot, disponible: true };
          }
  
          // Existe: disponible si quedan cupos
          return {
            ...slot,
            disponible: (slotDb.disponibles ?? 0) > 0,
            capacidad: slotDb.capacidad
          };
        });
  
        if (alive) setSlots(mezclados);
      } catch (err) {
        console.error(err);
        if (alive) setError("No pudimos cargar los horarios.");
      } finally {
        if (alive) setLoadingHoras(false);
      }
    })();
  
    return () => { alive = false; };
  }, [servicioSel, fecha, config]);
  
  

  // Paso 3: confirmar turno
  const handleConfirm = async () => {
    if (!user?.id) {
      setError("Tenés que iniciar sesión para reservar.");
      return;
    }
    if (!servicioSel || !horaSel) return;

    const slot = slots.find(
      s =>
        s.fechaHoraInicio.toLocaleTimeString("es-AR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        }) === horaSel
    );

    setConfirming(true);
    setError("");
    setSuccessMsg("");

    const res = await crearTurno({ user, servicio: servicioSel, slot });

    setConfirming(false);

    if (!res.ok) {
      setError(res.error || "No pudimos crear el turno.");
      return;
    }

    setSuccessMsg("¡Tu turno fue creado con éxito!");
    setStep(1);
    setServicioSel(null);
    setHoraSel("");
  };

// Helpers locales para el input date (formato YYYY-MM-DD)
const formatDateInput = (d) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};
const todayStr = formatDateInput(new Date());
const fechaStr = formatDateInput(fecha);

return (
  <div className="max-w-5xl mx-auto px-6 py-10">
    {/* Header */}
    <h1 className="text-3xl font-bold mb-2">Sacar turno</h1>
    <p className="text-gray-600 mb-6">
      Elegí un servicio, seleccioná fecha y horario, y confirmá tu reserva.
    </p>

    {/* Stepper */}
    <ol className="mb-6 flex items-center gap-4 text-sm">
      <li className={`flex items-center gap-2 ${step >= 1 ? "text-indigo-700" : "text-gray-400"}`}>
        <span className={`w-6 h-6 rounded-full flex items-center justify-center border ${step >= 1 ? "bg-indigo-600 text-white border-indigo-600" : "bg-white"}`}>1</span>
        Servicio
      </li>
      <li className="text-gray-300">—</li>
      <li className={`flex items-center gap-2 ${step >= 2 ? "text-indigo-700" : "text-gray-400"}`}>
        <span className={`w-6 h-6 rounded-full flex items-center justify-center border ${step >= 2 ? "bg-indigo-600 text-white border-indigo-600" : "bg-white"}`}>2</span>
        Fecha y horario
      </li>
      <li className="text-gray-300">—</li>
      <li className={`flex items-center gap-2 ${step >= 3 ? "text-indigo-700" : "text-gray-400"}`}>
        <span className={`w-6 h-6 rounded-full flex items-center justify-center border ${step >= 3 ? "bg-indigo-600 text-white border-indigo-600" : "bg-white"}`}>3</span>
        Confirmación
      </li>
    </ol>

    {/* Mensajes */}
    {error && (
      <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
        {error}
      </div>
    )}
    {successMsg && (
      <div className="mb-4 rounded border border-green-200 bg-green-50 px-4 py-3 text-green-700">
        {successMsg}
      </div>
    )}

    {/* Paso 1: elegir servicio */}
    {step === 1 && (
      <section>
        <h2 className="text-2xl font-semibold mb-4">1. Elegí un servicio</h2>

        {loadingServicios ? (
          <p className="text-gray-500">Cargando servicios...</p>
        ) : servicios.length === 0 ? (
          <p className="text-gray-500">No hay servicios disponibles.</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {servicios.map((serv) => (
              <li
                key={serv.id}
                className="border rounded p-4 shadow hover:shadow-lg transition flex flex-col"
              >
                <h3 className="text-lg font-bold mb-1">{serv.nombre}</h3>
                <p className="text-sm text-gray-600">Duración: {serv.duracionMinutos} min</p>
                {typeof serv.precio === "number" && (
                  <p className="text-sm text-gray-600 mt-1">Precio: ${serv.precio}</p>
                )}
                <button
                  className="mt-4 bg-indigo-600 text-white px-3 py-2 rounded hover:bg-indigo-700"
                  onClick={() => {
                    setServicioSel(serv);
                    setHoraSel("");
                    setStep(2);
                  }}
                >
                  Elegir
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    )}

    {/* Paso 2: fecha y horario */}
    {step === 2 && servicioSel && (
      <section className="rounded border p-4 bg-white mt-6">
        <div className="flex items-center justify-between mb-4">
          <button
            className="text-gray-600 hover:text-gray-800 underline"
            onClick={() => {
              setServicioSel(null);
              setHoraSel("");
              setStep(1);
            }}
          >
            ← Cambiar servicio
          </button>
          <div className="text-sm text-gray-600">
            {servicioSel.nombre} — {servicioSel.duracionMinutos} min
          </div>
        </div>

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fecha
        </label>
        <input
          type="date"
          className="border rounded px-3 py-2 mb-4"
          value={fechaStr}
          min={todayStr}
          onChange={(e) => {
            const [y, m, d] = e.target.value.split("-").map(Number);
            setFecha(new Date(y, m - 1, d));
            setHoraSel("");
          }}
        />

        {loadingHoras ? (
          <p className="text-gray-500">Cargando horarios...</p>
        ) : slots.length === 0 ? (
          <p className="text-gray-500">No hay horarios disponibles para esta fecha.</p>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-2">Elegí un horario:</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {slots.map((s) => {
                const label = s.fechaHoraInicio.toLocaleTimeString("es-AR", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                });
                const selected = horaSel === label;
                return (
                  <button
                    key={s.id + label}
                    type="button"
                    disabled={!s.disponible}
                    className={`px-3 py-2 rounded border text-sm
                      ${
                        !s.disponible
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : selected
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white hover:bg-indigo-50"
                      }
                    `}
                    aria-pressed={selected}
                    onClick={() => setHoraSel(label)}
                    title={s.disponible ? "Disponible" : "Completo"}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                className={`px-4 py-2 rounded ${
                  !horaSel
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
                disabled={!horaSel}
                onClick={() => setStep(3)}
              >
                Continuar
              </button>
              <span className="text-sm text-gray-500">
                Capacidad por horario: {config?.turnosSimultaneos ?? 1}
              </span>
            </div>
          </>
        )}
      </section>
    )}

    {/* Paso 3: confirmación */}
    {step === 3 && servicioSel && horaSel && (
      <section className="rounded border p-4 bg-white mt-6">
        <button
          className="text-gray-600 hover:text-gray-800 underline mb-4"
          onClick={() => setStep(2)}
        >
          ← Cambiar fecha u horario
        </button>

        <h2 className="text-xl font-semibold mb-3">Revisá y confirmá</h2>
        <ul className="text-gray-700 mb-6 space-y-1">
          <li>
            <span className="font-medium">Servicio:</span> {servicioSel.nombre}
          </li>
          <li>
            <span className="font-medium">Duración:</span> {servicioSel.duracionMinutos} min
          </li>
          <li>
            <span className="font-medium">Fecha:</span>{" "}
            {fecha.toLocaleDateString("es-AR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </li>
          <li>
            <span className="font-medium">Horario:</span> {horaSel} hs
          </li>
          {typeof servicioSel.precio === "number" && (
            <li>
              <span className="font-medium">Precio:</span> ${servicioSel.precio}
            </li>
          )}
        </ul>

        <div className="flex items-center gap-3">
          <button
            disabled={confirming}
            className={`px-4 py-2 rounded ${
              confirming
                ? "bg-gray-300 text-gray-600 cursor-wait"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
            onClick={handleConfirm}
          >
            {confirming ? "Confirmando..." : "Confirmar turno"}
          </button>
          <button
            className="px-4 py-2 rounded border hover:bg-gray-50"
            onClick={() => setStep(2)}
          >
            Volver
          </button>
        </div>
      </section>
    )}
  </div>
);
}
