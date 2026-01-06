import React, { useState } from 'react';
import {
    FitnessFlowLogo,
    MailIcon,
    LockIcon,
    EyeOpenIcon,
    EyeClosedIcon,
    GoogleIcon
} from '../components/FormIcons';

// ============================================================================
// PÁGINA DE INICIO DE SESIÓN (LoginPage.tsx)
// ============================================================================
// Permite a los usuarios, gimnasios y entrenadores acceder a su cuenta.
// Maneja la autenticación básica (simulada) y la redirección.
// ============================================================================

interface LoginPageProps {
    onNavigateToRegister: () => void; // Función para navegar al registro
    onNavigateBack: () => void; // Función para volver al inicio
    onLoginSuccess: (data: { email: string; accountType: 'user' | 'gym' | 'entrenador' }) => void; // Callback al completar login exitoso
    onGoogleLogin: () => void; // Función para login con Google
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigateToRegister, onNavigateBack, onLoginSuccess, onGoogleLogin }) => {
    // Estado local para manejar el tipo de cuenta seleccionado
    const [accountType, setAccountType] = useState<'user' | 'gym' | 'entrenador'>('user');
    const [showPassword, setShowPassword] = useState(false); // Alternar visibilidad de contraseña

    // Estados del formulario
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Maneja el envío del formulario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validaciones básicas
        if (!email || !password) {
            setError('Por favor, completa todos los campos.');
            return;
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            setError('Por favor, ingresa un correo electrónico válido.');
            return;
        }

        try {
            const { data, error } = await (await import('../src/lib/supabaseClient')).supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                if (error.message.includes('Invalid login credentials')) {
                    throw new Error('Correo o contraseña incorrectos.');
                }
                throw error;
            }

            if (data.user) {
                // Check if profile exists/fetch role? 
                // We rely on App.tsx to handle the user state update via onAuthStateChange.
                // But we need to pass accountType to onLoginSuccess if we want the parent to know immediately,
                // although the parent might re-fetch from supabase user metadata.
                // For now, we trust the input accountType or query the profile?
                // Ideally, we should fetch the profile to confirm accountType matches the selected tab.

                const supabase = (await import('../src/lib/supabaseClient')).supabase;
                const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single();

                const role = profile?.role || accountType;

                onLoginSuccess({ email, accountType: role as any });
            }

        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.message || 'Error al iniciar sesión.');
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-green-400 via-teal-400 to-blue-500 flex flex-col items-center justify-center p-4 font-sans">
            <main className="w-full max-w-md mx-auto relative">
                {/* Botón Volver */}
                <button
                    onClick={onNavigateBack}
                    className="absolute top-0 left-0 -mt-12 text-white hover:text-white/80 flex items-center gap-2 font-medium transition-colors z-20"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Volver
                </button>

                {/* Cabecera del Login */}
                <div className="text-center mb-8">
                    <div className="inline-block bg-white p-4 rounded-full shadow-lg mb-4">
                        <FitnessFlowLogo />
                    </div>
                    <h1 className="text-4xl font-bold text-white drop-shadow-md">FitnessFlow</h1>
                    <p className="text-white/90 text-lg font-medium">Tu gimnasio digital en Medellín</p>
                </div>

                {/* Tarjeta del Formulario */}
                <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-white/50 dark:border-slate-700 transition-colors">

                    {/* Selector de Tipo de Cuenta */}
                    <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-full mb-6" role="group" aria-label="Seleccionar tipo de cuenta">
                        <button
                            onClick={() => setAccountType('user')}
                            aria-pressed={accountType === 'user'}
                            className={`flex-1 py-3 rounded-full font-bold text-sm transition-colors focus-visible:ring-2 focus-visible:ring-brand-primary ${accountType === 'user' ? 'bg-white dark:bg-slate-600 shadow text-brand-primary-dark dark:text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
                        >
                            Usuario
                        </button>
                        <button
                            onClick={() => setAccountType('gym')}
                            aria-pressed={accountType === 'gym'}
                            className={`flex-1 py-3 rounded-full font-bold text-sm transition-colors focus-visible:ring-2 focus-visible:ring-brand-primary ${accountType === 'gym' ? 'bg-white dark:bg-slate-600 shadow text-brand-primary-dark dark:text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
                        >
                            Gimnasio
                        </button>
                        <button
                            onClick={() => setAccountType('entrenador')}
                            aria-pressed={accountType === 'entrenador'}
                            className={`flex-1 py-3 rounded-full font-bold text-sm transition-colors focus-visible:ring-2 focus-visible:ring-brand-primary ${accountType === 'entrenador' ? 'bg-white dark:bg-slate-600 shadow text-brand-primary-dark dark:text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
                        >
                            Entrenador
                        </button>
                    </div>

                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Iniciar Sesión</h2>
                        <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">Como {accountType === 'user' ? 'Usuario' : accountType === 'gym' ? 'Gimnasio' : 'Entrenador'}</p>
                    </div>

                    {/* Botón de Google */}
                    <div className="space-y-4">
                        <button
                            onClick={() => {
                                // Guardar la intención de rol antes de abrir el modal/iniciar el flujo
                                console.log("Login intent:", accountType);
                                localStorage.setItem('pendingAccountType', accountType);
                                sessionStorage.setItem('pendingAccountType', accountType);
                                onGoogleLogin();
                            }}
                            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-white font-bold hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors focus-visible:ring-2 focus-visible:ring-brand-primary min-h-[44px]"
                        >
                            <GoogleIcon />
                            <span>Continuar como {accountType === 'user' ? 'Usuario' : accountType === 'gym' ? 'Gimnasio' : 'Entrenador'}</span>
                        </button>

                        <div className="flex items-center" aria-hidden="true">
                            <hr className="flex-grow border-t border-slate-300 dark:border-slate-600" />
                            <span className="px-3 text-sm text-slate-500 dark:text-slate-400 font-medium">O</span>
                            <hr className="flex-grow border-t border-slate-300 dark:border-slate-600" />
                        </div>
                    </div>


                    {/* Formulario de Email/Contraseña */}
                    <form className="space-y-5 mt-4" onSubmit={handleSubmit} noValidate>
                        <div>
                            <label htmlFor="correo" className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1">Correo Electrónico</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
                                    <MailIcon />
                                </span>
                                <input
                                    type="email"
                                    id="correo"
                                    name="correo"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-3 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-shadow placeholder-slate-400 dark:placeholder-slate-400"
                                    placeholder="tu@email.com"
                                    required
                                    aria-invalid={!!error}
                                    aria-describedby={error ? "login-error" : undefined}
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="contrasena" className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1">Contraseña</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
                                    <LockIcon />
                                </span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="contrasena"
                                    name="contrasena"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Tu contraseña"
                                    required
                                    className="w-full pl-10 pr-12 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-shadow placeholder-slate-400 dark:placeholder-slate-400"
                                    aria-invalid={!!error}
                                    aria-describedby={error ? "login-error" : undefined}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 focus:outline-none focus:text-brand-primary"
                                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                >
                                    {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div id="login-error" className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-3 rounded" role="alert">
                                <p className="text-red-700 dark:text-red-300 text-sm font-medium">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-brand-primary text-white font-bold py-3.5 px-4 rounded-lg hover:bg-brand-primary-dark transition-colors duration-300 shadow-lg hover:shadow-green-500/30 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-primary min-h-[48px]"
                        >
                            Iniciar Sesión
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
                        ¿No tienes cuenta? <button onClick={onNavigateToRegister} className="font-bold text-brand-primary hover:text-brand-primary-dark hover:underline focus:outline-none focus:ring-2 focus:ring-brand-primary rounded p-1">Regístrate aquí</button>
                    </p>
                </div>
            </main>
            <footer className="absolute bottom-4 text-center w-full px-4">
                <p className="text-white/90 text-sm font-medium drop-shadow-sm">Plataforma segura para la gestión de tu entrenamiento</p>
            </footer>
        </div>
    );
};