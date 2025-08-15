export function ExcepcionesForm({ nuevaExcepcion, setNuevaExcepcion, onAdd }) {
  // Agregar una franja vacía
  const agregarFranja = () => {
    setNuevaExcepcion({
      ...nuevaExcepcion,
      franjas: [...(nuevaExcepcion.franjas || []), { inicio: "", fin: "" }],
    });
  };

  // Eliminar franja por índice
  const eliminarFranja = (index) => {
    const nuevas = nuevaExcepcion.franjas.filter((_, i) => i !== index);
    setNuevaExcepcion({ ...nuevaExcepcion, franjas: nuevas });
  };

  // Modificar un campo de una franja específica
  const cambiarFranja = (index, campo, valor) => {
    const nuevas = nuevaExcepcion.franjas.map((f, i) =>
      i === index ? { ...f, [campo]: valor } : f
    );
    setNuevaExcepcion({ ...nuevaExcepcion, franjas: nuevas });
  };

  return (
    <div className="flex flex-col gap-2 mb-2">
      {/* Fecha y tipo */}
      <div className="flex gap-2 items-center">
        <input
          type="date"
          value={nuevaExcepcion.fecha}
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) =>
            setNuevaExcepcion({ ...nuevaExcepcion, fecha: e.target.value })
          }
        />
        <select
          value={nuevaExcepcion.tipo}
          onChange={(e) =>
            setNuevaExcepcion({
              ...nuevaExcepcion,
              tipo: e.target.value,
              franjas: e.target.value === "abierto" ? nuevaExcepcion.franjas || [] : [],
            })
          }
        >
          <option value="cerrado">Cerrado</option>
          <option value="abierto">Abierto especial</option>
        </select>
        <button
          onClick={onAdd}
          className="bg-green-500 text-white px-2 py-1 rounded"
        >
          Agregar
        </button>
      </div>

      {/* Lista de franjas si es abierto */}
      {nuevaExcepcion.tipo === "abierto" && (
        <div className="flex flex-col gap-2">
          {(nuevaExcepcion.franjas || []).map((franja, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input
                type="time"
                value={franja.inicio}
                onChange={(e) => cambiarFranja(idx, "inicio", e.target.value)}
              />
              <input
                type="time"
                value={franja.fin}
                onChange={(e) => cambiarFranja(idx, "fin", e.target.value)}
              />
              <button
                onClick={() => eliminarFranja(idx)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                X
              </button>
            </div>
          ))}
          <button
            onClick={agregarFranja}
            className="bg-blue-500 text-white px-2 py-1 rounded"
          >
            + Agregar franja
          </button>
        </div>
      )}
    </div>
  );
}
