// ============================================================================
// DEFINICIONES DE TIPOS (TYPES.TS)
// ============================================================================
// Este archivo contiene los "planos" o definiciones de cómo se estructuran los datos
// en toda la aplicación. Define qué propiedades tiene un Usuario, un Ejercicio, etc.
// ============================================================================

import React from 'react';

// --- SISTEMA DE NOTIFICACIONES ---
export interface Notification {
  id: number;
  message: string; // Mensaje a mostrar
  date: string;    // Fecha de envío
  read: boolean;   // Si el usuario ya la leyó
}

export interface NavItem {
  name: string;
  icon: React.ReactNode;
}

// --- ENTRENAMIENTO ---

// Define un ejercicio individual dentro de una rutina
export interface Exercise {
  name: string;
  sets: number;   // Series
  reps: string;   // Repeticiones
  rest: number;   // Descanso en segundos
  description: string;
  imageSearchQuery: string; // Para buscar imágenes ilustrativas
}

// Define la rutina de un día específico
export interface DailyWorkout {
  day: string;    // Lunes, Martes...
  focus: string;  // Enfoque (ej: Pecho y Tríceps)
  warmUp: string; // Calentamiento
  exercises: Exercise[];
  coolDown: string; // Enfriamiento
}

export interface WorkoutPlan {
  weeklyPlan: DailyWorkout[];
}

// Datos de salud y fitness del usuario
export interface UserProfile {
  goal: 'build_muscle' | 'lose_fat' | 'improve_endurance' | 'general_fitness';
  level: 'beginner' | 'intermediate' | 'advanced';
  daysPerWeek: number;
  equipment: string[]; // Equipamiento disponible
  notes?: string;
  restPreference?: string;
  exercisesToAvoid?: string;
}

export type ExerciseDifficulty = 'Principiante' | 'Intermedio' | 'Avanzado';

// Ejercicio en la Biblioteca Global de Ejercicios
export interface LibraryExercise {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  videoUrl?: string; // Enlace a video demostrativo
  difficulty: ExerciseDifficulty;
  tags: string[];    // Etiquetas para filtrado
  duration: number;
  caloriesPerMin: number;
  isFavorite?: boolean;
  isPremium?: boolean;
  category: string;
  equipment: string;
  instructions: string[]; // Paso a paso
}

// --- CLASES Y SERVICIOS ---

export interface ClassSchedule {
  day: string;
  time: string;
}

// Clase Grupal (Zoomba, Yoga, etc.)
export interface GroupClass {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  videoUrl?: string;
  difficulty?: 'Principiante' | 'Intermedio' | 'Avanzado';
  category: string;
  coach: string; // Nombre del instructor
  capacity?: number;
  duration?: number;
  schedule: ClassSchedule[];
  price?: number;
  locationType: 'Gimnasio' | 'A Domicilio' | 'Virtual';
  gymId?: string;
  clientAddress?: string;
  bookedBy?: string;
  status?: 'pending_confirmation' | 'confirmed' | 'completed' | 'cancelled' | 'blocked';
  rawDate?: string;
}

export interface WeeklyVolumeData {
  week: string;
  volume: number;
}

export interface PersonalRecord {
  exercise: string;
  weight: number;
  date: string;
}

// --- GAMIFICACIÓN ---
// Estructura de medallas y logros
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;     // ¿Desbloqueado?
  dateUnlocked?: string; // Fecha en que se consiguió
}

// --- IA Y CHAT ---
export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  sources?: { uri: string; title: string }[]; // Citas bibliográficas (opcional)
}

// Cliente de un Entrenador
export interface Client {
  id: string | number;
  name: string;
  email: string;
  plan?: string;   // Plan de suscripción (ej: Básico, Premium)
  goal: string;
  lastActivity?: string;
  lastVisit?: string;
  status?: 'active' | 'inactive' | string;
  objective?: string;
  progress: number;
  notes: string[];
  avatar?: string;
  phone?: string;
  joinDate?: string;
  memberships?: string;
  source?: 'service' | 'class' | 'both' | string; // Origen del cliente
}

