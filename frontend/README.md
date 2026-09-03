# 🎓 PredictUNI - Frontend

Este directorio contiene el código del frontend de **PredictUNI**, construido con **React**, **Vite** y **Tailwind CSS**.

## 📋 Requisitos Previos

Asegúrate de tener instalado en tu sistema:
- [Node.js](https://nodejs.org/) (versión 18 o superior recomendada)
- npm (incluido con Node.js)
- Git

## 🚀 Guía de Inicio Rápido (Setup)

Sigue estos pasos para levantar el proyecto localmente después de clonar el repositorio. *(Nota: La configuración de Tailwind ya está integrada en el repositorio, por lo que se instalará automáticamente con el resto de paquetes).*

### 1. Ubícate en la carpeta del frontend
Si estás en la raíz del proyecto, ingresa a la carpeta correspondiente:
```bash
cd frontend
```

### 2. Sincroniza la rama principal de trabajo
Como el equipo trabaja con protección de ramas, asegúrate de posicionarte en `develop` para obtener la versión más actualizada antes de empezar a programar:
```bash
git checkout develop
git pull origin develop
```

### 3. Instala las dependencias
Descarga todos los paquetes necesarios (React, Vite, Tailwind CSS, etc.). **Al ejecutar este comando, Tailwind se instala automáticamente** gracias al archivo `package.json`:
```bash
npm install
```

### 4. Levanta el servidor local
Inicia el entorno de desarrollo ultrarrápido de Vite:
```bash
npm run dev
```

### 5. Abre la aplicación
La terminal compilará el código y te mostrará un enlace. Abre tu navegador de preferencia y dirígete a:
👉 **http://localhost:5173/**

---

## 🧩 Extensiones Recomendadas (VS Code)

Para asegurar una experiencia fluida y evitar falsos errores de sintaxis, se recomienda instalar estas extensiones esenciales en tu editor:

1. **Tailwind CSS IntelliSense**: Obligatoria. Te da autocompletado de clases en tiempo real, muestra los colores que estás usando y evita que VS Code marque directivas como `@tailwind` como errores.
2. **ESLint**: Fundamental para encontrar y arreglar problemas en tu código JavaScript/React al instante.
3. **Prettier - Code formatter**: Formatea tu código automáticamente al guardar. Mantiene un estilo unificado y limpio entre todos los miembros del equipo.

---

## 🛠️ Comandos Adicionales

- `npm run dev`: Inicia el servidor de desarrollo local.
- `npm run build`: Empaqueta y optimiza la aplicación lista para pasarla a producción (Vercel).
- `npm run preview`: Previsualiza localmente la versión construida (build) antes del despliegue.