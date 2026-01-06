import React, { useState, useEffect, useRef } from 'react';
import { GroupClass } from '../types';
import { useFeedback } from './FeedbackSystem';

const difficultyStyles: Record<string, string> = {
    Principiante: 'bg-green-500/20 text-green-300 border-green-500/30',
    Intermedio: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    Avanzado: 'bg-red-500/20 text-red-300 border-red-500/30',
};

interface ClassCardProps {
    classData: GroupClass;
    onBook?: (id: number) => Promise<void>;
}

export const ClassCard: React.FC<ClassCardProps> = ({ classData, onBook }) => {
    const [isBooked, setIsBooked] = useState(false);
    const { showToast } = useFeedback();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isInView, setIsInView] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    // Helper to get next session time
    const nextSession = classData.schedule[0];

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    setIsInView(entry.isIntersecting);
                });
            },
            { threshold: 0.4 } // Autoplay when 40% visible
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => {
            if (cardRef.current) observer.unobserve(cardRef.current);
        };
    }, []);

    useEffect(() => {
        if (videoRef.current) {
            if (isInView) {
                videoRef.current.play().catch(() => { });
            } else {
                videoRef.current.pause();
            }
        }
    }, [isInView]);

    const handleBooking = async () => {
        if (isBooked) return;
        if (onBook) {
            try {
                await onBook(classData.id);
                setIsBooked(true);
            } catch (err) {
                console.error(err);
            }
        } else {
            setIsBooked(true);
            showToast(`¡Reserva exitosa para ${classData.name}!`, 'success');
        }
    };

    return (
        <div
            ref={cardRef}
            className="group relative h-72 rounded-3xl overflow-hidden cursor-pointer transition-transform duration-500 hover:scale-[1.02] shadow-2xl shadow-black/50"
        >
            {/* Background Layer */}
            <div className="absolute inset-0 bg-slate-900">
                {classData.videoUrl ? (
                    <video
                        ref={videoRef}
                        src={classData.videoUrl}
                        poster={classData.imageUrl}
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700"
                        muted
                        loop
                        playsInline
                        preload="metadata"
                    />
                ) : (
                    <img src={classData.imageUrl} alt={classData.name} className="w-full h-full object-cover opacity-60" />
                )}
                {/* Cinematic Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            </div>

            {/* Content Layer */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">

                {/* Top Badges */}
                <div className="flex justify-between items-start">
                    <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider border rounded-full backdrop-blur-md ${classData.difficulty ? difficultyStyles[classData.difficulty] : ''}`}>
                        {classData.difficulty}
                    </span>
                    <span className="bg-white/10 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        AI Cam
                    </span>
                </div>

                {/* Bottom Info */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-brand-primary flex items-center justify-center text-brand-dark text-xs font-bold">
                            {classData.coach.charAt(0)}
                        </div>
                        <span className="text-slate-300 text-xs font-medium">{classData.coach}</span>
                    </div>

                    <h3 className="text-2xl font-black text-white mb-1 leading-none tracking-tight group-hover:text-brand-primary transition-colors">{classData.name}</h3>
                    <p className="text-slate-400 text-xs uppercase font-bold tracking-widest mb-4">{classData.category}</p>

                    {/* Expandable Action Area */}
                    <div className="flex items-center justify-between gap-4 mt-2">
                        <div className="flex items-center gap-2 text-slate-300 text-xs bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span className="font-mono">{nextSession ? `${nextSession.day} ${nextSession.time}` : 'Flexible'}</span>
                        </div>

                        <button
                            onClick={(e) => { e.stopPropagation(); handleBooking(); }}
                            disabled={isBooked}
                            className={`flex-grow py-2 px-4 rounded-xl text-xs font-bold uppercase tracking-wide transition-all active:scale-95 shadow-lg
                                ${isBooked
                                    ? 'bg-green-500/20 text-green-400 border border-green-500/50 cursor-default'
                                    : 'bg-white text-slate-900 hover:bg-brand-primary hover:text-slate-900'
                                }`}
                        >
                            {isBooked ? 'Reservado' : 'Reservar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};