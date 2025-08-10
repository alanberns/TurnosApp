import React from 'react';
import { format, isToday } from 'date-fns';

/**
 * @param {Object} props
 * @param {Date} props.date
 * @param {Turno[]} [props.turnos] - lista de turnos de este día
 * @param {number} [props.capacidad] - capacidad total de la fecha
 * @param {() => void} props.onClick
 */
const CalendarDay = ({ date, turnos = [], capacidad = 0, onClick }) => {
  const formattedDate = format(date, 'd');
  const pendientes = turnos.filter(t => t.estado === 'pendiente').length;
  const confirmados = turnos.filter(t => t.estado === 'confirmado').length;

  const isFull = capacidad > 0 && confirmados >= capacidad;

  return (
    <div
      className={`calendar-day ${isToday(date) ? 'hoy' : ''}`}
      onClick={onClick}
      style={{
        border: '1px solid #ccc',
        padding: '8px',
        cursor: 'pointer',
        backgroundColor:
          pendientes > 0
            ? '#fff3cd'   // amarillo: hay pendientes
            : isFull
            ? '#f8d7da'   // rojo claro: día lleno
            : '#f8f9fa',  // gris claro: huecos libres
        minHeight: '70px'
      }}
    >
      <div><strong>{formattedDate}</strong></div>
      {capacidad > 0 && (
        <div style={{ fontSize: '0.8em' }}>
          ✅ {confirmados} / {capacidad}
          {pendientes > 0 && <> • 🕓 {pendientes}</>}
        </div>
      )}
    </div>
  );
};

export default CalendarDay;
