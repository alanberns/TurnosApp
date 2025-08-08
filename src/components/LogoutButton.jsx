// src/components/LogoutButton.jsx
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const navigate = useNavigate();
  const clearUser = useAuthStore((state) => state.clearUser);

  const logout = async () => {
    try {
      await signOut(auth);
      clearUser();
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
      Cerrar sesión
    </button>
  );
}
