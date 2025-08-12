import React, { useState, useEffect } from "react";
import {
  getServicios,
  addServicio,
  updateServicio,
  deleteServicio
} from "../../db/service/dbServicios";

export default function AdminServicios() {
  const [servicios, setServicios] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    duracionMinutos: 30,
    precio: 0,
    activo: true
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    cargarServicios();
  }, []);

  async function cargarServicios() {
    setServicios(await getServicios());
  }

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const guardarServicio = async e => {
    e.preventDefault();
    if (!form.nombre) return;

    if (editId) {
      await updateServicio(editId, form);
      setEditId(null);
    } else {
      await addServicio(form);
    }

    setForm({ nombre: "", duracionMinutos: 30, precio: 0, activo: true });
    cargarServicios();
  };

  const editarServicio = s => {
    setForm(s);
    setEditId(s.id);
  };

  const eliminarServicio = async id => {
    if (!window.confirm("¿Eliminar este servicio?")) return;
    await deleteServicio(id);
    setServicios(servicios.filter(s => s.id !== id));
  };

  return (
    <div>
      <h2>Administración de Servicios</h2>

      <form onSubmit={guardarServicio} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="duracionMinutos"
          placeholder="Duración (min)"
          value={form.duracionMinutos}
          onChange={handleChange}
          min="1"
          required
        />
        <input
          type="number"
          name="precio"
          placeholder="Precio"
          value={form.precio}
          onChange={handleChange}
          min="0"
          required
        />
        <label>
          Activo
          <input
            type="checkbox"
            name="activo"
            checked={form.activo}
            onChange={handleChange}
          />
        </label>
        <button type="submit">{editId ? 'Actualizar' : 'Agregar'}</button>
      </form>

      <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Duración</th>
            <th>Precio</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {servicios.map(s => (
            <tr key={s.id}>
              <td>{s.nombre}</td>
              <td>{s.duracionMinutos} min</td>
              <td>${s.precio}</td>
              <td>{s.activo ? '✅' : '❌'}</td>
              <td>
                <button onClick={() => editarServicio(s)}>Editar</button>
                <button onClick={() => eliminarServicio(s.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
          {servicios.length === 0 && (
            <tr>
              <td colSpan="5">No hay servicios</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
