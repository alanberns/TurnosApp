export function ExcepcionesLista({ excepciones, onDelete }) {
    return (
      <ul>
        {excepciones.map((ex) => (
          <li key={ex.id}>
            {ex.fecha} - {ex.tipo}{" "}
            {ex.tipo === "abierto" && `${ex.inicio} a ${ex.fin}`}{" "}
            <button onClick={() => onDelete(ex.id)}>🗑</button>
          </li>
        ))}
      </ul>
    );
  }
  