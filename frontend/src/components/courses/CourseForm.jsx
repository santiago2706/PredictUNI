import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X } from 'lucide-react';
import InputField from '../ui/InputField';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { DAY_OPTIONS, SESSION_TYPES, emptySession, getDefaultTerm } from '../../utils/schedule';
import { authFetch, clearSession, SESSION_EXPIRED_MESSAGE } from '../../utils/api';

const DIFFICULTY_OPTIONS = [
  { value: '1', label: 'Baja' },
  { value: '2', label: 'Media' },
  { value: '3', label: 'Alta' },
];

const TYPE_OPTIONS = SESSION_TYPES.map((t) => ({ value: t, label: t }));

const INITIAL_STATE = { name: '', code: '', credits: '', difficulty: '' };

const CourseForm = ({ onCourseCreated }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const [hasSchedule, setHasSchedule] = useState(false);
  const [term, setTerm] = useState(getDefaultTerm());
  const [sessions, setSessions] = useState([emptySession()]);

  const handleChange = (e) => {
    const { id, value } = e.target;

  // Créditos: 1 dígito del 1 al 9, con hasta 1 decimal opcional (ej. 4, 4.5)
    if (id === 'credits' && value !== '' && !/^[1-9]?(\.\d?)?$/.test(value)) return;

    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: undefined }));
  };
  const handleCreditsBlur = () => {
    const val = formData.credits;
    if (!val) return;
    if (!val.includes('.')) {
      setFormData((prev) => ({ ...prev, credits: `${val}.0` }));
    } else if (val.endsWith('.')) {
      setFormData((prev) => ({ ...prev, credits: `${val}0` }));
    }
  };

  const toggleSchedule = () => {
    setHasSchedule((prev) => !prev);
    setErrors((prev) => ({ ...prev, term_start: undefined, term_end: undefined }));
  };

  const updateTerm = (field, value) => {
    setTerm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const updateSession = (index, field, value) => {
    setSessions((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
    setErrors((prev) => ({ ...prev, [`session_${index}`]: undefined }));
  };

  const addSession = () => setSessions((prev) => [...prev, emptySession()]);
  const removeSession = (index) => setSessions((prev) => prev.filter((_, i) => i !== index));

  const validate = () => {
    const next = {};
    if (!formData.name.trim()) next.name = 'Ingresa el nombre del curso';
    if (!formData.code.trim()) next.code = 'Ingresa el código del curso';
    if (!formData.credits) next.credits = 'Ingresa los créditos';
    if (!formData.difficulty) next.difficulty = 'Selecciona la dificultad';

    if (hasSchedule) {
      if (!term.term_start) next.term_start = 'Ingresa el inicio de ciclo';
      if (!term.term_end) next.term_end = 'Ingresa el fin de ciclo';
      if (term.term_start && term.term_end && term.term_end < term.term_start) {
        next.term_end = 'Debe ser posterior al inicio de ciclo';
      }
      sessions.forEach((s, i) => {
        if (!s.start_time || !s.end_time) {
          next[`session_${i}`] = 'Completa la hora de inicio y fin';
        } else if (s.end_time <= s.start_time) {
          next[`session_${i}`] = 'La hora de fin debe ser posterior a la de inicio';
        }
      });
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || isLoading) return;

    setIsLoading(true);
    setServerError('');

    const payload = {
      name: formData.name.trim(),
      code: formData.code.trim(),
      credits: Number(formData.credits),
      difficulty_weight: Number(formData.difficulty),
    };

    if (hasSchedule) {
      payload.schedule = {
        term_start: term.term_start,
        term_end: term.term_end,
        sessions: sessions.map((s) => ({
          day_of_week: Number(s.day_of_week),
          start_time: s.start_time,
          end_time: s.end_time,
          type: s.type || 'Teoría',
        })),
      };
    }

    try {
      const response = await authFetch('/courses/', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (response.status === 401) {
        clearSession();
        navigate('/login', { replace: true, state: { message: SESSION_EXPIRED_MESSAGE } });
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'No se pudo registrar el curso. Inténtalo nuevamente.');
      }

      onCourseCreated?.(data);
      setFormData(INITIAL_STATE);
      setHasSchedule(false);
      setTerm(getDefaultTerm());
      setSessions([emptySession()]);
    } catch (error) {
      setServerError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      <InputField
        label="Nombre del curso"
        id="name"
        type="text"
        placeholder="Cálculo I"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InputField
          label="Código"
          id="code"
          type="text"
          placeholder="MA-101"
          value={formData.code}
          onChange={handleChange}
          onBlur={handleCreditsBlur}
          error={errors.code}
        />

        <InputField
          label="Créditos"
          id="credits"
          type="text"
          inputMode="numeric"
          placeholder="4"
          value={formData.credits}
          onChange={handleChange}
          error={errors.credits}
        />
      </div>

      <Select
        label="Dificultad"
        id="difficulty"
        placeholder="Selecciona la dificultad"
        options={DIFFICULTY_OPTIONS}
        value={formData.difficulty}
        onChange={handleChange}
        error={errors.difficulty}
      />

      <div className="rounded-lg border border-gray-800 p-4">
        <label className="flex items-center justify-between gap-3 cursor-pointer select-none">
          <span className="text-sm font-medium text-gray-200">Agregar horario de clases (opcional)</span>
          <span
            role="switch"
            aria-checked={hasSchedule}
            tabIndex={0}
            onClick={toggleSchedule}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), toggleSchedule())}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
              hasSchedule ? 'bg-[#7B3FE4]' : 'bg-gray-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                hasSchedule ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </span>
        </label>

        {hasSchedule && (
          <div className="mt-4 space-y-4">
            <p className="text-xs text-gray-500">
              Por defecto se usan las fechas del ciclo universitario vigente. Cámbialas si es un curso corto o fuera de ciclo.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InputField
                label="Inicio de ciclo"
                id="term_start"
                type="date"
                value={term.term_start}
                onChange={(e) => updateTerm('term_start', e.target.value)}
                error={errors.term_start}
              />
              <InputField
                label="Fin de ciclo"
                id="term_end"
                type="date"
                value={term.term_end}
                onChange={(e) => updateTerm('term_end', e.target.value)}
                error={errors.term_end}
              />
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-200">Sesiones semanales</p>

              {sessions.map((session, i) => (
                <div key={i} className="rounded-lg border border-gray-800 bg-[#1A1025] p-3 space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-start">
                    <Select
                      label="Día"
                      id={`session_day_${i}`}
                      options={DAY_OPTIONS}
                      value={String(session.day_of_week)}
                      onChange={(e) => updateSession(i, 'day_of_week', e.target.value)}
                    />
                    <InputField
                      label="Inicio"
                      id={`session_start_${i}`}
                      type="time"
                      value={session.start_time}
                      onChange={(e) => updateSession(i, 'start_time', e.target.value)}
                    />
                    <InputField
                      label="Fin"
                      id={`session_end_${i}`}
                      type="time"
                      value={session.end_time}
                      onChange={(e) => updateSession(i, 'end_time', e.target.value)}
                    />
                    <Select
                      label="Tipo"
                      id={`session_type_${i}`}
                      options={TYPE_OPTIONS}
                      value={session.type}
                      onChange={(e) => updateSession(i, 'type', e.target.value)}
                    />
                  </div>

                  {errors[`session_${i}`] && (
                    <p className="text-xs text-red-400 font-medium">{errors[`session_${i}`]}</p>
                  )}

                  <button
                    type="button"
                    onClick={() => removeSession(i)}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <X size={12} /> Quitar sesión
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addSession}
                className="flex items-center gap-1.5 text-xs font-medium text-[#9b66f2] hover:text-white transition-colors"
              >
                <Plus size={14} /> Agregar sesión
              </button>
            </div>
          </div>
        )}
      </div>

      {serverError && (
        <p className="text-red-400 text-sm text-center font-medium">{serverError}</p>
      )}

      <Button type="submit" isLoading={isLoading}>
        Agregar curso
      </Button>
    </form>
  );
};

export default CourseForm;
