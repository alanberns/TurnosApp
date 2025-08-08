import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InfoMessage from "../components/InfoMessage";
import { useAuthStore } from "../store/useAuthStore";


export default function Dashboard() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const info = useAuthStore((state) => state.info); // puedo traer mas

  
  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-indigo-600">Bienvenido al Dashboard</h1>

      {error && <InfoMessage type="error" message={error} />}
      {success && <InfoMessage type="success" message={success} />}


      <div className="space-y-2">
        <p><strong>Nombre:</strong> {info.nombre} {info.apellido}</p>
        <p><strong>Teléfono:</strong> {info.telefono}</p>
        <p><strong>Email:</strong> {info.email}</p>
      </div>

      <hr className="my-6" />

      <h2 className="text-xl font-semibold text-indigo-500">Tus turnos</h2>
      <p className="text-gray-500">(Acá vamos a listar los turnos del usuario)</p>

      <button onClick={() => setSuccess("hola")}>Click</button>

    </div>
  );
}
