import React, { useState } from 'react';
import Button from '../ui/Button';

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

const WeeklyAvailabilityForm = ({ onSaved }) => {
  const [hours, setHours] = useState(INITIAL_HOURS);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [savedAt, setSavedAt] = useState(null);

const MAX_HORAS_DIA = 24;
const handleChange = (day, value) => {
    if (value !== '' && !/^\d*$/.test(value)) return;
    if (value !== '' && Number(value) > MAX_HORAS_DIA) return;
    setHours((prev) => ({ ...prev, [day]: value }));
    setError('');
    setSavedAt(null);
  };

  const totalHoras = DIAS.reduce((sum, { key }) => sum + (Number(hours[key]) || 0), 0);

  const handleSubmit = (e) => {
    e.preventDefault();

    const allFilled = DIAS.every(({ key }) => hours[key] !== '');
    if (!allFilled) {
      setError('Ingresa las horas libres de los 7 días.');
      return;
    }

    setIsLoading(true);

    // Payload listo para POST /availability (S2-01): arreglo exacto de 7 días,
    // índice 0 = Lunes ... índice 6 = Domingo. Por ahora se simula el envío.
    const payload = DIAS.map(({ key }) => Number(hours[key]));
    console.log('Payload de Disponibilidad listo:', payload);

    setTimeout(() => {
      onSaved?.(payload);
      setSavedAt(new Date());
      setIsLoading(false);
    }, 800);
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
                placeholder="—"
                className="w-full bg-transparent text-center text-2xl font-semibold text-white placeholder-gray-700 border-b-2 border-transparent focus:border-[#7B3FE4] outline-none pb-1 transition-colors"
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
        <Button type="submit" isLoading={isLoading}>
          Guardar disponibilidad
        </Button>
      </div>
    </form>
  );
};

export default WeeklyAvailabilityForm;
