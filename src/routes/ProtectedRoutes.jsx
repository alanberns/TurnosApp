// src/routes/ProtectedRoutes.jsx
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function ProtectedRoutes({ allowedRoles, children }) {
  const { user, role, isAuthReady } = useAuthStore();

  if (!isAuthReady) return <p className="text-center mt-10">Cargando sesión...</p>;

  if (!user || !allowedRoles.includes(role)) {
    return <Navigate to="/login" />;
  }

  return children;
}