export interface InventoryItem {
  id: number;
  gym_id?: string;
  item_name: string;
  category: string;
  quantity: number;
  status: 'Operativo' | 'En Mantenimiento' | 'Fuera de Servicio' | 'Disponible' | 'Agotado' | 'Bajo Stock';
  brand?: string;
  serial_number?: string;
  last_maintenance?: string;
  image_url?: string;
  price?: number;
  type?: 'equipment' | 'product';
}

// Servicio ofrecido por un Entrenador (Asesoría, Personalizado)
export interface CoachService {
  id: number;
  name: string;       // Renamed from serviceName for consistency
  description: string;
  imageUrl?: string;  // Made optional
  videoUrl?: string;
  coach?: string;     // Optional if context implies it
  duration: number;
  price: number;
  locationType?: 'Gimnasio' | 'A Domicilio' | 'Virtual'; // Optional
  availability?: { day: string; hours: string[] }[];   // Optional
  activeClients?: number; // Added for dashboard stats
}

export type Theme = 'light' | 'dark';

// Registro Diario de Bienestar (Bio-Feedback)
export interface DailyCheckin {
  date: string;
  energyLevel: number; // 1-10
  sleepQuality: 'poor' | 'average' | 'good' | 'excellent';
  soreness: 'none' | 'low' | 'medium' | 'high'; // Dolor muscular
  mood: 'stressed' | 'neutral' | 'motivated' | 'tired';
}

// Insights generados por IA
export interface AIInsight {
  type: 'recovery' | 'performance' | 'caution' | 'motivation';
  title: string;
  message: string;
  actionLabel: string;
  suggestedActivity?: string;
}

// --- TIPOS DE GAMIFICACIÓN EXPANDIDOS ---

export interface LevelData {
  currentLevel: number;
  currentXP: number;
  nextLevelXP: number;
  title: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  target: number;
  current?: number; // Opcional, calculado en frontend
  unit: string;
  reward_xp: number; // Snake case from DB
  deadline: string;
  participants_count: number; // Snake case from DB
}

export interface LeaderboardEntry {
  rank: number;
  userName: string;
  xp: number;
  avatar?: string;
  trend: 'up' | 'down' | 'same'; // Tendencia (subió, bajó, igual)
}

export interface SocialActivity {
  id: string;
  user: string;
  action: string;
  timeAgo: string;
  type: 'workout' | 'level_up' | 'achievement';
  likes: number;
}

export interface WeeklyComparisonItem {
  label: string;
  current: number;
  previous: number;
  unit: string;
}

// --- USUARIO MAESTRO ---
// Define la estructura completa de un usuario en el sistema
export interface User {
  name: string;
  email: string;
  password?: string;
  accountType: 'user' | 'gym' | 'entrenador'; // Rol
  plan: 'gratis' | 'básico' | 'premium';
  subscriptionStatus: 'trial' | 'subscribed' | 'expired';
  isGymMember: boolean;
  trialEndDate: Date | null;
  notifications: Notification[];
  hasCompletedOnboarding?: boolean; // ¿Ya pasó el asistente inicial?
  profile?: UserProfile;            // Datos fitness (si es usuario)
  profession?: string;              // (si es entrenador)
  professionalDescription?: string;
  phone?: string;
  address?: string;
  cc?: string;
  availability?: { day: string; hours: string[] }[];
  dailyCheckins?: DailyCheckin[];

  // Propiedades de Gamificación
  gamification?: {
    xp: number;
    level: number;
    title: string; // Título (ej: Guerrero Espartano)
    achievements: Achievement[];
  };
}

// --- FEEDBACK Y RESEÑAS ---
export interface Feedback {
  id: string;
  authorName: string;
  rating: number; // 1-5 Estrellas
  comment: string;
  date: string;
  targetType: 'coach' | 'gym' | 'class'; // A quién va dirigida
}
