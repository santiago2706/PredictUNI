from pydantic import BaseModel
from typing import List
from datetime import date

class DailyAnalysis(BaseModel):
    date: date
    day_of_week: int # 0=Lunes, 6=Domingo
    total_available_hours: int
    assigned_hours: float
    saturation_percentage: float
    risk_level: str # "BAJO", "MEDIO", "ALTO"
    color: str # "🟢", "🟡", "🔴"

class AnalysisResponse(BaseModel):
    global_saturation: float
    global_risk: str
    daily_analysis: List[DailyAnalysis]
    recommendations: List[str]

class SimulacionRequest(BaseModel):
    dia_modificar: str  
    horas_extra: int
