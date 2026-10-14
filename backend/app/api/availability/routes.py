from fastapi import APIRouter, status, Depends
from typing import List

from app.api.auth.dependencies import get_current_user_id
from app.api.availability.schemas import WeeklyAvailability, AvailabilityResponse
from app.api.availability.set.services import set_availability
from app.api.availability.get.services import get_availability

router = APIRouter(prefix="/availability", tags=["Availability"])

@router.post("/", status_code=status.HTTP_201_CREATED)
def configure_availability(request: WeeklyAvailability, user_id: str = Depends(get_current_user_id)):
    return set_availability(request, user_id)

@router.get("/", status_code=status.HTTP_200_OK, response_model=List[AvailabilityResponse])
def get_availability_schedule(user_id: str = Depends(get_current_user_id)):
    return get_availability(user_id)
