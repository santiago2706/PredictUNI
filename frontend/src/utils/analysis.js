export const DIAS_ORDEN = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

// Adapta el AnalysisResponse actual del backend (global_saturation/global_risk/daily_analysis/recommendations)
// a la forma que ya consumen RiskCard y WeeklyLoadChart (porcentaje/riesgo/mapa_diario/recomendaciones).
export function adaptAnalysisResponse(analysis) {
  if (!analysis) return null;

  const mapa_diario = {};
  (analysis.daily_analysis ?? []).forEach((dia) => {
    const nombre = DIAS_ORDEN[dia.day_of_week];
    if (!nombre || mapa_diario[nombre]) return; // nos quedamos con la ocurrencia más próxima (próximos 7 días)
    mapa_diario[nombre] = {
      horas_disponibles: dia.total_available_hours,
      horas_asignadas: dia.assigned_hours,
    };
  });

  return {
    porcentaje_global: analysis.global_saturation,
    riesgo_semanal: analysis.global_risk,
    recomendaciones: analysis.recommendations ?? [],
    mapa_diario,
  };
}

// Mismos umbrales que usa el backend (60% / 85%) para clasificar riesgo por día.
export const nivelRiesgo = (pct) => (pct > 85 ? 'alto' : pct > 60 ? 'medio' : 'bajo');

// Resume un mapa_diario (día -> {horas_disponibles, horas_asignadas}) en conteos por nivel
// de riesgo y el/los día(s) con mayor carga. Usado para las tarjetas de resumen semanal.
export function summarizeMapaDiario(mapa_diario = {}) {
  const dias = Object.entries(mapa_diario).map(([nombre, d]) => {
    const pct = d.horas_disponibles > 0 ? (d.horas_asignadas / d.horas_disponibles) * 100 : 0;
    return { nombre, pct, nivel: nivelRiesgo(pct), ...d };
  });
  const counts = { bajo: 0, medio: 0, alto: 0 };
  dias.forEach((d) => counts[d.nivel]++);
  const maxPct = dias.length > 0 ? Math.max(...dias.map((d) => d.pct)) : 0;
  const diasMasCargados = maxPct > 0 ? dias.filter((d) => d.pct === maxPct) : [];
  return { dias, counts, diasMasCargados, maxPct };
}
