from app.db.connection import supabase

def get_availability(user_id: str):
    response = supabase.table("availability").select("*").eq("user_id", user_id).execute()
    return response.data
