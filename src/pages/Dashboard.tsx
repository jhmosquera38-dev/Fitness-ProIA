// ============================================================================
// DASHBOARD DE USUARIO (Dashboard.tsx)
// ============================================================================
// Este es el panel principal para el usuario final (el deportista).
// Arquitectura de Diseño: Utiliza un "Bento Grid" (rejilla modular) para organizar 
// widgets de diferentes tamaños de forma visualmente atractiva.
// 
// Integraciones Clave:
// 1. AI Guide Widget: Muestra insights generados por Gemini.
// 2. Gamificación: Muestra nivel, XP y retos activos.
// 3. Recomendaciones Inteligentes: Sugiere actividades basadas en el estado del usuario.
// ============================================================================

import React, { useState, useEffect } from 'react';
import { User, DailyCheckin, AIInsight } from '../types';
import { userService } from '../services/userService';
import { gymService } from '../services/gymService'; // Import Service
import { ChecklistWidget } from '../components/ChecklistWidget';
import { DailyCheckinModal } from '../components/DailyCheckinModal';
import { SmartRecommendations } from '../components/SmartRecommendations';
import { AIGuideWidget } from '../components/AIGuideWidget';
import { GamificationWidget } from '../components/GamificationWidget';
import { SocialFeed } from '../components/SocialFeed';
import { LeaderboardWidget } from '../components/LeaderboardWidget';
import { generateContextualInsight } from '../services/geminiService';
import { ACTIVE_CHALLENGES } from '../data/gamification';

import { useFeedback } from '../components/FeedbackSystem';

// Tarjeta de estadística pequeña y reutilizable con efecto "glass"
// const StatCard: React.FC<{ label: string; value: string | number; trend?: string; icon: string; delay: string }> = ({ label, value, trend, icon, delay }) => (
//     <div className={`glass-panel p-5 rounded-2xl flex flex-col justify-between h-full relative overflow-hidden group hover:bg-white/5 transition-colors duration-300 animate-fade-in ${delay}`}>
//         <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-6xl select-none grayscale">
//             {icon}
//         </div>
//         <div className="flex justify-between items-start z-10">
//             <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{label}</p>
//             {trend && <span className="bg-green-500/20 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-500/30">{trend}</span>}
//         </div>
//         <div className="z-10 mt-4">
//             <p className="text-3xl font-black text-white tracking-tight group-hover:scale-105 transition-transform duration-300 origin-left">{value}</p>
//         </div>
//     </div>
// );

