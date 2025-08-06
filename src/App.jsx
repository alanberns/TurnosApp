import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase"; 
import AdminPage from "./AdminPage";
import { useAuthStore } from "./store/useAuthStore";
import { fetchUserRole } from "./utils/fetchUserRole";
import ProtectedRoutes from "./routes/ProtectedRoutes";


function App() {
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const role = await fetchUserRole(user.uid);
        setUser(user, role);
      } else {
        clearUser();
      }
    });
    return () => unsubscribe();
  }, []);


  return (
    <BrowserRouter basename="/TurnosApp">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
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
  )
}
export default App