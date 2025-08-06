// src/Register.jsx
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { useNavigate } from "react-router-dom";


export default function Register() {
    const [form, setForm] = useState({
        nombre: "",
        apellido: "",
        telefono: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    
    
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const uid = userCredential.user.uid;

      await setDoc(doc(db, "users", uid), {
        nombre: form.nombre,
        apellido: form.apellido,
        telefono: form.telefono,
        email: form.email,
        createdAt: new Date(),
      });

      console.log("Usuario registrado:", uid);
      navigate("/dashboard");
    } catch (err) {
      setError("Error al registrar: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="flex flex-col gap-4 max-w-md mx-auto mt-10">
      <input name="nombre" placeholder="Nombre" className="border p-2 rounded" onChange={handleChange} />
      <input name="apellido" placeholder="Apellido" className="border p-2 rounded" onChange={handleChange} />
      <input name="telefono" placeholder="Teléfono" className="border p-2 rounded" onChange={handleChange} />
      <input name="email" type="email" placeholder="Email" className="border p-2 rounded" onChange={handleChange} />
      <input name="password" type="password" placeholder="Contraseña" className="border p-2 rounded" onChange={handleChange} />
      <button type="submit" className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
        Registrarse
      </button>
      {error && <p className="text-red-500">{error}</p>}
      {loading && <p className="text-gray-500">Registrando...</p>}
    </form>
  );
}
