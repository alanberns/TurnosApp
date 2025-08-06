// src/routes/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function ProtectedRoutes({ children, allowedRoles }) {
  const user = useAuthStore((state) => state.user);
  const role = useAuthStore((state) => state.role);

  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/" />;

  return children;
}
