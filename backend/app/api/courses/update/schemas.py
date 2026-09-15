from pydantic import BaseModel, Field
from typing import Optional
from app.api.courses.create.schemas import ScheduleModel

class CourseUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    credits: Optional[int] = Field(None, gt=0)
    difficulty_weight: Optional[float] = Field(None, gt=0.0)
    schedule: Optional[ScheduleModel] = None