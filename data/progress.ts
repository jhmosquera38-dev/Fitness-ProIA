
import { WeeklyVolumeData, PersonalRecord, Achievement, WeeklyComparisonItem } from '../types';

export const PROGRESS_DATA = {
    kpis: {
        totalWorkouts: 78,
        totalVolumeKg: 54200,
        timeInvestedHours: 65,
        prsBeaten: 4,
    },
    weeklyVolume: [
        { week: 'Sem 1', volume: 4500 },
        { week: 'Sem 2', volume: 4800 },
        { week: 'Sem 3', volume: 4700 },
        { week: 'Sem 4', volume: 5100 },
        { week: 'Sem 5', volume: 5500 },
        { week: 'Sem 6', volume: 5300 },
    ] as WeeklyVolumeData[],
    personalRecords: [
        { exercise: 'Peso Muerto', weight: 140, date: '2024-05-20' },
        { exercise: 'Press de Banca', weight: 95, date: '2024-05-18' },
        { exercise: 'Sentadilla', weight: 120, date: '2024-05-15' },
    ] as PersonalRecord[],
    achievements: [
        { id: 'first_workout', name: 'Rompiendo el Hielo', description: 'Completa tu primer entrenamiento.', icon: '🎉', unlocked: true },
        { id: 'streak_5', name: 'Imparable', description: 'Completa 5 días de entrenamiento en una semana.', icon: '🔥', unlocked: true },
        { id: 'one_month', name: 'Constancia de Acero', description: 'Entrena durante un mes completo.', icon: '🗓️', unlocked: true },
        { id: 'first_pr', name: 'Superando Límites', description: 'Rompe tu primer récord personal.', icon: '🚀', unlocked: true },
        { id: '10k_volume', name: 'Levantador Novato', description: 'Levanta 10,000 kg en total.', icon: '💪', unlocked: false },
        { id: '50_workouts', name: 'Maratonista de Hierro', description: 'Completa 50 entrenamientos.', icon: '🏅', unlocked: false },
        { id: '100k_volume', name: 'Titán de Hierro', description: 'Levanta 100,000 kg en total.', icon: '🌋', unlocked: false },
        { id: 'three_months', name: 'Consistencia de Élite', description: 'Entrena de forma consistente por 3 meses.', icon: '💎', unlocked: false },
    ] as Achievement[],
    muscleFocus: [
        { name: 'Pecho', value: 25 },
        { name: 'Espalda', value: 20 },
        { name: 'Piernas', value: 30 },
        { name: 'Hombros', value: 15 },
        { name: 'Brazos', value: 10 },
    ],
    weeklyComparison: [
        { label: 'Sesiones Completadas', current: 4, previous: 3, unit: '' },
        { label: 'Volumen Total', current: 12500, previous: 11200, unit: 'kg' },
        { label: 'Calorías Quemadas', current: 2150, previous: 1800, unit: 'kcal' },
        { label: 'Tiempo Activo', current: 180, previous: 150, unit: 'min' }
    ] as WeeklyComparisonItem[]
};
