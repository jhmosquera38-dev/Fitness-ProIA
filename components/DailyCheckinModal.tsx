
import React, { useState } from 'react';
import { DailyCheckin } from '../types';

interface DailyCheckinModalProps {
    userName: string;
    onComplete: (data: Omit<DailyCheckin, 'date'>) => void;
    isSubmitting?: boolean;
    onClose?: () => void;
}

export const DailyCheckinModal: React.FC<DailyCheckinModalProps> = ({ userName, onComplete, isSubmitting = false, onClose }) => {
    const [step, setStep] = useState(1);
    const [energy, setEnergy] = useState(5);
    const [sleep, setSleep] = useState<DailyCheckin['sleepQuality']>('average');
    const [soreness, setSoreness] = useState<DailyCheckin['soreness']>('low');
    const [mood, setMood] = useState<DailyCheckin['mood']>('neutral');

    const handleFinish = () => {
        onComplete({
            energyLevel: energy,
            sleepQuality: sleep,
            soreness: soreness,
            mood: mood
        });
    };

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-700 relative">
                {onClose && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors z-10"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
                <div className="p-1 h-2 bg-slate-100 dark:bg-slate-700">
                    <div
                        className="h-full bg-brand-primary rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${(step / 4) * 100}%` }}
                    ></div>
                </div>

                <div className="p-8 text-center">
                    {step === 1 && (
                        <div className="animate-slide-up">
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Hola, {userName} 👋</h2>
                            <p className="text-slate-500 dark:text-slate-400 mb-8">¿Cómo está tu nivel de energía hoy?</p>

                            <div className="relative mb-8 px-4">
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    value={energy}
                                    onChange={(e) => setEnergy(parseInt(e.target.value))}
                                    className="w-full h-3 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                                />
                                <div className="flex justify-between mt-4 text-sm font-bold text-slate-400">
                                    <span>Agotado 🔋</span>
                                    <span className="text-brand-primary text-xl">{energy}</span>
                                    <span>Imparable ⚡</span>
                                </div>
                            </div>
                            <button onClick={() => setStep(2)} className="w-full bg-brand-primary text-white font-bold py-3 rounded-xl hover:bg-brand-secondary transition-colors">Siguiente</button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-slide-up">
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">¿Cómo dormiste anoche? 💤</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { id: 'poor', label: 'Mal', icon: '😫' },
                                    { id: 'average', label: 'Regular', icon: '😐' },
                                    { id: 'good', label: 'Bien', icon: '🙂' },
                                    { id: 'excellent', label: 'Excelente', icon: '🤩' }
                                ].map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => { setSleep(option.id as any); setStep(3); }}
                                        className={`p-4 rounded-xl border-2 transition-all ${sleep === option.id ? 'border-brand-primary bg-brand-primary/10' : 'border-slate-200 dark:border-slate-600 hover:border-brand-primary/50'}`}
                                    >
                                        <div className="text-3xl mb-2">{option.icon}</div>
                                        <div className="font-bold text-slate-700 dark:text-slate-200">{option.label}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="animate-slide-up">
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">¿Sientes dolor muscular? 🩹</h2>
                            <div className="space-y-3">
                                {[
                                    { id: 'none', label: 'Nada, estoy fresco', color: 'bg-green-100 text-green-700' },
                                    { id: 'low', label: 'Un poco (Agujetas leves)', color: 'bg-blue-100 text-blue-700' },
                                    { id: 'medium', label: 'Moderado', color: 'bg-yellow-100 text-yellow-700' },
                                    { id: 'high', label: 'Sí, me cuesta moverme', color: 'bg-red-100 text-red-700' }
                                ].map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => { setSoreness(option.id as any); setStep(4); }}
                                        className={`w-full p-4 rounded-xl font-bold transition-transform hover:scale-[1.02] border-2 border-transparent ${option.color}`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="animate-slide-up">
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">¿Cuál es tu "Mood" hoy? 🧠</h2>
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                {[
                                    { id: 'motivated', label: 'Motivado', icon: '🔥' },
                                    { id: 'stressed', label: 'Estresado', icon: '🤯' },
                                    { id: 'tired', label: 'Cansado', icon: '🥱' },
                                    { id: 'neutral', label: 'Normal', icon: '😐' }
                                ].map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => setMood(option.id as any)}
                                        className={`p-4 rounded-xl border-2 transition-all ${mood === option.id ? 'border-brand-primary bg-brand-primary/10 ring-2 ring-brand-primary ring-offset-2 dark:ring-offset-slate-800' : 'border-slate-200 dark:border-slate-600'}`}
                                    >
                                        <div className="text-3xl mb-1">{option.icon}</div>
                                        <div className="font-medium text-slate-700 dark:text-slate-200">{option.label}</div>
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={handleFinish}
                                disabled={isSubmitting}
                                className={`w-full bg-brand-primary text-white font-bold py-3 rounded-xl hover:bg-brand-secondary transition-colors shadow-lg shadow-brand-primary/30 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? 'Personalizando...' : 'Personalizar mi Rutina'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