interface DashboardProps {
    user: User;
    onNavigate: (page: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
    // --- ESTADO LOCAL ---
    const [showCheckin, setShowCheckin] = useState(false); // ¿Mostrar modal de check-in diario?
    const [dailyStatus, setDailyStatus] = useState<DailyCheckin | null>(null); // Datos del check-in de hoy
    const [aiInsight, setAiInsight] = useState<AIInsight | null>(null); // Recomendación de la IA
    // const [userStats, setUserStats] = useState({ totalWorkouts: 0, timeInvestedMinutes: 0, caloriesBurned: 0 });
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [socialFeed, setSocialFeed] = useState<any[]>([]);
    const [challenges, setChallenges] = useState<any[]>([]); // New state for real challenges
    // const [streak, setStreak] = useState(0);

    const [isLoading, setIsLoading] = useState(true);
    const [isSavingCheckin, setIsSavingCheckin] = useState(false);
    const { showToast } = useFeedback();

    // Efecto de carga inicial: Verifica si ya hizo check-in hoy
    useEffect(() => {
        const loadDashboardData = async () => {
            setIsLoading(true);
            try {
                // 1. Check DB for today's checkin
                const checkin = await userService.fetchTodayCheckin();

                // 2. Load Stats & Social & Challenges
                const [, ranking, feed, activeChallenges] = await Promise.all([
                    userService.fetchUserStats(),
                    userService.fetchLeaderboard(),
                    userService.fetchSocialFeed(),
                    gymService.fetchActiveChallenges(),
                    userService.fetchCheckinHistory(7)
                ]);

                // setUserStats(stats);
                setLeaderboard(ranking);
                setSocialFeed(feed);
                setChallenges(activeChallenges);

                // Simple streak calc
                // setStreak(history.length); // Simplification: just count of recent checkins

                const insightKey = `insight_${new Date().toDateString()}_${user.email}`;
                const savedInsight = localStorage.getItem(insightKey);

                if (!checkin) {
                    setShowCheckin(true);
                } else {
                    setDailyStatus(checkin);

                    if (savedInsight) {
                        setAiInsight(JSON.parse(savedInsight));
                    } else {
                        fetchInsight(checkin);
                    }
                }
            } catch (error) {
                console.error("Error loading dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadDashboardData();
    }, [user.email]);

    const handleCheckinComplete = async (data: Omit<DailyCheckin, 'date'>) => {
        setIsSavingCheckin(true);
        try {
            await userService.logDailyCheckin(data);
            const fullData: DailyCheckin = {
                ...data,
                date: new Date().toISOString().split('T')[0]
            };
            setDailyStatus(fullData);
            setShowCheckin(false);
            showToast('¡Check-in diario completado!', 'success');
            await fetchInsight(fullData);

            // Refresh stats to likely update streak
            await userService.fetchCheckinHistory(7);
            // setStreak(history.length);
        } catch (error) {
            console.error("Error saving checkin:", error);
            showToast('Error al guardar tu check-in. Intenta de nuevo.', 'error');
        } finally {
            setIsSavingCheckin(false);
        }
    };

    // Llama al servicio de IA (Gemini) para obtener un consejo basado en el estado
    const fetchInsight = async (status: DailyCheckin) => {
        try {
            const insight = await generateContextualInsight(status, user.name.split(' ')[0]);
            setAiInsight(insight);
            localStorage.setItem(`insight_${new Date().toDateString()}_${user.email}`, JSON.stringify(insight));
        } catch (error) {
            console.error("Failed to fetch insight");
        }
    };

    const handleAIAction = () => {
        if (!aiInsight) return;
        switch (aiInsight.type) {
            case 'recovery': onNavigate('Clases Grupales'); break;
            case 'performance': onNavigate('Mis Rutinas'); break;
            case 'caution': onNavigate('Bienestar AI'); break;
            default: onNavigate('Mis Rutinas');
        }
    };

    const handleComment = async (activityId: string, content: string) => {
        try {
            await userService.postComment(activityId, content);
            showToast('Comentario enviado', 'success');
        } catch (error) {
            console.error(error);
            showToast('Error al enviar comentario', 'error');
        }
    };

    const checklistItems = [
        { id: '1', label: 'Completa tu perfil físico', isCompleted: true },
        { id: '2', label: 'Genera tu rutina con IA', isCompleted: false, actionLabel: 'Ir a Rutinas' },
        { id: '3', label: 'Reserva una clase', isCompleted: false, actionLabel: 'Ver Clases' },
    ];

    const handleChecklistAction = (item: any) => {
        if (item.actionLabel === 'Ir a Rutinas') onNavigate('Mis Rutinas');
        if (item.actionLabel === 'Ver Clases') onNavigate('Clases Grupales');
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div></div>;
    }

    return (
        <div className="container mx-auto px-4 py-6 md:py-8 space-y-6 animate-fade-in max-w-7xl">
            {/* ... Header ... */}
            <div className="flex flex-col md:flex-row justify-between items-end pb-2">
                <div>
                    <p className="text-brand-primary text-sm font-mono mb-1">{new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                    <h1 className="text-4xl font-black text-white tracking-tight">
                        Hola, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">{user.name.split(' ')[0]}</span>
                    </h1>
                </div>
                <div className="hidden md:flex items-center gap-3 glass-panel px-4 py-2 rounded-full mt-4 md:mt-0">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <p className="text-sm font-bold text-slate-300">Nivel {user.gamification?.level || 5}: <span className="text-white">{user.gamification?.title || 'Élite'}</span></p>
                </div>
            </div>

            {/* BENTO GRID LAYOUT */}
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[minmax(180px,auto)]">

                {/* 1. AI Hero Widget */}
                <div className="md:col-span-4 lg:col-span-3 row-span-1 min-h-[220px]">
                    {aiInsight ? (
                        <AIGuideWidget
                            insight={aiInsight}
                            userName={user.name.split(' ')[0]}
                            onAction={handleAIAction}
                        />
                    ) : (
                        <div className="glass-panel p-6 rounded-2xl h-full flex items-center justify-between border border-white/5 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 to-transparent opacity-50"></div>
                            <div className="relative z-10 flex flex-col gap-4 max-w-lg">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">👋 ¡Bienvenido de nuevo, {user.name.split(' ')[0]}!</h2>
                                    <p className="text-slate-300">Para generar tu plan de entrenamiento inteligente y recomendaciones, necesitamos saber cómo te sientes hoy.</p>
                                </div>
                                <button
                                    onClick={() => setShowCheckin(true)}
                                    className="w-fit px-6 py-3 bg-brand-primary hover:bg-brand-secondary text-white font-bold rounded-xl transition-all shadow-lg shadow-brand-primary/20 flex items-center gap-2"
                                >
                                    <span>⚡</span> Iniciar Check-in Diario
                                </button>
                            </div>
                            <div className="hidden md:block text-8xl opacity-20 grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-12">
                                🤖
                            </div>
                        </div>
                    )}
                </div>

                {/* 2. Gamification Widget */}
                <div className="md:col-span-2 lg:col-span-1 lg:row-span-2 h-full">
                    <GamificationWidget user={user} challenges={challenges.length > 0 ? challenges : ACTIVE_CHALLENGES} />
                </div>

                {/* 3. Tarjetas de Estadísticas Reales */}
                {/* 3. Tarjetas de Estadísticas (Ocultas por solicitud de simplificación) */}
                {/* 
                <div className="md:col-span-2 lg:col-span-1">
                    <StatCard label="Entrenamientos" value={userStats.totalWorkouts.toString()} trend="Global" icon="🏋️" delay="delay-[100ms]" />
                </div>
                <div className="md:col-span-2 lg:col-span-1">
                    <StatCard label="Calorías" value={userStats.caloriesBurned.toLocaleString()} trend="Quemadas" icon="🔥" delay="delay-[200ms]" />
                </div> 
                <div className="md:col-span-2 lg:col-span-1">
                    <StatCard label="Racha" value={`${streak} Días`} trend="Activa" icon="⚡" delay="delay-[300ms]" />
                </div>
                */}

                {/* Botón de Acción Rápida: Explorar Gyms */}
                <div className="md:col-span-2 lg:col-span-1">
                    <div
                        onClick={() => onNavigate('Explorar Gimnasios')}
                        className="glass-panel p-5 rounded-2xl flex flex-col justify-between h-full relative cursor-pointer hover:border-brand-primary/50 transition-all group overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10 flex flex-col items-center justify-center h-full gap-2">
                            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-brand-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </div>
                            <h3 className="font-bold text-white">Explorar Gyms</h3>
                        </div>
                    </div>
                </div>

                {/* 4. Recomendaciones Inteligentes (Top Entrenadores, Clases) */}
                {dailyStatus && (
                    <div className="md:col-span-4 lg:col-span-3">
                        <div className="glass-panel p-6 rounded-2xl border border-slate-700/50 h-full">
                            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <span className="text-brand-primary">✦</span> Recomendado para Hoy
                            </h2>
                            <SmartRecommendations status={dailyStatus} onNavigate={onNavigate} />
                        </div>
                    </div>
                )}

                {/* 5. Lista de Tareas (Onboarding) */}
                <div className="md:col-span-2 lg:col-span-2">
                    <ChecklistWidget
                        title="Tu Camino"
                        items={checklistItems}
                        onAction={handleChecklistAction}
                    />
                </div>

                {/* 6. Botones de Acción Secundarios */}
                <div className="md:col-span-2 lg:col-span-2 grid grid-cols-2 gap-4">
                    <div
                        onClick={() => onNavigate('Explorar Gimnasios')}
                        className="glass-panel p-4 rounded-2xl cursor-pointer hover:border-brand-primary/50 transition-all group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10">
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mb-2 text-brand-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </div>
                            <h3 className="font-bold text-white">Explorar</h3>
                            <p className="text-xs text-slate-400">Gimnasios cerca</p>
                        </div>
                    </div>
                    <div
                        onClick={() => onNavigate('Bienestar AI')}
                        className="glass-panel p-4 rounded-2xl cursor-pointer hover:border-brand-secondary/50 transition-all group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10">
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mb-2 text-brand-secondary">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                            </div>
                            <h3 className="font-bold text-white">Coach AI</h3>
                            <p className="text-xs text-slate-400">Consulta 24/7</p>
                        </div>
                    </div>
                </div>

                {/* 7. Social & Leaderboard (Full Width Bottom) - Datos Reales */}
                <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <LeaderboardWidget data={leaderboard} currentUserId={user.name} />
                    <SocialFeed activities={socialFeed} onComment={handleComment} />
                </div>

            </div>

            {/* Modal de Check-in Diario (Popup) */}
            {showCheckin && (
                <DailyCheckinModal
                    userName={user.name.split(' ')[0]}
                    onComplete={handleCheckinComplete}
                    isSubmitting={isSavingCheckin}
                    onClose={() => setShowCheckin(false)}
                />
            )}
        </div>
    );
};