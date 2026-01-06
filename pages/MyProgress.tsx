
import React from 'react';


import { MuscleGroupFocusChart } from '../components/charts/MuscleGroupFocusChart';
import { WeeklyComparisonWidget } from '../components/WeeklyComparisonWidget';
import { User } from '../types';
import { userService } from '../services/userService';

// ============================================================================
// MI PROGRESO (MyProgress.tsx)
// ============================================================================
// Dashboard principal de progreso para el usuario.
// Visualiza KPIs, gráficos de volumen semanal, récords personales,
// enfoque muscular y logros desbloqueados.
// ============================================================================

// Componente para tarjetas de KPI individuales
const KpiCard: React.FC<{ icon: string; value: string; label: string; }> = ({ icon, value, label }) => (
    <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-100 transition-transform hover:scale-105">
        <div className="flex items-center gap-4">
            <div className="text-3xl bg-slate-100 p-3 rounded-full">{icon}</div>
            <div>
                <p className="text-2xl font-bold text-slate-800">{value}</p>
                <p className="text-slate-500 text-sm">{label}</p>
            </div>
        </div>
    </div>
);

interface MyProgressProps {
    user: User;
}

export const MyProgress: React.FC<MyProgressProps> = () => {
    // Estado local
    const [personalRecords, setPersonalRecords] = React.useState<any[]>([]);
    const [achievements, setAchievements] = React.useState<{ unlocked: any[], locked: any[] }>({ unlocked: [], locked: [] });
    const [progressLogs, setProgressLogs] = React.useState<any[]>([]);
    const [userStats, setUserStats] = React.useState({ totalWorkouts: 0, timeInvestedMinutes: 0, caloriesBurned: 0 });
    const [isLoading, setIsLoading] = React.useState(true);

    // State for dynamic charts
    const [weeklyComparison, setWeeklyComparison] = React.useState<any[]>([]);
    const [muscleFocus, setMuscleFocus] = React.useState<any[]>([]);
    const [coachEvaluation, setCoachEvaluation] = React.useState<any>(null); // New state

    React.useEffect(() => {
        const loadStats = async () => {
            setIsLoading(true);
            try {
                const [prs, achs, logs, stats, weekly, focus, evalData] = await Promise.all([
                    userService.fetchPersonalRecords(),
                    userService.fetchAchievements(),
                    userService.fetchProgressLogs(),
                    userService.fetchUserStats(),
                    userService.fetchWeeklyStats(),
                    userService.fetchMuscleFocusStats(),
                    userService.fetchMyEvaluation()
                ]);
                setPersonalRecords(prs);
                setAchievements(achs);
                setProgressLogs(logs);
                setUserStats(stats);
                setWeeklyComparison(weekly);
                setMuscleFocus(focus);
                setCoachEvaluation(evalData);
            } catch (error) {
                console.error("Error loading progress:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadStats();
    }, []);

    const unlockedAchievements = achievements.unlocked;
    const lockedAchievements = achievements.locked;

    if (isLoading) {
        return <div className="p-12 text-center">Cargando progreso...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 space-y-8 animate-fade-in">
            {/* Encabezado */}
            <div className="mb-4">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">Mi Progreso</h1>
                <p className="mt-2 text-lg text-slate-600 max-w-2xl">Tu panel de control personal de rendimiento y logros.</p>
            </div>

            {/* Tarjetas de KPI (Key Performance Indicators) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard icon="🏋️" value={userStats.totalWorkouts.toString()} label="Entrenamientos Totales" />
                <KpiCard icon="🔥" value={`${userStats.caloriesBurned}`} label="Calorías Quemadas" />
                <KpiCard icon="⏱️" value={`${(userStats.timeInvestedMinutes / 60).toFixed(1)}h`} label="Tiempo Entrenado" />
                <KpiCard icon="🏆" value={personalRecords.length.toString()} label="Récords Personales Batidos" />
            </div>

            {/* Grid de Contenido Principal */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Columna Izquierda (Gráficos Principales) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Widget de Comparación Semanal */}
                    {Array.isArray(weeklyComparison) && weeklyComparison.length > 0 && <WeeklyComparisonWidget data={weeklyComparison} />}

                    {/* Gráfico de Progreso de Peso */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Progreso de Peso Corporal (kg)</h2>
                        <div className="h-64">
                            {/* Reusing Volume Chart component logic but feeding weight data if compatible, or valid text */}
                            {/* Since we don't have a specific WeightChart component yet, we can reuse WeeklyVolumeChart if it accepts similar data structure or create a simple display */}
                            {/* Better: Create a placeholder or simple list for now as 'WeeklyVolumeChart' expects strict 'week/volume' data. */}
                            {/* I will use a simple table or list for weight logs for now to ensure correctness */}
                            <div className="overflow-y-auto h-full">
                                <table className="w-full text-left">
                                    <thead className="text-sm text-slate-500 sticky top-0 bg-white">
                                        <tr>
                                            <th className="p-2 font-semibold">Fecha</th>
                                            <th className="p-2 font-semibold">Peso (kg)</th>
                                            <th className="p-2 font-semibold">Grasa (%)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {progressLogs.length === 0 ? (
                                            <tr><td colSpan={3} className="p-4 text-center text-slate-500">No hay registros de peso aún.</td></tr>
                                        ) : progressLogs.map((log, idx) => (
                                            <tr key={idx} className="border-t border-slate-200 hover:bg-slate-50">
                                                <td className="p-2 font-medium text-slate-700">{new Date(log.date).toLocaleDateString()}</td>
                                                <td className="p-2 font-bold text-brand-primary">{log.weight_kg} kg</td>
                                                <td className="p-2 text-slate-500">{log.body_fat_percentage ? `${log.body_fat_percentage}%` : '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Tabla de Récords Personales (PRs) */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Récords Personales (PRs)</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="text-sm text-slate-500">
                                    <tr>
                                        <th className="p-2 font-semibold">Ejercicio</th>
                                        <th className="p-2 font-semibold">Peso</th>
                                        <th className="p-2 font-semibold">Fecha</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {personalRecords.length === 0 ? (
                                        <tr><td colSpan={3} className="p-4 text-center text-slate-500">No hay récords registrados aún.</td></tr>
                                    ) : personalRecords.map((pr, idx) => (
                                        <tr key={idx} className="border-t border-slate-200">
                                            <td className="p-2 font-medium text-slate-700">{pr.exercise}</td>
                                            <td className="p-2 font-bold text-brand-primary">{pr.weight} kg</td>
                                            <td className="p-2 text-slate-500">{new Date(pr.date).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Columna Derecha (Logros, Enfoque y Feedback del Coach) */}
                <div className="space-y-8">
                    {/* Feedback del Entrenador (Nuevo) */}
                    {coachEvaluation && (
                        <div className="bg-gradient-to-br from-brand-primary to-brand-secondary p-6 rounded-xl shadow-lg shadow-brand-primary/20 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 text-9xl">📝</div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4 border-b border-white/20 pb-3">
                                    <span className="text-3xl">⭐</span>
                                    <div>
                                        <h2 className="text-xl font-bold">Feedback de tu Entrenador</h2>
                                        <p className="text-sm opacity-90">Evaluación reciente de progreso</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                        <span className="block text-xs font-bold uppercase opacity-70 mb-1">Calificación</span>
                                        <div className="flex text-yellow-300 gap-1 text-lg">
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <span key={i}>{i <= (coachEvaluation.rating || 0) ? '★' : '☆'}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                        <span className="block text-xs font-bold uppercase opacity-70 mb-1">Estado</span>
                                        <span className="font-bold text-lg">{coachEvaluation.general_valuation || 'En Progreso'}</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {coachEvaluation.feedback && (
                                        <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                            <span className="block text-xs font-bold uppercase opacity-70 mb-1">Feedback Técnico</span>
                                            <p className="text-sm leading-relaxed">{coachEvaluation.feedback}</p>
                                        </div>
                                    )}
                                    {coachEvaluation.recommendations && (
                                        <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm border-l-4 border-yellow-400">
                                            <span className="block text-xs font-bold uppercase opacity-70 mb-1">Recomendación Clave</span>
                                            <p className="text-sm font-medium">{coachEvaluation.recommendations}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Logros Desbloqueados */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Logros Desbloqueados</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {unlockedAchievements.length === 0 ? (
                                <p className="col-span-2 text-center text-slate-500 text-sm">Aún no has desbloqueado logros.</p>
                            ) : unlockedAchievements.map((ach: any) => (
                                <div key={ach.id} className="text-center p-4 rounded-lg bg-green-50 border border-green-200 transition-transform hover:scale-105">
                                    <div className="text-4xl">{ach.icon}</div>
                                    <h4 className="font-semibold text-slate-800 mt-2 text-sm">{ach.name}</h4>
                                    <p className="text-xs text-slate-500">{ach.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Próximos Logros (Bloqueados) */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Próximos Logros</h2>
                        <ul className="space-y-3">
                            {lockedAchievements.length === 0 ? (
                                <p className="text-center text-slate-500 text-sm">¡Has completado todos los logros!</p>
                            ) : lockedAchievements.slice(0, 5).map((ach: any) => (
                                <li key={ach.id} className="flex items-center gap-4 opacity-70">
                                    <div className="text-3xl bg-slate-200 p-2 rounded-full grayscale">{ach.icon}</div>
                                    <div>
                                        <h4 className="font-semibold text-slate-600">{ach.name}</h4>
                                        <p className="text-sm text-slate-500">{ach.description}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Gráfico de Enfoque Muscular (Donut) */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
                        <div className="flex items-center gap-2 mb-4">
                            <h2 className="text-xl font-bold text-slate-800">Enfoque Muscular</h2>
                        </div>
                        <div className="h-64">
                            <MuscleGroupFocusChart data={muscleFocus} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
