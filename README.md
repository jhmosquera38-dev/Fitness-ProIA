# 🏋️‍♂️ FitnessFlow SaaS 🚀

**FitnessFlow** es la plataforma definitiva para la gestión de gimnasios, entrenadores y usuarios apasionados por el fitness. Potenciada por Inteligencia Artificial (Gemini) y construida sobre una arquitectura robusta en la nube, FitnessFlow democratiza el acceso a tecnología de élite para el bienestar físico.

> **Desarrollado por el equipo de SinFlow** con mucho amor para todos los amantes del fitness. 💙

---

## 🚀 Estado del Proyecto (Versión Final v2.0)
- ✅ **PWA**: Instalable y Offline-capable (Navegación SPA fluida).
- ✅ **SaaS**: Soporte multi-tenant (Usuarios, Gimnasios, Entrenadores) con seguridad de sesión estricta.
- ✅ **IA**: Coach 24/7 con Gemini (Chat, análisis y generación de rutinas).
- ✅ **Pagos**: Integración simulada Nequi/Bancolombia.
- ✅ **Despliegue**: Producción lista para producción (Vite + GH Pages).

---

## ✨ Funcionalidades Principales

### 👤 Para Usuarios (Potenciado por IA)
- **AI Wellness Hub**: Centro de comando para tu bienestar.
- **Rutinas Personalizadas**: Planes adaptados a tu nivel y equipo disponible generados por IA.
- **Gamificación**: Logros, retos y niveles para motivar tu progreso.
- **PWA Instalable**: Funciona como una app nativa en dispositivos móviles y escritorio.

### 🏢 Para Gimnasios
- **Panel Administrativo**: Control total de miembros, aforo e inventario.
- **Gestión Financiera**: Registro automatizado de ingresos, gastos y facturación.
- **Clases Grupales**: Sistema de reservas y horarios optimizado.

### 🧢 Para Entrenadores
- **Gestión de Clientes**: CRM dedicado para seguimiento de atletas.
- **Servicios**: Define tu oferta de entrenamiento personal y clases.
- **Agenda Inteligente**: Gestión de sesiones presenciales o virtuales.

---

## 🛠️ Stack Tecnológico

El proyecto utiliza un stack moderno, escalable y seguro:

### Frontend (Cliente)
- **Core**: React 18 + TypeScript.
- **Build Tool**: Vite (Rendimiento ultra rápido).
- **Estilos**: Tailwind CSS (Diseño utility-first y responsive).
- **Iconos**: Lucide React.
- **PWA**: `vite-plugin-pwa`.

### Backend & AI
- **BaaS**: Supabase (PostgreSQL, Auth, Storage).
- **IA**: Google Gemini API (Modelos Flash para latencia mínima).

---

## 📂 Estructura del Proyecto

```bash
/root
├── /pages             # Vistas principales (Dashboard, Perfil, Gestión)
├── /components        # Componentes UI reutilizables (Botones, Modales, Layouts)
├── /services          # Lógica de comunicación con APIs (Supabase, Gemini)
├── /lib               # Configuraciones base (Cliente Supabase, Utils)
├── /public            # Assets estáticos, manifiesto PWA e iconos
├── App.tsx            # Enrutador principal y gestión de estado global
├── MainApp.tsx        # Contenedor principal de la aplicación autenticada
├── README.md          # Documentación del proyecto
└── package.json       # Scripts y dependencias
```

---

## 🔧 Guía de Instalación y Desarrollo

1. **Clonar Repositorio**:
   ```bash
   git clone https://github.com/jhmosquera38-dev/Fitness-ProIA.git
   ```

2. **Instalar Dependencias**:
   ```bash
   npm install
   ```

3. **Configurar Entorno**:
   Crea un archivo `.env.local` en la raíz con tus credenciales:
   ```env
   VITE_SUPABASE_URL=tu_supabase_url
   VITE_SUPABASE_ANON_KEY=tu_supabase_key
   VITE_GEMINI_API_KEY=tu_gemini_key
   ```

4. **Ejecutar en Desarrollo**:
   ```bash
   npm run dev
   ```

---

## 🔒 Auditoría y Calidad
- **Clean Code**: Arquitectura modular y nombres descriptivos.
- **Seguridad**: Row Level Security (RLS) en Supabase para aislamiento de datos.
- **Tipado**: Uso consistente de TypeScript para evitar errores en producción.

---

<div align="center">
  <b>Desarrollado por el equipo de SinFlow con mucho amor para todos los amantes del fitness. 💙</b>
</div>