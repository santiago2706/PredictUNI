import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import ActivityForm from '../../components/activities/ActivityForm';
import WeeklyAvailabilityForm from '../../components/activities/WeeklyAvailabilityForm';
import { authFetch, clearSession, SESSION_EXPIRED_MESSAGE } from '../../utils/api';

const TIPO_DOT_COLOR = {
  Examen: 'bg-rose-400',
  Trabajo: 'bg-[#9b66f2]',
  'Exposición': 'bg-amber-400',
  'Práctica': 'bg-sky-400',
  Otro: 'bg-gray-500',
};

const PRIORIDAD_TEXT_COLOR = {
  Alta: 'text-rose-400',
  Media: 'text-amber-400',
  Baja: 'text-gray-500',
};

const formatFecha = (iso) => {
  if (!iso) return '';
  const [, month, day] = iso.split('-');
  const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  return `${Number(day)} ${meses[Number(month) - 1]}`;
};

const ActividadesPage = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const handleSessionExpired = useCallback(() => {
    clearSession();
    navigate('/login', { replace: true, state: { message: SESSION_EXPIRED_MESSAGE } });
  }, [navigate]);

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch('/activities/');

      if (res.status === 401) return handleSessionExpired();
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

      const data = await res.json();
      setActivities(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar las actividades:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [handleSessionExpired]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const handleActivityCreated = (activity) => {
    setActivities((prev) =>
      [...prev, activity].sort((a, b) => a.due_date.localeCompare(b.due_date))
    );
    setModalOpen(false);
  };

  const pendientes = activities.filter((a) => a.status === 'Pendiente');

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-white font-semibold mb-1">Disponibilidad de la semana</h2>
        <p className="text-sm text-gray-500 mb-4">
          ¿Cuántas horas libres tienes cada día para avanzar tus actividades?
        </p>
        <WeeklyAvailabilityForm />
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold">Lo que tienes pendiente</h2>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 text-sm font-medium text-white bg-[#7B3FE4] hover:bg-[#6A32C9] px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={16} />
            Agregar
          </button>
        </div>

        {loading && (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 rounded-xl bg-gray-700/30 animate-pulse" />
            ))}
          </div>
        )}

        {error && !loading && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center">
            <p className="text-red-400 font-medium text-sm">No se pudo conectar con el servidor</p>
            <p className="text-gray-400 text-xs mt-1">{error}</p>
            <button
              onClick={fetchActivities}
              className="mt-4 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm hover:bg-red-500/30 transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && pendientes.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-800 py-14 text-center">
            <p className="text-gray-400 text-sm">
              Registra tu primer examen o trabajo para empezar a ver tu carga de la semana.
            </p>
          </div>
        ) : (
          !loading &&
          !error && (
            <div className="rounded-xl border border-gray-800 divide-y divide-gray-800">
              {pendientes.map((act) => (
                <div key={act.id} className="flex items-center gap-4 px-5 py-4">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${TIPO_DOT_COLOR[act.type] ?? 'bg-gray-500'}`} />

                  <div className="min-w-0 flex-1">
                    <p className="text-white text-sm font-medium truncate">{act.name}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{act.type}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-sm text-gray-300">{formatFecha(act.due_date)}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{act.estimated_hours}h</p>
                  </div>

                  <span
                    className={`text-xs font-medium shrink-0 w-12 text-right ${PRIORIDAD_TEXT_COLOR[act.priority] ?? 'text-gray-500'}`}
                  >
                    {act.priority ?? '—'}
                  </span>
                </div>
              ))}
            </div>
          )
        )}
      </section>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Registrar actividad">
        <ActivityForm onActivityCreated={handleActivityCreated} />
      </Modal>
    </div>
  );
};

export default ActividadesPage;
