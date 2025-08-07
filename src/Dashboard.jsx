// src/Dashboard.jsx
import { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import LogoutButton from "./LogoutButton";

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate("/login");
        return;
      }

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else {
        console.error("No se encontró el documento del usuario.");
      }
    };

    fetchUserData();
  }, [navigate]);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-indigo-600">Bienvenido al Dashboard</h1>

      {userData ? (
        <div className="space-y-2">
          <p><strong>Nombre:</strong> {userData.nombre} {userData.apellido}</p>
          <p><strong>Teléfono:</strong> {userData.telefono}</p>
          <p><strong>Email:</strong> {userData.email}</p>
        </div>
      ) : (
        <p className="text-gray-500">Cargando datos del usuario...</p>
      )}

      <hr className="my-6" />

      <h2 className="text-xl font-semibold text-indigo-500">Tus turnos</h2>
      <p className="text-gray-500">(Acá vamos a listar los turnos del usuario)</p>

      <LogoutButton />

    </div>
  );
}
