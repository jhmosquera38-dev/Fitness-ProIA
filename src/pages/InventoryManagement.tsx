import React, { useState } from 'react';
import { EquipmentInventory } from './inventory/EquipmentInventory';
import { ProductInventory } from './inventory/ProductInventory';

export const InventoryManagement: React.FC = () => {
    const [view, setView] = useState<'equipment' | 'products'>('equipment');

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Gestión de Inventario</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Administra tus equipos y productos comerciales desde un solo lugar.</p>
            </header>

            {/* Navigation Tabs */}
            <div className="flex gap-4 mb-8 border-b border-slate-200 dark:border-slate-700">
                <button
                    onClick={() => setView('equipment')}
                    className={`pb-3 px-2 text-sm font-medium transition-colors relative ${view === 'equipment'
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                >
                    MAQUINARIA Y EQUIPOS
                    {view === 'equipment' && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-t-full"></span>
                    )}
                </button>
                <button
                    onClick={() => setView('products')}
                    className={`pb-3 px-2 text-sm font-medium transition-colors relative ${view === 'products'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                >
                    PRODUCTOS Y TIENDA
                    {view === 'products' && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-t-full"></span>
                    )}
                </button>
            </div>

            {/* View Container */}
            <div className="animate-in fade-in duration-300">
                {view === 'equipment' ? <EquipmentInventory /> : <ProductInventory />}
            </div>
        </div>
    );
};