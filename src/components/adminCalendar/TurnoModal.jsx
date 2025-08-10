import React from 'react';
import { format } from 'date-fns';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // ajusta la ruta según tu proyecto

/**
 * @param {Object} props
 * @param {string|Date} props.date - fecha seleccionada en el calendario
 * @param {Turno[]} props.turnos - lista de turnos para ese día
 * @param {() => void} props.onClose - cerrar el modal
 * @param {() => void} [props.onUpdate] - callback para refrescar datos luego de actualizar
 */
const TurnoModal = ({ date, turnos, onClose, onUpdate }) => {
  const fechaFormateada = format(new Date(date), 'dd/MM/yyyy');

  const handleConfirmar = async (turnoId) => {
    try {
      await updateDoc(doc(db, 'turnos', turnoId), { estado: 'confirmado' });
      onUpdate?.();
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
    <div className="turno-modal">
      <div className="modal-content">
        <button onClick={onClose} style={{ float: 'right' }}>✖</button>
        <h3>Turnos del {fechaFormateada}</h3>
        
        {turnos.length === 0 ? (
          <p>No hay turnos para este día.</p>
        ) : (
          <ul>
            {turnos.map(turno => (
              <li key={turno.id} style={{ marginBottom: '8px' }}>
                {/* Si querés, podés mostrar info del Slot aquí */}
                <strong>{turno.hora || 'Sin hora'}</strong> — {turno.nombre || turno.userId}
                {turno.estado === 'pendiente' && (
                  <span style={{ marginLeft: '10px' }}>
                    <button onClick={() => handleConfirmar(turno.id)}>✅</button>
                    <button onClick={() => handleRechazar(turno.id)}>❌</button>
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TurnoModal;
