// src/ResetPassword.jsx
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "./firebase";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Te enviamos un correo para restablecer tu contraseña.");
    } catch (err) {
      setError("Hubo un problema: " + err.message);
    }
  };

  return (
    <form onSubmit={handleReset} className="flex flex-col gap-4 max-w-sm mx-auto mt-10">
      <h2 className="text-xl font-semibold">Recuperar contraseña</h2>
      <input
        type="email"
        placeholder="Tu email"
        className="border p-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit" className="bg-green-500 text-white py-2 rounded hover:bg-green-600">
        Enviar correo de recuperación
      </button>
      {message && <p className="text-green-600">{message}</p>}
      {error && <p className="text-red-600">{error}</p>}
    </form>
  );
}
