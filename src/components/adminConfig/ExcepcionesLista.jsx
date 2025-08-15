export function ExcepcionesLista({ excepciones, onDelete }) {
  return (
    <ul>
      {excepciones.map((ex) => (
        <li key={ex.id}>
          {ex.fecha} - {ex.tipo}{" "}
          {ex.tipo === "abierto" &&
            (ex.franjas || []).map((f, idx) => (
              <span key={idx}>
                {f.inicio} a {f.fin}
                {idx < ex.franjas.length - 1 && " | "}
              </span>
            ))
          }
          <button
            onClick={() => onDelete(ex.id)}
            className="ml-2 bg-red-500 text-white px-2 py-1 rounded"
          >
            🗑
          </button>
        </li>
      ))}
    </ul>
  );
}
