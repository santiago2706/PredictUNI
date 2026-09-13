import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CalendarDays, TrendingUp, ArrowRight } from 'lucide-react';

const API_BASE = 'http://localhost:8000';

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];
const DIAS_HEADER = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const DIAS_NOMBRE = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const RIESGO = {
  alto: { label: 'Sobrecarga', text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', dot: 'bg-red-400' },
  medio: { label: 'Media', text: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', dot: 'bg-yellow-400' },
  bajo: { label: 'Baja', text: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30', dot: 'bg-green-400' },
};

const nivelRiesgo = (pct) => (pct > 85 ? 'alto' : pct > 60 ? 'medio' : 'bajo');
const nombreDia = (date) => DIAS_NOMBRE[(date.getDay() + 6) % 7];
const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const CalendarioPage = () => {
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(`${API_BASE}/analysis`, {
          headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
        });
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
        setAnalysis(await res.json());
      } catch (err) {
        console.error('Error al cargar el análisis:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, []);

  const today = useMemo(() => new Date(), []);
  const esMesActual = viewDate.getMonth() === today.getMonth() && viewDate.getFullYear() === today.getFullYear();

  const { inicioSemana, finSemana } = useMemo(() => {
    const offset = (today.getDay() + 6) % 7;
    const inicio = new Date(today);
    inicio.setDate(today.getDate() - offset);
    inicio.setHours(0, 0, 0, 0);
    const fin = new Date(inicio);
    fin.setDate(inicio.getDate() + 6);
    fin.setHours(23, 59, 59, 999);
    return { inicioSemana: inicio, finSemana: fin };
  }, [today]);

  // Selecciona "hoy" por defecto en cuanto llegan los datos
  useEffect(() => {
    if (analysis && !selectedDate) setSelectedDate(today);
  }, [analysis, today, selectedDate]);

  const celdas = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const primerDiaMes = new Date(year, month, 1);
    const diasEnMes = new Date(year, month + 1, 0).getDate();
    const offsetInicio = (primerDiaMes.getDay() + 6) % 7;
    const dias = [];
    for (let i = 0; i < offsetInicio; i++) dias.push(null);
    for (let d = 1; d <= diasEnMes; d++) dias.push(new Date(year, month, d));
    while (dias.length % 7 !== 0) dias.push(null);
    return dias;
  }, [viewDate]);

  const cambiarMes = (delta) => setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));

  const datosDia = (fecha) => {
    if (!analysis?.mapa_diario || fecha < inicioSemana || fecha > finSemana) return null;
    const datos = analysis.mapa_diario[nombreDia(fecha)];
    if (!datos) return null;
    const pct = datos.horas_disponibles > 0 ? (datos.horas_asignadas / datos.horas_disponibles) * 100 : 0;
    return { ...datos, pct, nivel: nivelRiesgo(pct) };
  };

  // Resumen de la semana actual (independiente del mes que estés mirando)
  const semana = useMemo(() => {
    if (!analysis?.mapa_diario) return null;
    const dias = DIAS_NOMBRE.map((nombre) => {
      const d = analysis.mapa_diario[nombre];
      if (!d) return null;
      const pct = d.horas_disponibles > 0 ? (d.horas_asignadas / d.horas_disponibles) * 100 : 0;
      return { nombre, pct, nivel: nivelRiesgo(pct), ...d };
    }).filter(Boolean);
    const counts = { bajo: 0, medio: 0, alto: 0 };
    dias.forEach((d) => counts[d.nivel]++);
    const maxPct = dias.length > 0 ? Math.max(...dias.map((d) => d.pct)) : 0;
    const diasMasCargados = dias.filter((d) => d.pct === maxPct);
    return { dias, counts, diasMasCargados, maxPct };
  }, [analysis]);

  const seleccionInfo = selectedDate ? datosDia(selectedDate) : null;
  const recomendacionSeleccion =
    seleccionInfo && analysis?.recomendaciones?.find((r) => r.includes(nombreDia(selectedDate)));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Calendario */}
      <div className="lg:col-span-3 rounded-2xl border border-gray-800 bg-[#150A21] p-6 sm:p-7">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#7B3FE4]/15 flex items-center justify-center shrink-0">
              <CalendarDays size={18} className="text-[#9b66f2]" />
            </div>
            <h2 className="text-white font-bold text-xl leading-tight">
              {MESES[viewDate.getMonth()]} <span className="text-gray-500 font-medium">{viewDate.getFullYear()}</span>
            </h2>
          </div>

          <div className="flex items-center gap-0.5 bg-white/5 rounded-full p-1">
            <button onClick={() => cambiarMes(-1)} className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors" aria-label="Mes anterior">
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setViewDate(new Date())}
              disabled={esMesActual}
              className="px-3 py-1 text-xs font-medium rounded-full transition-colors disabled:opacity-40 disabled:cursor-default text-gray-300 hover:text-white hover:bg-white/10"
            >
              Hoy
            </button>
            <button onClick={() => cambiarMes(1)} className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors" aria-label="Mes siguiente">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {loading && <div className="py-20 text-center text-gray-500 text-sm">Cargando calendario…</div>}
        {error && !loading && (
          <div className="py-20 text-center">
            <p className="text-red-400 text-sm font-medium">No se pudo conectar con el servidor</p>
            <p className="text-gray-500 text-xs mt-1">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-7 mb-1">
              {DIAS_HEADER.map((d, i) => (
                <div key={d} className={`text-center text-[11px] font-semibold uppercase tracking-wider py-2 ${i >= 5 ? 'text-gray-600' : 'text-gray-500'}`}>
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {celdas.map((fecha, i) => {
                if (!fecha) return <div key={`blank-${i}`} className="min-h-[64px] sm:min-h-[76px]" />;

                const info = datosDia(fecha);
                const esHoy = isSameDay(fecha, today);
                const esSeleccionado = selectedDate && isSameDay(fecha, selectedDate);
                const esFinDeSemana = [5, 6].includes((fecha.getDay() + 6) % 7);
                const estilo = info ? RIESGO[info.nivel] : null;

                return (
                  <button
                    key={fecha.toISOString()}
                    onClick={() => info && setSelectedDate(fecha)}
                    disabled={!info}
                    className={`min-h-[64px] sm:min-h-[76px] rounded-xl border flex flex-col items-start justify-between p-2 text-left transition-all
                      ${estilo ? `${estilo.bg} ${estilo.border}` : 'border-transparent'}
                      ${info ? 'cursor-pointer hover:brightness-125' : 'cursor-default'}
                      ${esSeleccionado ? 'ring-2 ring-white/70' : ''}
                      ${esHoy && !estilo ? 'ring-1 ring-[#7B3FE4]/60' : ''}
                    `}
                  >
                    <span className={`text-sm ${esHoy ? 'text-white font-bold' : estilo ? 'text-white font-semibold' : esFinDeSemana ? 'text-gray-500' : 'text-gray-300'}`}>
                      {fecha.getDate()}
                    </span>
                    {estilo && (
                      <span className={`text-[9px] font-semibold ${estilo.text} leading-tight`}>
                        {info.horas_asignadas}h/{info.horas_disponibles}h
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Panel de detalle del día seleccionado */}
            {seleccionInfo && selectedDate && (
              <div className={`mt-6 pt-5 border-t border-gray-800`}>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="text-white font-semibold text-sm">
                      {nombreDia(selectedDate)} {selectedDate.getDate()} de {MESES[selectedDate.getMonth()]}
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {seleccionInfo.horas_asignadas}h ocupadas de {seleccionInfo.horas_disponibles}h disponibles ·{' '}
                      {Math.round(seleccionInfo.pct)}%
                    </p>
                  </div>
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${RIESGO[seleccionInfo.nivel].bg} ${RIESGO[seleccionInfo.nivel].text}`}>
                    {RIESGO[seleccionInfo.nivel].label}
                  </span>
                </div>

                {recomendacionSeleccion ? (
                  <p className="text-xs text-gray-300 bg-black/20 rounded-lg px-3 py-2 mt-3">{recomendacionSeleccion}</p>
                ) : (
                  <p className="text-xs text-gray-500 mt-3">Sin alertas para este día.</p>
                )}

                <button
                  onClick={() => navigate('/actividades')}
                  className="mt-3 flex items-center gap-1.5 text-xs font-medium text-[#9b66f2] hover:text-white transition-colors"
                >
                  Ir a registrar algo este día <ArrowRight size={13} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Panel lateral: resumen de la semana */}
      <div className="lg:col-span-2 space-y-4">
        <div className="rounded-2xl border border-gray-800 bg-[#150A21] p-6">
          <div className="flex flex-wrap gap-2 mb-5">
            {Object.entries(RIESGO).map(([key, r]) => (
              <span key={key} className={`flex items-center gap-1.5 text-[11px] ${r.text} ${r.bg} rounded-full px-2.5 py-1`}>
                <span className={`w-1.5 h-1.5 rounded-full ${r.dot}`} /> {key === 'bajo' ? 'Carga baja' : key === 'medio' ? 'Carga media' : r.label}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={15} className="text-[#9b66f2]" />
            <h3 className="text-white font-semibold text-sm">Resumen de la semana</h3>
          </div>

          {semana ? (
            <>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="rounded-lg bg-green-500/10 p-3 text-center">
                  <p className="text-green-400 text-lg font-bold">{semana.counts.bajo}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">días carga baja</p>
                </div>
                <div className="rounded-lg bg-yellow-500/10 p-3 text-center">
                  <p className="text-yellow-400 text-lg font-bold">{semana.counts.medio}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">días carga media</p>
                </div>
                <div className="rounded-lg bg-red-500/10 p-3 text-center">
                  <p className="text-red-400 text-lg font-bold">{semana.counts.alto}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">en sobrecarga</p>
                </div>
              </div>

              {semana.diasMasCargados?.length > 0 && (
                <div className="rounded-lg border border-gray-800 px-3 py-2.5 text-xs">
                  <span className="text-gray-500">
                    {semana.diasMasCargados.length === 1 ? 'Día más cargado: ' : 'Días más cargados: '}
                  </span>
                  <span className="text-white font-medium">
                    {semana.diasMasCargados.map((d) => d.nombre).join(', ')}
                  </span>
                  <span className={RIESGO[nivelRiesgo(semana.maxPct)].text}> ({Math.round(semana.maxPct)}%)</span>
                </div>
              )}
            </>
          ) : (
            <p className="text-xs text-gray-500">Sin datos todavía.</p>
          )}
        </div>

        {analysis?.recomendaciones?.length > 0 && (
          <div className="rounded-2xl border border-gray-800 bg-[#150A21] p-6">
            <h3 className="text-white font-semibold text-sm mb-4">Recomendaciones</h3>
            <div className="space-y-2">
              {analysis.recomendaciones.map((rec, i) => (
                <p key={i} className="text-xs text-gray-300 bg-black/20 rounded-lg px-3 py-2">
                  {rec}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarioPage;
