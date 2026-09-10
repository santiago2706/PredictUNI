from typing import Optional
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from app.api.analysis import router as analysis_router
from app.api.auth.routes import router as auth_router

from app.db.connection import supabase
from datetime import date
import json

app = FastAPI(title="PredictUNI Mock Auth API")

# 1. Configuración de CORS (Crucial para que React pueda conectarse)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, cámbialo por "http://localhost:5173"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluimos los routers de la aplicación
app.include_router(analysis_router)
app.include_router(auth_router)



@app.post("/db_prueba")
def db_prueba():
    print("Paso 1")
    try:
        write_response = supabase.table("users").insert(
            {
                "id": "7a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
                "name": "Jose Luis",
                "email": "[ADRESS]",
                "cycle": 3,
                "created_at": json.dumps(date.today().isoformat()),
                "updated_at": json.dumps(date.today().isoformat())
            }
        ).execute()
        print("Paso 2")
        read_response = supabase.table("users").select("*").limit(1).execute()
        print("Paso 3")
        return {
            "status": "succes",
            "message": "Conexion Exitosa (Read - Write)",
            "read_response": read_response.data}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al conectar con la base de datos: {str(e)}"
        )
        
        
    