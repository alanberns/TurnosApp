import { useState, useEffect } from "react";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { getTurnosPendientesDesdeHoy } from "../../db/adminTurnos";
import { aceptarTurno, rechazarTurno } from "../../db/adminTurnos";

dayjs.locale("es");

export default function ListaTurnosPendientes() {
    const [turnosPendientes, setTurnosPendientes] = useState([]);
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        async function cargarPendientes() {
            setCargando(true);
            const data = await getTurnosPendientesDesdeHoy();
            setTurnosPendientes(data);
            setCargando(false);
        }
        cargarPendientes();
    }, []);

    if (cargando) {
        return <p className="text-gray-500">Cargando turnos pendientes...</p>;
    }

    if (turnosPendientes.length === 0) {
        return <p className="text-gray-500">No hay turnos pendientes desde hoy</p>;
    }

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">
                Turnos pendientes ({turnosPendientes.length})
            </h2>
            <div className="space-y-3">
                {turnosPendientes.map((t) => (
                    <div
                        key={t.id}
                        className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded"
                    >
                        <p className="font-medium">
                            {dayjs(t.inicio.toDate()).format("DD/MM/YYYY HH:mm")} -{" "}
                            {dayjs(t.fin.toDate()).format("HH:mm")}
                        </p>
                        {t.usuario && (
                            <p className="text-sm text-gray-700">
                                {t.usuario.apellido}, {t.usuario.nombre} | {t.usuario.telefono}
                            </p>
                        )}
                        {t.servicio && (
                            <p className="text-sm text-gray-500">
                                {t.servicio.nombre} - ${t.servicio.precio}
                            </p>
                        )}

                        <div className="flex gap-2 mt-3">
                            <button
                                onClick={async () => {
                                    await aceptarTurno(t.id);
                                    setTurnosPendientes(prev => prev.filter(tp => tp.id !== t.id));
                                }}
                                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                Aceptar
                            </button>
                            <button
                                onClick={async () => {
                                    await rechazarTurno(t.id);
                                    setTurnosPendientes(prev => prev.filter(tp => tp.id !== t.id));
                                }}
                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Rechazar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
