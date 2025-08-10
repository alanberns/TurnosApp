import React from 'react';
import CalendarDay from './CalendarDay'; // ✅ Import correcto
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  format
} from 'date-fns';

/**
 * @param {Object} props
 * @param {Slot[]} props.slots - lista de slots con turnos ya unidos
 * @param {(string) => void} props.onSelectDate
 */
const CalendarGrid = ({ slots = [], onSelectDate }) => {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // lunes
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = [];
  let day = gridStart;

  while (day <= gridEnd) {
    const formattedDate = format(day, 'yyyy-MM-dd');

    // Filtramos los slots que caen en este día
    const slotsDelDia = slots.filter(
      s => format(s.fechaHoraInicio, 'yyyy-MM-dd') === formattedDate
    );

    // Sumamos todos los turnos de esos slots
    const turnosDelDia = slotsDelDia.flatMap(s => s.turnos || []);

    // Capacidad total sumada
    const capacidadTotal = slotsDelDia.reduce((acc, s) => acc + (s.capacidad || 0), 0);

    days.push(
      <CalendarDay
        key={formattedDate}
        date={day}
        turnos={turnosDelDia}
        capacidad={capacidadTotal}
        onClick={() => onSelectDate(formattedDate)}
      />
    );

    day = addDays(day, 1);
  }

  return (
    <div className="calendar-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
      {days}
    </div>
  );
};

export default CalendarGrid;
