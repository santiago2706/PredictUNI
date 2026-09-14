from datetime import datetime, timedelta
from typing import List, Dict, Any
from app.db.connection import supabase
from app.api.analysis.schemas import AnalysisResponse, DailyAnalysis

def get_analysis_data(user_id: str) -> AnalysisResponse:
    # 1. Data Fetching
    availability_res = supabase.table("availability").select("*").eq("user_id", user_id).execute()
    availability_data = availability_res.data
    
    courses_res = supabase.table("courses").select("*").eq("user_id", user_id).execute()
    courses_data = courses_res.data
    
    activities_res = supabase.table("activities").select("*").eq("user_id", user_id).eq("status", "pending").execute()
    activities_data = activities_res.data

    # Prevención de Error: Usuario sin disponibilidad
    if not availability_data:
        return AnalysisResponse(
            global_saturation=0.0,
            global_risk="BAJO",
            daily_analysis=[],
            recommendations=["Por favor, configura tu horario de disponibilidad para analizar tu carga"]
        )

    # 2. Mapeos Rápidos
    course_map = {course["id"]: course.get("difficulty_weight", 1.0) for course in courses_data}
    user_availability = {item["day_of_week"]: item["available_hours"] for item in availability_data}
    
    # 3. Filtrar y procesar actividades
    valid_activities = []
    now = datetime.now()
    
    for act in activities_data:
        due_date_str = act.get("due_date")
        if not due_date_str:
            continue
            
        # Manejo de Fechas (Timezones)
        try:
            due_date_str = due_date_str.replace("Z", "+00:00")
            due_date = datetime.fromisoformat(due_date_str).replace(tzinfo=None)
        except ValueError:
            try:
                due_date = datetime.strptime(due_date_str.split("T")[0], "%Y-%m-%d")
            except ValueError:
                continue

        # Actividades Vencidas (ignorar)
        if due_date < now:
            continue
            
        # Cálculo de Horas Efectivas
        est_hours = act.get("estimated_hours", 0)
        course_id = act.get("course_id")
        diff_weight = course_map.get(course_id, 1.0)
        
        effective_hours = est_hours * diff_weight
        
        valid_activities.append({
            "name": act.get("name"),
            "due_date": due_date,
            "effective_hours": effective_hours
        })
    
    # 4. Distribución Inversa (Core)
    window_days = 14
    if valid_activities:
        max_due = max(act["due_date"] for act in valid_activities)
        days_diff = (max_due - now).days
        if days_diff > window_days:
            window_days = days_diff + 1
            
    schedule = {}
    for i in range(window_days):
        current_date = (now + timedelta(days=i)).date()
        day_of_week = current_date.weekday()
        available_hours = user_availability.get(day_of_week, 0)
        
        schedule[current_date] = {
            "day_of_week": day_of_week,
            "total_available_hours": available_hours,
            "assigned_hours": 0.0
        }
        
    for act in valid_activities:
        hours_to_assign = act["effective_hours"]
        due_date_naive = act["due_date"].date()
        
        current_date = due_date_naive
        
        while hours_to_assign > 0:
            if current_date < now.date():
                current_date = now.date()
                
            if current_date not in schedule:
                day_of_week = current_date.weekday()
                schedule[current_date] = {
                    "day_of_week": day_of_week,
                    "total_available_hours": user_availability.get(day_of_week, 0),
                    "assigned_hours": 0.0
                }
                
            available = schedule[current_date]["total_available_hours"]
            assigned = schedule[current_date]["assigned_hours"]
            
            # Si disponibilidad es 0, saltamos días hacia atrás
            if available == 0 and current_date > now.date():
                current_date = current_date - timedelta(days=1)
                continue
                
            remaining_capacity = max(0, available - assigned)
            
            if remaining_capacity > 0:
                if hours_to_assign <= remaining_capacity:
                    schedule[current_date]["assigned_hours"] += hours_to_assign
                    hours_to_assign = 0
                else:
                    schedule[current_date]["assigned_hours"] += remaining_capacity
                    hours_to_assign -= remaining_capacity
                    current_date = current_date - timedelta(days=1)
            else:
                if current_date > now.date():
                    current_date = current_date - timedelta(days=1)
                else:
                    # En la fecha actual (now.date()), si no hay capacidad, debemos asignar por fuerza para no iterar al infinito
                    schedule[current_date]["assigned_hours"] += hours_to_assign
                    hours_to_assign = 0

    # 5. Cálculo de Riesgo Diario y 6. Generación de Alertas
    daily_analysis_list = []
    total_assigned = 0.0
    total_available_window = 0
    high_risk_days = []
    
    sorted_dates = sorted(list(schedule.keys()))
    
    for d in sorted_dates:
        stats = schedule[d]
        avail = stats["total_available_hours"]
        assigned = stats["assigned_hours"]
        
        total_available_window += avail
        total_assigned += assigned
        
        # División por Cero (ZeroDivisionError)
        if avail == 0:
            if assigned > 0:
                saturation = 100.0
            else:
                saturation = 0.0
        else:
            saturation = (assigned / avail) * 100.0
            
        if saturation <= 60.0:
            risk = "BAJO"
            color = "🟢"
        elif saturation <= 85.0:
            risk = "MEDIO"
            color = "🟡"
        else:
            risk = "ALTO"
            color = "🔴"
            
        if risk == "ALTO":
            high_risk_days.append(d)
            
        daily_analysis_list.append(
            DailyAnalysis(
                date=d,
                day_of_week=stats["day_of_week"],
                total_available_hours=avail,
                assigned_hours=round(assigned, 2),
                saturation_percentage=round(saturation, 2),
                risk_level=risk,
                color=color
            )
        )
        
    if total_available_window == 0:
        global_sat = 100.0 if total_assigned > 0 else 0.0
    else:
        global_sat = (total_assigned / total_available_window) * 100.0
        
    if global_sat <= 60.0:
        global_risk = "BAJO"
    elif global_sat <= 85.0:
        global_risk = "MEDIO"
    else:
        global_risk = "ALTO"
        
    recommendations = []
    days_map = {0: "Lunes", 1: "Martes", 2: "Miércoles", 3: "Jueves", 4: "Viernes", 5: "Sábado", 6: "Domingo"}
    
    for d in high_risk_days[:3]:
        day_name = days_map[d.weekday()]
        day_num = d.day
        
        suggested_day = None
        for i in range(1, 7):
            prev_d = d - timedelta(days=i)
            if prev_d in schedule:
                p_avail = schedule[prev_d]["total_available_hours"]
                p_assigned = schedule[prev_d]["assigned_hours"]
                if p_avail > 0:
                    p_sat = (p_assigned / p_avail) * 100.0
                    if p_sat <= 60.0:
                        suggested_day = days_map[prev_d.weekday()]
                        break
        
        if suggested_day:
            recommendations.append(f"Alta saturación detectada el {day_name} {day_num}. Se sugiere adelantar horas de estudio al {suggested_day}.")
        else:
            recommendations.append(f"Alta saturación detectada el {day_name} {day_num}. Intenta reestructurar tus actividades.")
            
    if not recommendations:
        recommendations.append("Tu carga actual es manejable. ¡Sigue así!")
        
    return AnalysisResponse(
        global_saturation=round(global_sat, 2),
        global_risk=global_risk,
        daily_analysis=daily_analysis_list,
        recommendations=recommendations
    )
