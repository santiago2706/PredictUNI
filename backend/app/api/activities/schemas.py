from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, datetime
from uuid import UUID

class ActivityBase(BaseModel):
    course_id: UUID
    name: str
    type: str
    due_date: date
    estimated_hours: int = Field(..., gt=0)
    difficulty: Optional[int] = Field(None, ge=1, le=3)
    priority: Optional[str] = None

class ActivityCreate(ActivityBase):
    pass

class ActivityResponse(ActivityBase):
    id: UUID
    user_id: UUID
    status: str
    created_at: datetime
