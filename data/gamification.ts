// ============================================================================
// DATOS DE GAMIFICACIÓN (Data Mock)
// ============================================================================
// Define los niveles, recompensas, retos activos y datos sociales para
// simular la experiencia de juego en la plataforma.
// ============================================================================

// Títulos y XP necesarios por nivel
export const LEVEL_TITLES = [
    { level: 1, minXP: 0, title: 'Novato' },
    { level: 2, minXP: 1000, title: 'Principiante' },
    { level: 3, minXP: 2500, title: 'Entusiasta' },
    { level: 4, minXP: 5000, title: 'Atleta' },
    { level: 5, minXP: 10000, title: 'Élite' },
    { level: 6, minXP: 20000, title: 'Maestro' },
    { level: 7, minXP: 40000, title: 'Leyenda' },
];

// Retos disponibles actualmente para los usuarios
export const ACTIVE_CHALLENGES = [
    {
        id: 'c1',
        title: 'Guerrero de Fin de Semana',
        description: 'Completa 2 entrenamientos este fin de semana',
        target: 2,
        current: 1,
        unit: 'sesiones',
        rewardXP: 500,
        deadline: '2024-06-30',
        participants: 1240
    },
    {
        id: 'c2',
        title: 'Rey del Cardio',
        description: 'Acumula 120 minutos de cardio',
        target: 120,
        current: 45,
        unit: 'minutos',
        rewardXP: 300,
        deadline: '2024-07-05',
        participants: 850
    },
    {
        id: 'c3',
        title: 'Fuerza Bruta',
        description: 'Levanta un total de 5000kg (volumen)',
        target: 5000,
        current: 3250,
        unit: 'kg',
        rewardXP: 750,
        deadline: '2024-07-10',
        participants: 560
    }
];

// Datos ficticios para la tabla de clasificación (Leaderboard)
export const LEADERBOARD_DATA = [
    { rank: 1, userName: 'Laura V.', xp: 45200, trend: 'up' as const, avatar: '👩' },
    { rank: 2, userName: 'Carlos M.', xp: 42100, trend: 'same' as const, avatar: '👨' },
    { rank: 3, userName: 'Ana G.', xp: 38900, trend: 'up' as const, avatar: '👩' },
    { rank: 4, userName: 'Juan P.', xp: 35400, trend: 'down' as const, avatar: '👨' },
    { rank: 5, userName: 'Sofia R.', xp: 31200, trend: 'up' as const, avatar: '👩' }
];

// Actividad social simulada (Social Feed)
export const SOCIAL_FEED = [
    { id: 's1', user: 'Laura V.', action: 'completó', type: 'workout' as const, timeAgo: '2h', likes: 12 },
    { id: 's2', user: 'Carlos M.', action: 'subió a nivel', type: 'level_up' as const, timeAgo: '4h', likes: 24 },
    { id: 's3', user: 'Roberto', action: 'ganó logro', type: 'achievement' as const, timeAgo: '5h', likes: 8 },
    { id: 's4', user: 'Ana G.', action: 'terminó reto', type: 'workout' as const, timeAgo: '1d', likes: 15 }
];
