import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import RiskCard from '../../components/dashboard/RiskCard';

// URL del backend — cuando se despliegue en Render, cambia esto por la URL real
const API_BASE = 'http://localhost:8000';

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
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_BASE}/analysis`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

      const data = await res.json();
      setAnalysis(data);
    } catch (err) {
      console.error('Error al cargar el análisis:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, []);

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

      {analysis && !loading && (
        <RiskCard
          porcentaje={analysis.porcentaje_global}
          riesgo={analysis.riesgo_semanal}
          recomendaciones={analysis.recomendaciones}
          mapa_diario={analysis.mapa_diario}
        />
      )}
    </div>
  );
};

export default DashboardPage;
