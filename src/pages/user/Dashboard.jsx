import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InfoMessage from "../../components/InfoMessage";
import { useAuthStore } from "../../store/useAuthStore";


export default function Dashboard() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const turnos = useAuthStore((state) => state.turnos);

  
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
              <p><strong>Tipo:</strong> {turno.tipo}</p>
              <p><strong>Fecha:</strong> {turno.fecha} {turno.hora}</p>
              <p><strong>Estado:</strong> {turno.estado}</p>
            </li>
          ))}
        </ul>
      )}


      <button onClick={() => setSuccess("hola")}>Click</button>
      <button
        onClick={() => setSuccess("hola")}
        className="mt-6 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Sacar nuevo turno
      </button>


    </div>
  );
}
