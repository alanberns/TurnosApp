import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./AuthProvider";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminPage from "./pages/AdminPage";
import Home from "./pages/Home";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import Layout from "./components/layout/Layout";


export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/TurnosApp">
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
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
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}
