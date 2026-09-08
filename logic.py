def calcular_indice_saturacion(matriz_horas, limite_diario):
    """
    Versión eficiente en Python puro sin dependencias externas.
    """
    total_horas_procesadas = sum(sum(fila) for fila in matriz_horas)
    
    if limite_diario <= 0:
        raise ValueError("El límite de disponibilidad diario debe ser mayor a cero.")
    
    indice_saturacion = (total_horas_procesadas / limite_diario) * 100
    
    if indice_saturacion <= 60:
        estado = "BAJO"
    elif indice_saturacion <= 85:
        estado = "MEDIO"
    else:
        estado = "ALTO"
        
    return f"{indice_saturacion:.2f}%", estado