from fastapi import HTTPException, status
from app.api.auth.login.schemas import UserLogin

from app.db.connection import supabase

def login_user(user: UserLogin):
    
    try:
        login_info = {
            "email": user.email,
            "password": user.password
        }

        login_response = supabase.auth.sign_in_with_password(login_info)

        if not login_response.session:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Inicio de Sesion Fallido"
            )

        return {
            "message": "Inicio de sesion exitoso",
            "access_token": login_response.session.access_token,
            "token_type": "bearer"
        }



    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Credenciales incorrectas: {str(e)}"
        )
