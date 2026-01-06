import React, { useState, useEffect } from 'react';
import { User } from '../types';
import {
    FitnessFlowLogo,
    UserIcon,
    MailIcon,
    LockIcon,
    GymIcon,
    NitIcon,
    IdCardIcon,
    BriefcaseIcon,
    InfoIcon,
    PhoneIcon,
    LocationIcon,
    GoogleIcon,
} from '../components/FormIcons';

interface RegisterPageProps {
    onNavigateToLogin: () => void;
    onNavigateBack: () => void;
    onRegisterSuccess: (data: Partial<User> & { email: string, accountType: 'user' | 'gym' | 'entrenador', plan: 'gratis' | 'básico' | 'premium' }) => void;
    onGoogleLogin: () => void;
    initialAccountType: 'user' | 'gym' | 'entrenador';
    initialPlan: 'gratis' | 'básico' | 'premium';
}

const InputField: React.FC<{ id: string; name: string; label: string; type?: string; placeholder: string; icon: React.ReactNode; required?: boolean; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; error?: string; as?: 'input' | 'textarea' }> = ({ id, name, label, type = 'text', placeholder, icon, required = true, value, onChange, error, as = 'input' }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">{label}{required && ' *'}</label>
        <div className="relative">
            <span className="absolute top-2.5 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                {icon}
            </span>
            {as === 'input' ? (
                <input
                    type={type}
                    id={id}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className={`w-full pl-10 pr-3 py-2 bg-slate-100 dark:bg-slate-700 border rounded-md text-slate-800 dark:text-white focus:ring-2 outline-none placeholder-slate-400 dark:placeholder-slate-400 ${error ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-600 focus:ring-brand-primary'}`}
                    placeholder={placeholder}
                    required={required}
                />
            ) : (
                <textarea
                    id={id}
                    name={name}
                    value={value}
                    onChange={onChange}
                    rows={3}
                    className={`w-full pl-10 pr-3 py-2 bg-slate-100 dark:bg-slate-700 border rounded-md text-slate-800 dark:text-white focus:ring-2 outline-none placeholder-slate-400 dark:placeholder-slate-400 ${error ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-600 focus:ring-brand-primary'}`}
                    placeholder={placeholder}
                    required={required}
                />
            )}
        </div>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
);

// Error types for each form
type UserErrorData = { [key in keyof typeof initialUserData]?: string };
type GymErrorData = { [key in keyof typeof initialGymData]?: string };
type CoachErrorData = { [key in keyof typeof initialCoachData]?: string };

// Initial state for each form
const initialUserData = { nombre: '', apellido: '', correo: '', contrasena: '', confirmarContrasena: '', terminos: false };
const initialGymData = { nombreGimnasio: '', nit: '', correo: '', contrasena: '', confirmarContrasena: '', terminos: false };
const initialCoachData = { nombre: '', cc: '', profession: '', professionalDescription: '', phone: '', address: '', correo: '', contrasena: '', confirmarContrasena: '', terminos: false };


