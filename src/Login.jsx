// src/Login.jsx
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();


    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("Usuario logueado:", userCredential.user);
          navigate("/dashboard");

        } catch (error) {
            setError("Credenciales inválidas o usuario no registrado.");
        } finally {
            setLoading(false);
        }
    };



  return (
      <form onSubmit={handleLogin} className="flex flex-col gap-4 max-w-sm mx-auto mt-10">
    {error && <p className="text-red-500">{error}</p>}
    {loading && <p className="text-gray-500">Cargando...</p>}

      <input
        type="email"
        placeholder="Email"
        className="border p-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        className="border p-2 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
        Iniciar sesión
      </button>
    </form>
  );
}
