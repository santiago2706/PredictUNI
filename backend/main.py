from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr

app = FastAPI(title="PredictUNI Mock Auth API")

# 1. Configuración de CORS (Crucial para que React pueda conectarse)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, cámbialo por "http://localhost:5173"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Base de datos simulada (En memoria)
fake_users_db = {}

# 3. Modelos de validación (Pydantic)
class UserAuth(BaseModel):
    email: str # En el futuro, usa EmailStr de pydantic para validar el formato
    password: str

# 4. Endpoints
@app.post("/auth/register")
def register(user: UserAuth):
    # Verificamos si el usuario ya existe
    if user.email in fake_users_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="El correo ya está registrado"
        )
    
    # Guardamos en nuestra DB simulada (¡Sin hashear por ahora para pruebas rápidas!)
    fake_users_db[user.email] = {
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