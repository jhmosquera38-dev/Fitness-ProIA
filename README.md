# 🏋️‍♂️ FitnessFlow Pro (Fitness Energy)

**Tu entrenador personal y coach de bienestar impulsado por Inteligencia Artificial.**

FitnessFlow es una aplicación web progresiva (PWA) diseñada para revolucionar la gestión de entrenamientos, nutrición y bienestar personal. Combina un diseño moderno y fluido con la potencia de Gemini AI para ofrecer planes personalizados y asistencia en tiempo real.

---

## 🚀 Características Principales

*   **🤖 Asistente IA (Gemini 3 Flash):** Chat inteligente para consultas sobre ejercicios, nutrición y rutinas.
*   **📅 Gestión de Agenda:** Módulo unificado para entrenadores (Clases Grupales + Entrenamientos Personales) con bloqueo de horarios.
*   **📊 Dashboard de Entrenador:** Estadísticas de ingresos, calificaciones y gestión de clientes en tiempo real.
*   **📱 PWA Instalable:** Funciona como una app nativa en dispositivos móviles y escritorio.
*   **🔔 Sistema de Alertas:** Notificaciones para reservas, recordatorios y gamificación.
*   **🏆 Gamificación:** Logros, retos y niveles para motivar a los usuarios.

---

## 🛠️ Arquitectura Técnica

El proyecto sigue una arquitectura **Frontend-First** con backend en la nube (BaaS).

### Frontend
*   **Framework:** React 18
*   **Build Tool:** Vite (Ultra rápido)
*   **Lenguaje:** TypeScript (Tipado estático para mayor robustez)
*   **Estilos:** Tailwind CSS (Diseño utility-first y responsive)
*   **Iconos:** Lucide React
*   **AI SDK:** Google Generative AI SDK

### Backend (Supabase)
*   **Base de Datos:** PostgreSQL
*   **Autenticación:** Supabase Auth
*   **Almacenamiento:** Supabase Storage (Imágenes de perfil, evidencias)
*   **Seguridad:** Row Level Security (RLS) policies estrictas.

---

## 📂 Estructura del Proyecto

```
/src
  /components    # Componentes UI reutilizables (Botones, Modales, Widgets)
  /pages         # Vistas principales (Dashboard, Perfil, Login)
  /services      # Lógica de negocio y comunicación con Supabase
  /types         # Definiciones de tipos TypeScript (Interfaces)
  /lib           # Configuraciones base (Cliente Supabase, Utils)
/public          # Assets estáticos (Iconos PWA, Robots.txt)
```

---

## 🔧 Instalación y Ejecución

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/jhmosquera38-dev/FitnessFlow-Production.git
    cd FitnessFlow-Production
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar Variables de Entorno:**
    Crear un archivo `.env.local` en la raíz con:
    ```env
    VITE_SUPABASE_URL=tu_supabase_url
    VITE_SUPABASE_ANON_KEY=tu_supabase_key
    VITE_GEMINI_API_KEY=tu_gemini_key
    ```
    *(Nota: La API Key de Gemini actual es de nivel Preview/Free, sujeta a cuotas).*

4.  **Ejecutar en desarrollo:**
    ```bash
    npm run dev
    ```
    Acceder a `http://localhost:5173`.

5.  **Construir para producción:**
    ```bash
    npm run build
    ```

---

## 🧪 Auditoría y Calidad

Este código ha sido auditado para garantizar:
*   **Clean Code:** Nombres descriptivos y funciones modulares.
*   **Tipado:** Uso extensivo de TypeScript interfaces.
*   **Performance:** Carga diferida y optimización de assets.
*   **Seguridad:** Manejo de errores robusto y validación de datos.

---

**Versión:** 1.0.0
**Licencia:** Privada / Propietaria
