from fastapi import HTTPException, status
from app.db.connection import supabase

def refresh_session(refresh_token: str):
    try:
        response = supabase.auth.refresh_session(refresh_token)

        if not response.session:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="No se pudo renovar la sesion"
            )

        return {
            "access_token": response.session.access_token,
            "refresh_token": response.session.refresh_token,
            "token_type": "bearer"
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Sesion invalida o expirada: {str(e)}"
        )
