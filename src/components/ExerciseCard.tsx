
import React, { useState, useRef, useEffect } from 'react';
import { type LibraryExercise, type ExerciseDifficulty } from '../types';

// ============================================================================
// TARJETA DE EJERCICIO (ExerciseCard.tsx)
// ============================================================================
// Componente de UI para mostrar un resumen de un ejercicio en la biblioteca.
// Incluye una vista previa de video en hover y badges de dificultad/premium.
// ============================================================================

interface ExerciseCardProps {
    exercise: LibraryExercise;
    onCardClick: () => void;
}

const difficultyStyles: Record<ExerciseDifficulty, string> = {
    Principiante: 'bg-green-100 text-green-800',
    Intermedio: 'bg-yellow-100 text-yellow-800',
    Avanzado: 'bg-red-100 text-red-800',
};

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onCardClick }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isHovering, setIsHovering] = useState(false);

    // Manejar la reproducción de video al pasar el mouse (hover)
    useEffect(() => {
        if (videoRef.current) {
            if (isHovering) {
                // Reiniciar al inicio si ya terminó
                if (videoRef.current.ended) videoRef.current.currentTime = 0;

                const playPromise = videoRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch(() => {
                        // El auto-play fue prevenido o interrumpido
                        // Es aceptable que falle silenciosamente, se mostrará el poster
                    });
                }
            } else {
                videoRef.current.pause();
                videoRef.current.currentTime = 0; // Reset preview
            }
        }
    }, [isHovering]);

    return (
        <button
            onClick={onCardClick}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:scale-95 text-left w-full group relative"
        >

            <div className="relative aspect-video overflow-hidden bg-black">
                {exercise.videoUrl ? (
                    <video
                        ref={videoRef}
                        src={exercise.videoUrl}
                        poster={exercise.imageUrl}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                        muted
                        loop
                        playsInline
                        preload="metadata"
                    />
                ) : (
                    <img src={exercise.imageUrl} alt={exercise.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 pointer-events-none"></div>

                {/* Badge de Dificultad */}
                <span className={`absolute top-3 right-3 px-2 py-1 text-[10px] font-bold uppercase tracking-wide rounded-md shadow-sm ${difficultyStyles[exercise.difficulty]} z-10`}>
                    {exercise.difficulty}
                </span>

                {/* Badge Premium (si aplica) */}
                {exercise.isPremium && (
                    <span className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-1 rounded-md shadow-sm z-10">PREMIUM</span>
                )}

                {/* Icono de Play (se desvanece en hover) */}
                {exercise.videoUrl && (
                    <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 transition-opacity duration-300 ${isHovering ? 'opacity-0' : 'opacity-80'}`}>
                        <div className="bg-black/40 rounded-full p-2 backdrop-blur-sm border border-white/30">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                )}

                <div className="absolute bottom-3 left-3 text-white z-10">
                    <h3 className="text-lg font-bold leading-tight text-shadow-sm">{exercise.name}</h3>
                </div>
            </div>

            <div className="p-4 flex flex-col flex-grow justify-between">
                <div className="flex flex-wrap gap-2 mb-3">
                    {exercise.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="px-2 py-1 text-xs text-slate-600 bg-slate-100 rounded-md">
                            {tag}
                        </span>
                    ))}
                    {exercise.tags.length > 3 && <span className="px-2 py-1 text-xs text-slate-400">+</span>}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3 mt-1">
                    <div className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>{exercise.duration} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <span className="truncate max-w-[80px]">{exercise.category}</span>
                    </div>
                </div>
            </div>
        </button>
    );
};
