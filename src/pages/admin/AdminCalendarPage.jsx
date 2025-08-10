import React, { useState, useEffect } from 'react';
import CalendarHeader from '../../components/adminCalendar/CalendarHeader';
import CalendarGrid from '../../components/adminCalendar/CalendarGrid';
import TurnoModal from '../../components/adminCalendar/TurnoModal';
import TurnosPendientesList from '../../components/adminCalendar/TurnosPendientesList';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { startOfMonth, endOfMonth } from 'date-fns';
import { db } from '../../firebase';

const AdminCalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [slotsConTurnos, setSlotsConTurnos] = useState([]);
  const [turnosPendientes, setTurnosPendientes] = useState([]);

  useEffect(() => {
    const fetchSlotsConTurnos = async () => {
      // Paso 1: traer slots del mes
      const inicioMes = startOfMonth(currentDate);
      const finMes = endOfMonth(currentDate);

      const qSlots = query(
        collection(db, 'slots'),
        where('fechaHoraInicio', '>=', inicioMes),
        where('fechaHoraInicio', '<=', finMes)
      );
      const snapshotSlots = await getDocs(qSlots);
      const slots = snapshotSlots.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        fechaHoraInicio: doc.data().fechaHoraInicio.toDate(),
        fechaHoraFin: doc.data().fechaHoraFin.toDate()
      }));

      // Paso 2: traer turnos asociados
      const slotIds = slots.map(s => s.id);
      let turnos = [];
      if (slotIds.length) {
        const qTurnos = query(
          collection(db, 'turnos'),
          where('slotId', 'in', slotIds)
        );
        const snapshotTurnos = await getDocs(qTurnos);
        turnos = snapshotTurnos.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          fechaCreacion: doc.data().fechaCreacion.toDate()
        }));
      }

      // Paso 3: unir datos
      const slotsWithTurnos = slots.map(slot => ({
        ...slot,
        turnos: turnos.filter(t => t.slotId === slot.id)
      }));

      // Paso 4: guardar en estado
      setSlotsConTurnos(slotsWithTurnos);
      setTurnosPendientes(turnos.filter(t => t.estado === 'pendiente'));
    };

    fetchSlotsConTurnos();
  }, [currentDate]);

  return (
    <div className="admin-calendar-page">
      <CalendarHeader currentDate={currentDate} setCurrentDate={setCurrentDate} />

      <div className="calendar-content">
        <CalendarGrid
          slots={slotsConTurnos}
          onSelectDate={setSelectedDate}
        />
        <TurnosPendientesList
          turnos={turnosPendientes}
          onUpdate={() => {
            // volver a cargar data luego de confirmar/rechazar
            // simplemente modificando currentDate vuelve a disparar el useEffect
            setCurrentDate(d => new Date(d));
          }}
        />
      </div>

      {selectedDate && (
        <TurnoModal
          date={selectedDate}
          turnos={slotsConTurnos
            .filter(s => s.fechaHoraInicio.toDateString() === new Date(selectedDate).toDateString())
            .flatMap(s => s.turnos)}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  );
};

export default AdminCalendarPage;
