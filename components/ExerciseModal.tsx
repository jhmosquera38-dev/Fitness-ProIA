
import React from 'react';
import { type LibraryExercise, type ExerciseDifficulty } from '../types';

// ============================================================================
// MODAL DE DETALLES DE EJERCICIO (ExerciseModal.tsx)
// ============================================================================
// Modal emergente que muestra información completa de un ejercicio:
// video demo, instrucciones paso a paso, grupos musculares, equipo necesario, etc.
// ============================================================================

interface ExerciseModalProps {
    exercise: LibraryExercise;
    onClose: () => void;
    onStartExercise?: () => void;
}

const difficultyStyles: Record<ExerciseDifficulty, string> = {
    Principiante: 'bg-green-100 text-green-800',
    Intermedio: 'bg-yellow-100 text-yellow-800',
    Avanzado: 'bg-red-100 text-red-800',
};

const HeartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
    </svg>
);


export const ExerciseModal: React.FC<ExerciseModalProps> = ({ exercise, onClose, onStartExercise }) => {

    // Evitar el scroll del fondo cuando el modal está abierto
    React.useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
            console.log("Cerrando modal");
        };
    }, []);

    const handleStartExercise = () => {
        if (onStartExercise) {
            onStartExercise();
        } else {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 animate-fade-in"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col"
                onClick={(e) => e.stopPropagation()} // Evitar que el clic dentro del modal lo cierre
            >
                {/* Encabezado */}
                <div className="p-4 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-sm z-10">
                    <div className="flex items-center gap-4">
                        <HeartIcon />
                        <h2 className="text-2xl font-bold text-slate-800">{exercise.name}</h2>
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${difficultyStyles[exercise.difficulty]}`}>
                            {exercise.difficulty}
                        </span>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Contenido Principal */}
                <div className="p-6 md:p-8 flex-grow">
                    <p className="text-slate-600 mb-6">{exercise.description}</p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Video o Imagen */}
                        <div className="lg:order-2">
                            <div className="w-full aspect-video bg-black rounded-xl shadow-md overflow-hidden relative group">
                                {exercise.videoUrl ? (
                                    <video
                                        src={exercise.videoUrl}
                                        poster={exercise.imageUrl}
                                        controls
                                        className="w-full h-full object-cover"
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                    />
                                ) : (
                                    <img src={exercise.imageUrl} alt={exercise.name} className="w-full h-full object-cover" />
                                )}
                                {/* AI Label */}
                                {exercise.videoUrl && (
                                    <div className="absolute top-2 right-2 bg-brand-primary/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md">
                                        Video Demo
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Detalles e Instrucciones */}
                        <div className="lg:order-1 space-y-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 mb-2">Grupos Musculares</h3>
                                <div className="flex flex-wrap gap-2">
                                    {exercise.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1 text-sm font-medium text-brand-primary bg-green-50 rounded-full">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 mb-3">Instrucciones</h3>
                                <ol className="list-decimal list-inside space-y-2 text-slate-600">
                                    {exercise.instructions.map((step, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <span className="bg-brand-primary text-white text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0 mt-0.5">{index + 1}</span>
                                            <span>{step}</span>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pie de modal (Resumen de métricas) */}
                <div className="p-4 md:p-6 bg-slate-50 border-t border-slate-200 grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="col-span-2 md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-slate-600"><span className="text-green-500 text-lg">◎</span> <div><span className="font-bold">Categoría:</span> {exercise.category}</div></div>
                        <div className="flex items-center gap-2 text-slate-600"><span className="text-blue-500 text-lg">⏱️</span> <div><span className="font-bold">Duración:</span> {exercise.duration}min</div></div>
                        <div className="flex items-center gap-2 text-slate-600"><span className="text-orange-500 text-lg">🔥</span> <div><span className="font-bold">Calorías:</span> {exercise.caloriesPerMin}/min</div></div>
                        <div className="flex items-center gap-2 text-slate-600"><span className="text-purple-500 text-lg">🏋️</span> <div><span className="font-bold">Equipo:</span> {exercise.equipment}</div></div>
                    </div>
                    <div className="col-span-2">
                        <button
                            onClick={handleStartExercise}
                            className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                            Comenzar Ejercicio
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
