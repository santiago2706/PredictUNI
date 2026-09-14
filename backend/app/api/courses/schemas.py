from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID

class CourseBase(BaseModel):
    name: str
    code: Optional[str] = None
    credits: int = Field(..., gt=0)
    difficulty_weight: float = Field(..., gt=0.0)

class CourseCreate(CourseBase):
    pass

class CourseUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    credits: Optional[int] = Field(None, gt=0)
    difficulty_weight: Optional[float] = Field(None, gt=0.0)

class CourseResponse(CourseBase):
    id: UUID
    user_id: UUID
    created_at: datetime
