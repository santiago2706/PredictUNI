from fastapi import HTTPException, status
from app.api.courses.create.schemas import CourseCreate
from app.db.connection import supabase

def create_course(course_data: CourseCreate, user_id: str):
    data = course_data.model_dump(mode="json")
    data["user_id"] = user_id
    
    response = supabase.table("courses").insert(data).execute()
    if not response.data:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error creando el curso")
    return response.data[0]
