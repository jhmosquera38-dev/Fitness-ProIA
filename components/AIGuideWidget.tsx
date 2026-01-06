
import React from 'react';
import { AIInsight } from '../types';

// ============================================================================
// WIDGET GUÍA IA (AIGuideWidget.tsx)
// ============================================================================
// Muestra una tarjeta destacada con sugerencias proactivas de la IA (Insights).
// El diseño y color cambian dinámicamente según el tipo de insight (Recuperación, Precaución, Rendimiento, Motivación).
// ============================================================================

interface AIGuideWidgetProps {
    insight: AIInsight;
    userName: string;
    onAction: () => void; // Callback para la acción principal del widget
}

// Determina los estilos (colores e iconos) basados en el tipo de insight
const getInsightStyles = (type: AIInsight['type']) => {
    switch (type) {
        case 'recovery':
            return {
                bg: 'bg-gradient-to-r from-blue-600 to-indigo-700',
                icon: '🧘‍♂️',
                accent: 'bg-blue-500',
                text: 'text-blue-100'
            };
        case 'caution':
            return {
                bg: 'bg-gradient-to-r from-amber-500 to-orange-600',
                icon: '⚠️',
                accent: 'bg-amber-400',
                text: 'text-amber-100'
            };
        case 'performance':
            return {
                bg: 'bg-gradient-to-r from-green-500 to-emerald-700',
                icon: '⚡',
                accent: 'bg-green-400',
                text: 'text-green-100'
            };
        case 'motivation':
        default:
            return {
                bg: 'bg-gradient-to-r from-purple-600 to-pink-600',
                icon: '🔥',
                accent: 'bg-purple-500',
                text: 'text-purple-100'
            };
    }
};

export const AIGuideWidget: React.FC<AIGuideWidgetProps> = ({ insight, onAction }) => {
    const styles = getInsightStyles(insight.type);

    return (
        <div className={`rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden transition-all hover:shadow-2xl ${styles.bg} animate-fade-in`}>
            {/* Elementos Decorativos de fondo */}
            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-40 w-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            </div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-white opacity-10 blur-2xl"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                        <span className={`${styles.accent} text-white/90 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide backdrop-blur-sm border border-white/20 shadow-sm flex items-center gap-1`}>
                            <span className="animate-pulse text-xs">●</span> Guía Inteligente
                        </span>
                        {insight.suggestedActivity && (
                            <span className="bg-white/20 text-white text-xs font-bold px-2 py-1 rounded-md backdrop-blur-sm">
                                Sugerencia: {insight.suggestedActivity}
                            </span>
                        )}
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold mb-2 tracking-tight leading-tight">{insight.title}</h2>
                    <p className={`${styles.text} max-w-lg text-lg font-medium leading-relaxed`}>{insight.message}</p>
                </div>

                <div className="flex-shrink-0 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-inner flex flex-col items-center justify-center min-w-[120px]">
                    <span className="text-5xl mb-2 filter drop-shadow-md">{styles.icon}</span>
                    <button
                        onClick={onAction}
                        className="bg-white text-slate-900 font-bold py-2 px-4 rounded-lg hover:bg-slate-100 transition-colors text-sm w-full shadow-md whitespace-nowrap"
                    >
                        {insight.actionLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};
