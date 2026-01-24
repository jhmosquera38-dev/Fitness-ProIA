
// ============================================================================
// ARCHIVO PRINCIPAL: App.tsx
// ============================================================================
// Este es el componente raíz de la aplicación.
// Responsabilidades principales:
// 1. Gestión del Estado Global (Usuario actual, Tema, Vista actual).
// 2. Enrutamiento (Navegación entre Login, Registro, Dashboard, etc.).
// 3. Manejo de Sesión (Login, Logout, Registro).
// 4. Verificación de estado de Suscripción y Pruebas Gratuitas.
// ============================================================================

import React, { useState, useEffect } from 'react';
import { supabase } from './src/lib/supabaseClient';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { MainApp } from './MainApp';
// Eliminado: import { SubscriptionGate } from './pages/SubscriptionGate';
import { GoogleLoginModal } from './components/GoogleLoginModal';
import { OnboardingWizard } from './components/OnboardingWizard';
import { InstallPWA } from './components/InstallPWA';
import { FeedbackProvider } from './components/FeedbackSystem';
import { ReloadPrompt } from './components/ReloadPrompt';


import { USERS_DATA } from './data/users';

import { type Notification, type User, type Theme } from './types';

// Definición de las posibles "Vistas" o páginas de la aplicación
type AppView = 'landing' | 'login' | 'register' | 'subscription' | 'onboarding' | 'main';

// Estado temporal para el proceso de registro
type RegistrationState = {
  accountType: 'user' | 'gym' | 'entrenador';
  plan: 'gratis' | 'básico' | 'premium';
};

// Usuario "Invitado" para demostraciones rápidas
const GUEST_USER: User = {
  name: 'Invitado',
  email: 'guest@fitnessflow.pro',
  accountType: 'user',
  plan: 'básico',
  subscriptionStatus: 'subscribed', // Suscrito para omitir bloqueos
  isGymMember: false,
  trialEndDate: null,
  notifications: [],
  hasCompletedOnboarding: true,
};


