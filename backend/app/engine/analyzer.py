from datetime import datetime, timedelta

def analizar_carga(actividades, disponibilidad):
    dias_semana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
    
    distribucion = {}
    deficit_total = 0
    hoy = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    
    for dia in range(7):
        distribucion[dia] = {
            "horas_disponibles": disponibilidad.get(dia, 0),
            "horas_asignadas": 0
        }

    horas_totales_requeridas = 0

    for act in actividades:
        horas_necesarias = act["horas_estimadas"] * act["peso_dificultad"]
        horas_totales_requeridas += horas_necesarias
        fecha_actual = datetime.strptime(act["fecha_entrega"], "%Y-%m-%d") - timedelta(days=1)
        
        while horas_necesarias > 0:
            if fecha_actual < hoy:
                deficit_total += horas_necesarias
                break
                
            dia_idx = fecha_actual.weekday()
            disp_hoy = disponibilidad.get(dia_idx, 0)
            asignadas_hoy = distribucion[dia_idx]["horas_asignadas"]
            horas_libres_reales = disp_hoy - asignadas_hoy
            
            if horas_libres_reales > 0:
                horas_a_asignar = min(horas_necesarias, horas_libres_reales)
                distribucion[dia_idx]["horas_asignadas"] += horas_a_asignar
                horas_necesarias -= horas_a_asignar
                
            fecha_actual -= timedelta(days=1)

    alertas = []
    horas_totales_disp = sum(d.get("horas_disponibles", 0) for d in distribucion.values())
    
    # Porcentaje basado en lo que realmente demanda el alumno frente a lo que tiene
    porcentaje_global = (horas_totales_requeridas / horas_totales_disp) * 100 if horas_totales_disp > 0 else 100
    
    if porcentaje_global <= 60:
        riesgo = "BAJO"
    elif porcentaje_global <= 85:
        riesgo = "MEDIO"
    else:
        riesgo = "ALTO"
        
    for dia_idx, datos in distribucion.items():
        if datos["horas_disponibles"] > 0:
            porcentaje_dia = (datos["horas_asignadas"] / datos["horas_disponibles"]) * 100
            if porcentaje_dia > 85:
                nombre_dia = dias_semana[dia_idx]
                alertas.append(f"Alta saturación el {nombre_dia}. Considera redistribuir tareas.")
                
    if deficit_total > 0:
        alertas.append(f"ALERTA CRÍTICA: Tienes un déficit de {round(deficit_total, 1)} horas que no alcanzan en tu disponibilidad.")

    return {
        "porcentaje_global": round(porcentaje_global, 2),
        "riesgo_semanal": riesgo,
        "mapa_diario": distribucion,
        "recomendaciones": alertas[:3]
    }