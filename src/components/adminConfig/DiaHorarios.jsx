export function DiaHorarios({ dia, franjas, onAdd, onUpdate, onDelete }) {
    return (
      <div className="mb-2">
        <strong>{dia}</strong>
        {franjas.map((franja, idxFranja) => (
          <div key={idxFranja} className="flex gap-2 items-center">
            <input
              type="time"
              value={franja.inicio}
              onChange={(e) => onUpdate(idxFranja, "inicio", e.target.value)}
            />
            <input
              type="time"
              value={franja.fin}
              onChange={(e) => onUpdate(idxFranja, "fin", e.target.value)}
            />
            <button onClick={() => onDelete(idxFranja)}>🗑</button>
          </div>
        ))}
        <button onClick={onAdd} className="text-blue-500">+ Franja</button>
      </div>
    );
  }
  