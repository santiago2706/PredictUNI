import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { authFetch, clearSession, SESSION_EXPIRED_MESSAGE } from '../../utils/api';

const DIAS = [
  { key: 0, short: 'Lun', label: 'Lunes' },
  { key: 1, short: 'Mar', label: 'Martes' },
  { key: 2, short: 'Mié', label: 'Miércoles' },
  { key: 3, short: 'Jue', label: 'Jueves' },
  { key: 4, short: 'Vie', label: 'Viernes' },
  { key: 5, short: 'Sáb', label: 'Sábado' },
  { key: 6, short: 'Dom', label: 'Domingo' },
];

const INITIAL_HOURS = { 0: '', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '' };
const MAX_HORAS_DIA = 24;

const WeeklyAvailabilityForm = ({ onSaved }) => {
  const navigate = useNavigate();
  const [hours, setHours] = useState(INITIAL_HOURS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [savedAt, setSavedAt] = useState(null);

  const handleSessionExpired = useCallback(() => {
    clearSession();
    navigate('/login', { replace: true, state: { message: SESSION_EXPIRED_MESSAGE } });
  }, [navigate]);

  useEffect(() => {
    const fetchAvailability = async () => {
      setLoading(true);
      try {
        const res = await authFetch('/availability/');

        if (res.status === 401) return handleSessionExpired();
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setHours((prev) => {
            const next = { ...prev };
            data.forEach((day) => {
              next[day.day_of_week] = String(day.available_hours);
            });
            return next;
          });
        }
      } catch (err) {
        console.error('Error al cargar la disponibilidad:', err);
        setError('No se pudo cargar tu disponibilidad guardada.');
      } finally {
        setLoading(false);
      }
    };
    fetchAvailability();
  }, [handleSessionExpired]);

  const handleChange = (day, value) => {
    if (value !== '' && !/^\d*$/.test(value)) return;
    if (value !== '' && Number(value) > MAX_HORAS_DIA) return;
    setHours((prev) => ({ ...prev, [day]: value }));
    setError('');
    setSavedAt(null);
  };

  const totalHoras = DIAS.reduce((sum, { key }) => sum + (Number(hours[key]) || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const allFilled = DIAS.every(({ key }) => hours[key] !== '');
    if (!allFilled) {
      setError('Ingresa las horas libres de los 7 días.');
      return;
    }

    setIsLoading(true);
    setError('');

    const payload = {
      availability: DIAS.map(({ key }) => ({
        day_of_week: key,
        available_hours: Number(hours[key]),
      })),
    };

    try {
      const res = await authFetch('/availability/', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res.status === 401) return handleSessionExpired();

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'No se pudo guardar la disponibilidad.');

      onSaved?.(data);
      setSavedAt(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="rounded-xl border border-gray-800 overflow-hidden">
        <div className="grid grid-cols-7 divide-x divide-gray-800">
          {DIAS.map(({ key, short, label }) => (
            <label key={key} className="flex flex-col items-center gap-2 py-5 px-2 cursor-text">
              <span className="text-[13px] text-gray-500" title={label}>
                {short}
              </span>
              <input
                type="text"
                inputMode="numeric"
                aria-label={`Horas libres el ${label}`}
                value={hours[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder={loading ? '···' : '—'}
                disabled={loading}
                className="w-full bg-transparent text-center text-2xl font-semibold text-white placeholder-gray-700 border-b-2 border-transparent focus:border-[#7B3FE4] outline-none pb-1 transition-colors disabled:opacity-50"
              />
              <span className="text-[11px] text-gray-600">hrs</span>
            </label>
          ))}
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-800 bg-[#1A1025]/50">
          <span className="text-sm text-gray-400">
            {totalHoras > 0 ? (
              <>Total: <span className="text-white font-medium">{totalHoras} horas</span> a la semana</>
            ) : (
              'Aún no ingresas horas'
            )}
          </span>
          {savedAt && !isLoading && (
            <span className="text-xs text-emerald-400">Guardado</span>
          )}
        </div>
      </div>

      {error && <p className="text-xs text-red-400 mt-3 font-medium">{error}</p>}

      <div className="mt-5">
        <Button type="submit" isLoading={isLoading} disabled={loading || isLoading}>
          Guardar disponibilidad
        </Button>
      </div>
    </form>
  );
};

export default WeeklyAvailabilityForm;
