from fastapi import APIRouter, status, Depends
from typing import List

from app.api.auth.dependencies import get_current_user_id
from app.api.activities.schemas import ActivityCreate, ActivityResponse

from app.api.activities.create.services import create_activity
from app.api.activities.get.services import get_activities

router = APIRouter(prefix="/activities", tags=["Activities"])

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=ActivityResponse)
def create(request: ActivityCreate, user_id: str = Depends(get_current_user_id)):
    return create_activity(request, user_id)

@router.get("/", status_code=status.HTTP_200_OK, response_model=List[ActivityResponse])
def get_all(user_id: str = Depends(get_current_user_id)):
    return get_activities(user_id)
