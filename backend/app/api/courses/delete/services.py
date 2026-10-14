from fastapi import HTTPException, status
from app.db.connection import supabase

def delete_course(course_id: str, user_id: str):
    response = supabase.table("courses").delete().eq("id", course_id).eq("user_id", user_id).execute()
    if not response.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Curso no encontrado o no autorizado")
    return {"message": "Curso eliminado exitosamente"}
