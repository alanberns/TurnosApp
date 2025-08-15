import { useState, useEffect } from "react";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { getTurnosPorFechaOptimizado } from "../../db/adminTurnos";
import CalendarioBasico from "../../components/adminCalendar/CalendarioBasico";
import ListaTurnosPendientes from "../../components/adminCalendar/ListarTurnosPendientes";
import { cancelarTurno, aceptarTurno, rechazarTurno } from "../../db/adminTurnos";

dayjs.locale("es");

export default function AdminCalendarPage() {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [turnos, setTurnos] = useState([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    async function cargarTurnos() {
      setCargando(true);
      const data = await getTurnosPorFechaOptimizado(fechaSeleccionada);
      setTurnos(data);
      setCargando(false);
    }
    cargarTurnos();
  }, [fechaSeleccionada]);

  const agrupadosPorEstado = turnos.reduce((acc, turno) => {
    const estado = turno.estado || "sin estado";
    if (!acc[estado]) acc[estado] = [];
    acc[estado].push(turno);
    return acc;
  }, {});

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4">
      {/* Calendario */}
      <div className="md:w-1/3">
        <CalendarioBasico
          fechaSeleccionada={fechaSeleccionada}
          onSelectDate={setFechaSeleccionada}
        />
      </div>

      {/* Lista de turnos */}
      <div className="md:w-2/3">
        <h2 className="text-xl font-bold mb-4">
          Turnos para {dayjs(fechaSeleccionada).format("DD/MM/YYYY")}
        </h2>
        {cargando ? (
          <p className="text-gray-500">Cargando turnos...</p>
        ) : turnos.length === 0 ? (
          <p className="text-gray-500">No hay turnos para esta fecha</p>
        ) : (
          Object.keys(agrupadosPorEstado).map((estado) => (
            <div key={estado} className="mb-6">
              <h3 className="text-lg font-semibold capitalize">
                {estado} ({agrupadosPorEstado[estado].length})
              </h3>
              <div className="space-y-3 mt-2">
                {agrupadosPorEstado[estado].map((t) => (
                  <div
                    key={t.id}
                    className="p-4 bg-white rounded-lg shadow border"
                  >
                    <p className="font-medium">
                      {dayjs(t.inicio.toDate()).format("HH:mm")} -{" "}
                      {dayjs(t.fin.toDate()).format("HH:mm")}
                    </p>
                    {t.usuario && (
                      <p className="text-sm text-gray-700">
                        {t.usuario.apellido}, {t.usuario.nombre} |{" "}
                        {t.usuario.telefono}
                      </p>
                    )}
                    {t.servicio && (
                      <p className="text-sm text-gray-500">
                        {t.servicio.nombre} - ${t.servicio.precio}
                      </p>
                    )}
                    {t.estado === 'confirmado' && (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={async () => {
                            if (window.confirm("¿Seguro que quieres cancelar este turno?")) {
                              await cancelarTurno(t.id);
                              setTurnos(prev => prev.filter(tt => tt.id !== t.id));
                            }
                          }}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Cancelar
                        </button>
                      </div>
                    )}

                    {t.estado === 'pendiente' && (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={async () => {
                            await aceptarTurno(t.id);
                            setTurnos(prev => prev.filter(tt => tt.id !== t.id));
                          }}
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Aceptar
                        </button>
                        <button
                          onClick={async () => {
                            await rechazarTurno(t.id);
                            setTurnos(prev => prev.filter(tt => tt.id !== t.id));
                          }}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Rechazar
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
      <div className="md:w-2/3">
        {/* ...tu lista actual de turnos... */}
        <div className="mt-8">
          <ListaTurnosPendientes />
        </div>
      </div>

    </div>
  );
}
