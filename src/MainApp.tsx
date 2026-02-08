
import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { User, type Theme, type NavItem } from './types';
import { Dashboard } from './pages/Dashboard';
import { MyRoutines } from './pages/MyRoutines';
import { ExerciseLibrary } from './pages/ExerciseLibrary';
import { GroupClasses } from './pages/GroupClasses';
import { MyProgress } from './pages/MyProgress';
import { AIWellnessHub } from './pages/AIWellnessHub';
import { ExploreGyms } from './pages/ExploreGyms';
import { MobileBottomNav } from './components/MobileBottomNav';
import { OnboardingTour } from './components/OnboardingTour';
import { VideoTutorialModal } from './components/VideoTutorialModal';

// Páginas del Gimnasio
import { GymDashboard } from './pages/GymDashboard';
import { MembersManagement } from './pages/MembersManagement';
import { InventoryManagement } from './pages/InventoryManagement';
import { FinanceManagement } from './pages/FinanceManagement';
import { MarketingAutomations } from './pages/MarketingAutomations';
import { PremiumLock } from './components/PremiumLock';

// Páginas del Entrenador
import { CoachDashboard } from './pages/CoachDashboard';
import { MyClients } from './pages/MyClients';
import { CoachSchedule } from './pages/CoachSchedule';
import { PersonalTraining } from './pages/PersonalTraining';



// Iconos
const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const RoutinesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
const LibraryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>;
const ClassesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.125-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.125-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const ProgressIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const AIIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.871 4.871a2.25 2.25 0 013.182 0l1.82 1.819a2.25 2.25 0 003.182 0l1.82-1.82a2.25 2.25 0 013.182 0l1.82 1.82a2.25 2.25 0 003.182 0l1.82-1.82a2.25 2.25 0 013.182 0M4.87 19.129a2.25 2.25 0 003.182 0l1.82-1.82a2.25 2.25 0 013.182 0l1.82 1.82a2.25 2.25 0 003.182 0l1.82-1.82a2.25 2.25 0 013.182 0" /></svg>;
const MembersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-1a6 6 0 00-1.781-4.121" /></svg>;
const InventoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>;
const FinanceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>;
const ClientsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.125-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.125-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const ScheduleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const ServicesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2h2" /></svg>;
const MapPinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const MarketingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>;


interface MainAppProps {
    user: User;
    users: User[];
    onLogout: () => void;
    theme: Theme;
    onToggleTheme: () => void;
    onAddUser: (user: User) => void;
    onUpdateUser: (originalEmail: string, updatedUser: User) => void;
    onDeleteUser: (email: string) => void;
    onSendNotification: (userEmail: string, message: string) => void;
    onMarkNotificationsAsRead: () => void;
    onNavigateToLogin: () => void;
    onNavigateToRegister: () => void;
}

const userNavItems: NavItem[] = [
    { name: 'Dashboard', icon: <DashboardIcon /> },
    { name: 'Mis Rutinas', icon: <RoutinesIcon /> },
    { name: 'Biblioteca', icon: <LibraryIcon /> },
    { name: 'Clases Grupales', icon: <ClassesIcon /> },
    { name: 'Entrenamiento Personal', icon: <ServicesIcon /> },
    { name: 'Explorar Gimnasios', icon: <MapPinIcon /> },
    { name: 'Mi Progreso', icon: <ProgressIcon /> },
    { name: 'Bienestar AI', icon: <AIIcon /> },
];

const gymNavItems: NavItem[] = [
    { name: 'Dashboard', icon: <DashboardIcon /> },
    { name: 'Miembros', icon: <MembersIcon /> },
    { name: 'Automatización', icon: <MarketingIcon /> },
    { name: 'Inventario', icon: <InventoryIcon /> },
    { name: 'Finanzas', icon: <FinanceIcon /> },
];

