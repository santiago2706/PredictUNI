from datetime import datetime, timedelta

def analizar_carga(actividades, disponibilidad):
    dias_semana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
    
    distribucion = {}
    deficit_total = 0
    hoy = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    
    for dia_idx, horas in disponibilidad.items():
        nombre_dia = dias_semana[int(dia_idx)]
        distribucion[nombre_dia] = {"horas_disponibles": horas, "horas_asignadas": 0}

    horas_totales_requeridas = 0

    # SOLUCIÓN 1: Filtrar fechas inválidas y ordenar actividades de la más urgente a la más lejana
    actividades_validas = []
    for act in actividades:
        try:
            act["fecha_obj"] = datetime.strptime(act["fecha_entrega"], "%Y-%m-%d")
            actividades_validas.append(act)
        except ValueError:
            raise ValueError(f"Formato de fecha inválido en '{act.get('nombre', 'Desconocida')}'. Se requiere YYYY-MM-DD.")
            
    actividades_ordenadas = sorted(actividades_validas, key=lambda x: x["fecha_obj"])

    for act in actividades_ordenadas:
        horas_necesarias = act["horas_estimadas"] * act["peso_dificultad"]
        horas_totales_requeridas += horas_necesarias
        fecha_actual = act["fecha_obj"]
        
        while horas_necesarias > 0:
            if fecha_actual < hoy:
                deficit_total += horas_necesarias
                break
                
            dia_idx = fecha_actual.weekday()
            nombre_dia = dias_semana[dia_idx]
            
            if nombre_dia in distribucion:
                disp_hoy = distribucion[nombre_dia]["horas_disponibles"]
                asignadas_hoy = distribucion[nombre_dia]["horas_asignadas"]
                horas_libres_reales = disp_hoy - asignadas_hoy
                
                if horas_libres_reales > 0:
                    horas_a_asignar = min(horas_necesarias, horas_libres_reales)
                    distribucion[nombre_dia]["horas_asignadas"] += horas_a_asignar
                    horas_necesarias -= horas_a_asignar
                    
            fecha_actual -= timedelta(days=1)

    alertas = []
    horas_totales_disp = sum(d["horas_disponibles"] for d in distribucion.values())
    
    # SOLUCIÓN 2: Manejo correcto del límite inferior para evitar división por cero
    if horas_totales_disp > 0:
        porcentaje_crudo = (horas_totales_requeridas / horas_totales_disp) * 100
    else:
        porcentaje_crudo = 100.0 if horas_totales_requeridas > 0 else 0.0
    
    porcentaje_global_visual = min(porcentaje_crudo, 100.0)
    
    if porcentaje_crudo <= 60:
        riesgo = "BAJO"
    elif porcentaje_crudo <= 85:
        riesgo = "MEDIO"
    else:
        riesgo = "ALTO"
        
    for nombre_dia, datos in distribucion.items():
        if datos["horas_disponibles"] > 0:
            porcentaje_dia = (datos["horas_asignadas"] / datos["horas_disponibles"]) * 100
            if porcentaje_dia > 85:
                alertas.append(f"Alta saturación el {nombre_dia}. Considera redistribuir tareas.")
                
    if deficit_total > 0:
        alertas.append(f"ALERTA CRÍTICA: Tienes un déficit de {round(deficit_total, 1)} horas que no alcanzan en tu disponibilidad.")

    return {
        "porcentaje_global": round(porcentaje_global_visual, 2),
        "riesgo_semanal": riesgo,
        "mapa_diario": distribucion,
        "recomendaciones": alertas[:3]
    }