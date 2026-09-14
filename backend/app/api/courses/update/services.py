from fastapi import HTTPException, status
from app.api.courses.schemas import CourseUpdate
from app.db.connection import supabase

def update_course(course_id: str, course_data: CourseUpdate, user_id: str):
    data = course_data.model_dump(exclude_unset=True)
    if not data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No se enviaron datos para actualizar")
    
    response = supabase.table("courses").update(data).eq("id", course_id).eq("user_id", user_id).execute()
    if not response.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Curso no encontrado o no autorizado")
    return response.data[0]
