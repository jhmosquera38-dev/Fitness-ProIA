
import React, { useState, useRef, useEffect } from 'react';
import { TrialBanner } from './TrialBanner';
import { User, type Theme } from '../types'; 
import { FitnessFlowLogo } from './FormIcons';
import { MusicWidget } from './MusicWidget';
import { DigitalMemberCard } from './DigitalMemberCard'; // NEW IMPORT

const BellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);

const MusicNoteIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${className || ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
    </svg>
);

const IdCardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 012-2h2a2 2 0 012 2v1m-4 0h4" />
    </svg>
);

const PremiumBadge = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
)

interface HeaderProps {
  user: User;
  onLogout: () => void;
  theme: Theme;
  onToggleTheme: () => void;
  onMarkNotificationsAsRead: () => void;
  onNavigateToLogin?: () => void;
  onNavigateToRegister?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout, theme, onToggleTheme, onMarkNotificationsAsRead, onNavigateToLogin, onNavigateToRegister }) => {
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);
    const [isMusicWidgetOpen, setIsMusicWidgetOpen] = useState(false);
    const [isIdCardOpen, setIsIdCardOpen] = useState(false);

    const profileMenuRef = useRef<HTMLDivElement>(null);
    const notificationMenuRef = useRef<HTMLDivElement>(null);
    const musicWidgetRef = useRef<HTMLDivElement>(null);

    const isGuest = user.email === 'guest@fitnessflow.pro';
    const userInitials = isGuest ? 'IN' : user.name.substring(0, 2).toUpperCase();

    const unreadNotifications = user.notifications?.filter(n => !n.read).length || 0;

    const handleToggleNotifications = () => {
        if (!isNotificationMenuOpen && unreadNotifications > 0) {
            onMarkNotificationsAsRead();
        }
        setIsNotificationMenuOpen(prev => !prev);
        if (isMusicWidgetOpen) setIsMusicWidgetOpen(false); 
        setIsProfileMenuOpen(false);
    };
    
    const handleToggleMusic = () => {
        setIsMusicWidgetOpen(prev => !prev);
        setIsNotificationMenuOpen(false);
        setIsProfileMenuOpen(false);
    }
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setIsProfileMenuOpen(false);
            }
            if (notificationMenuRef.current && !notificationMenuRef.current.contains(event.target as Node)) {
                setIsNotificationMenuOpen(false);
            }
             if (musicWidgetRef.current && !musicWidgetRef.current.contains(event.target as Node)) {
                setIsMusicWidgetOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            {!isGuest && user.subscriptionStatus === 'trial' && user.trialEndDate && (
                <TrialBanner trialEndDate={user.trialEndDate} onSubscribeClick={() => { /* In a real app, this would navigate to the subscription page */ }} />
            )}
            <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 w-full sticky top-0 z-40 h-16">
                <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                        
                        {/* Mobile Logo (Visible only on small screens) */}
                        <div className="md:hidden flex items-center gap-2">
                             <div className="h-8 w-8 bg-brand-primary rounded-lg flex items-center justify-center text-white font-bold scale-90">
                                <span className="text-xs"><FitnessFlowLogo/></span>
                             </div>
                             <h1 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                                FitnessFlow
                            </h1>
                        </div>

                        {/* Desktop Spacer (When logo is in sidebar) */}
                        <div className="hidden md:block">
                             <p className="text-slate-400 text-sm font-medium">{new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                        </div>

                        {/* Right side icons */}
                        <div className="flex items-center gap-2 md:gap-4">
                            {isGuest ? (
                                <div className="flex items-center gap-2">
                                    <button onClick={onNavigateToLogin} className="text-slate-600 hover:text-brand-primary font-medium px-3 py-2 rounded-lg transition-colors text-sm">Ingresar</button>
                                    <button onClick={onNavigateToRegister} className="bg-brand-primary text-white font-semibold px-3 py-2 rounded-lg hover:bg-brand-secondary transition-colors text-sm">Registrarse</button>
                                </div>
                            ) : (
                                <>
                                    {/* NEW: Digital Pass (Only for Users) */}
                                    {user.accountType === 'user' && (
                                        <button 
                                            onClick={() => setIsIdCardOpen(true)}
                                            className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-full text-xs font-bold transition-colors border border-transparent hover:border-brand-primary/30"
                                            title="Mi Pase Digital"
                                        >
                                            <IdCardIcon />
                                            <span className="hidden lg:inline">Mi Pase</span>
                                        </button>
                                    )}

                                    {/* Music Widget Trigger */}
                                    <div className="relative" ref={musicWidgetRef}>
                                        <button 
                                            onClick={handleToggleMusic}
                                            className={`p-2.5 rounded-full transition-all duration-300 ease-out group relative ${
                                                isMusicWidgetOpen 
                                                    ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-lg shadow-brand-primary/40 scale-110 rotate-6 ring-2 ring-offset-2 ring-brand-primary/50 dark:ring-offset-slate-900' 
                                                    : 'text-slate-400 dark:text-slate-500 hover:text-brand-primary hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-110 hover:shadow-md'
                                            }`}
                                            title="Música Fitness"
                                        >
                                            <span className="sr-only">Abrir reproductor de música</span>
                                            <MusicNoteIcon className={`transition-transform duration-300 ${isMusicWidgetOpen ? 'animate-pulse' : 'group-hover:rotate-12'}`} />
                                        </button>
                                        <MusicWidget isOpen={isMusicWidgetOpen} onClose={() => setIsMusicWidgetOpen(false)} />
                                    </div>

                                    <div className="relative" ref={notificationMenuRef}>
                                        <button
                                            onClick={handleToggleNotifications}
                                            className="relative text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            <span className="sr-only">Ver notificaciones</span>
                                            <BellIcon />
                                            {unreadNotifications > 0 && (
                                                <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900 animate-pulse"></span>
                                            )}
                                        </button>
                                        {isNotificationMenuOpen && (
                                            <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-xl shadow-2xl bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 focus:outline-none animate-fade-in z-50">
                                                <div className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200 font-bold border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                                                    <span>Notificaciones</span>
                                                    <span className="text-xs font-normal text-slate-400">Marcar leídas</span>
                                                </div>
                                                {user.notifications?.length > 0 ? (
                                                    <div className="py-1 max-h-80 overflow-y-auto">
                                                        {user.notifications.map(notif => (
                                                            <div key={notif.id} className={`relative p-3 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer border-b border-slate-50 dark:border-slate-700 last:border-0 ${!notif.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                                                                {!notif.read && <span className="absolute left-2 top-4 h-2 w-2 rounded-full bg-brand-primary"></span>}
                                                                <div className="ml-3">
                                                                    <p className={`text-slate-800 dark:text-slate-100 ${!notif.read ? 'font-bold' : 'font-medium'}`}>{notif.message}</p>
                                                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{notif.date}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="p-8 text-center">
                                                        <p className="text-sm text-slate-500 dark:text-slate-400">No tienes notificaciones nuevas.</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="relative" ref={profileMenuRef}>
                                    <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center gap-3 focus:outline-none group">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 ring-transparent group-hover:ring-brand-primary/30 transition-all relative">
                                                <span className="font-bold text-sm text-white">{userInitials}</span>
                                                {user.plan === 'premium' && (
                                                    <span className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                                        <PremiumBadge />
                                                    </span>
                                                )}
                                            </div>
                                            <div className="hidden md:block text-left">
                                                <p className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-brand-primary transition-colors">{user.name.split(' ')[0]}</p>
                                                <p className="text-xs text-slate-400 capitalize">{user.accountType}</p>
                                            </div>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 hidden md:block group-hover:text-slate-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                    </button>
                                    {isProfileMenuOpen && (
                                        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-xl shadow-2xl py-2 bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 focus:outline-none animate-fade-in z-50" role="menu">
                                            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 mb-1 md:hidden">
                                                    <p className="font-bold text-slate-800 dark:text-slate-100 truncate">{user.name}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                                            </div>
                                            
                                            {/* Mobile Digital Pass Link */}
                                             {user.accountType === 'user' && (
                                                <button 
                                                    onClick={() => { setIsIdCardOpen(true); setIsProfileMenuOpen(false); }} 
                                                    className="md:hidden flex items-center gap-2 w-full px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700" 
                                                    role="menuitem"
                                                >
                                                    <span>🆔 Mi Pase Digital</span>
                                                </button>
                                            )}

                                            <button onClick={onToggleTheme} className="flex justify-between items-center w-full px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700" role="menuitem">
                                                <span>Tema</span>
                                                <span className="text-base">{theme === 'light' ? '☀️' : '🌙'}</span>
                                            </button>
                                            <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>
                                            <button onClick={onLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium flex items-center gap-2" role="menuitem">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 01-3-3h4a3 3 0 013 3v1" /></svg>
                                                Cerrar Sesión
                                            </button>
                                        </div>
                                    )}
                                    </div>
                                </>
                            )}
                        </div>
                </div>
            </header>

            {isIdCardOpen && (
                <DigitalMemberCard user={user} onClose={() => setIsIdCardOpen(false)} />
            )}
        </>
    );
};
