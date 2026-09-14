import React from 'react';
import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

const RISK_CONFIG = {
  BAJO: {
    label: 'Carga Baja',
    color: 'text-green-400',
    border: 'border-green-500/30',
    bg: 'bg-green-500/10',
    icon: CheckCircle,
    bar: 'bg-green-500',
  },
  MEDIO: {
    label: 'Carga Media',
    color: 'text-yellow-400',
    border: 'border-yellow-500/30',
    bg: 'bg-yellow-500/10',
    icon: AlertCircle,
    bar: 'bg-yellow-500',
  },
  ALTO: {
    label: '¡Sobrecarga Detectada!',
    color: 'text-red-400',
    border: 'border-red-500/30',
    bg: 'bg-red-500/10',
    icon: AlertTriangle,
    bar: 'bg-red-500',
  },
};

const RiskCard = ({ porcentaje, riesgo, recomendaciones = [], mapa_diario = {} }) => {
  const config = RISK_CONFIG[riesgo] ?? RISK_CONFIG.BAJO;
  const Icon = config.icon;

  return (
    <div className={cn('rounded-xl border p-6 space-y-5', config.border, config.bg)}>
      <div className="flex items-center gap-3">
        <Icon size={22} className={config.color} />
        <h2 className={cn('text-lg font-bold', config.color)}>{config.label}</h2>
      </div>

      <div className="text-center py-4">
        <p className={cn('text-7xl font-extrabold tracking-tight', config.color)}>
          {porcentaje}%
        </p>
        <p className="text-gray-400 text-sm mt-2">de tu disponibilidad semanal comprometida</p>
      </div>

      <div className="w-full bg-gray-700/50 rounded-full h-3">
        <div
          className={cn('h-3 rounded-full transition-all duration-700', config.bar)}
          style={{ width: `${Math.min(porcentaje, 100)}%` }}
        />
      </div>

      {Object.keys(mapa_diario).length > 0 && (
        <div>
          <p className="text-xs text-gray-400 mb-3 font-medium uppercase tracking-wider">
            Distribución semanal
          </p>
          <div className="grid grid-cols-7 gap-1">
            {Object.entries(mapa_diario).map(([dia, datos]) => {
              const pct = datos.horas_disponibles > 0
                ? (datos.horas_asignadas / datos.horas_disponibles) * 100
                : 0;
              const diaCorto = dia.slice(0, 3);
              const dayColor = pct > 85 ? 'bg-red-500' : pct > 60 ? 'bg-yellow-500' : 'bg-green-500';
              return (
                <div key={dia} className="flex flex-col items-center gap-1">
                  <span className="text-[10px] text-gray-500">{diaCorto}</span>
                  <div className="w-full bg-gray-700/50 rounded h-2">
                    <div
                      className={cn('h-2 rounded transition-all duration-500', dayColor)}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-500">{datos.horas_asignadas}h</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {recomendaciones.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
            Recomendaciones
          </p>
          {recomendaciones.map((rec, i) => (
            <div
              key={i}
              className="flex items-start gap-2 text-sm text-gray-300 bg-black/20 rounded-lg px-3 py-2"
            >
              <span className={cn('mt-0.5 shrink-0', config.color)}>›</span>
              <span>{rec}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RiskCard;
