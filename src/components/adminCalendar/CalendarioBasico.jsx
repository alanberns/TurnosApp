import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function CalendarioBasico({ fechaSeleccionada, onSelectDate }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <Calendar
        value={fechaSeleccionada}
        onChange={onSelectDate}
        locale="es-ES"
      />
    </div>
  );
}
