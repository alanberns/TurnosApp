// src/Login.jsx
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { fetchUserRole } from "../utils/fetchUserRole";
import { fetchUserTurnos } from "../utils/fetchUserTurnos";
import { fetchUserInfo } from "../utils/fetchUserInfo";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const role = await fetchUserRole(userCredential.user.uid);
      const info = await fetchUserInfo(userCredential.user.uid);
      const turnos = await fetchUserTurnos(userCredential.user.uid);
      setUser(userCredential.user, role, info, turnos);
      navigate("/dashboard");
    } catch (err) {
      setError("Credenciales inválidas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div> 
    <form onSubmit={handleLogin} className="max-w-sm mx-auto mt-10 flex flex-col gap-4">
      {error && <p className="text-red-500">{error}</p>}
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="border p-2 rounded" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" className="border p-2 rounded" />
      <button type="submit" className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
        Iniciar sesión
      </button>
    </form>
    <button onClick={() => navigate('/register')} className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
    Registrate
  </button>   
  </div> 

  );
}
 

