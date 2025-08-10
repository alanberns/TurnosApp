import React from 'react';
import { format } from 'date-fns';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // ajusta la ruta a tu config

/**
 * @param {Object} props
 * @param {Turno[]} props.turnos
 * @param {() => void} [props.onUpdate]
 */
const TurnosPendientesList = ({ turnos, onUpdate }) => {
  const handleConfirmar = async (turnoId) => {
    try {
      await updateDoc(doc(db, 'turnos', turnoId), { estado: 'confirmado' });
      onUpdate?.(); // refrescar datos
    } catch (err) {
      console.error('Error confirmando turno:', err);
    }
  };

  const handleRechazar = async (turnoId) => {
    try {
      await updateDoc(doc(db, 'turnos', turnoId), { estado: 'cancelado' });
      onUpdate?.();
    } catch (err) {
      console.error('Error cancelando turno:', err);
    }
  };

  return (
    <div className="turnos-pendientes-list">
      <h4>Turnos pendientes</h4>
      {turnos.length === 0 ? (
        <p>No hay turnos pendientes.</p>
      ) : (
        <ul>
          {turnos.map(turno => (
            <li key={turno.id} style={{ marginBottom: '8px' }}>
              {/* OJO: turno.fecha no existe en tu typedef, deberías pasar ya formateado usando slot.fechaHoraInicio */}
              <strong>
                {turno.slotFechaHoraInicio
                  ? format(new Date(turno.slotFechaHoraInicio), 'dd/MM HH:mm')
                  : ''}
              </strong>{' '}
              — {turno.nombre || turno.userId}
              <span style={{ marginLeft: '10px' }}>
                <button onClick={() => handleConfirmar(turno.id)}>✅</button>
                <button onClick={() => handleRechazar(turno.id)}>❌</button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TurnosPendientesList;
