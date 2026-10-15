import test from 'node:test';
import assert from 'node:assert/strict';
import { integer, dateValid, authErrors, courseErrors, activityErrors, availabilityErrors, simulationError, apiError } from '../src/utils/validation.js';

for (const value of ['', ' ', '-1', '0', '2.5', '4.0', 'abc', 'Infinity', 'NaN', '1e2', '9007199254740992']) {
  test(`Rechaza entero positivo inválido: ${JSON.stringify(value)}`, () => assert.equal(integer(value), false));
}
test('Enteros positivos seguros y disponibilidad cero', () => {
  assert.equal(integer('12'), true);
  assert.equal(integer('0', 0, 24), true);
  assert.equal(integer('24', 0, 24), true);
  assert.equal(integer('25', 0, 24), false);
});
test('Fechas reales y años bisiestos', () => {
  for (const value of ['2026-02-29', '2026-02-30', '2026-13-01', '', '0000-01-01']) assert.equal(dateValid(value), false);
  assert.equal(dateValid('2028-02-29'), true);
});
test('Autenticación: nombres internacionales, correo, contraseña y confirmación', () => {
  const data = { name: '李 明华', email: 'alumno@example.com', password: 'a b!2345', confirmPassword: 'a b!2345' };
  assert.deepEqual(authErrors(data, true), {});
  assert.ok(authErrors({ ...data, name: '  ' }, true).name);
  assert.ok(authErrors({ ...data, email: ' a@example.com' }, true).email);
  assert.ok(authErrors({ ...data, email: 'a@' }, true).email);
  assert.ok(authErrors({ ...data, confirmPassword: 'different' }, true).confirmPassword);
  assert.deepEqual(authErrors({ email: 'a@example.com', password: 'abc' }), {});
});
const course = { name: 'Cálculo 1 + Física', code: '', credits: '4', difficulty: '2' };
const term = { term_start: '2026-10-15', term_end: '2026-12-15' };
const session = { day_of_week: '1', start_time: '08:00', end_time: '10:00', type: 'Teoría' };
test('Curso: código opcional, dificultad, créditos y fechas', () => {
  assert.deepEqual(courseErrors(course, true, term, [session]), {});
  for (const credits of ['-1', '0', '4.5', 'NaN']) assert.ok(courseErrors({ ...course, credits }, false).credits);
  assert.ok(courseErrors({ ...course, difficulty: '99' }, false).difficulty);
  assert.ok(courseErrors(course, true, { ...term, term_end: term.term_start }, [session]).term_end);
  assert.ok(courseErrors(course, true, term, []).schedule);
});
test('Sesiones: días, tipos, horas reales y secuencia', () => {
  for (const change of [{ day_of_week: '7' }, { type: 'inventado' }, { start_time: '25:00' }, { end_time: '08:00' }, { end_time: '07:00' }]) assert.ok(courseErrors(course, true, term, [{ ...session, ...change }]).session_0);
});
const activity = { curso_id: 'course-1', nombre: 'Examen', tipo: 'Examen', tipo_otro: '', fecha_entrega: '2026-10-15', horas_estimadas: '100', peso_dificultad: '1', prioridad: 'Alta' };
const activityCheck = data => activityErrors(data, [{ id: 'course-1' }], '2026-10-15', '2027-10-15');
test('Actividad: curso existente, rangos, horas y enumeraciones', () => {
  assert.deepEqual(activityCheck(activity), {});
  for (const change of [{ curso_id: 'missing' }, { nombre: '  ' }, { tipo: 'Otro' }, { fecha_entrega: '2026-10-14' }, { fecha_entrega: '2027-10-16' }, { horas_estimadas: '0' }, { horas_estimadas: '-2' }, { horas_estimadas: '2.7' }, { horas_estimadas: '101' }, { prioridad: '???' }, { peso_dificultad: '4' }]) assert.ok(Object.keys(activityCheck({ ...activity, ...change })).length);
});
test('Disponibilidad exige los siete días, acepta cero y rechaza valores fuera del contrato', () => {
  const hours = Object.fromEntries(Array.from({ length: 7 }, (_, i) => [i, '0']));
  assert.deepEqual(availabilityErrors(hours), {});
  for (const value of ['-1', '25', '2.5', 'abc', '', 'Infinity']) assert.ok(availabilityErrors({ ...hours, 3: value })[3]);
  delete hours[6]; assert.ok(availabilityErrors(hours)[6]);
});
test('Simulación admite cambios negativos, cero y positivos, con límites diarios', () => {
  for (const value of ['-24', '0', '+2', '24']) assert.equal(simulationError('Lunes', value), '');
  for (const value of ['2.5', 'NaN', '25', '-25', '', ' ']) assert.ok(simulationError('Lunes', value));
  assert.ok(simulationError('invalid', '2'));
});
test('Errores estructurados de API no revelan valores introducidos', () => {
  const message = apiError([{ loc: ['body', 'password'], input: 'SECRET', msg: 'invalid SECRET' }]);
  assert.ok(message.includes('password'));
  assert.equal(message.includes('SECRET'), false);
});
