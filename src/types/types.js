/**
 * @typedef {Object} Admin
 * @property {string} id - UID del admin (igual al de auth)
 */

/**
 * @typedef {Object} HorarioDia
 * @property {number} diaSemana - 0=Dom, 1=Lun, ... 6=Sáb
 * @property {string} inicio - hora en formato "HH:mm" (ej. "09:00")
 * @property {string} fin - hora en formato "HH:mm" (ej. "18:30")
 */

/**
 * @typedef {Object} Excepcion
 * @property {Date} fecha 
 * @property {string} inicio - hora en formato "HH:mm" (ej. "09:00") Opcional
 * @property {string} fin - hora en formato "HH:mm" (ej. "18:30") Opcional
 * @property {'abierto'|'cerrado'} tipoExcepcion 
 */

/**
 * @typedef {Object} Config
 * @property {number} turnosSimultaneos - cantidad máxima de turnos por slot
 * @property {HorarioDia[]} horarioAtencion - array con el horario por día de la semana
 * @property {number} MinutosVentana - Minutos de la ventana
 * @property {boolean} AutoaceptarTurnos 
 * @property {Excepcion}
 * 
 */

/**
 * @typedef {Object} Servicio
 * @property {string} id
 * @property {string} nombre
 * @property {number} duracionMinutos
 * @property {number} precio
 * @property {boolean} activo
 */

/**
 * @typedef {Object} User
 * @property {string} id - UID del usuario (igual al de auth)
 * @property {string} nombre
 * @property {string} apellido
 * @property {string} email
 * @property {string} telefono
 * @property {string} rolId
 */

/**
 * @typedef {Object} Slot
 * @property {string} id
 * @property {Date} fechaHoraInicio 
 * @property {Date} fechaHoraFin
 * @property {boolean} disponible
 * @property {number} capacidad - lugares disponibles para ese slot
 */

/**
 * @typedef {Object} Turno
 * @property {string} id
 * @property {string} userId
 * @property {string} servicioId
 * @property {string} slotId
 * @property {'pendiente'|'confirmado'|'cancelado'} estado
 * @property {Date} fechaCreacion
 */
