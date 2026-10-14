from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date, time
from app.api.courses.schemas import CourseBase

# 1. Modelo para cada sesión (clase)
class SessionModel(BaseModel):
    day_of_week: int = Field(..., ge=0, le=6, description="0=Domingo, 1=Lunes, ..., 6=Sábado")
    start_time: time = Field(..., description="Hora de inicio, ej: 08:00")
    end_time: time = Field(..., description="Hora de fin, ej: 10:00")
    type: Optional[str] = Field("Teoría", description="Ej: Teoría, Laboratorio, Práctica")

# 2. Modelo para el horario completo (que se guardará como JSONB)
class ScheduleModel(BaseModel):
    term_start: date = Field(..., description="Fecha de inicio (YYYY-MM-DD)")
    term_end: date = Field(..., description="Fecha de fin (YYYY-MM-DD)")
    sessions: List[SessionModel] = Field(default_factory=list)

# 3. Tu modelo principal actualizado
class CourseCreate(CourseBase):
    schedule: Optional[ScheduleModel] = None
