// Convención de la API para `schedule.sessions[].day_of_week`: 0=Domingo ... 6=Sábado
export const DIAS_SEMANA = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
export const DIA_CORTO = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export const SESSION_TYPES = ['Teoría', 'Laboratorio', 'Práctica'];

export const DAY_OPTIONS = DIAS_SEMANA.map((label, value) => ({ value: String(value), label }));

export const emptySession = () => ({ day_of_week: '1', start_time: '08:00', end_time: '10:00', type: 'Teoría' });

// Aproxima el ciclo universitario vigente (Ciclo I: marzo-julio, Ciclo II: agosto-diciembre)
// como valor por defecto; el usuario siempre puede sobrescribirlo para cursos fuera de ciclo.
export function getDefaultTerm(today = new Date()) {
  const year = today.getFullYear();
  const isSecondCycle = today.getMonth() >= 7; // agosto (7) en adelante
  return isSecondCycle
    ? { term_start: `${year}-08-15`, term_end: `${year}-12-15` }
    : { term_start: `${year}-03-15`, term_end: `${year}-07-15` };
}

export function formatSessionSummary(session) {
  const dia = DIA_CORTO[session.day_of_week] ?? '?';
  return `${dia} ${session.start_time?.slice(0, 5)}–${session.end_time?.slice(0, 5)}`;
}
