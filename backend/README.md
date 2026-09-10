# 🎓 PredictUNI - Backend

Este directorio contiene el código del backend de **PredictUNI**, construido con **Python** y **FastAPI**. Actualmente cuenta con un solo endpoint de prueba para verificar que el servidor funcione correctamente.

## 📋 Requisitos Previos

Asegúrate de tener instalado en tu sistema:
- [Python](https://www.python.org/) (versión 3.9 o superior recomendada)
- pip (gestor de paquetes de Python)
- Git

## 🚀 Guía de Inicio Rápido (Setup)

Sigue estos pasos para levantar el backend localmente después de clonar el repositorio. Se recomienda usar un entorno virtual para mantener aisladas las dependencias del proyecto.

### 1. Ubícate en la carpeta del backend
Si estás en la raíz del proyecto, ingresa a la carpeta correspondiente:
```bash
cd backend
```

### 2. Sincroniza la rama principal de trabajo
Como el equipo trabaja con protección de ramas, asegúrate de posicionarte en `develop` para obtener la versión más actualizada antes de empezar a programar:
```bash
git checkout develop
git pull origin develop
```

### 3. Crea y activa tu entorno virtual (Recomendado)
Es una buena práctica trabajar dentro de un entorno virtual. Ejecuta los siguientes comandos:

**En Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**En macOS / Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 4. Instala las dependencias
Instala todas las librerías necesarias (como FastAPI y Uvicorn) a partir del archivo de requerimientos:
```bash
pip install -r requirements.txt
```

### 5. Levanta el servidor local
Inicia el servidor en modo desarrollo (con recarga automática al hacer cambios):
```bash
uvicorn main:app --reload
```

### 6. Prueba la aplicación
El backend estará funcionando y podrás acceder a él desde tu navegador.
👉 **Endpoint de prueba:** [http://127.0.0.1:8000/](http://127.0.0.1:8000/)

Además, FastAPI genera documentación interactiva automáticamente:
👉 **Swagger UI:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
👉 **ReDoc:** [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

## 🧩 Extensiones Recomendadas (VS Code)

Para asegurar una experiencia fluida trabajando con Python y FastAPI, se recomienda instalar estas extensiones esenciales en tu editor:

1. **Python** (por Microsoft): Obligatoria. Proporciona soporte para entornos virtuales, depuración y navegación de código.
2. **Pylance**: Ofrece autocompletado inteligente (IntelliSense) y análisis de tipos para Python, lo que facilita mucho el trabajo con FastAPI.
3. **Ruff** (opcional pero recomendado): Un linter y formateador de código en Python extremadamente rápido, ideal para mantener un código limpio en el equipo.

---

## 🛠️ Comandos Adicionales

- `pip freeze > requirements.txt`: Si instalas un paquete nuevo (ej: `pip install requests`), ejecuta este comando para guardar la dependencia en el archivo y que el resto del equipo pueda usarla.
- `deactivate`: Para salir del entorno virtual de Python cuando termines de trabajar.
