export function ExcepcionesForm({ nuevaExcepcion, setNuevaExcepcion, onAdd }) {
    return (
      <div className="flex gap-2 items-center mb-2">
        <input
          type="date"
          value={nuevaExcepcion.fecha}
          onChange={(e) => setNuevaExcepcion({ ...nuevaExcepcion, fecha: e.target.value })}
        />
        <select
          value={nuevaExcepcion.tipo}
          onChange={(e) => setNuevaExcepcion({ ...nuevaExcepcion, tipo: e.target.value })}
        >
          <option value="cerrado">Cerrado</option>
          <option value="abierto">Abierto especial</option>
        </select>
        {nuevaExcepcion.tipo === "abierto" && (
          <>
            <input
              type="time"
              value={nuevaExcepcion.inicio}
              onChange={(e) => setNuevaExcepcion({ ...nuevaExcepcion, inicio: e.target.value })}
            />
            <input
              type="time"
              value={nuevaExcepcion.fin}
              onChange={(e) => setNuevaExcepcion({ ...nuevaExcepcion, fin: e.target.value })}
            />
          </>
        )}
        <button
          onClick={onAdd}
          className="bg-green-500 text-white px-2 py-1 rounded"
        >
          Agregar
        </button>
      </div>
    );
  }
  