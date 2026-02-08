
import React, { useState } from 'react';
import { User } from '../types';
import { FitnessFlowLogo } from './FormIcons';

interface OnboardingWizardProps {
    user: User;
    onComplete: (data?: any) => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ user, onComplete }) => {
    const [step, setStep] = useState(0);
    const [selectedGoal, setSelectedGoal] = useState<string>('');

    // Gym states
    const [capacity, setCapacity] = useState('');
    const [openingHours, setOpeningHours] = useState('06:00');

    // Coach states
    const [specialty, setSpecialty] = useState('');

    const handleNext = () => {
        setStep(prev => prev + 1);
    };

    const UserContent = () => {
        if (step === 0) return (
            <div className="text-center animate-fade-in">
                <div className="w-24 h-24 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">👋</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">¡Bienvenido, {user.name.split(' ')[0]}!</h2>
                <p className="text-slate-600 mb-8">Estamos emocionados de acompañarte en tu viaje fitness. Antes de empezar, vamos a personalizar tu experiencia.</p>
                <button onClick={handleNext} className="bg-brand-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-brand-secondary transition-transform transform hover:scale-105 shadow-lg">
                    Comencemos
                </button>
            </div>
        );
        if (step === 1) return (
            <div className="animate-fade-in">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">¿Cuál es tu objetivo principal?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['Ganar Músculo', 'Perder Grasa', 'Mejorar Resistencia', 'Salud General'].map((goal) => (
                        <button
                            key={goal}
                            onClick={() => { setSelectedGoal(goal); handleNext(); }}
                            className={`p-4 border-2 rounded-xl transition-all text-left group ${selectedGoal === goal ? 'border-brand-primary bg-green-50' : 'border-slate-200 hover:border-brand-primary hover:bg-green-50'}`}
                        >
                            <span className={`font-bold group-hover:text-brand-primary ${selectedGoal === goal ? 'text-brand-primary' : 'text-slate-700'}`}>{goal}</span>
                        </button>
                    ))}
                </div>
            </div>
        );
        if (step === 2) return (
            <div className="text-center animate-fade-in">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">¡Todo Listo!</h2>
                <p className="text-slate-600 mb-8">Hemos configurado tu dashboard. Prepárate para transformar tu cuerpo.</p>
                <button
                    onClick={() => onComplete({ goal: selectedGoal })}
                    className="bg-brand-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-brand-secondary shadow-lg"
                >
                    Ir a mi Dashboard
                </button>
            </div>
        );
        return null;
    };

    const GymContent = () => {
        if (step === 0) return (
            <div className="text-center animate-fade-in">
                <div className="w-24 h-24 bg-brand-dark/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">🏢</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Bienvenido a FitnessFlow Business</h2>
                <p className="text-slate-600 mb-8">La herramienta definitiva para gestionar {user.name}. Optimicemos tu gimnasio.</p>
                <button onClick={handleNext} className="bg-brand-dark text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-lg">
                    Configurar Gimnasio
                </button>
            </div>
        );
        if (step === 1) return (
            <div className="animate-fade-in">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Capacidad y Aforo</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Aforo Máximo Permitido</label>
                        <input
                            type="number"
                            value={capacity}
                            onChange={(e) => setCapacity(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-brand-dark"
                            placeholder="Ej: 150"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Horario de Apertura</label>
                        <input
                            type="time"
                            value={openingHours}
                            onChange={(e) => setOpeningHours(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-brand-dark"
                        />
                    </div>
                    <button onClick={handleNext} className="w-full mt-4 bg-brand-dark text-white font-bold py-3 rounded-lg hover:bg-blue-700">
                        Continuar
                    </button>
                </div>
            </div>
        );
        if (step === 2) return (
            <div className="text-center animate-fade-in">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-dark">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Configuración Completa</h2>
                <p className="text-slate-600 mb-8">Tu panel de administración está listo. Empieza a registrar miembros y controlar tus finanzas.</p>
                <button
                    onClick={() => onComplete({ capacity, openingHours })}
                    className="bg-brand-dark text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 shadow-lg"
                >
                    Ir al Panel
                </button>
            </div>
        );
        return null;
    }

    const CoachContent = () => {
        if (step === 0) return (
            <div className="text-center animate-fade-in">
                <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">🧢</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Hola, Coach {user.name.split(' ')[0]}</h2>
                <p className="text-slate-600 mb-8">Lleva tu carrera al siguiente nivel. Gestiona clientes y agenda sesiones fácilmente.</p>
                <button onClick={handleNext} className="bg-purple-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-purple-700 transition-transform transform hover:scale-105 shadow-lg">
                    Crear Perfil Pro
                </button>
            </div>
        );
        if (step === 1) return (
            <div className="animate-fade-in">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Tu Especialidad</h2>
                <div className="grid grid-cols-2 gap-4">
                    {['Musculación', 'Yoga', 'CrossFit', 'Funcional', 'Rehabilitación', 'Nutrición'].map((spec) => (
                        <button
                            key={spec}
                            onClick={() => { setSpecialty(spec); handleNext(); }}
                            className={`p-3 border rounded-lg hover:bg-purple-50 hover:border-purple-500 font-medium transition-colors ${specialty === spec ? 'bg-purple-50 border-purple-500 text-purple-700' : 'text-slate-700'}`}
                        >
                            {spec}
                        </button>
                    ))}
                </div>
            </div>
        );
        if (step === 2) return (
            <div className="text-center animate-fade-in">
                <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 text-purple-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">¡Perfil Listo!</h2>
                <p className="text-slate-600 mb-8">Ya puedes empezar a recibir reservas y conectar con clientes.</p>
                <button
                    onClick={() => onComplete({ specialty })}
                    className="bg-purple-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-purple-700 shadow-lg"
                >
                    Ver mi Agenda
                </button>
            </div>
        );
        return null;
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[500px]">
                {/* Left Side / Banner */}
                <div className={`w-full md:w-2/5 p-8 flex flex-col justify-between text-white ${user.accountType === 'gym' ? 'bg-brand-dark' : user.accountType === 'entrenador' ? 'bg-purple-600' : 'bg-brand-primary'}`}>
                    <div>
                        <div className="bg-white/20 p-2 rounded-lg inline-block mb-4">
                            <FitnessFlowLogo />
                        </div>
                        <h1 className="text-3xl font-extrabold mb-2">FitnessFlow</h1>
                        <p className="opacity-90">Configuración Inicial</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${step >= 0 ? 'bg-white' : 'bg-white/30'}`}></div>
                            <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-white' : 'bg-white/30'}`}></div>
                            <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-white' : 'bg-white/30'}`}></div>
                            <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-white' : 'bg-white/30'}`}></div>
                            <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-white' : 'bg-white/30'}`}></div>
                        </div>
                        <p className="text-xs opacity-75 text-right">Paso {step + 1} de 3</p>
                    </div>
                </div>

                {/* Right Side / Content */}
                <div className="w-full md:w-3/5 p-8 flex flex-col justify-center relative">
                    {user.accountType === 'user' && <UserContent />}
                    {user.accountType === 'gym' && <GymContent />}
                    {user.accountType === 'entrenador' && <CoachContent />}
                </div>
            </div>
        </div>
    );
};
