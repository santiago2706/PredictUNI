from pydantic import BaseModel, Field, validator
from typing import List
from uuid import UUID

class AvailabilityDay(BaseModel):
    day_of_week: int = Field(..., ge=0, le=6)
    available_hours: int = Field(..., ge=0)

class WeeklyAvailability(BaseModel):
    availability: List[AvailabilityDay] = Field(..., min_length=7, max_length=7)

    @validator('availability')
    def validate_days(cls, v):
        days = [day.day_of_week for day in v]
        if len(set(days)) != 7:
            raise ValueError("Debe contener exactamente 7 dias unicos del 0 al 6")
        return v

class AvailabilityResponse(AvailabilityDay):
    id: UUID
    user_id: UUID
