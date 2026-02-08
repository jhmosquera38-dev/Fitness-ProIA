
import { Client, CoachService } from '../types';

// ============================================================================
// DATOS DE ENTRENADOR (coach.ts)
// ============================================================================
// Datos simulados para el dashboard del entrenador, incluyendo clientes y servicios.
// ============================================================================

export const mockClients: Client[] = [
    {
        id: 1,
        name: 'Carlos Rodríguez',
        email: 'carlos.rodriguez@email.com',
        plan: 'Premium',
        goal: 'Perder Grasa',
        lastActivity: 'Ayer',
        progress: 75,
        joinDate: '2024-01-01',
        notes: [
            '2024-07-15: Excelente progreso en la última semana. Aumentar cardio a 35 min.',
            '2024-07-08: Foco en la técnica de sentadilla para evitar molestias en la rodilla.',
        ]
    },
    {
        id: 2,
        name: 'Sofia Gómez',
        email: 'sofia.gomez@email.com',
        goal: 'Ganar Músculo',
        lastActivity: 'Hoy',
        progress: 60,
        joinDate: '2024-02-15',
        notes: [
            '2024-07-16: Aumentó el peso en press de banca. Revisar la dieta para asegurar superávit calórico.',
        ]
    },
    {
        id: 3,
        name: 'Javier Pérez',
        email: 'javier.perez@email.com',
        goal: 'Fitness General',
        lastActivity: 'Hace 3 días',
        progress: 40,
        joinDate: '2024-03-10',
        notes: [
            '2024-07-12: Mostró gran consistencia. Sugerir una clase de yoga para mejorar flexibilidad.',
        ]
    },
];

export const mockCoachServices: CoachService[] = [
    {
        id: 1,
        name: 'Entrenamiento Personal 1:1',
        description: 'Sesiones personalizadas de 60 minutos con enfoque en objetivos específicos.',
        price: 80000,
        duration: 60,
        activeClients: 5
    },
    {
        id: 2,
        name: 'Plan de Nutrición Mensual',
        description: 'Asesoría nutricional completa con seguimiento semanal y ajustes.',
        price: 120000,
        duration: 0,
        activeClients: 12
    },
    {
        id: 3,
        name: 'Clase Grupal HIIT',
        description: 'Entrenamiento de alta intensidad en grupo reducido (Max 10).',
        price: 25000,
        duration: 45,
        activeClients: 8
    }
];
