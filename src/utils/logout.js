// src/utils/logout.js
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuthStore } from "../store/useAuthStore";

export async function logout() {
  const clearUser = useAuthStore.getState().clearUser;

  try {
    await signOut(auth);       // 🔐 Firebase cierra sesión
    clearUser();               // 🧹 Zustand limpia el store y localStorage
    console.log("Sesión cerrada");
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
}

/*
import { logout } from "../utils/logout";

<button
  onClick={logout}
  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
>
  Cerrar sesión
</button>
*/