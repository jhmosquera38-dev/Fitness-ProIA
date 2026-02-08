
// ============================================================================
// GESTIÓN FINANCIERA (FinanceManagement.tsx)
// ============================================================================
// Módulo de contabilidad y finanzas para el gimnasio.
// 
// Características:
// 1. Registro de Movimientos: Ingresos, Gastos, Comisiones y Fianzas.
// 2. Dashboards Financieros: Tarjetas de KPI y Gráficos de proyección.
// 3. Filtrado Interactivo: Visualización por tipo de transacción (Libro Mayor).
// 4. Gestión de Comisiones: Rastreo de pagos a entrenadores y terceros.
// 5. Gestión de Fianzas: Monitorización de depósitos de garantía activos.
// ============================================================================

import React, { useState, useMemo, useEffect } from 'react';
import { gymService } from '../services/gymService';
import { AddTransactionModal } from '../components/AddTransactionModal';

interface Transaction {
    id: number;
    date: string;
    description: string;
    type: 'Ingreso' | 'Gasto' | 'Comisión' | 'Fianza';
    amount: number;
    category: string;
}

// Componente para mostrar KPIs financieros destacados
const KpiCard: React.FC<{ label: string; value: string; color: string; icon?: string }> = ({ label, value, color, icon }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 relative overflow-hidden">
        {icon && <div className="absolute right-4 top-4 opacity-10 text-4xl">{icon}</div>}
        <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase">{label}</p>
        <p className={`text-3xl font-black mt-1 ${color}`}>{value}</p>
    </div>
);

// Códigos de color para los tipos de transacción
const transactionTypeColors: { [key: string]: string } = {
    'Ingreso': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    'Gasto': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    'Comisión': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    'Fianza': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
};

export const FinanceManagement: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState<'Todos' | 'Ingreso' | 'Gasto' | 'Comisión' | 'Fianza'>('Todos');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = async () => {
        try {
            const data = await gymService.fetchTransactions();
            setTransactions(data);
        } catch (error) {
            console.error("Error loading transactions:", error);
        } finally {
            setLoading(false);
        }
    };

    // Cálculo de resumen financiero
    const financialSummary = useMemo(() => {
        const monthlyIncome = transactions
            .filter(tx => tx.type === 'Ingreso')
            .reduce((sum, tx) => sum + tx.amount, 0);

        const monthlyExpenses = transactions
            .filter(tx => tx.type === 'Gasto' || tx.type === 'Comisión')
            .reduce((sum, tx) => sum + tx.amount, 0);

        const pendingCommissions = transactions
            .filter(tx => tx.type === 'Comisión')
            .reduce((sum, tx) => sum + tx.amount, 0);

        const activeBails = transactions
            .filter(tx => tx.type === 'Fianza')
            .reduce((sum, tx) => sum + tx.amount, 0);

        // Generar datos vacíos para gráfica si no hay info, o agrupar por mes si hay
        // Por ahora, devolvemos un placeholder visual si está vacío
        const chartData = [
            { name: 'Actual', income: monthlyIncome, expenses: monthlyExpenses },
        ];

        return {
            monthlyIncome,
            monthlyExpenses,
            netProfit: monthlyIncome - monthlyExpenses,
            commissions: pendingCommissions,
            bails: activeBails,
            chartData
        };
    }, [transactions]);

    // Filtrado de la lista
    const filteredTransactions = useMemo(() => {
        if (filterType === 'Todos') return transactions;
        return transactions.filter(tx => tx.type === filterType);
    }, [transactions, filterType]);

    const handleAddTransaction = async (newTransactionData: any) => {
        try {
            await gymService.addTransaction(newTransactionData);
            loadTransactions();
            setIsAddModalOpen(false);
        } catch (error) {
            console.error("Error adding transaction:", error);
            alert("Error al registrar la transacción");
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-slate-200 dark:border-slate-700 pb-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Gestión Financiera</h1>
                    <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">Control total de ingresos, pagos a entrenadores y fianzas.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-brand-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-brand-secondary transition-colors flex items-center gap-2 self-start md:self-center shadow-lg shadow-brand-primary/20">
                    <span className="text-xl">+</span> Registrar Movimiento
                </button>
            </div>

            {/* Tarjetas KPI */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard
                    label="Ingresos Totales"
                    value={`$${(financialSummary.monthlyIncome / 1000000).toFixed(2)}M`}
                    color="text-green-600 dark:text-green-400"
                    icon="💰"
                />
                <KpiCard
                    label="Gastos Operativos"
                    value={`$${(financialSummary.monthlyExpenses / 1000000).toFixed(2)}M`}
                    color="text-red-600 dark:text-red-400"
                    icon="📉"
                />
                <KpiCard
                    label="Pagos a Entrenadores"
                    value={`$${(financialSummary.commissions).toLocaleString()}`}
                    color="text-purple-600 dark:text-purple-400"
                    icon="🤝"
                />
                <KpiCard
                    label="Fianzas Activas"
                    value={`$${(financialSummary.bails).toLocaleString()}`}
                    color="text-yellow-600 dark:text-yellow-400"
                    icon="🛡️"
                />
            </div>

            {/* Historial de Transacciones */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700">
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Libro de Movimientos</h2>
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                        {['Todos', 'Ingreso', 'Gasto', 'Comisión', 'Fianza'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setFilterType(type as any)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filterType === type
                                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                                    : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                            <tr>
                                <th className="p-4 font-semibold rounded-l-lg">Fecha</th>
                                <th className="p-4 font-semibold">Descripción</th>
                                <th className="p-4 font-semibold">Categoría</th>
                                <th className="p-4 font-semibold text-center">Tipo</th>
                                <th className="p-4 font-semibold text-right rounded-r-lg">Monto</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {loading ? (
                                <tr><td colSpan={5} className="p-8 text-center text-slate-500">Cargando movimientos...</td></tr>
                            ) : filteredTransactions.length === 0 ? (
                                <tr><td colSpan={5} className="p-8 text-center text-slate-500">No hay movimientos registrados.</td></tr>
                            ) : (
                                filteredTransactions.map(tx => (
                                    <tr key={tx.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                        <td className="p-4 font-mono text-slate-500 dark:text-slate-400">{tx.date}</td>
                                        <td className="p-4 font-medium text-slate-800 dark:text-white">{tx.description}</td>
                                        <td className="p-4 text-slate-600 dark:text-slate-300">{tx.category}</td>
                                        <td className="p-4 text-center">
                                            <span className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full ${transactionTypeColors[tx.type] || 'bg-slate-100 text-slate-600'}`}>
                                                {tx.type}
                                            </span>
                                        </td>
                                        <td className={`p-4 text-right font-bold ${tx.type === 'Ingreso' ? 'text-green-600 dark:text-green-400' :
                                            tx.type === 'Gasto' ? 'text-red-500 dark:text-red-400' :
                                                'text-slate-800 dark:text-white'
                                            }`}>
                                            {tx.type === 'Ingreso' ? '+' : '-'} ${tx.amount.toLocaleString('es-CO')}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Área de Proyección Financiera (Placeholder por ahora) */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Proyección Financiera</h2>
                <div className="h-80 w-full flex items-center justify-center text-slate-400">
                    <p>Registra datos para ver proyecciones.</p>
                </div>
            </div>

            {isAddModalOpen && (
                <AddTransactionModal
                    onClose={() => setIsAddModalOpen(false)}
                    onAdd={handleAddTransaction}
                />
            )}
        </div>
    );
};
