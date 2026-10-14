import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from 'recharts';

const DIAS_ORDEN = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const DIA_CORTO = {
  Lunes: 'Lun',
  Martes: 'Mar',
  Miércoles: 'Mié',
  Jueves: 'Jue',
  Viernes: 'Vie',
  Sábado: 'Sáb',
  Domingo: 'Dom',
};

// Mismos umbrales semánticos que usa RiskCard (BAJO/MEDIO/ALTO)
const barColor = (pct) => {
  if (pct > 85) return '#f87171'; // red-400
  if (pct > 60) return '#facc15'; // yellow-400
  return '#4ade80'; // green-400
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const { horas_asignadas, horas_disponibles } = payload[0].payload;
  return (
    <div className="rounded-lg border border-gray-700 bg-[#150A21] px-3 py-2 text-xs shadow-xl">
      <p className="text-white font-medium mb-1">{label}</p>
      <p className="text-gray-400">
        {horas_asignadas}h ocupadas de {horas_disponibles}h disponibles
      </p>
    </div>
  );
};

const WeeklyLoadChart = ({ mapa_diario = {} }) => {
  const data = DIAS_ORDEN.filter((dia) => mapa_diario[dia]).map((dia) => {
    const { horas_disponibles, horas_asignadas } = mapa_diario[dia];
    const pct = horas_disponibles > 0 ? (horas_asignadas / horas_disponibles) * 100 : 0;
    return {
      dia: DIA_CORTO[dia] ?? dia.slice(0, 3),
      horas_asignadas,
      horas_disponibles,
      pct,
    };
  });

  if (data.length === 0) return null;

  return (
    <div className="rounded-xl border border-gray-800 bg-[#150A21] p-6">
      <p className="text-xs text-gray-400 mb-4 font-medium uppercase tracking-wider">
        Ocupación por día · próximos 7 días
      </p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <XAxis
              dataKey="dia"
              axisLine={{ stroke: '#374151' }}
              tickLine={false}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(123,63,228,0.08)' }} />
            <Bar dataKey="horas_asignadas" radius={[6, 6, 0, 0]} maxBarSize={40}>
              {data.map((entry) => (
                <Cell key={entry.dia} fill={barColor(entry.pct)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-4 mt-4 text-[11px] text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#4ade80]" /> Carga baja
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#facc15]" /> Carga media
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#f87171]" /> Sobrecarga
        </span>
      </div>
    </div>
  );
};

export default WeeklyLoadChart;