export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigateToLogin, onNavigateBack, onRegisterSuccess, onGoogleLogin, initialAccountType, initialPlan }) => {
    const [accountType, setAccountType] = useState<'user' | 'gym' | 'entrenador'>(initialAccountType);

    // States for each form
    const [userData, setUserData] = useState(initialUserData);
    const [userErrors, setUserErrors] = useState<UserErrorData>({});
    const [gymData, setGymData] = useState(initialGymData);
    const [gymErrors, setGymErrors] = useState<GymErrorData>({});
    const [coachData, setCoachData] = useState(initialCoachData);
    const [coachErrors, setCoachErrors] = useState<CoachErrorData>({});

    useEffect(() => {
        setAccountType(initialAccountType);
    }, [initialAccountType]);

    // --- Change Handlers ---
    const createChangeHandler = <T,>(setter: React.Dispatch<React.SetStateAction<T>>) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setter(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };
    const handleUserChange = createChangeHandler(setUserData);
    const handleGymChange = createChangeHandler(setGymData);
    const handleCoachChange = createChangeHandler(setCoachData);

    // --- Validation Functions ---
    const validateUserForm = (): boolean => {
        const errors: UserErrorData = {};
        if (!userData.nombre.trim()) errors.nombre = 'El nombre es obligatorio.';
        if (!userData.apellido.trim()) errors.apellido = 'El apellido es obligatorio.';
        if (!/^\S+@\S+\.\S+$/.test(userData.correo)) errors.correo = 'El correo electrónico no es válido.';
        if (userData.contrasena.length < 6) errors.contrasena = 'La contraseña debe tener al menos 6 caracteres.';
        if (userData.contrasena !== userData.confirmarContrasena) errors.confirmarContrasena = 'Las contraseñas no coinciden.';
        if (!userData.terminos) errors.terminos = 'Debes aceptar los términos y condiciones.';
        setUserErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validateGymForm = (): boolean => {
        const errors: GymErrorData = {};
        if (!gymData.nombreGimnasio.trim()) errors.nombreGimnasio = 'El nombre del gimnasio es obligatorio.';
        if (!/^\d{3}\.\d{3}\.\d{3}-\d$/.test(gymData.nit)) errors.nit = 'Formato de NIT inválido. Ej: 900.123.456-7';
        if (!/^\S+@\S+\.\S+$/.test(gymData.correo)) errors.correo = 'El correo electrónico no es válido.';
        if (gymData.contrasena.length < 6) errors.contrasena = 'La contraseña debe tener al menos 6 caracteres.';
        if (gymData.contrasena !== gymData.confirmarContrasena) errors.confirmarContrasena = 'Las contraseñas no coinciden.';
        if (!gymData.terminos) errors.terminos = 'Debes aceptar los términos y condiciones.';
        setGymErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validateCoachForm = (): boolean => {
        const errors: CoachErrorData = {};
        if (!coachData.nombre.trim()) errors.nombre = 'El nombre completo es obligatorio.';
        if (!/^\d{1,3}(?:\.\d{3})*(?:-\d)?$/.test(coachData.cc)) errors.cc = 'El formato de la CC es inválido.';
        if (!coachData.profession.trim()) errors.profession = 'La profesión es obligatoria.';
        if (!/^\S+@\S+\.\S+$/.test(coachData.correo)) errors.correo = 'El correo electrónico no es válido.';
        if (coachData.contrasena.length < 6) errors.contrasena = 'La contraseña debe tener al menos 6 caracteres.';
        if (coachData.contrasena !== coachData.confirmarContrasena) errors.confirmarContrasena = 'Las contraseñas no coinciden.';
        if (!coachData.terminos) errors.terminos = 'Debes aceptar los términos y condiciones.';
        setCoachErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let email = '';
        let password = '';
        let fullName = '';

        // Validation and Extraction
        if (accountType === 'user') {
            if (!validateUserForm()) return;
            email = userData.correo;
            password = userData.contrasena;
            fullName = `${userData.nombre} ${userData.apellido}`;
        } else if (accountType === 'gym') {
            if (!validateGymForm()) return;
            email = gymData.correo;
            password = gymData.contrasena;
            fullName = gymData.nombreGimnasio;
        } else if (accountType === 'entrenador') {
            if (!validateCoachForm()) return;
            email = coachData.correo;
            password = coachData.contrasena;
            fullName = coachData.nombre;
        }

        try {
            // 1. Sign Up
            const { data: authData, error: authError } = await (await import('../src/lib/supabaseClient')).supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        account_type: accountType,
                        plan: initialPlan
                    }
                }
            });

            if (authError) throw authError;
            if (!authData.user) throw new Error("No se pudo crear el usuario");

            const userId = authData.user.id;
            const supabase = (await import('../src/lib/supabaseClient')).supabase;

            // 2. Insert Profile (Upsert to be safe)
            const { error: profileError } = await supabase
                .from('profiles')
                .upsert({
                    id: userId,
                    email: email,
                    full_name: fullName,
                    role: accountType,
                    plan: initialPlan,
                    subscription_status: 'trial',
                    trial_end_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
                    has_completed_onboarding: false,
                    is_gym_member: false
                });

            if (profileError) {
                console.error("Profile Error:", profileError);
                // Continue anyway? If profile fails, details will fail FK
                throw profileError;
            }

            // 3. Insert Details based on role
            if (accountType === 'gym') {
                const { error: gymError } = await supabase
                    .from('gym_details')
                    .insert({
                        profile_id: userId,
                        gym_name: gymData.nombreGimnasio,
                        nit: gymData.nit,
                        address: 'Medellín' // Default or add field
                    });
                if (gymError) console.error("Gym Details Error:", gymError);
            } else if (accountType === 'entrenador') {
                const { error: coachError } = await supabase
                    .from('coach_details')
                    .insert({
                        profile_id: userId,
                        profession: coachData.profession,
                        description: coachData.professionalDescription,
                        phone: coachData.phone,
                        address: coachData.address
                    });
                if (coachError) console.error("Coach Details Error:", coachError);
            }

            // Success -> Notify App
            sessionStorage.setItem('isNewRegistration', 'true');
            // We pass data just for local state update if needed, but App should rely on Auth
            onRegisterSuccess({
                email,
                name: fullName,
                accountType,
                plan: initialPlan
            });

        } catch (error: any) {
            console.error("Registration failed:", error);
            // Handle specific Supabase errors
            if (error.message?.includes("already registered")) {
                if (accountType === 'user') setUserErrors({ ...userErrors, correo: 'Este correo ya está registrado.' });
                else if (accountType === 'gym') setGymErrors({ ...gymErrors, correo: 'Este correo ya está registrado.' });
                else setCoachErrors({ ...coachErrors, correo: 'Este correo ya está registrado.' });
            } else {
                alert(`Error al registrar: ${error.message}`);
            }
        }
    };

    const getTitle = () => {
        switch (accountType) {
            case 'user': return 'Usuario';
            case 'gym': return 'Gimnasio';
            case 'entrenador': return 'Entrenador';
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-400 via-teal-400 to-blue-500 flex items-center justify-center p-4 font-sans">
            <main className="w-full max-w-4xl mx-auto relative">
                {/* Botón Volver */}
                <button
                    onClick={onNavigateBack}
                    className="absolute top-0 left-0 -mt-10 md:-mt-12 text-white hover:text-white/80 flex items-center gap-2 font-medium transition-colors z-20"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Volver
                </button>

                <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-xl shadow-2xl p-6 md:p-10 transition-colors duration-300">
                    <div className="text-center mb-8">
                        <div className="inline-block bg-white dark:bg-slate-700 p-3 rounded-full shadow-md mb-3"><FitnessFlowLogo /></div>
                        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">FitnessFlow</h1>
                        <p className="text-slate-600 dark:text-slate-300">Únete a la comunidad fitness de Medellín</p>
                    </div>

                    <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-full mb-6">
                        <button onClick={() => setAccountType('user')} className={`w-1/3 py-2 rounded-full font-semibold transition-colors ${accountType === 'user' ? 'bg-white dark:bg-slate-600 shadow text-brand-primary dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>Soy un Usuario</button>
                        <button onClick={() => setAccountType('gym')} className={`w-1/3 py-2 rounded-full font-semibold transition-colors ${accountType === 'gym' ? 'bg-white dark:bg-slate-600 shadow text-brand-primary dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>Soy un Gimnasio</button>
                        <button onClick={() => setAccountType('entrenador')} className={`w-1/3 py-2 rounded-full font-semibold transition-colors ${accountType === 'entrenador' ? 'bg-white dark:bg-slate-600 shadow text-brand-primary dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>Soy un Entrenador</button>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Crear Cuenta de {getTitle()} - Plan <span className="capitalize text-brand-primary">{initialPlan}</span></h2>
                        <p className="text-slate-500 dark:text-slate-400">Completa tu información para comenzar tu journey fitness</p>
                    </div>

                    {/* Botón de Google Start: Visible para todos los roles ahora */}
                    <div className="space-y-4 mb-4">
                        <button
                            onClick={() => {
                                console.log("Guardando intención de rol:", accountType); // Debug log
                                localStorage.setItem('pendingAccountType', accountType);
                                sessionStorage.setItem('pendingAccountType', accountType); // Backup persistence
                                onGoogleLogin();
                            }}
                            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-white font-semibold hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                        >
                            <GoogleIcon />
                            <span>Continuar con Google como {getTitle()}</span>
                        </button>
                        <div className="flex items-center">
                            <hr className="flex-grow border-t border-slate-300 dark:border-slate-600" />
                            <span className="px-3 text-sm text-slate-500 dark:text-slate-400">O con correo</span>
                            <hr className="flex-grow border-t border-slate-300 dark:border-slate-600" />
                        </div>
                    </div>


                    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                        {accountType === 'user' && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField id="nombre" name="nombre" label="Nombre" placeholder="Tu nombre" icon={<UserIcon />} value={userData.nombre} onChange={handleUserChange} error={userErrors.nombre} />
                                    <InputField id="apellido" name="apellido" label="Apellido" placeholder="Tu apellido" icon={<UserIcon />} value={userData.apellido} onChange={handleUserChange} error={userErrors.apellido} />
                                </div>
                                <InputField id="correo" name="correo" label="Correo Electrónico" type="email" placeholder="tu@email.com" icon={<MailIcon />} value={userData.correo} onChange={handleUserChange} error={userErrors.correo} />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField id="contrasena" name="contrasena" label="Contraseña" type={'password'} placeholder="Mínimo 6 caracteres" icon={<LockIcon />} value={userData.contrasena} onChange={handleUserChange} error={userErrors.contrasena} />
                                    <InputField id="confirmarContrasena" name="confirmarContrasena" label="Confirmar Contraseña" type={'password'} placeholder="Repetir contraseña" icon={<LockIcon />} value={userData.confirmarContrasena} onChange={handleUserChange} error={userErrors.confirmarContrasena} />
                                </div>
                                <div className="flex items-center">
                                    <input id="terminos" name="terminos" type="checkbox" required checked={userData.terminos} onChange={handleUserChange} className="h-4 w-4 text-brand-primary focus:ring-brand-primary border-slate-300 rounded" />
                                    <label htmlFor="terminos" className="ml-2 block text-sm text-slate-700 dark:text-slate-300">Acepto los <a href="#" className="font-medium text-brand-primary hover:underline">términos y condiciones</a> de FitnessFlow *</label>
                                </div>
                                {userErrors.terminos && <p className="text-xs text-red-600 -mt-4">{userErrors.terminos}</p>}
                            </>
                        )}
                        {accountType === 'gym' && (
                            <>
                                <InputField id="nombreGimnasio" name="nombreGimnasio" label="Nombre del Gimnasio" placeholder="Mi Gimnasio Fitness" icon={<GymIcon />} value={gymData.nombreGimnasio} onChange={handleGymChange} error={gymErrors.nombreGimnasio} />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField id="nit" name="nit" label="NIT" placeholder="900.123.456-7" icon={<NitIcon />} value={gymData.nit} onChange={handleGymChange} error={gymErrors.nit} />
                                    <InputField id="correo" name="correo" label="Correo Electrónico" type="email" placeholder="contacto@gimnasio.com" icon={<MailIcon />} value={gymData.correo} onChange={handleGymChange} error={gymErrors.correo} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField id="contrasena" name="contrasena" label="Contraseña" type={'password'} placeholder="Mínimo 6 caracteres" icon={<LockIcon />} value={gymData.contrasena} onChange={handleGymChange} error={gymErrors.contrasena} />
                                    <InputField id="confirmarContrasena" name="confirmarContrasena" label="Confirmar Contraseña" type={'password'} placeholder="Repetir contraseña" icon={<LockIcon />} value={gymData.confirmarContrasena} onChange={handleGymChange} error={gymErrors.confirmarContrasena} />
                                </div>
                                <div className="flex items-center">
                                    <input id="terminosGym" name="terminos" type="checkbox" required checked={gymData.terminos} onChange={handleGymChange} className="h-4 w-4 text-brand-primary focus:ring-brand-primary border-slate-300 rounded" />
                                    <label htmlFor="terminosGym" className="ml-2 block text-sm text-slate-700 dark:text-slate-300">Acepto los <a href="#" className="font-medium text-brand-primary hover:underline">términos y condiciones</a> de FitnessFlow *</label>
                                </div>
                                {gymErrors.terminos && <p className="text-xs text-red-600 -mt-4">{gymErrors.terminos}</p>}
                            </>
                        )}
                        {accountType === 'entrenador' && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField id="nombre" name="nombre" label="Nombre Completo" placeholder="Tu nombre completo" icon={<UserIcon />} value={coachData.nombre} onChange={handleCoachChange} error={coachErrors.nombre} />
                                    <InputField id="cc" name="cc" label="CC" placeholder="123.456.789-0" icon={<IdCardIcon />} value={coachData.cc} onChange={handleCoachChange} error={coachErrors.cc} />
                                </div>
                                <InputField id="profession" name="profession" label="Profesión" placeholder="Ej: Entrenador Personal Certificado" icon={<BriefcaseIcon />} value={coachData.profession} onChange={handleCoachChange} error={coachErrors.profession} />
                                <InputField id="professionalDescription" name="professionalDescription" label="Descripción Profesional" as="textarea" placeholder="Describe tu experiencia, especialidades, etc." icon={<InfoIcon />} value={coachData.professionalDescription} onChange={handleCoachChange} required={false} error={coachErrors.professionalDescription} />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField id="phone" name="phone" label="Teléfono" placeholder="3001234567" icon={<PhoneIcon />} value={coachData.phone} onChange={handleCoachChange} required={false} error={coachErrors.phone} />
                                    <InputField id="address" name="address" label="Dirección" placeholder="Calle 10 #43A-50, Medellín" icon={<LocationIcon />} value={coachData.address} onChange={handleCoachChange} required={false} error={coachErrors.address} />
                                </div>
                                <InputField id="correo" name="correo" label="Correo Electrónico" type="email" placeholder="tu@email.com" icon={<MailIcon />} value={coachData.correo} onChange={handleCoachChange} error={coachErrors.correo} />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField id="contrasena" name="contrasena" label="Contraseña" type={'password'} placeholder="Mínimo 6 caracteres" icon={<LockIcon />} value={coachData.contrasena} onChange={handleCoachChange} error={coachErrors.contrasena} />
                                    <InputField id="confirmarContrasena" name="confirmarContrasena" label="Confirmar Contraseña" type={'password'} placeholder="Repetir contraseña" icon={<LockIcon />} value={coachData.confirmarContrasena} onChange={handleCoachChange} error={coachErrors.confirmarContrasena} />
                                </div>
                                <div className="flex items-center">
                                    <input id="terminosCoach" name="terminos" type="checkbox" required checked={coachData.terminos} onChange={handleCoachChange} className="h-4 w-4 text-brand-primary focus:ring-brand-primary border-slate-300 rounded" />
                                    <label htmlFor="terminosCoach" className="ml-2 block text-sm text-slate-700 dark:text-slate-300">Acepto los <a href="#" className="font-medium text-brand-primary hover:underline">términos y condiciones</a> de FitnessFlow *</label>
                                </div>
                                {coachErrors.terminos && <p className="text-xs text-red-600 -mt-4">{coachErrors.terminos}</p>}
                            </>
                        )}
                        <button type="submit" className="w-full bg-brand-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-secondary transition-colors duration-300 shadow-lg hover:shadow-green-500/50">Crear Cuenta</button>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
                        ¿Ya tienes cuenta? <button onClick={onNavigateToLogin} className="font-medium text-brand-primary hover:underline">Inicia sesión aquí</button></p>
                </div>
            </main>
        </div>
    );
};