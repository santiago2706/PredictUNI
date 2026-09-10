import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import ActivityForm from '../../components/activities/ActivityForm';
import WeeklyAvailabilityForm from '../../components/activities/WeeklyAvailabilityForm';

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
  const [activities, setActivities] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);

  const handleActivityCreated = (activity) => {
    setActivities((prev) =>
      [...prev, activity].sort((a, b) => a.fecha_entrega.localeCompare(b.fecha_entrega))
    );
    setModalOpen(false);
  };

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

        {activities.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-800 py-14 text-center">
            <p className="text-gray-400 text-sm">
              Registra tu primer examen o trabajo para empezar a ver tu carga de la semana.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-gray-800 divide-y divide-gray-800">
            {activities.map((act, i) => (
              <div
                key={`${act.nombre}-${i}`}
                className="flex items-center gap-4 px-5 py-4"
              >
                <span className={`w-2 h-2 rounded-full shrink-0 ${TIPO_DOT_COLOR[act.tipo] ?? 'bg-gray-500'}`} />

                <div className="min-w-0 flex-1">
                  <p className="text-white text-sm font-medium truncate">{act.nombre}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{act.tipo}</p>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-sm text-gray-300">{formatFecha(act.fecha_entrega)}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{act.horas_estimadas}h</p>
                </div>

                <span
                  className={`text-xs font-medium shrink-0 w-12 text-right ${PRIORIDAD_TEXT_COLOR[act.prioridad] ?? 'text-gray-500'}`}
                >
                  {act.prioridad}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Registrar actividad">
        <ActivityForm onActivityCreated={handleActivityCreated} />
      </Modal>
    </div>
  );
};

export default ActividadesPage;
