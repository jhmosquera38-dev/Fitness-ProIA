
import React from 'react';
import { WeeklyComparisonItem } from '../types';

// ============================================================================
// WIDGET DE COMPARACIÓN SEMANAL (WeeklyComparisonWidget.tsx)
// ============================================================================
// Muestra una comparación visual (barras de progreso) entre el rendimiento
// de la semana actual y la anterior para varias métricas.
// ============================================================================

interface WeeklyComparisonWidgetProps {
    data: WeeklyComparisonItem[];
}

export const WeeklyComparisonWidget: React.FC<WeeklyComparisonWidgetProps> = ({ data }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Rendimiento: Esta Semana vs. Anterior</h2>
            <div className="space-y-6">
                {data.map((item, index) => {
                    // Cálculo de diferencias y porcentajes
                    const diff = item.current - item.previous;
                    const percentChange = item.previous > 0 ? ((diff / item.previous) * 100).toFixed(1) : '0';
                    const isPositive = diff >= 0;
                    const maxVal = Math.max(item.current, item.previous) * 1.2; // Escalar barras (120% del máximo)

                    return (
                        <div key={index} className="flex flex-col gap-2">
                            {/* Encabezado de la métrica y badge de cambio porcentual */}
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-semibold text-slate-600">{item.label}</span>
                                <div className={`text-xs font-bold px-2 py-0.5 rounded-full ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {isPositive ? '↑' : '↓'} {Math.abs(Number(percentChange))}%
                                </div>
                            </div>

                            {/* Barra: Semana Anterior */}
                            <div className="flex items-center gap-4 text-xs font-medium">
                                <span className="w-16 text-slate-500">Anterior</span>
                                <div className="flex-grow h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-slate-300 rounded-full"
                                        style={{ width: `${(item.previous / maxVal) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="w-12 text-right text-slate-500">{item.previous} {item.unit}</span>
                            </div>

                            {/* Barra: Semana Actual */}
                            <div className="flex items-center gap-4 text-xs font-bold">
                                <span className="w-16 text-brand-primary-dark">Actual</span>
                                <div className="flex-grow h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-brand-primary rounded-full transition-all duration-1000 ease-out"
                                        style={{ width: `${(item.current / maxVal) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="w-12 text-right text-brand-primary-dark">{item.current} {item.unit}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
