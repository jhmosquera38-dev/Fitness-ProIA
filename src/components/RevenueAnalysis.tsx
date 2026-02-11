import React from 'react';
import { SimpleBarChart } from './charts/SimpleBarChart';

interface RevenueData {
    month: string;
    subscriptions: number;
    classes: number;
    inventory: number;
}

interface RevenueAnalysisProps {
    data: RevenueData[];
}

export const RevenueAnalysis: React.FC<RevenueAnalysisProps> = ({ data }) => {
    const totalRevenue = data.reduce((acc, curr) => acc + curr.subscriptions + curr.classes + curr.inventory, 0);
    const avgMonthly = totalRevenue / (data.length || 1);

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Análisis de Ingresos 360°</h2>
                    <p className="text-xs text-slate-500">Distribución mensual por canales de venta</p>
                </div>
                <div className="text-right">
                    <span className="text-2xl font-black text-brand-primary leading-none">${totalRevenue.toLocaleString()}</span>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Total Periodo</p>
                </div>
            </div>

            <div className="h-64 mb-8">
                {/* Reusing SimpleBarChart but with custom processing if needed */}
                <SimpleBarChart
                    data={data.map(d => ({
                        name: d.month,
                        income: (d.subscriptions + d.classes + d.inventory) / 1000,
                        expenses: ((d.subscriptions + d.classes + d.inventory) * 0.6) / 1000
                    }))}
                />
            </div>

            <div className="grid grid-cols-3 gap-4 border-t border-slate-100 dark:border-slate-700 pt-6">
                <div className="text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Pagos Recurrentes</p>
                    <p className="text-lg font-bold text-slate-800 dark:text-white">
                        {Math.round((data.reduce((acc, d) => acc + d.subscriptions, 0) / totalRevenue) * 100)}%
                    </p>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-1 rounded-full mt-2">
                        <div className="bg-brand-primary h-1 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                </div>
                <div className="text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Clases Extra</p>
                    <p className="text-lg font-bold text-slate-800 dark:text-white">
                        {Math.round((data.reduce((acc, d) => acc + d.classes, 0) / totalRevenue) * 100)}%
                    </p>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-1 rounded-full mt-2">
                        <div className="bg-brand-secondary h-1 rounded-full" style={{ width: '10%' }}></div>
                    </div>
                </div>
                <div className="text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Tienda/Café</p>
                    <p className="text-lg font-bold text-slate-800 dark:text-white">
                        {Math.round((data.reduce((acc, d) => acc + d.inventory, 0) / totalRevenue) * 100)}%
                    </p>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-1 rounded-full mt-2">
                        <div className="bg-green-500 h-1 rounded-full" style={{ width: '5%' }}></div>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <div className="flex items-center gap-2">
                    <span className="text-green-500 text-lg">📈</span>
                    <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">Promedio Mensual: <span className="font-bold">${avgMonthly.toLocaleString()}</span></span>
                </div>
                <button className="text-[10px] font-black text-brand-primary uppercase tracking-wider hover:underline">Ver Auditoría</button>
            </div>
        </div>
    );
};