const App: React.FC = () => {
  // --- ESTADO GLOBAL ---
  const [theme, setTheme] = useState<Theme>('light'); // Tema: claro u oscuro
  const [users, setUsers] = useState<User[]>(USERS_DATA); // "Base de datos" local de usuarios
  const [currentUser, setCurrentUser] = useState<User | null>(null); // Usuario logueado actualmente
  const [currentView, setCurrentView] = useState<AppView>('landing'); // Qué pantalla se muestra
  const [registrationState, setRegistrationState] = useState<RegistrationState>({ accountType: 'user', plan: 'premium' });
  const [isGoogleLoginModalOpen, setIsGoogleLoginModalOpen] = useState(false);


  // Referencia para persistir la intención de registro a través de los múltiples eventos de auth
  const intentRef = React.useRef<string | null>(null);

  // Capturar intent de la URL inmediatamente al montar
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const intentFromUrl = urlParams.get('intent');

    if (intentFromUrl) {
      // console.log("Intent capturado al inicio y guardado en memoria:", intentFromUrl);
      intentRef.current = intentFromUrl;
      // No limpiamos la URL aún para debugging visual del usuario
    }
  }, []);

  // --- ESCUCHA DE SESIÓN DE SUPABASE ---
  useEffect(() => {
    // 1. Verificar sesión actual al cargar
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        handleSupabaseUser(session.user);
      }
    });

    // 2. Escuchar cambios de autenticación (Login, Logout, Auto-refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        handleSupabaseUser(session.user);
      } else {
        // Al cerrar sesión, limpiar estado
        if (currentUser && currentUser.email !== GUEST_USER.email) {
          setCurrentUser(null);
          setCurrentView('landing');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Función auxiliar para mapear usuario de Supabase a nuestro tipo User
  const handleSupabaseUser = async (supabaseUser: any) => {
    try {
      // 1. Intentar obtener perfil real de la BD
      const profile = await (await import('./services/userService')).userService.fetchUserProfile();

      const metadataType = supabaseUser.user_metadata?.account_type;

      if (profile) {
        // console.log("Perfil recuperado (RAW):", profile);
        // console.log("Metadata Auth:", metadataType);

        // 1. Rol de la BD (Fuente de Verdad Única)
        let finalRole: 'user' | 'gym' | 'entrenador' = profile.role || 'user';

        // 2. Corrección por Metadata (Safe Check): 
        // Si la BD dice 'user' pero Auth Metadata dice explícitamente otro rol, respetamos la Metadata de registro.
        // Esto soluciona casos donde la sincronización inicial de BD falló pero el usuario es auténtico.
        if (finalRole === 'user' && (metadataType === 'gym' || metadataType === 'entrenador')) {
          finalRole = metadataType;
        }

        // LÓGICA DE INFERENCIA ELIMINADA (No se usa presencia de tablas)

        // NO borrar pendingAccountType aún para asegurar persistencia en recargas rápidas
        // localStorage.removeItem('pendingAccountType');
        // sessionStorage.removeItem('pendingAccountType');

        const localOnboardingStatus = localStorage.getItem(`onboarding_completed_${supabaseUser.email}`) === 'true';

        // Mapear perfil DB a estado local
        const mappedUser: User = {
          name: profile.full_name || supabaseUser.email?.split('@')[0] || 'Usuario',
          email: profile.email || supabaseUser.email,
          accountType: finalRole,
          plan: 'premium', // Forzado para la demo
          subscriptionStatus: 'subscribed', // Forzado para evitar expiración
          isGymMember: profile.is_gym_member || false,
          trialEndDate: null, // Sin fecha de fin
          notifications: [],
          hasCompletedOnboarding: profile.has_completed_onboarding || localOnboardingStatus || false,

          // Mapear detalles específicos
          ...(profile.user_details && profile.user_details.length > 0 ? { profile: profile.user_details[0] } : {}),
          ...(finalRole === 'entrenador' && profile.coach_details && profile.coach_details.length > 0 ? {
            profession: profile.coach_details[0].profession,
            professionalDescription: profile.coach_details[0].description,
            phone: profile.coach_details[0].phone,
            address: profile.coach_details[0].address,
            cc: '',
            availability: []
          } : {})
        };

        setCurrentUser(mappedUser);

        // Actualizar lista local
        setUsers(prev => {
          if (prev.find(u => u.email === mappedUser.email)) return prev.map(u => u.email === mappedUser.email ? mappedUser : u);
          return [...prev, mappedUser];
        });

        // Redirección
        if (currentView === 'login' || currentView === 'register' || currentView === 'landing' || currentView === 'onboarding') {
          // console.log("Redirigiendo usuario...", mappedUser.accountType, "Onboarding:", mappedUser.hasCompletedOnboarding);
          if (mappedUser.hasCompletedOnboarding) {
            setCurrentView('main');
          } else {
            setCurrentView('onboarding');
          }
        }
      } else {
        // Fallback: Perfil no encontrado o Error RLS
        // console.log("Perfil no encontrado o bloqueado. Usando Fallback de Metadata/Storage.");

        const urlParams = new URLSearchParams(window.location.search);
        const intentFromUrl = urlParams.get('intent');
        const storagePending = localStorage.getItem('pendingAccountType') || sessionStorage.getItem('pendingAccountType');

        let storedAccountType = metadataType || intentRef.current || intentFromUrl || storagePending || 'user';

        // console.log("Decisión Fallback:", { metadataType, intent: intentRef.current, url: intentFromUrl, storage: storagePending, RESULTADO: storedAccountType });

        // Limpiar
        localStorage.removeItem('pendingAccountType');
        sessionStorage.removeItem('pendingAccountType');

        // Intentar crear (si no existe)
        try {
          await (await import('./services/userService')).userService.createProfile(supabaseUser, storedAccountType as string);
        } catch (err) {
          // Ignorar error si ya existe
        }

        const newUser: User = {
          name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'Usuario',
          email: supabaseUser.email || '',
          accountType: storedAccountType as any,
          plan: 'premium',
          subscriptionStatus: 'trial', // Reset to Trial
          isGymMember: false,
          trialEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 Days from NOW
          notifications: [],
          hasCompletedOnboarding: false, // Asumir false si no pudimos leer
        };

        setCurrentUser(newUser);

        if (newUser.hasCompletedOnboarding) {
          setCurrentView('main');
        } else {
          setCurrentView('onboarding');
        }
      }
    } catch (error) {
      console.error("Error handling supabase user:", error);
    }
  };

  // Efecto para aplicar el tema (dark mode) y verificar expiración de prueba al cargar
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');

    // Verificar si la prueba gratuita ha expirado
    // Verificar si la prueba gratuita ha expirado y aplicar Auto-Fix para Demo
    if (currentUser) {
      let needsUpdate = false;
      let updatedUser = { ...currentUser };
      const now = new Date();

      // 1. Upgrade Trial to Premium if needed
      if (updatedUser.subscriptionStatus === 'trial' && updatedUser.plan !== 'premium') {
        updatedUser.plan = 'premium';
        needsUpdate = true;
      }

      // 2. Extend/Reset Trial if Expired or close to expiring (Auto-fix for existing users)
      if (updatedUser.subscriptionStatus === 'expired' ||
        (updatedUser.subscriptionStatus === 'trial' && updatedUser.trialEndDate && now > new Date(updatedUser.trialEndDate))) {
        const newEndDate = new Date();
        newEndDate.setDate(newEndDate.getDate() + 30);

        updatedUser.subscriptionStatus = 'trial';
        updatedUser.trialEndDate = newEndDate;
        updatedUser.plan = 'premium'; // Ensure premium
        needsUpdate = true;
      }

      if (needsUpdate) {
        handleUpdateUser(currentUser.email, updatedUser);
        // Ensure view is accessible
        if (currentView === 'subscription') {
          setCurrentView('main');
        }
      }
    }
  }, [theme, currentUser, currentView]);

  const handleToggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // --- NAVEGACIÓN Y FLUJOS DE USUARIO ---

  const handleNavigateToLogin = () => setCurrentView('login');

  // Iniciar registro seleccionando tipo de cuenta y plan
  const handleStartRegistration = (accountType: 'user' | 'gym' | 'entrenador', plan: 'gratis' | 'básico' | 'premium') => {
    // Al registrarse, todos obtienen acceso total por 15 días (Trial)
    setRegistrationState({ accountType, plan });
    setCurrentView('register');
  };

  const handleLoginSuccess = ({ email }: { email: string }) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      // --- NUCLEAR OPTION FOR LOGIN DEMO --- 
      // Forzamos "cleanUser" con status 'subscribed' y 'premium' siempre que entre.
      // Esto sobrescribe cualquier estado expirado o 'básico' que pudiera tener.
      // --- TRIAl RESURRECTION (Configuración Solicitada) --- 
      // Si el usuario entra, le damos 30 días de prueba fresca.
      const cleanUser = {
        ...user,
        subscriptionStatus: 'trial' as const,
        plan: 'premium' as const,
        trialEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 días desde HOY
      };

      setCurrentUser(cleanUser);

      const hasLocalPersistence = localStorage.getItem(`onboarding_completed_${user.email}`) === 'true';

      // Sincronizar persistencia local
      if (hasLocalPersistence && !user.hasCompletedOnboarding) {
        cleanUser.hasCompletedOnboarding = true;
        // Actualizamos la base de datos (array 'users') con el user saneado
        setUsers(prev => prev.map(u => u.email === user.email ? cleanUser : u));
      }

      // Redirigir siempre a flujo correcto, nunca a 'subscription'
      if (cleanUser.hasCompletedOnboarding) {
        setCurrentView('main');
      } else {
        setCurrentView('onboarding');
      }
    } else {
      alert("Usuario no encontrado.");
    }
  };

  const handleGoogleLogin = () => {
    // No sobrescribir 'pendingAccountType' aquí. 
    // RegisterPage ya lo establece con el valor correcto (actualizado por el usuario).
    setIsGoogleLoginModalOpen(true);
  };



  // Maneja el éxito del registro: Crea el nuevo usuario en el estado
  const handleRegisterSuccess = (data: Partial<User> & { email: string, accountType: 'user' | 'gym' | 'entrenador', plan: 'gratis' | 'básico' | 'premium' }) => {
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 30); // 30 días exactos de prueba

    const newUser: User = {
      name: data.name || 'Nuevo Usuario',
      email: data.email,
      password: data.password,
      accountType: data.accountType,
      plan: data.plan,
      subscriptionStatus: 'trial', // Comienza en periodo de prueba
      isGymMember: false,
      trialEndDate: trialEndDate,
      notifications: [{ id: 1, message: '¡Bienvenido a tu prueba Premium de 30 días!', date: new Date().toLocaleDateString(), read: false }],
      hasCompletedOnboarding: false,
      // Datos específicos según tipo de usuario
      ...(data.accountType === 'user' && { profile: undefined }),
      ...(data.accountType === 'entrenador' && {
        profession: data.profession || '',
        professionalDescription: data.professionalDescription || '',
        phone: data.phone || '',
        address: data.address || '',
        cc: data.cc || '',
        availability: [],
      }),
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setCurrentView('onboarding');
  };

  const handleOnboardingComplete = async (data?: any) => {
    if (currentUser) {
      try {
        console.log("Completando onboarding con datos:", data);

        // Intentar actualizar en DB (Non-blocking for UI)
        try {
          const userService = (await import('./services/userService')).userService;

          // Si hay datos adicionales, podríamos guardarlos aquí
          // if (data?.goal) await userService.updateGoal(data.goal);

          await userService.completeOnboarding();
        } catch (dbError) {
          console.error("Warning: Could not save onboarding status to DB (possible offline mode or missing column):", dbError);
          // We continue anyway to let the user in
        }

        // Persistir que este usuario completó el onboarding (backup local)
        localStorage.setItem(`onboarding_completed_${currentUser.email}`, 'true');

        const updatedUser = { ...currentUser, hasCompletedOnboarding: true };
        handleUpdateUser(currentUser.email, updatedUser); // Actualizar estado React
        setCurrentView('main');
      } catch (error) {
        console.error("Critical Error in onboarding flow:", error);
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setCurrentView('landing');
  };

  const handleGuestLogin = () => {
    setCurrentUser(GUEST_USER);
    setCurrentView('main');
  };

  const handleNavigateToLanding = () => {
    setCurrentUser(null);
    setCurrentView('landing');
  };

  const handleGoToLogin = () => {
    setCurrentUser(null);
    setCurrentView('login');
  };

  const handleGoToRegister = () => {
    setCurrentUser(null);
    handleStartRegistration('user', 'premium');
  };

  const handleSubscriptionSuccess = () => {
    if (currentUser) {
      handleUpdateUser(currentUser.email, { ...currentUser, subscriptionStatus: 'subscribed' });
      setCurrentView('main');
    } else {
      // Manejo de caso borde: usuario forzado a suscribirse tras expirar
      const lastAttemptedEmail = 'ana.garcia@email.com'; // Fallback demo
      const user = users.find(u => u.email === lastAttemptedEmail);
      if (user) {
        const updatedUser: User = { ...user, subscriptionStatus: 'subscribed' };
        setUsers(prev => prev.map(u => u.email === lastAttemptedEmail ? updatedUser : u));
        setCurrentUser(updatedUser);
        setCurrentView('main');
      } else {
        setCurrentView('login');
      }
    }
  };

  // --- ADMINISTRACIÓN DE DATOS (Simulación Backend) ---

  const handleAddUser = (user: User) => setUsers(prev => [...prev, user]);

  const handleUpdateUser = (originalEmail: string, updatedUser: User) => {
    setUsers(prev => prev.map(u => (u.email === originalEmail ? updatedUser : u)));
    if (currentUser && currentUser.email === originalEmail) {
      setCurrentUser(updatedUser);
    }
  };

  const handleDeleteUser = (email: string) => setUsers(prev => prev.filter(u => u.email !== email));

  const handleSendNotification = (userEmail: string, message: string) => {
    setUsers(prev => prev.map(u => {
      if (u.email === userEmail) {
        const newNotif: Notification = {
          id: Date.now(),
          message,
          date: new Date().toLocaleString(),
          read: false,
        };
        return { ...u, notifications: [newNotif, ...u.notifications] };
      }
      return u;
    }));
  };

  const handleMarkNotificationsAsRead = () => {
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        notifications: currentUser.notifications.map(n => ({ ...n, read: true }))
      };
      setCurrentUser(updatedUser);
      setUsers(prev => prev.map(u => u.email === currentUser.email ? updatedUser : u));
    }
  }




  // Función principal de renderizado según el estado 'currentView'
  const renderCurrentView = () => {
    // Si hay usuario y está en 'main', mostrar la App Principal (Dashboards)
    if (currentUser && currentView === 'main') {
      return <MainApp
        user={currentUser}
        users={users}
        onLogout={handleLogout}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onAddUser={handleAddUser}
        onUpdateUser={handleUpdateUser}
        onDeleteUser={handleDeleteUser}
        onSendNotification={handleSendNotification}
        onMarkNotificationsAsRead={handleMarkNotificationsAsRead}

        onNavigateToLogin={handleGoToLogin}
        onNavigateToRegister={handleGoToRegister}
      />;
    }

    // Router básico (Switch)
    switch (currentView) {
      case 'login': return <LoginPage onNavigateToRegister={() => handleStartRegistration('user', 'premium')} onNavigateBack={handleNavigateToLanding} onLoginSuccess={handleLoginSuccess} onGoogleLogin={handleGoogleLogin} />;
      case 'register': return <RegisterPage onNavigateToLogin={handleNavigateToLogin} onNavigateBack={handleNavigateToLanding} onRegisterSuccess={handleRegisterSuccess} onGoogleLogin={handleGoogleLogin} initialAccountType={registrationState.accountType} initialPlan={registrationState.plan} />;
      // Eliminado: case 'subscription': return <SubscriptionGate ... />
      case 'onboarding': return currentUser ? <OnboardingWizard user={currentUser} onComplete={handleOnboardingComplete} /> : <LoginPage onNavigateToRegister={() => handleStartRegistration('user', 'premium')} onNavigateBack={handleNavigateToLanding} onLoginSuccess={handleLoginSuccess} onGoogleLogin={handleGoogleLogin} />;
      case 'landing':
      default:
        return <LandingPage onStartRegistration={handleStartRegistration} onNavigateToLogin={handleNavigateToLogin} onGuestLogin={handleGuestLogin} />;
    }
  };

  return (
    <FeedbackProvider>
      <a href="#main-content" className="skip-link">Saltar al contenido principal</a>
      {renderCurrentView()}
      <InstallPWA />
      <ReloadPrompt />
      {isGoogleLoginModalOpen && (
        <GoogleLoginModal
          onClose={() => setIsGoogleLoginModalOpen(false)}
        />
      )}
    </FeedbackProvider>
  );
};

export default App;