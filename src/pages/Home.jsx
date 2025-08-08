import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <div className="text-center mt-10">
        <h2 className="text-3xl font-bold mb-4">Bienvenido a Mi App</h2>
        <p className="text-gray-700 mb-6">
          Esta es una plataforma donde podés registrarte, iniciar sesión y acceder a tu dashboard personalizado.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/login" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
            Iniciar sesión
          </Link>
          <Link to="/register" className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
            Registrarse
          </Link>
        </div>
      </div>
    </>
  );
}