const coachNavItems: NavItem[] = [
    { name: 'Dashboard', icon: <DashboardIcon /> },
    { name: 'Mis Clientes', icon: <ClientsIcon /> },
    { name: 'Mi Horario', icon: <ScheduleIcon /> },
    { name: 'Servicios', icon: <ServicesIcon /> },
    { name: 'Bienestar AI', icon: <AIIcon /> },
];


export const MainApp: React.FC<MainAppProps> = ({ user, users, onLogout, theme, onToggleTheme, onSendNotification, onMarkNotificationsAsRead, onNavigateToLogin, onNavigateToRegister }) => {

    const [showTour, setShowTour] = useState(false);
    const [showVideoTutorial, setShowVideoTutorial] = useState(false);

    useEffect(() => {
        // Forzar el tour para usuarios existentes si no han visto la versión 2
        // Esto cubre el caso de "ya estoy registrado pero quiero ver el onboarding nuevo"
        // Y también usuarios nuevos que acaban de registrarse.
        // Forzar el tour para usuarios existentes si no han visto la versión 3
        // Esto cubre el caso de "ya estoy registrado pero quiero ver el onboarding nuevo"
        // Y también usuarios nuevos que acaban de registrarse.
        const tourKey = `fitness_tour_v3_${user.email}`;
        const hasSeenTour = localStorage.getItem(tourKey);

        if (!hasSeenTour) {
            if (user.accountType === 'entrenador') {
                setShowVideoTutorial(true);
            } else {
                setShowTour(true);
            }
        }
    }, [user.email]);

    const handleTourComplete = () => {
        setShowTour(false);
        const tourKey = `fitness_tour_v3_${user.email}`;
        localStorage.setItem(tourKey, 'true');
        sessionStorage.removeItem('isNewRegistration');
    };

    // DEBUG: Force re-eval of nav items when user changes
    useEffect(() => {
        // console.log("MainApp: User account type is:", user.accountType);
    }, [user.accountType]);

    const navItems = useMemo(() => {
        switch (user.accountType) {
            case 'gym':
                return gymNavItems;
            case 'entrenador':
                return coachNavItems;
            case 'user':
            default:
                return userNavItems;
        }
    }, [user.accountType]);

    const [activeItem, setActiveItem] = useState(navItems[0].name);

    useEffect(() => {
        const currentItemIsValid = navItems.some(item => item.name === activeItem);
        if (!currentItemIsValid) {
            setActiveItem(navItems[0].name);
        }
    }, [navItems]);

    // Role-based Access Helpers
    // El plan Gratis ahora actúa como una prueba COMPLETAMENTE PREMIUM por 15 días
    // Si el estado es 'trial', el usuario tiene acceso TOTAL (es como Premium)
    const isPremium = user.plan === 'premium' || user.subscriptionStatus === 'trial';
    const isBasicOrPremium = user.plan === 'básico' || user.plan === 'premium' || user.subscriptionStatus === 'trial';



    const handleManualTourStart = () => {
        console.log("MainApp: manually starting tour");
        const tourKey = `fitness_tour_v3_${user.email}`;
        localStorage.removeItem(tourKey); // Reset persistence

        if (user.accountType === 'entrenador') {
            setShowVideoTutorial(true);
        } else {
            setShowTour(true);
        }
    };

    const renderContent = () => {
        if (user.accountType === 'user') {
            switch (activeItem) {
                case 'Dashboard': return <Dashboard user={user} onNavigate={setActiveItem} />;
                case 'Biblioteca': return <ExerciseLibrary onNavigate={setActiveItem} />;
                case 'Explorar Gimnasios': return <ExploreGyms />;
                // Locked for Gratis
                case 'Mis Rutinas': return isBasicOrPremium ? <MyRoutines /> : <PremiumLock featureName="Rutinas Personalizadas" />;
                case 'Mi Progreso': return isBasicOrPremium ? <MyProgress user={user} /> : <PremiumLock featureName="Seguimiento de Progreso" />;
                // Premium Only
                case 'Clases Grupales': return isPremium ? <GroupClasses /> : <PremiumLock featureName="Clases Grupales" />;
                case 'Bienestar AI': return isPremium ? <AIWellnessHub user={user} /> : <PremiumLock featureName="AI Coach" />;
                case 'Entrenamiento Personal':
                    return isPremium ? <PersonalTraining
                        user={user}

                    /> : <PremiumLock featureName="Entrenamiento Personal" />;
                default: return <Dashboard user={user} onNavigate={setActiveItem} />;
            }
        }
        if (user.accountType === 'gym') {
            switch (activeItem) {
                case 'Dashboard': return <GymDashboard onNavigate={setActiveItem} />;
                // Locked for Gratis
                case 'Miembros': return isBasicOrPremium ? <MembersManagement onNavigate={setActiveItem} /> : <PremiumLock featureName="Gestión de Miembros" />;
                case 'Inventario': return isBasicOrPremium ? <InventoryManagement /> : <PremiumLock featureName="Inventario" />;
                // Premium Only
                case 'Automatización': return isPremium ? <MarketingAutomations users={users} onSendNotification={onSendNotification} /> : <PremiumLock featureName="Automatización y Marketing" />;
                case 'Finanzas': return isPremium ? <FinanceManagement /> : <PremiumLock featureName="Gestión Financiera" />;
                default: return <GymDashboard onNavigate={setActiveItem} />;
            }
        }
        if (user.accountType === 'entrenador') {
            switch (activeItem) {
                case 'Dashboard': return <CoachDashboard user={user} onNavigate={setActiveItem} onStartTour={handleManualTourStart} />;
                // Locked for Gratis
                case 'Mis Clientes': return isBasicOrPremium ? <MyClients /> : <PremiumLock featureName="Gestión de Clientes" />;
                case 'Mi Horario': return isBasicOrPremium ? <CoachSchedule /> : <PremiumLock featureName="Agenda Inteligente" />;
                // Premium Only
                case 'Servicios':
                    return isPremium ? <PersonalTraining
                        isCoachView={true}
                        user={user}
                    /> : <PremiumLock featureName="Gestión de Servicios" />;
                case 'Bienestar AI': return isPremium ? <AIWellnessHub user={user} /> : <PremiumLock featureName="AI Coach Pro" />;
                default: return <CoachDashboard user={user} onNavigate={setActiveItem} onStartTour={handleManualTourStart} />;
            }
        }
        return null;
    };

    const getTourSteps = () => {
        if (user.accountType === 'user') {
            return [
                { targetId: 'nav-item-0', title: 'Start Your Day', content: 'Check your daily summary and wellness score to stay on track.', position: 'right' as const },
                { targetId: 'nav-item-1', title: 'Create Your Perfect Plan', content: 'Ask AI to generate a personalized routine for you in 1 click.', position: 'right' as const },
                { targetId: 'nav-item-7', title: 'Chat with Your AI Coach', content: 'Get instant advice on nutrition, sleep, and workouts 24/7.', position: 'right' as const },
            ];
        } else if (user.accountType === 'gym') {
            return [
                { targetId: 'nav-item-0', title: 'Monitor KPIs', content: 'Track revenue, active members, and retention at a glance.', position: 'right' as const },
                { targetId: 'nav-item-1', title: 'Manage Members', content: 'View profiles, check-ins, and subscription status instantly.', position: 'right' as const },
                { targetId: 'nav-item-3', title: 'Track Finances', content: 'Keep your business profitable with real-time financial tracking.', position: 'right' as const },
            ];
        } else {
            // Coach Flow (Blueprint Implementation)
            return [
                // Paso 1: Dashboard (KPIs)
                {
                    targetId: 'coach-stats',
                    title: 'El Corazón del Negocio',
                    content: '¡Bienvenido a tu Panel de Control! Aquí tienes una vista pájaro de tu éxito. Podrás monitorear tus ingresos en tiempo real y la satisfacción de tus alumnos de un solo vistazo.',
                    position: 'bottom' as const
                },
                // Paso 2: Mis Clientes (Nav Item Index 1)
                {
                    targetId: ['sidebar-item-1', 'mobile-item-1'],
                    title: 'Gestión de Alumnos',
                    content: 'Tus alumnos son lo primero. Desde aquí puedes ver quiénes están activos, su progreso individual y gestionar sus membresías de forma personalizada.',
                    position: 'right' as const
                },
                // Paso 3: Mi Horario (Nav Item Index 2)
                {
                    targetId: ['sidebar-item-2', 'mobile-item-2'],
                    title: 'Optimización del Tiempo',
                    content: 'Organiza tu agenda sin complicaciones. Programa clases de Yoga, HIIT o lo que prefieras. Tus alumnos recibirán notificaciones automáticas para unirse.',
                    position: 'right' as const
                },
                // Paso 4: Servicios (Nav Item Index 3)
                {
                    targetId: ['sidebar-item-3', 'mobile-item-3'],
                    title: 'Monetización',
                    content: 'Aquí configuras tu oferta profesional. Crea nuevos servicios, ajusta precios y describe los beneficios de entrenar contigo. ¡Haz que tu talento sea rentable!',
                    position: 'right' as const
                },
                // Paso 5: Bienestar AI (Nav Item Index 4)
                {
                    targetId: ['sidebar-item-4', 'mobile-item-4'],
                    title: 'Inteligencia Artificial',
                    content: 'Este es tu asistente personal con IA. Utilízalo para generar planes de entrenamiento basados en datos, analizar el bienestar de tus clientes o resolver dudas técnicas en segundos.',
                    position: 'right' as const
                },
            ];
        }
    }

    const getCompletionContent = () => {
        if (user.accountType === 'entrenador') {
            return {
                title: '¡Estás listo para despegar, Coach! 🚀',
                message: 'Has completado el tour básico. Recuerda que siempre puedes volver a consultar esta guía en el centro de ayuda.',
                primaryAction: {
                    label: 'Crear mi primer servicio',
                    action: () => {
                        setActiveItem('Servicios');
                        // Optional: Trigger a specific action in the Services page if needed
                    }
                },
                secondaryAction: {
                    label: 'Ir al Dashboard',
                    action: () => setActiveItem('Dashboard')
                }
            };
        }
        return undefined;
    };

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
            <Sidebar
                navItems={navItems}
                activeItem={activeItem}
                onNavigate={setActiveItem}
                onLogout={onLogout}
            />

            <div className="flex-1 flex flex-col overflow-hidden relative">
                <Header
                    user={user}
                    onLogout={onLogout}
                    theme={theme}
                    onToggleTheme={onToggleTheme}
                    onMarkNotificationsAsRead={onMarkNotificationsAsRead}
                    onNavigateToLogin={onNavigateToLogin}
                    onNavigateToRegister={onNavigateToRegister}
                />

                <main className="flex-1 overflow-y-auto overflow-x-hidden pb-20 md:pb-0 scroll-smooth">
                    {renderContent()}
                </main>



                <MobileBottomNav
                    navItems={navItems}
                    activeItem={activeItem}
                    onNavigate={setActiveItem}
                />
            </div>

            {showVideoTutorial && (
                <VideoTutorialModal
                    videoSrc={`${import.meta.env.BASE_URL}video.mp4`}
                    onClose={() => {
                        setShowVideoTutorial(false);
                        setShowTour(true);
                    }}
                    onComplete={() => {
                        setShowVideoTutorial(false);
                        setShowTour(true);
                    }}
                />
            )}

            {showTour && (
                <OnboardingTour
                    steps={getTourSteps()}
                    onComplete={handleTourComplete}
                    completionContent={getCompletionContent()}
                />
            )}
        </div>
    );
};
