// src/components/Calendar.jsx
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isBefore } from "date-fns";

export default function Calendar({ disponibles, onSelect }) {
  const hoy = new Date();
  const inicioMes = startOfMonth(hoy);
  const finMes = endOfMonth(hoy);
  const dias = eachDayOfInterval({ start: inicioMes, end: finMes });

  return (
    <div className="grid grid-cols-7 gap-2">
      {dias.map((dia) => {
        const fechaStr = format(dia, "yyyy-MM-dd");
        const estaDisponible = disponibles[fechaStr];
        const esPasado = isBefore(dia, hoy);

        const disabled = !estaDisponible || esPasado;

        return (
          <button
            key={fechaStr}
            disabled={disabled}
            onClick={() => onSelect(fechaStr)}
            className={`p-2 rounded border text-sm ${
              disabled
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-indigo-100"
            }`}
          >
            {format(dia, "d")}
          </button>
        );
      })}
    </div>
  );
}
