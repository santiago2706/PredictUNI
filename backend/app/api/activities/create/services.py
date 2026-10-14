from fastapi import HTTPException, status
from app.api.activities.schemas import ActivityCreate
from app.db.connection import supabase

def create_activity(activity_data: ActivityCreate, user_id: str):
    data = activity_data.model_dump(mode="json")
    data["user_id"] = user_id

    response = supabase.table("activities").insert(data).execute()
    if not response.data:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error registrando la actividad")
    return response.data[0]
