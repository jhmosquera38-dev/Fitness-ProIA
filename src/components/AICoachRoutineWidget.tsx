import React, { useState } from 'react';
import { generateCoachRoutine } from '../services/geminiService';
import { Client } from '../types';

interface AICoachRoutineWidgetProps {
    clients: Client[];
}

export const AICoachRoutineWidget: React.FC<AICoachRoutineWidgetProps> = ({ clients }) => {
    const [selectedClientId, setSelectedClientId] = useState<string>('');
    const [objective, setObjective] = useState<string>('');
    const [routine, setRoutine] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        if (!selectedClientId) return;
        const client = clients.find(c => c.id.toString() === selectedClientId);
        if (!client) return;

        setIsLoading(true);
        try {
            const result = await generateCoachRoutine(client, objective || client.objective || 'Fitness General');
            setRoutine(result);
        } catch (error) {
            console.error(error);
            setRoutine('Error al generar la rutina. Intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(routine);
        alert('Rutina copiada al portapapeles. ¡Ahora puedes pegarla en el chat del alumno!');
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 space-y-4">
            <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">🤖</span>
                <div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">Generador de Rutinas IA Pro</h2>
                    <p className="text-xs text-slate-500">Crea rutinas personalizadas para tus alumnos en segundos.</p>
                </div>
            </div>

            <div className="space-y-3">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Seleccionar Alumno</label>
                    <select
                        value={selectedClientId}
                        onChange={(e) => setSelectedClientId(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-primary/20"
                    >
                        <option value="">-- Elige un alumno --</option>
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>{client.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Objetivo del Entrenamiento</label>
                    <input
                        type="text"
                        placeholder="Ej: Glúteos y Pierna, Hipertrofia Tren Superior..."
                        value={objective}
                        onChange={(e) => setObjective(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-primary/20"
                    />
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={!selectedClientId || isLoading}
                    className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${!selectedClientId || isLoading
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-lg shadow-brand-primary/20 hover:scale-[1.02]'
                        }`}
                >
                    {isLoading ? (
                        <><span className="animate-spin text-lg">⏳</span> Generando...</>
                    ) : (
                        <><span className="text-lg">✨</span> Generar con IA Pro</>
                    )}
                </button>
            </div>

            {routine && (
                <div className="mt-6 animate-fade-in-up">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold text-brand-primary uppercase">Rutina Sugerida</label>
                        <button onClick={handleCopy} className="text-[10px] font-bold text-slate-400 hover:text-brand-secondary transition-colors underline">Copiar Texto</button>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 h-64 overflow-y-auto custom-scrollbar">
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                            <pre className="whitespace-pre-wrap font-sans text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                                {routine}
                            </pre>
                        </div>
                    </div>
                    <p className="mt-3 text-[10px] text-slate-400 italic text-center">
                        * Revisa siempre la rutina antes de enviarla a tu alumno.
                    </p>
                </div>
            )}
        </div>
    );
};
