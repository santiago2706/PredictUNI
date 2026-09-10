from typing import Optional
from pydantic import BaseModel, EmailStr, Field

class UserRegister(BaseModel):
    name: str = Field(..., min_length=3 ,description="Nombre completo del estudiante")
    email: EmailStr = Field(..., description="Correo electronico del estudiante")
    password: str = Field(..., min_length=8 ,description="Contraseña del estudiante, minimo 8 caracteres")
    cycle: Optional[int] = Field(None, description = "Ciclo academico del estudiante")
