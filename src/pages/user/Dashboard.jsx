import { useState } from "react";
import InfoMessage from "../../components/InfoMessage";
import { useAuthStore } from "../../store/useAuthStore";
import { Link } from "react-router-dom";
import { Timestamp } from "firebase/firestore";
import { cancelarTurno } from "../../db/adminTurnos";

export default function Dashboard() {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const turnos = useAuthStore((state) => state.turnos);
  const setTurnos = useAuthStore((state) => state.setTurnos);

  const handleCancelarTurno = async (id) => {
    try {
      await cancelarTurno(id); 
      setTurnos(
        turnos.map((t) =>
          t.id === id ? { ...t, estado: "cancelado" } : t
        )
      );
      setSuccess("El turno fue cancelado correctamente.");
      setError(null);
    } catch (err) {
      setError("No se pudo cancelar el turno. Intenta de nuevo.");
      setSuccess(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-indigo-600">Bienvenido al Dashboard</h1>

      {error && <InfoMessage type="error" message={error} />}
      {success && <InfoMessage type="success" message={success} />}


      <h2 className="text-xl font-semibold text-indigo-500 mt-6">Tus próximos turnos</h2>

      {turnos.length === 0 ? (
        <p className="text-gray-400 mt-2">No tenés turnos próximos.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {turnos.map((turno) => (
            <li key={turno.id} className="border p-3 rounded shadow-sm">
              <h3>{turno.servicio?.nombre}</h3>
              <p><strong>Precio:</strong> ${turno.servicio?.precio}</p>
              <p>
                <strong>Fecha:</strong>{" "}
                {new Timestamp(
                  turno.inicio.seconds,
                  turno.inicio.nanoseconds
                ).toDate().toLocaleString("es-AR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </p>
              <p><strong>Duración:</strong> {turno.servicio?.duracionMinutos} minutos</p>
              <p><strong>Estado:</strong> {turno.estado}</p>

              {/* Mostrar botón de cancelar si el estado es pendiente o confirmado */}
              {(turno.estado === "pendiente" || turno.estado === "confirmado") && (
                <button
                  onClick={() => handleCancelarTurno(turno.id)}
                  className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Cancelar turno
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      <button onClick={() => setSuccess("hola")}>Click</button>
      <Link
        to={"/turnos"}
        className="mt-6 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Sacar nuevo turno
      </Link>

    </div>
  );
}
