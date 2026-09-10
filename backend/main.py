from typing import Optional
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from app.api.analysis import router as analysis_router

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

# 2. Base de datos simulada (En memoria)
fake_users_db = {}

# 3. Modelos de validación (Pydantic)
class UserAuth(BaseModel):
    email: str # En el futuro, usa EmailStr de pydantic para validar el formato
    password: str

class UserRegister(BaseModel):
    name: Optional[str] = None
    email: str
    password: str

# 4. Endpoints
@app.post("/auth/register")
def register(user: UserRegister):
    # Verificamos si el usuario ya existe
    if user.email in fake_users_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="El correo ya está registrado"
        )
    
    # Guardamos en nuestra DB simulada (¡Sin hashear por ahora para pruebas rápidas!)
    fake_users_db[user.email] = {
        "name": user.name,
        "email": user.email,
        "password": user.password
    }
    
    return {"message": "Usuario registrado exitosamente"}

@app.post("/auth/login")
def login(user: UserAuth):
    # Buscamos al usuario en la DB simulada
    db_user = fake_users_db.get(user.email)
    
    # Validamos existencia y contraseña
    if not db_user or db_user["password"] != user.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas"
        )
    
    # Simulamos la creación de un token JWT
    fake_token = f"fake-jwt-token-for-{user.email}"
    
    return {
        "access_token": fake_token, 
        "token_type": "bearer"
    }
app.include_router(analysis_router)

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
        
        
    