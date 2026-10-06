from app.db.connection import supabase

def get_activities(user_id: str):
    response = (
        supabase.table("activities")
        .select("*")
        .eq("user_id", user_id)
        .order("due_date")
        .execute()
    )
    return response.data
