import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { fetchServicios } from "../db/fetchServicios";

export default function Home() {
  const user = useAuthStore((state) => state.user);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarServicios = async () => {
      setLoading(true);
      const data = await fetchServicios(); // devuelve array (aunque sea 0 o 1)
      setServicios(data);
      setLoading(false);
    };
    cargarServicios();
  }, []);


  return (
    <>
      <div className="text-center mt-10">
        <h2 className="text-3xl font-bold mb-4">Bienvenido a Mi App</h2>
        <p className="text-gray-700 mb-6">
          Esta es una plataforma donde podés registrarte, iniciar sesión y acceder a tu dashboard personalizado.
        </p>

        {/* Mostrar botones solo si NO hay usuario logueado */}
        {!user && (
          <div className="flex justify-center gap-4">
            <Link
              to="/login"
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Iniciar sesión
            </Link>
            <Link
              to="/register"
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
            >
              Registrarse
            </Link>
          </div>
        )}
      </div>

      {/* 📋 Lista de servicios */}
      <section className="mt-12 px-6">
        <h3 className="text-2xl font-semibold mb-4">Nuestros servicios</h3>

        {servicios.length === 0 ? (
          <p className="text-gray-500">Próximamente podrás ver nuestros servicios disponibles.</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {servicios.map((servicio) => (
              <li
                key={servicio.id}
                className="border rounded p-4 shadow hover:shadow-lg transition"
              >
                <h4 className="text-lg font-bold mb-2">{servicio.nombre}</h4>
                <p className="text-sm text-gray-600">{servicio.descripcion}</p>
                <p className="text-sm font-semibold mt-2">
                  Duración: {servicio.duracionMinutos} min
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
