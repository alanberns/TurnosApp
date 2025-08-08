// src/pages/SacarTurno.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { fetchDisponibilidad } from "../../utils/fetchDisponibilidad";
import Calendar from "../../components/Calendar"; // lo creamos abajo

export default function SacarTurno() {
  const navigate = useNavigate();
  const info = useAuthStore((state) => state.info);
  const [disponibles, setDisponibles] = useState({});
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);

  useEffect(() => {
    const cargarDisponibilidad = async () => {
      const data = await fetchDisponibilidad(); // llamamos a Firestore
      setDisponibles(data);
    };
    cargarDisponibilidad();
  }, []);

  const handleSeleccion = (fecha) => {
    setFechaSeleccionada(fecha);
    navigate(`/sacar-turno/${fecha}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-indigo-600 mb-4">Sacar turno</h1>
      <p className="text-gray-600 mb-6">Seleccioná una fecha disponible:</p>

      <Calendar
        disponibles={disponibles}
        onSelect={handleSeleccion}
      />
    </div>
  );
}
