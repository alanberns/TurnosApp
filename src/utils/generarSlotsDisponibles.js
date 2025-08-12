/**
 * @param {Date} fecha
 * @param {number} duracionMinutos
 * @param {Config} config
 * @param {Slot[]} slotsDia
 * @returns {Slot[]}
 */
export function generarSlotsDisponibles(fecha, duracionMinutos, config, slotsDia) {
  if (!config?.horarioAtencion) return [];

  const diaSemana = fecha.getDay();
  const horario = config.horarioAtencion.find(h => h.diaSemana === diaSemana);
  if (!horario) return [];

  const [hInicio, mInicio] = horario.inicio.split(":").map(Number);
  const [hFin, mFin] = horario.fin.split(":").map(Number);

  const inicioMin = hInicio * 60 + mInicio;
  const finMin = hFin * 60 + mFin;
  let idCounter = 1;
  const out = [];

  for (let t = inicioMin; t + duracionMinutos <= finMin; t += duracionMinutos) {
    const hh = String(Math.floor(t / 60)).padStart(2, "0");
    const mm = String(t % 60).padStart(2, "0");

    const fechaInicio = new Date(fecha);
    fechaInicio.setHours(hh, mm, 0, 0);
    const fechaFin = new Date(fechaInicio.getTime() + duracionMinutos * 60000);

    const slotDb = slotsDia.find(
      s => s.fechaHoraInicio.getTime() === fechaInicio.getTime()
    );

    const disponible = slotDb ? slotDb.disponibles > 0 : true;

    out.push({
      id: `slot-${idCounter++}`,
      fechaHoraInicio: fechaInicio,
      fechaHoraFin: fechaFin,
      disponible,
      capacidad: config.turnosSimultaneos
    });
  }
  return out;
}
