import React, { useState } from 'react';

// ============================================================================
// ENCABEZADO DE LANDING PAGE (LandingHeader.tsx)
// ============================================================================
// Barra de navegación principal para visitantes no autenticados.
// Facilita la navegación a las secciones clave y el acceso a Login/Registro.
// ============================================================================

const HamburgerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const navLinks = [
    { name: 'Características', targetId: 'features' },
    { name: 'Planes', targetId: 'plans' },
    { name: 'Nosotros', targetId: 'nosotros' },
];

interface LandingHeaderProps {
    onNavigateToRegister: () => void;
    onNavigateToLogin: () => void;
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({ onNavigateToRegister, onNavigateToLogin }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Desplazamiento suave a las secciones de la página
    const handleScroll = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        setIsMobileMenuOpen(false);
    };

    const handleMobileAuthClick = (callback: () => void) => {
        callback();
        setIsMobileMenuOpen(false);
    }

    return (
        <header className="bg-white/80 backdrop-blur-lg shadow-sm w-full sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <h1 className="text-2xl font-bold text-slate-900">
                            Fitness<span className="text-brand-primary">Flow</span>
                        </h1>
                    </div>

                    {/* Navegación Desktop */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navLinks.map(link => (
                            <button key={link.name} onClick={() => handleScroll(link.targetId)} className="text-slate-600 hover:text-brand-primary font-medium transition-colors">
                                {link.name}
                            </button>
                        ))}
                    </nav>

                    {/* Botones de Autenticación y Menú Móvil */}
                    <div className="flex items-center gap-2">
                        <div className="hidden md:flex items-center gap-2">
                            <button onClick={onNavigateToLogin} className="text-slate-600 hover:text-brand-primary font-medium px-4 py-2 rounded-lg transition-colors">Iniciar Sesión</button>
                            <button onClick={onNavigateToRegister} className="bg-brand-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-brand-secondary transition-colors">Registrarse</button>
                        </div>
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-primary"
                                aria-controls="mobile-menu"
                                aria-expanded={isMobileMenuOpen}
                            >
                                <span className="sr-only">Abrir menú principal</span>
                                {isMobileMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Menú Móvil */}
            {isMobileMenuOpen && (
                <div className="md:hidden animate-fade-in" id="mobile-menu">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map(link => (
                            <button key={link.name} onClick={() => handleScroll(link.targetId)} className="text-slate-600 hover:bg-slate-100 hover:text-brand-primary block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors">
                                {link.name}
                            </button>
                        ))}
                    </div>
                    <div className="pt-4 pb-3 border-t border-slate-200">
                        <div className="px-2 space-y-2">
                            <button onClick={() => handleMobileAuthClick(onNavigateToLogin)} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-slate-100 hover:text-brand-primary">Iniciar Sesión</button>
                            <button onClick={() => handleMobileAuthClick(onNavigateToRegister)} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium bg-brand-primary text-white hover:bg-brand-secondary">Registrarse</button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};