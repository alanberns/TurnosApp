// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./AuthProvider";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import AdminPage from "./AdminPage";
import ProtectedRoutes from "./routes/ProtectedRoutes";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/TurnosApp">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoutes allowedRoles={["user", "admin"]}>
                <Dashboard />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoutes allowedRoles={["admin"]}>
                <AdminPage />
              </ProtectedRoutes>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
