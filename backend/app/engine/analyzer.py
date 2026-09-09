from datetime import datetime, timedelta

def analizar_carga(actividades, disponibilidad):
    dias_semana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
    
    distribucion = {}
    deficit_total = 0
    hoy = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    
    # FIX 4: Mapear la distribución usando los nombres de los días como llaves
    for dia_idx, horas in disponibilidad.items():
        nombre_dia = dias_semana[int(dia_idx)]
        distribucion[nombre_dia] = {"horas_disponibles": horas, "horas_asignadas": 0}

    horas_totales_requeridas = 0

    for act in actividades:
        horas_necesarias = act["horas_estimadas"] * act["peso_dificultad"]
        horas_totales_requeridas += horas_necesarias
        
        # FIX 3: Captura de excepciones para evitar Crash/Error 500
        try:
            # FIX 1: Iniciamos la iteración el mismo día de la entrega
            fecha_actual = datetime.strptime(act["fecha_entrega"], "%Y-%m-%d")
        except ValueError:
            raise ValueError(f"Formato de fecha inválido en la actividad '{act.get('nombre', 'Desconocida')}'. Se requiere YYYY-MM-DD.")
        
        while horas_necesarias > 0:
            if fecha_actual < hoy:
                # Si llegamos al pasado y faltan horas, se va a déficit
                deficit_total += horas_necesarias
                break
                
            dia_idx = fecha_actual.weekday()
            nombre_dia = dias_semana[dia_idx]
            
            # Verificamos si el día existe en la disponibilidad del usuario
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
    
    # Cálculo crudo para determinar el riesgo interno (puede superar 100)
    porcentaje_crudo = (horas_totales_requeridas / horas_totales_disp) * 100 if horas_totales_disp > 0 else 100
    
    # FIX 2: Limitamos la salida visual máxima al 100% para el frontend
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