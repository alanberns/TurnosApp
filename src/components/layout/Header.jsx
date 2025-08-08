import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import LogoutButton from "../LogoutButton";
import { useAuthStore } from "../../store/useAuthStore";

export default function Header() {
  const [user, setUser] = useState(null);
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
        {user ? (
            <>
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          {info ? <p>Hola, {info.nombre}</p> : <p>Cargando usuario...</p>}
          <LogoutButton />
          </>
        ) : (
          <Link to="/login" className="hover:underline">Iniciar sesión</Link>
        )}
      </nav>
    </header>
  );
}
