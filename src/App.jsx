import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./AuthProvider";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/user/Dashboard";
import SacarTurno from "./pages/user/SacarTurno";
import AdminPage from "./pages/admin/AdminPage";
import AdminConfig from "./pages/admin/AdminCofig";
import AdminCalendarPage from "./pages/admin/AdminCalendarPage";
import Home from "./pages/Home";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import Layout from "./components/layout/Layout";
import AdminServicios from "./pages/admin/AdminServicios";
import Perfil from "./pages/Perfil";


export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/TurnosApp">
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/perfil"
              element={
                <ProtectedRoutes allowedRoles={["user", "admin"]}>
                  <Perfil />
                </ProtectedRoutes>
              }
            />
            <Route path="/dashboard"
              element={
                <ProtectedRoutes allowedRoles={["user", "admin"]}>
                  <Dashboard />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/turnos"
              element={
                <SacarTurno />
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
            <Route
              path="/admin/turnos"
              element={
                <AdminCalendarPage />
              }
            />
            <Route
              path="/admin/horarios"
              element={
                <AdminConfig />
              }
            />
            <Route
              path="/admin/servicios"
              element={
                <AdminServicios />
              }
            />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}
