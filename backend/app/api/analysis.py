from fastapi import APIRouter
from app.engine.analyzer import analizar_carga

router = APIRouter()

@router.get("/analysis")
def get_analysis():
    # Mocks del Caso 3 (Sobrecarga)
    mock_availability = {
        0: 2, 1: 2, 2: 2, # Lunes a Miércoles: 2h
        3: 2, 4: 2,       # Jueves y Viernes: 2h
        5: 1, 6: 1        # Fin de semana: 1h
    } # Total: 12 horas disponibles
    
    # Calculamos fechas futuras dinámicas para la prueba
    from datetime import datetime, timedelta
    hoy = datetime.now()
    jueves = (hoy + timedelta(days=2)).strftime("%Y-%m-%d")
    viernes = (hoy + timedelta(days=3)).strftime("%Y-%m-%d")
    
    mock_activities = [
        {"nombre": "Examen Cálculo", "fecha_entrega": viernes, "horas_estimadas": 8, "peso_dificultad": 1.2},
        {"nombre": "Trabajo Física", "fecha_entrega": jueves, "horas_estimadas": 6, "peso_dificultad": 1.0}
    ] # Total requerido: ~15.6 horas (mayor a las 12h disponibles)

    resultado = analizar_carga(mock_activities, mock_availability)
    return resultado