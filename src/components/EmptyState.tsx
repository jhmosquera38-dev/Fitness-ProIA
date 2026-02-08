
import React from 'react';

// ============================================================================
// ESTADO VACÍO (EmptyState.tsx)
// ============================================================================
// Componente reutilizable para mostrar cuando no hay datos disponibles.
// Muestra un icono, título, descripción y opcionalmente un botón de acción.
// ============================================================================

interface EmptyStateProps {
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    icon?: React.ReactNode;
}

const DefaultIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
    </svg>
);

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, actionLabel, onAction, icon }) => {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 animate-fade-in">
            <div className="mb-4">
                {icon || <DefaultIcon />}
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
            <p className="text-slate-500 max-w-md mb-6">{description}</p>
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="bg-brand-primary text-white font-semibold py-2 px-6 rounded-lg hover:bg-brand-secondary transition-transform duration-200 transform hover:scale-105 shadow-md"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
};
