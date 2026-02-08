import React, { createContext, useContext, useState, ReactNode } from 'react';

// ============================================================================
// SISTEMA DE RETROALIMENTACIÓN (FeedbackSystem.tsx)
// ============================================================================
// Este componente gestiona las notificaciones tipo "Toast" para dar feedback
// visual al usuario sobre sus acciones (éxito, error, info, advertencia).
// ============================================================================

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

// Definición del contexto para exponer la función showToast
interface FeedbackContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

// Hook personalizado para usar el sistema de feedback fácilmente en cualquier componente
export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
};

// Proveedor del contexto que debe envolver la aplicación
export const FeedbackProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Función para mostrar una nueva notificación
  const showToast = React.useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);

    // Auto eliminar después de 3 segundos
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  return (
    <FeedbackContext.Provider value={{ showToast }}>
      {children}
      {/* Contenedor fijo para las notificaciones en la esquina inferior derecha */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`
              pointer-events-auto transform transition-all duration-300 ease-in-out animate-slide-up
              min-w-[300px] p-4 rounded-xl shadow-2xl border backdrop-blur-md
              flex items-center gap-3
              ${toast.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-100' : ''}
              ${toast.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-100' : ''}
              ${toast.type === 'info' ? 'bg-blue-500/10 border-blue-500/20 text-blue-100' : ''}
              ${toast.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-100' : ''}
            `}
          >
            <span className="text-2xl">
              {toast.type === 'success' && '✅'}
              {toast.type === 'error' && '❌'}
              {toast.type === 'info' && 'ℹ️'}
              {toast.type === 'warning' && '⚠️'}
            </span>
            <div>
              <p className="font-bold text-sm capitalize">{toast.type}</p>
              <p className="text-xs opacity-90">{toast.message}</p>
            </div>
          </div>
        ))}
      </div>
    </FeedbackContext.Provider>
  );
};