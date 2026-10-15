import { SESSION_TYPES } from './schedule.js';

export const integer = (value, min = 1, max = Number.MAX_SAFE_INTEGER) => /^\d+$/.test(String(value)) && Number.isSafeInteger(Number(value)) && Number(value) >= min && Number(value) <= max;
export const dateValid = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value) && Number(value.slice(0, 4)) > 0 && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
const timeValid = (value) => /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
export const localDate = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
export function authErrors(data, register = false) {
  const errors = {};
  if (!/^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/u.test(data.email)) errors.email = 'Ingresa un correo válido, sin espacios.';
  if (!data.password) errors.password = 'Ingresa tu contraseña.';
  if (register) {
    if ([...data.name.trim()].length < 3) errors.name = 'El nombre debe tener al menos 3 caracteres.';
    if ([...data.password].length < 8) errors.password = 'Usa al menos 8 caracteres.';
    if (!data.confirmPassword || data.password !== data.confirmPassword) errors.confirmPassword = 'Las contraseñas deben coincidir.';
  }
  return errors;
}
export function courseErrors(data, scheduled, term, sessions) {
  const errors = {};
  if (!data.name.trim()) errors.name = 'Ingresa el nombre del curso.';
  if (data.code && !data.code.trim()) errors.code = 'Deja el código vacío o escribe un código válido.';
  if (!integer(data.credits)) errors.credits = 'Los créditos deben ser un número entero mayor que cero.';
  if (!['1', '2', '3'].includes(data.difficulty)) errors.difficulty = 'Selecciona una dificultad válida.';
  if (scheduled) {
    if (!dateValid(term.term_start)) errors.term_start = 'Ingresa una fecha de inicio válida.';
    if (!dateValid(term.term_end)) errors.term_end = 'Ingresa una fecha final válida.';
    else if (term.term_end <= term.term_start) errors.term_end = 'El fin debe ser posterior al inicio del ciclo.';
    if (!sessions.length) errors.schedule = 'Agrega al menos una sesión o desactiva el horario.';
    sessions.forEach((s, i) => {
      if (!integer(s.day_of_week, 0, 6)) errors[`session_${i}`] = 'Selecciona un día válido.';
      else if (!SESSION_TYPES.includes(s.type)) errors[`session_${i}`] = 'Selecciona un tipo de sesión válido.';
      else if (!timeValid(s.start_time) || !timeValid(s.end_time)) errors[`session_${i}`] = 'Completa horas válidas de inicio y fin.';
      else if (s.end_time <= s.start_time) errors[`session_${i}`] = 'El fin debe ser posterior al inicio de la sesión.';
      else if (dateValid(term.term_start) && dateValid(term.term_end)) {
        const start = new Date(`${term.term_start}T00:00:00Z`);
        start.setUTCDate(start.getUTCDate() + (Number(s.day_of_week) - start.getUTCDay() + 7) % 7);
        if (localDateUTC(start) > term.term_end) errors[`session_${i}`] = 'Este día no ocurre dentro del ciclo indicado.';
      }
    });
  }
  return errors;
}
const localDateUTC = (date) => date.toISOString().slice(0, 10);
export function activityErrors(data, courses, today, maxDate) {
  const errors = {};
  if (!courses.some(c => String(c.id) === data.curso_id)) errors.curso_id = 'Selecciona un curso existente.';
  if (!data.nombre.trim()) errors.nombre = 'Ingresa el nombre de la actividad.';
  if (!['Examen', 'Trabajo', 'Exposición', 'Práctica', 'Otro'].includes(data.tipo)) errors.tipo = 'Selecciona un tipo válido.';
  if (data.tipo === 'Otro' && !data.tipo_otro.trim()) errors.tipo_otro = 'Describe el tipo de actividad.';
  if (!dateValid(data.fecha_entrega)) errors.fecha_entrega = 'Ingresa una fecha válida.';
  else if (data.fecha_entrega < today || data.fecha_entrega > maxDate) errors.fecha_entrega = 'La entrega debe estar entre hoy y un año a partir de hoy.';
  if (!integer(data.horas_estimadas, 1, 100)) errors.horas_estimadas = 'Ingresa un número entero entre 1 y 100 horas.';
  if (!['1', '2', '3'].includes(data.peso_dificultad)) errors.peso_dificultad = 'Selecciona una dificultad válida.';
  if (!['Baja', 'Media', 'Alta'].includes(data.prioridad)) errors.prioridad = 'Selecciona una prioridad válida.';
  return errors;
}
export const availabilityErrors = (hours) => Object.fromEntries(Array.from({ length: 7 }, (_, day) => [day, integer(hours[day], 0, 24) ? '' : 'Ingresa horas enteras entre 0 y 24.']).filter(([, error]) => error));
export function apiError(detail, fallback = 'No se pudo completar la solicitud. Inténtalo nuevamente.') {
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) return detail.map(item => {
    const field = item.loc?.filter(part => part !== 'body').join(' / ');
    return field ? `Revisa el campo ${field}: el servidor no aceptó este valor.` : fallback;
  }).join(' ');
  return fallback;
}

export function simulationError(day, hours) {
  if (!['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].includes(day)) return 'Selecciona un día válido.';
  if (!/^[+-]?\d+$/.test(String(hours)) || !Number.isSafeInteger(Number(hours)) || Math.abs(Number(hours)) > 24) return 'Ingresa horas enteras entre -24 y 24; usa un signo negativo para restar disponibilidad.';
  return '';
}
