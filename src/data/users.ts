
import { User } from '../types';

// ============================================================================
// DATOS DE USUARIOS (users.ts)
// ============================================================================
// Usuarios de prueba para los diferentes roles: Usuario normal, Gimnasio y Entrenador.
// Estos datos son utilizados por el servicio de autenticación simulado.
// ============================================================================

export const USERS_DATA: User[] = [
    // Usuario Regular
    {
        name: 'Ana García',
        email: 'ana.garcia@email.com',
        password: 'password123',
        accountType: 'user',
        plan: 'premium',
        subscriptionStatus: 'subscribed',
        isGymMember: true,
        trialEndDate: null,
        notifications: [
            { id: 1, message: '¡Bienvenida a FitnessFlow Pro!', date: '2024-07-20', read: true },
        ],
        profile: {
            goal: 'lose_fat',
            level: 'intermediate',
            daysPerWeek: 4,
            equipment: ['Mancuernas', 'Caminadora'],
        }
    },
    // Cuenta de Gimnasio
    {
        name: 'Gimnasio El Templo',
        email: 'contacto@gimnasioeltemplo.com',
        password: 'password123',
        accountType: 'gym',
        plan: 'premium',
        subscriptionStatus: 'subscribed',
        isGymMember: false,
        trialEndDate: null,
        notifications: [],
    },
    // Cuenta de Entrenador
    {
        name: 'Juan Valdez',
        email: 'juan.valdez@email.com',
        password: 'password123',
        accountType: 'entrenador',
        plan: 'premium',
        subscriptionStatus: 'subscribed',
        isGymMember: false,
        trialEndDate: null,
        notifications: [
            { id: 1, message: 'Carlos Rodríguez ha solicitado una sesión.', date: '2024-07-21', read: false },
        ],
        profession: 'Entrenador Personal Certificado',
        professionalDescription: 'Especialista en entrenamiento de fuerza y acondicionamiento físico.',
        phone: '3001234567',
        address: 'Calle 10 #43A-50, Medellín',
        availability: [
            { day: 'Lunes', hours: ['08:00', '09:00', '10:00', '14:00', '15:00'] },
            { day: 'Miércoles', hours: ['08:00', '09:00', '10:00', '14:00', '15:00'] },
            { day: 'Viernes', hours: ['08:00', '09:00', '10:00'] },
            { day: 'Sábado', hours: ['09:00', '10:00', '11:00'] },
        ]
    }
];
