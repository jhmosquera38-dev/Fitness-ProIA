
import React, { useEffect, useState } from 'react';

// ============================================================================
// COMPONENTE DE INSTALACIÓN PWA (InstallPWA.tsx)
// ============================================================================
// Este componente escucha el evento 'beforeinstallprompt' del navegador
// y muestra un botón personalizado para instalar la aplicación.
// Incluye función de minimizar para no obstruir la interfaz.
// ============================================================================

export const InstallPWA: React.FC = () => {
    const [promptInstall, setPromptInstall] = useState<any>(null);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setPromptInstall(e);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
        }

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const onClick = (evt: React.MouseEvent) => {
        evt.preventDefault();
        if (promptInstall) {
            promptInstall.prompt();
            promptInstall.userChoice.then((choiceResult: any) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the PWA prompt');
                } else {
                    console.log('User dismissed the PWA prompt');
                }
                setPromptInstall(null);
            });
        } else {
            // Fallback for manual installation instructions
            alert("Para instalar la aplicación:\n\n1. En PC: Busca el icono (+) en la barra de direcciones.\n2. En Móvil (Chrome): Toca el menú (⋮) y selecciona 'Agregar a pantalla de inicio'.\n3. En iOS (Safari): Toca 'Compartir' y luego 'Agregar al inicio'.");
        }
    };

    if (isInstalled) return null; // Don't show if already installed

    // Estado minimizado: Mostrar solo un icono pequeño flotante
    if (isMinimized) {
        return (
            <div className="fixed bottom-4 right-4 z-50 animate-fade-in print:hidden">
                <button
                    onClick={() => setIsMinimized(false)}
                    className="bg-slate-800 text-brand-primary p-3 rounded-full shadow-lg border border-brand-primary/30 hover:scale-110 transition-transform"
                    title="Mostrar instalación de App"
                    aria-label="Mostrar instalación"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                </button>
            </div>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 animate-slide-up print:hidden flex flex-col items-end">
            {/* Botón de cerrar/minimizar */}
            <button
                onClick={(e) => { e.stopPropagation(); setIsMinimized(true); }}
                className="mb-2 bg-slate-800/80 text-white hover:text-brand-primary p-1.5 rounded-full backdrop-blur-sm transition-colors shadow-sm"
                title="Ocultar botón"
                aria-label="Ocultar"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>

            <button
                onClick={onClick}
                className={`flex items-center gap-2 px-4 py-3 rounded-full shadow-neon font-bold transition-all duration-300 transform hover:scale-105 ${promptInstall
                    ? 'bg-brand-primary text-brand-dark hover:bg-brand-secondary'
                    : 'bg-slate-700 text-slate-300 cursor-help'
                    }`}
                title={promptInstall ? "Instalar Aplicación" : "Instalar manualmente"}
                aria-label="Instalar aplicación"
            >
                <div className="bg-white/10 p-1 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                </div>
                <span className="hidden sm:inline text-sm">{promptInstall ? 'Instalar App' : 'Instalar (Ayuda)'}</span>
            </button>
        </div>
    );
};
