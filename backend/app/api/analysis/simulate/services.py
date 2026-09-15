from fastapi import HTTPException, status
from app.api.analysis.schemas import SimulacionRequest, AnalysisResponse
from app.api.analysis.get.services import get_analysis_data

DAY_NAME_TO_INDEX = {
    "lunes": 0,
    "martes": 1,
    "miercoles": 2,
    "miércoles": 2,
    "jueves": 3,
    "viernes": 4,
    "sabado": 5,
    "sábado": 5,
    "domingo": 6,
}

def simulate_analysis(request: SimulacionRequest, user_id: str) -> AnalysisResponse:
    day_index = DAY_NAME_TO_INDEX.get(request.dia_modificar.strip().lower())
    if day_index is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Día inválido. Usa: Lunes, Martes, Miércoles, Jueves, Viernes, Sábado o Domingo.",
        )

    return get_analysis_data(user_id, extra_hours_by_day={day_index: request.horas_extra})
