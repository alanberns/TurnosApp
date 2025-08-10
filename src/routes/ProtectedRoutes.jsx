// src/routes/ProtectedRoutes.jsx
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function ProtectedRoutes({ allowedRoles, children }) {
  const { user, isAuthReady } = useAuthStore();

  if (!isAuthReady) return <p className="text-center mt-10">Cargando sesión...</p>;

  if (!user || !allowedRoles.includes(user.rolId)) {
    return <Navigate to="/login" />;
  }

  return children;
}
