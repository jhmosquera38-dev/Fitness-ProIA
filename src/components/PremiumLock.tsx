
import React from 'react';

// ============================================================================
// BLOQUEO PREMIUM (PremiumLock.tsx)
// ============================================================================
// Componente que muestra una pantalla de bloqueo para funcionalidades exclusivas
// de usuarios Premium. Invita al usuario a actualizar su plan.
// ============================================================================

interface PremiumLockProps {
    featureName: string; // Nombre de la funcionalidad bloqueada
}

export const PremiumLock: React.FC<PremiumLockProps> = ({ featureName }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 m-4">
            <div className="bg-amber-100 dark:bg-amber-900/30 p-4 rounded-full mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                {featureName} es una función Premium
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-md mb-8">
                Esta funcionalidad está reservada para usuarios del plan Premium. Desbloquea todo el potencial de FitnessFlow hoy mismo.
            </p>
            <button
                onClick={() => alert("¡Redirigiendo a la pasarela de pagos para actualizar tu plan!")}
                className="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
                <span>Actualizar a Premium</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
    );
};
