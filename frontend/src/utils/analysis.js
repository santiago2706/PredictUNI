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
