
import React from 'react';
import { NavItem } from '../types';
import { FitnessFlowLogo } from './FormIcons';

// ============================================================================
// BARRA LATERAL (Sidebar.tsx)
// ============================================================================
// Componente de navegación principal para vista de escritorio (Desktop).
// Muestra el logo, los items de menú y el botón de cerrar sesión.
// Se oculta automáticamente en dispositivos móviles.
// ============================================================================

interface SidebarProps {
  navItems: NavItem[];
  activeItem: string;
  onNavigate: (itemName: string) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ navItems, activeItem, onNavigate, onLogout }) => {
  return (
    <aside className="hidden md:flex flex-col w-20 lg:w-72 h-[96vh] sticky top-4 my-auto ml-4 rounded-3xl glass-panel flex-shrink-0 z-30 transition-all duration-500 shadow-glass" aria-label="Navegación Principal">
      {/* Área del Logo */}
      <div className="p-6 flex items-center justify-center lg:justify-start gap-4 mb-4">
        <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-brand-dark shadow-[0_0_15px_rgba(0,224,198,0.4)] animate-pulse-slow" aria-hidden="true">
          <span className="scale-110"><FitnessFlowLogo /></span>
        </div>
        <div className="hidden lg:block">
          <h1 className="text-xl font-extrabold text-white tracking-tight">
            Fitness<span className="text-brand-primary">Flow</span>
          </h1>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Pro</span>
        </div>
      </div>

      {/* Items de Navegación */}
      <nav className="flex-1 overflow-y-auto py-2 px-3 custom-scrollbar">
        <ul className="space-y-2">
          {navItems.map((item, index) => {
            const isActive = activeItem === item.name;
            return (
              <li key={item.name}>
                <button
                  id={`nav-item-${index}`}
                  onClick={() => onNavigate(item.name)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative w-full flex items-center gap-4 px-3 py-3 lg:px-4 rounded-2xl text-sm font-medium transition-all duration-300 group outline-none ${isActive
                      ? 'bg-brand-primary text-brand-dark shadow-neon scale-105 font-bold'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white hover:scale-105'
                    }`}
                >
                  <div className={`transition-transform duration-300 flex-shrink-0 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} aria-hidden="true">
                    {item.icon}
                  </div>
                  <span className="hidden lg:block tracking-wide truncate">{item.name}</span>

                  {/* Efecto de Brillo en Hover */}
                  {!isActive && (
                    <div className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Pie / Cerrar Sesión */}
      <div className="p-4 mt-auto">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center lg:justify-start gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-300 group"
          aria-label="Cerrar Sesión"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 01-3-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="hidden lg:inline">Salir</span>
        </button>
      </div>
    </aside>
  );
};