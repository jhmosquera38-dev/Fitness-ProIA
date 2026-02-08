
import React, { useState, useRef, useEffect } from 'react';
import { CoachService } from '../types';

interface ServiceCardProps {
    service: CoachService;
    onViewDetails: (service: CoachService) => void;
    isCoachView?: boolean;
    onEdit?: (service: CoachService) => void;
    onDelete?: (service: CoachService) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onViewDetails, isCoachView = false, onEdit, onDelete }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [isVideoReady, setIsVideoReady] = useState(false);

    // Handle video playback on hover with robust promise handling
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        let playPromise: Promise<void> | undefined;

        if (isHovering) {
            if (video.ended) video.currentTime = 0;

            // Only try to play if we have enough data or if it's cached
            if (video.readyState >= 2 || isVideoReady) {
                playPromise = video.play();
            } else {
                // If not ready, load it
                video.load();
                playPromise = video.play();
            }

            if (playPromise !== undefined) {
                playPromise
                    .catch(error => {
                        // Auto-play was prevented or interrupted. 
                        // This is common when mouse leaves quickly.
                        // We silence this specific error.
                        if (error.name !== 'AbortError') {
                            console.log('Video play interrupted');
                        }
                    });
            }
        } else {
            // Pause immediately on mouse leave
            video.pause();
            // Optional: Reset time to create a "preview" feel each time
            video.currentTime = 0;
        }
    }, [isHovering, isVideoReady]);

    const handleVideoLoaded = () => {
        setIsVideoReady(true);
    };

    return (
        <div
            className={`bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col overflow-hidden ${isCoachView ? '' : 'transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl'}`}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <div
                className="flex flex-col flex-grow text-left focus:outline-none rounded-lg disabled:cursor-default group relative"
            >
                <div className="relative w-full h-48 bg-black overflow-hidden cursor-pointer" onClick={() => !isCoachView && onViewDetails(service)}>
                    {service.videoUrl ? (
                        <>
                            <video
                                ref={videoRef}
                                src={service.videoUrl}
                                poster={service.imageUrl}
                                className={`w-full h-full object-cover transition-opacity duration-300 ${isHovering && isVideoReady ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}
                                muted
                                loop
                                playsInline
                                preload="metadata"
                                onLoadedData={handleVideoLoaded}
                            />
                            {/* Fallback Image (visible when not hovering or video not ready) */}
                            <img
                                src={service.imageUrl}
                                alt={service.name}
                                className={`w-full h-full object-cover transition-transform duration-500 ${isHovering ? 'scale-105' : ''} ${isHovering && isVideoReady ? 'opacity-0' : 'opacity-100'}`}
                            />

                            {/* Loading spinner for video on hover */}
                            {isHovering && !isVideoReady && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px] z-20">
                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                        </>
                    ) : (
                        <img src={service.imageUrl} alt={service.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    )}

                    {/* Play Icon Overlay (Only shows when not hovering if video exists) */}
                    {service.videoUrl && !isHovering && (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/30 backdrop-blur-sm p-2 rounded-full border border-white/20 transition-opacity duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 z-10">
                        <p className="text-white text-xs font-bold flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            {service.coach}
                        </p>
                    </div>
                </div>

                <div className="p-4 flex flex-col flex-grow bg-white relative z-10">
                    <h3 className="font-bold text-slate-800 line-clamp-1">{service.name}</h3>
                    <p className="text-sm text-slate-600 mt-1 flex-grow line-clamp-2">{service.description}</p>
                    <div className="text-xs text-slate-500 mt-3 flex justify-between items-center pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>{service.duration} min</span>
                        </div>
                        <span className="font-bold text-brand-primary text-base">${service.price.toLocaleString('es-CO')}</span>
                    </div>
                </div>

                {isCoachView ? (
                    <div className="px-4 pb-4 bg-white mt-auto flex gap-2">
                        <button
                            onClick={(e) => { e.stopPropagation(); onEdit && onEdit(service); }}
                            className="flex-1 py-2 px-3 text-sm font-bold text-slate-600 bg-slate-100 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            Editar
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete && onDelete(service); }}
                            className="flex-1 py-2 px-3 text-sm font-bold text-slate-600 bg-slate-100 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors flex items-center justify-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            Eliminar
                        </button>
                    </div>
                ) : (
                    <div className="px-4 pb-4 bg-white mt-auto cursor-pointer" onClick={() => onViewDetails(service)}>
                        <div className="w-full bg-slate-50 text-brand-primary font-bold text-sm py-2.5 px-4 rounded-lg text-center border border-brand-primary/20 group-hover:bg-brand-primary group-hover:text-white transition-colors">
                            Ver Detalles y Reservar
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
