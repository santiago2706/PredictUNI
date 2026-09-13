from app.db.connection import supabase
from fastapi import HTTPException, status

def get_courses(user_id: str):
    response = supabase.table("courses").select("*").eq("user_id", user_id).execute()
    return response.data
