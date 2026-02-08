
import React, { useState, useRef, useEffect } from 'react';
import { NavItem } from '../types';

// ============================================================================
// NAVEGACIÓN INFERIOR MÓVIL (MobileBottomNav.tsx)
// ============================================================================
// Barra de navegación optimizada para dispositivos móviles.
// Se muestra fija en la parte inferior y colapsa items extra en un menú "Más".
// ============================================================================

interface MobileBottomNavProps {
    navItems: NavItem[];
    activeItem: string;
    onNavigate: (itemName: string) => void;
}

const MoreIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
    </svg>
);

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ navItems, activeItem, onNavigate }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Cerrar menú al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node) &&
                buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Lógica: Mostrar máximo 5 items.
    // Si hay más de 5, mostrar 4 + botón "Más".
    const MAX_VISIBLE = 5;
    const shouldCollapse = navItems.length > MAX_VISIBLE;

    const visibleItems = shouldCollapse ? navItems.slice(0, 4) : navItems;
    const hiddenItems = shouldCollapse ? navItems.slice(4) : [];

    const handleNavigate = (name: string) => {
        onNavigate(name);
        setIsMenuOpen(false);
    }

    const isHiddenItemActive = hiddenItems.some(item => item.name === activeItem);

    return (
        <>
            {/* Menú de items ocultos & Fondo */}
            {isMenuOpen && (
                <>
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsMenuOpen(false)} />
                    <div
                        ref={menuRef}
                        className="md:hidden fixed bottom-24 right-4 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 animate-scale-in flex flex-col overflow-hidden origin-bottom-right"
                    >
                        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Más Módulos</p>
                            <button onClick={() => setIsMenuOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                        <div className="py-2 max-h-[60vh] overflow-y-auto">
                            {hiddenItems.map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => handleNavigate(item.name)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 border-l-4 ${activeItem === item.name
                                        ? 'border-brand-primary text-brand-primary bg-green-50 dark:bg-green-900/10 font-semibold'
                                        : 'border-transparent text-slate-600 dark:text-slate-300'
                                        }`}
                                >
                                    <div className={`w-5 h-5 ${activeItem === item.name ? 'text-brand-primary' : 'text-slate-400'}`}>{item.icon}</div>
                                    <span className="text-sm">{item.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {/* Barra Inferior */}
            <nav className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-sm bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl z-50 border border-slate-200 dark:border-slate-700 ring-1 ring-black/5">
                <div className="flex justify-around items-stretch h-16 px-1">
                    {visibleItems.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => handleNavigate(item.name)}
                            className={`flex-1 flex flex-col items-center justify-center transition-all duration-200 p-1 rounded-xl focus:outline-none active:scale-95 ${activeItem === item.name
                                ? 'text-brand-primary'
                                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                                }`}
                            aria-current={activeItem === item.name ? 'page' : undefined}
                            id={`mobile-item-${navItems.findIndex(n => n.name === item.name)}`}
                        >
                            <div className={`w-6 h-6 transition-transform duration-200 ${activeItem === item.name ? '-translate-y-1 scale-110' : ''}`}>{item.icon}</div>
                            <span className={`text-[10px] mt-1 truncate max-w-full px-1 ${activeItem === item.name ? 'font-bold opacity-100' : 'font-normal opacity-80'}`}>{item.name}</span>
                            {activeItem === item.name && <span className="w-1 h-1 bg-brand-primary rounded-full mt-1 absolute bottom-1.5"></span>}
                        </button>
                    ))}

                    {shouldCollapse && (
                        <button
                            ref={buttonRef}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`flex-1 flex flex-col items-center justify-center transition-all duration-200 p-1 rounded-xl focus:outline-none active:scale-95 ${isMenuOpen || isHiddenItemActive
                                ? 'text-brand-primary'
                                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                                }`}
                        >
                            <div className={`w-6 h-6 transition-transform duration-200 ${isMenuOpen ? '-translate-y-1 scale-110' : ''}`}><MoreIcon /></div>
                            <span className={`text-[10px] mt-1 ${isMenuOpen || isHiddenItemActive ? 'font-bold' : 'font-normal'}`}>Más</span>
                            {(isMenuOpen || isHiddenItemActive) && <span className="w-1 h-1 bg-brand-primary rounded-full mt-1 absolute bottom-1.5"></span>}
                        </button>
                    )}
                </div>
            </nav>
        </>
    );
};