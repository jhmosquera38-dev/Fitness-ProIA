import React from 'react';
import { DailyCheckin } from '../types';

interface WellnessTrendsWidgetProps {
    history: DailyCheckin[];
}

export const WellnessTrendsWidget: React.FC<WellnessTrendsWidgetProps> = ({ history }) => {
    // Escalas de mapeo para convertir strings a números para el gráfico
    const sleepMap = { 'poor': 1, 'average': 2, 'good': 3, 'excellent': 4 };
    const sorenessMap = { 'none': 4, 'low': 3, 'medium': 2, 'high': 1 }; // Invertido: 4 es mejor (menos dolor)

    // Preparar datos para los últimos 7 días (si hay menos, rellenar con 0 o padding)
    const last7Days = [...history].reverse().slice(-7);

    return (
        <div className="glass-panel p-6 rounded-2xl border border-white/5 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="text-brand-secondary">📈</span> Tendencias de Bienestar
                </h2>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white/5 px-2 py-1 rounded">Últimos 7 días</span>
            </div>

            <div className="space-y-6 flex-grow">
                {/* Métricas de Energía */}
                <div className="space-y-2">
                    <div className="flex justify-between items-end">
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Nivel de Energía</span>
                        <span className="text-xs text-brand-primary">{last7Days[last7Days.length - 1]?.energyLevel || 0}/10 hoy</span>
                    </div>
                    <div className="flex items-end gap-1 h-12">
                        {last7Days.map((d, i) => (
                            <div
                                key={i}
                                className="flex-1 bg-brand-primary/20 hover:bg-brand-primary/40 rounded-t-sm transition-all group relative"
                                style={{ height: `${(d.energyLevel / 10) * 100}%` }}
                            >
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-800 text-[10px] text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                    Energía: {d.energyLevel}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Métricas de Sueño */}
                <div className="space-y-2">
                    <div className="flex justify-between items-end">
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Calidad de Sueño</span>
                        <span className="text-xs text-brand-secondary">{last7Days[last7Days.length - 1]?.sleepQuality || '-'}</span>
                    </div>
                    <div className="flex items-end gap-1 h-12">
                        {last7Days.map((d, i) => (
                            <div
                                key={i}
                                className="flex-1 bg-brand-secondary/20 hover:bg-brand-secondary/40 rounded-t-sm transition-all group relative"
                                style={{ height: `${(sleepMap[d.sleepQuality] / 4) * 100}%` }}
                            >
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-800 text-[10px] text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                    Sueño: {d.sleepQuality}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Métricas de Soreness (Recuperación) */}
                <div className="space-y-2">
                    <div className="flex justify-between items-end">
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Recuperación (Dolor)</span>
                        <span className="text-xs text-yellow-500">{last7Days[last7Days.length - 1]?.soreness || '-'}</span>
                    </div>
                    <div className="flex items-end gap-1 h-12">
                        {last7Days.map((d, i) => (
                            <div
                                key={i}
                                className="flex-1 bg-yellow-500/20 hover:bg-yellow-500/40 rounded-t-sm transition-all group relative"
                                style={{ height: `${(sorenessMap[d.soreness] / 4) * 100}%` }}
                            >
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-800 text-[10px] text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                    Dolor: {d.soreness}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {history.length === 0 && (
                <div className="mt-4 p-4 bg-white/5 rounded-xl border border-dashed border-white/10 text-center">
                    <p className="text-xs text-slate-500 italic">No hay suficientes datos. Completa tu check-in diario para ver tendencias.</p>
                </div>
            )}
        </div>
    );
};
