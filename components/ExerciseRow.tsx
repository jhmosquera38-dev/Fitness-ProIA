import React, { useState, useMemo, useRef, useEffect } from 'react';
import { type Exercise } from '../types';
import { EXERCISE_DATA } from '../data/exercises';

// ============================================================================
// FILA DE EJERCICIO (ExerciseRow.tsx)
// ============================================================================
// Componente utilizado en las listas de rutinas (pantalla "Mi Rutina").
// Muestra nombre, series y reps. Expandible para ver instrucciones y video.
// Implementa lógica inteligente para asociar ejercicios de la rutina (texto)
// con la base de datos de ejercicios (video, imágenes, categorías).
// ============================================================================

interface ExerciseRowProps {
    exercise: Exercise;
}

export const ExerciseRow: React.FC<ExerciseRowProps> = ({ exercise }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isVideoLoading, setIsVideoLoading] = useState(true);
    const [videoError, setVideoError] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Lógica inteligente para encontrar un video de la librería que coincida
    // con el nombre del ejercicio generado por la IA de rutina.
    const matchingLibraryExercise = useMemo(() => {
        const searchName = exercise.name.toLowerCase();

        // 1. Intento de coincidencia exacta
        let match = EXERCISE_DATA.find(e => e.name.toLowerCase() === searchName);

        // 2. Intento de coincidencia parcial
        if (!match) {
            match = EXERCISE_DATA.find(e => searchName.includes(e.name.toLowerCase()) || e.name.toLowerCase().includes(searchName));
        }

        // 3. Intento de coincidencia por palabras clave (Fallback si la IA usa nombres variables)
        if (!match) {
            if (searchName.includes('sentadilla') || searchName.includes('squat')) match = EXERCISE_DATA.find(e => e.name.includes('Sentadilla'));
            else if (searchName.includes('push') || searchName.includes('flexi')) match = EXERCISE_DATA.find(e => e.name.includes('Flexiones'));
            else if (searchName.includes('plancha') || searchName.includes('plank')) match = EXERCISE_DATA.find(e => e.name.includes('Plancha'));
            else if (searchName.includes('correr') || searchName.includes('run')) match = EXERCISE_DATA.find(e => e.name.includes('Correr'));
            else if (searchName.includes('salto') || searchName.includes('jump')) match = EXERCISE_DATA.find(e => e.name.includes('Saltos'));
        }

        return match;
    }, [exercise.name]);

    // Imagen de relleno si no se encuentra coincidencia (loremflickr con keywords)
    const imageUrl = matchingLibraryExercise?.imageUrl || `https://loremflickr.com/320/240/${exercise.imageSearchQuery.replace(/\s/g, ',')},gym,exercise/all?lock=${encodeURIComponent(exercise.name)}`;

    const videoUrl = matchingLibraryExercise?.videoUrl;

    // Manejar lógica de reproducción de video cuando se expande la fila
    useEffect(() => {
        if (isExpanded && videoRef.current && videoUrl && !videoError) {
            // Reset loading state when expanded
            setIsVideoLoading(true);
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        // Reproducción iniciada con éxito
                    })
                    .catch(e => {
                        console.log('Autoplay prevented or interrupted', e);
                        // Si falla el autoplay, fallamos silenciosamente a la imagen estática
                    });
            }
        } else if (!isExpanded && videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    }, [isExpanded, videoUrl, videoError]);

    // Callback cuando el video ha cargado y está listo para reproducirse
    const handleVideoLoaded = () => {
        setIsVideoLoading(false);
    };

    // Callback cuando ocurre un error al cargar o reproducir el video
    const handleVideoError = () => {
        setVideoError(true);
        setIsVideoLoading(false);
    };

    return (
        <div className="border-b border-gray-700/50 last:border-b-0">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                aria-expanded={isExpanded}
                className="w-full text-left p-4 hover:bg-gray-700/40 focus:outline-none focus:bg-gray-700/60 transition-colors duration-200"
            >
                <div className="grid grid-cols-4 gap-2 items-center">
                    <div className="col-span-4 sm:col-span-2 flex items-center gap-2">
                        {matchingLibraryExercise?.videoUrl && (
                            <span className="bg-brand-primary text-brand-dark text-[10px] px-1.5 py-0.5 rounded font-bold flex-shrink-0">VIDEO</span>
                        )}
                        <p className="font-semibold text-gray-100">{exercise.name}</p>
                    </div>
                    <div className="text-center">
                        <span className="text-xs text-gray-400 sm:hidden">Series</span>
                        <p className="text-gray-200">{exercise.sets}</p>
                    </div>
                    <div className="text-center">
                        <span className="text-xs text-gray-400 sm:hidden">Reps</span>
                        <p className="text-gray-200">{exercise.reps}</p>
                    </div>
                </div>
            </button>

            {/* Panel Expandible */}
            {isExpanded && (
                <div className="p-4 bg-gray-900/50 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Texto y Detalles */}
                        <div className="md:col-span-2">
                            <h5 className="font-semibold text-brand-accent mb-2">Instrucciones Técnicas</h5>
                            <p className="text-gray-300 text-sm whitespace-pre-line leading-relaxed">{exercise.description}</p>
                            <div className="flex flex-wrap gap-4 mt-4">
                                <div className="bg-gray-800/50 px-3 py-2 rounded-lg border border-gray-700">
                                    <span className="text-xs text-gray-400 block uppercase">Descanso</span>
                                    <span className="font-bold text-white">{exercise.rest} seg</span>
                                </div>
                                {matchingLibraryExercise && (
                                    <div className="bg-gray-800/50 px-3 py-2 rounded-lg border border-gray-700">
                                        <span className="text-xs text-gray-400 block uppercase">Categoría</span>
                                        <span className="font-bold text-brand-primary">{matchingLibraryExercise.category}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Video / Imagen Visual */}
                        <div className="md:col-span-1 flex items-center justify-center">
                            <div className="w-full max-w-xs rounded-lg shadow-lg overflow-hidden border border-gray-700 bg-black relative group aspect-video">
                                {videoUrl && !videoError ? (
                                    <>
                                        <video
                                            ref={videoRef}
                                            src={videoUrl}
                                            poster={imageUrl}
                                            className={`w-full h-full object-cover transition-opacity duration-300 ${isVideoLoading ? 'opacity-0' : 'opacity-100'}`}
                                            muted
                                            loop
                                            playsInline
                                            controls={false}
                                            onLoadedData={handleVideoLoaded}
                                            onError={handleVideoError}
                                            preload="metadata"
                                        />
                                        {/* Loading Spinner */}
                                        {isVideoLoading && (
                                            <div className="absolute inset-0 flex items-center justify-center z-10">
                                                <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                                            </div>
                                        )}
                                        {/* Poster Image (shown while loading) */}
                                        {isVideoLoading && (
                                            <img
                                                src={imageUrl}
                                                alt={`Loading ${exercise.name}`}
                                                className="absolute inset-0 w-full h-full object-cover"
                                            />
                                        )}

                                        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm flex items-center gap-1 z-20">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 animate-pulse" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                                            Video Instruccional
                                        </div>
                                    </>
                                ) : (
                                    <img
                                        src={imageUrl}
                                        alt={`Demostración de ${exercise.name}`}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
