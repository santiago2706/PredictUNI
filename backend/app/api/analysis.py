from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.engine.analyzer import analizar_carga

router = APIRouter()

# --- MODELOS PYDANTIC ---
class SimulacionRequest(BaseModel):
    dia_modificar: str  
    horas_extra: int    

# --- FUNCIÓN AUXILIAR DE MOCKS ---
def get_mock_data():
    """Genera datos frescos por cada petición, eliminando la necesidad de deepcopy manual"""
    mock_availability = {
        0: 2, 1: 2, 2: 2, # Lunes a Miércoles: 2h
        3: 2, 4: 2,       # Jueves y Viernes: 2h
        5: 1, 6: 1        # Sábado y Domingo: 1h
    }
    
    hoy = datetime.now()
    # Calculamos fechas futuras de forma dinámica para que el test siempre funcione
    fecha_tarea_1 = (hoy + timedelta(days=2)).strftime("%Y-%m-%d")
    fecha_tarea_2 = (hoy + timedelta(days=3)).strftime("%Y-%m-%d")
    
    mock_activities = [
        {"nombre": "Examen Cálculo", "fecha_entrega": fecha_tarea_2, "horas_estimadas": 8, "peso_dificultad": 1.2},
        {"nombre": "Trabajo Física", "fecha_entrega": fecha_tarea_1, "horas_estimadas": 6, "peso_dificultad": 1.0}
    ]
    
    return mock_activities, mock_availability

# --- ENDPOINTS ---

@router.get("/analysis")
def get_analysis():
    # Obtenemos instancias limpias de los datos
    actividades, disponibilidad = get_mock_data()
    return analizar_carga(actividades, disponibilidad)


@router.post("/analysis/simulate")
def simular_carga(req: SimulacionRequest):
    # Obtenemos instancias limpias de los datos exclusivas para esta petición
    actividades_simuladas, disponibilidad_simulada = get_mock_data()

    dias_map = {
        "lunes": 0, "martes": 1, "miercoles": 2, "miércoles": 2, 
        "jueves": 3, "viernes": 4, "sabado": 5, "sábado": 5, "domingo": 6
    }

    # Normalizamos el día ingresado por el usuario (sin espacios y en minúsculas)
    dia_normalizado = req.dia_modificar.strip().lower()
    dia_idx = dias_map.get(dia_normalizado)

    # Validación de entrada para evitar fallos silenciosos
    if dia_idx is None:
        raise HTTPException(status_code=400, detail=f"Día inválido: {req.dia_modificar}")

    # Aplicamos la simulación
    disponibilidad_simulada[dia_idx] += req.horas_extra
    
    # Candado de seguridad: las horas disponibles nunca pueden ser negativas
    if disponibilidad_simulada[dia_idx] < 0:
        disponibilidad_simulada[dia_idx] = 0

    # Pasamos los datos modificados al algoritmo
    return analizar_carga(actividades_simuladas, disponibilidad_simulada)