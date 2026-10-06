import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, FlaskConical, CalendarClock, ArrowRight, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import RiskCard from '../../components/dashboard/RiskCard';
import WeeklyLoadChart from '../../components/dashboard/WeeklyLoadChart';
import Button from '../../components/ui/Button';
import { adaptAnalysisResponse, summarizeMapaDiario, DIAS_ORDEN } from '../../utils/analysis';
import { authFetch, clearSession, SESSION_EXPIRED_MESSAGE } from '../../utils/api';

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-700/50 rounded-lg ${className}`} />
);

const DashboardSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-10 w-48" />
    <Skeleton className="h-64 w-full" />
    <div className="grid grid-cols-3 gap-3">
      <Skeleton className="h-20" />
      <Skeleton className="h-20" />
      <Skeleton className="h-20" />
    </div>
  </div>
);

const DashboardPage = () => {
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [simEnabled, setSimEnabled] = useState(false);
  const [simDay, setSimDay] = useState('Lunes');
  const [simHours, setSimHours] = useState('2');
  const [simLoading, setSimLoading] = useState(false);
  const [simError, setSimError] = useState('');
  const [simulatedAnalysis, setSimulatedAnalysis] = useState(null);

  const handleSessionExpired = useCallback(() => {
    clearSession();
    navigate('/login', { replace: true, state: { message: SESSION_EXPIRED_MESSAGE } });
  }, [navigate]);

  const fetchAnalysis = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch('/analysis/');

      if (res.status === 401) return handleSessionExpired();
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

      setAnalysis(await res.json());
    } catch (err) {
      console.error('Error al cargar el análisis:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [handleSessionExpired]);

  useEffect(() => {
    fetchAnalysis();
  }, [fetchAnalysis]);

  const runSimulation = useCallback(async () => {
    const horas = Number(simHours);
    if (simHours === '' || Number.isNaN(horas)) {
      setSimError('Ingresa un número de horas válido.');
      return;
    }

    setSimLoading(true);
    setSimError('');
    try {
      const res = await authFetch('/analysis/simulate', {
        method: 'POST',
        body: JSON.stringify({ dia_modificar: simDay, horas_extra: horas }),
      });

      if (res.status === 401) return handleSessionExpired();

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'No se pudo simular el escenario.');

      setSimulatedAnalysis(data);
    } catch (err) {
      console.error('Error al simular escenario:', err);
      setSimError(err.message);
      setSimEnabled(false);
    } finally {
      setSimLoading(false);
    }
  }, [simDay, simHours, handleSessionExpired]);

  const handleToggleSim = (enable) => {
    setSimEnabled(enable);
    if (enable) {
      runSimulation();
    } else {
      setSimulatedAnalysis(null);
      setSimError('');
    }
  };

  const realAdapted = adaptAnalysisResponse(analysis);
  const simAdapted = adaptAnalysisResponse(simulatedAnalysis);
  const adapted = simEnabled && simAdapted ? simAdapted : realAdapted;
  const sinDatos = adapted && Object.keys(adapted.mapa_diario).length === 0;
  const resumenSemana = adapted && !sinDatos ? summarizeMapaDiario(adapted.mapa_diario) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">
            Análisis de tu carga académica esta semana
          </p>
        </div>
        <button
          onClick={fetchAnalysis}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#7B3FE4]/20 border border-[#7B3FE4]/30 text-[#9b66f2] text-sm font-medium hover:bg-[#7B3FE4]/30 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          Actualizar
        </button>
      </div>

      {simEnabled && (
        <div className="rounded-xl border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 space-y-2">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-yellow-300 text-sm font-semibold">
              <FlaskConical size={16} className="shrink-0" />
              Modo Simulación activo — estos datos son ficticios, no reflejan tu carga real
            </div>
            <button
              onClick={() => handleToggleSim(false)}
              className="text-xs font-medium text-yellow-200 hover:text-white underline shrink-0"
            >
              Salir
            </button>
          </div>

          {realAdapted && simAdapted && (() => {
            const antes = realAdapted.porcentaje_global;
            const despues = simAdapted.porcentaje_global;
            const delta = despues - antes;
            const DeltaIcon = delta > 0.5 ? TrendingUp : delta < -0.5 ? TrendingDown : Minus;
            const deltaColor = delta > 0.5 ? 'text-red-400' : delta < -0.5 ? 'text-green-400' : 'text-gray-400';
            return (
              <div className="flex items-center gap-2 text-xs text-yellow-100/80 bg-black/20 rounded-lg px-3 py-2 w-fit">
                <span>Carga real: <span className="font-semibold text-white">{antes}%</span></span>
                <ArrowRight size={12} className="text-yellow-100/50" />
                <span>Simulada: <span className="font-semibold text-white">{despues}%</span></span>
                <span className={`flex items-center gap-0.5 font-semibold ${deltaColor}`}>
                  <DeltaIcon size={13} />
                  {delta > 0 ? '+' : ''}{Math.round(delta * 10) / 10}%
                </span>
              </div>
            );
          })()}
        </div>
      )}

      <div className="rounded-xl border border-gray-800 bg-[#150A21] p-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <FlaskConical size={16} className="text-[#9b66f2]" />
            <h3 className="text-white font-semibold text-sm">Simulador de escenarios</h3>
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <span className="text-xs text-gray-400">{simEnabled ? 'Activado' : 'Desactivado'}</span>
            <span
              role="switch"
              aria-checked={simEnabled}
              tabIndex={0}
              onClick={() => handleToggleSim(!simEnabled)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleToggleSim(!simEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                simEnabled ? 'bg-[#7B3FE4]' : 'bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  simEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </span>
          </label>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          Simula cómo cambiaría tu carga si tuvieras más o menos horas disponibles un día específico.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 mt-4 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400">Día a modificar</label>
            <select
              value={simDay}
              onChange={(e) => setSimDay(e.target.value)}
              className="px-3 py-2.5 bg-[#1A1025] border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#7B3FE4]"
            >
              {DIAS_ORDEN.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400">Horas extra (+/-)</label>
            <input
              type="number"
              value={simHours}
              onChange={(e) => setSimHours(e.target.value)}
              className="px-3 py-2.5 bg-[#1A1025] border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#7B3FE4]"
            />
          </div>

          <Button type="button" onClick={() => (simEnabled ? runSimulation() : handleToggleSim(true))} isLoading={simLoading}>
            {simEnabled ? 'Actualizar' : 'Simular'}
          </Button>
        </div>

        {simError && <p className="text-red-400 text-xs mt-3">{simError}</p>}
      </div>

      {loading && <DashboardSkeleton />}

      {error && !loading && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center">
          <p className="text-red-400 font-medium">No se pudo conectar con el servidor</p>
          <p className="text-gray-400 text-sm mt-1">{error}</p>
          <button
            onClick={fetchAnalysis}
            className="mt-4 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm hover:bg-red-500/30 transition-colors"
          >
            Reintentar
          </button>
        </div>
      )}

      {adapted && !loading && sinDatos && (
        <div className="rounded-xl border border-dashed border-gray-800 p-8 text-center">
          <CalendarClock size={28} className="mx-auto mb-3 text-gray-600" />
          <p className="text-white font-medium text-sm mb-1">Aún no hay datos para analizar tu carga</p>
          <p className="text-gray-500 text-xs mb-4 max-w-sm mx-auto">
            Configura tu disponibilidad semanal en Actividades para que PredictUNI pueda calcular tu riesgo de sobrecarga.
          </p>
          <button
            onClick={() => navigate('/actividades')}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-[#7B3FE4] hover:bg-[#6A32C9] px-4 py-2 rounded-lg transition-colors"
          >
            Configurar disponibilidad <ArrowRight size={14} />
          </button>
        </div>
      )}

      {adapted && !loading && !sinDatos && (
        <>
          <RiskCard
            porcentaje={adapted.porcentaje_global}
            riesgo={adapted.riesgo_semanal}
            recomendaciones={adapted.recomendaciones}
            mapa_diario={adapted.mapa_diario}
          />

          {resumenSemana && (
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-gray-800 bg-[#150A21] p-4 text-center">
                <p className="text-green-400 text-2xl font-bold">{resumenSemana.counts.bajo}</p>
                <p className="text-[11px] text-gray-500 mt-1">días carga baja</p>
              </div>
              <div className="rounded-xl border border-gray-800 bg-[#150A21] p-4 text-center">
                <p className="text-yellow-400 text-2xl font-bold">{resumenSemana.counts.medio}</p>
                <p className="text-[11px] text-gray-500 mt-1">días carga media</p>
              </div>
              <div className="rounded-xl border border-gray-800 bg-[#150A21] p-4 text-center">
                <p className="text-red-400 text-2xl font-bold">{resumenSemana.counts.alto}</p>
                <p className="text-[11px] text-gray-500 mt-1">en sobrecarga</p>
              </div>
            </div>
          )}

          <WeeklyLoadChart mapa_diario={adapted.mapa_diario} />
        </>
      )}
    </div>
  );
};

export default DashboardPage;
