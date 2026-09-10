from fastapi import HTTPException, status
from app.api.auth.register.schemas import UserRegister

from app.db.connection import supabase

def register_user(user: UserRegister):
    
    try:
        
        #Creamos las credenciales
        auth_response = supabase.auth.sign_up({
            "email": user.email,
            "password": user.password
        })

        if not auth_response.user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No se pudo registrar el usuario"
            )

        user_id = auth_response.user.id

        profile_info = {
            "id": user_id,
            "name": user.name,
            "email": user.email,
            "cycle": user.cycle
        }

        db_final_response = supabase.table("users").insert(profile_info).execute()

        return {
            "status": "success",
            "message": "Usuario registrado correctamente",
            "access_token": auth_response.session.access_token,
            "token_type": "bearer"
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error al registrar usuario: {str(e)}"
        )
        
        

