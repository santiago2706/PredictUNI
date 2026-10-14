from fastapi import HTTPException, status
from app.api.availability.schemas import WeeklyAvailability
from app.db.connection import supabase

def set_availability(availability_data: WeeklyAvailability, user_id: str):
    # Eliminar disponibilidad previa
    supabase.table("availability").delete().eq("user_id", user_id).execute()
    
    # Preparar los nuevos registros inyectando el user_id
    records = []
    for day in availability_data.availability:
        record = day.model_dump()
        record["user_id"] = user_id
        records.append(record)
    
    # Insertar el nuevo arreglo
    response = supabase.table("availability").insert(records).execute()
    if not response.data:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error guardando la disponibilidad")
    return {"message": "Horario configurado exitosamente", "data": response.data}
