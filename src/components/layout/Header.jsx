import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import LogoutButton from "../LogoutButton";
import { useAuthStore } from "../../store/useAuthStore";

export default function Header() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const info = useAuthStore((state) => state.info);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <header className="bg-indigo-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Mi App</h1>

      <nav className="flex gap-4 items-center">
        <Link to="/" className="hover:underline">Inicio</Link>

        {user && info ? (
          <>
            {info.rolId === "admin" && (
              <>
                <Link to="/admin/servicios" className="hover:underline">Servicios</Link>
                <Link to="/admin/turnos" className="hover:underline">Turnos</Link>
                <Link to="/admin/horarios" className="hover:underline">Configuración</Link>
              </>
            )}

            {info.rolId === "user" && (
              <Link to="/dashboard" className="hover:underline">Mis turnos</Link>
            )}

            {/* Menú desplegable del usuario */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="hover:underline font-semibold"
              >
                Hola, {info.nombre} 
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-lg z-10 w-40">
                  <Link
                    to="/perfil"
                    className="block px-4 py-2 hover:bg-indigo-100"
                    onClick={() => setMenuOpen(false)}
                  >
                    Modificar datos
                  </Link>
                  <div className="px-4 py-2 border-t">
                    <LogoutButton />
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <Link to="/login" className="hover:underline">Iniciar sesión</Link>
        )}
      </nav>
    </header>
  );
}
