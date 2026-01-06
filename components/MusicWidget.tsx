
import React, { useState, useRef, useEffect } from 'react';

interface Playlist {
    id: string;
    name: string;
    genre: string;
    bpm: string;
    color: string;
    icon: string;
    audioSrc: string;
}

// Música de alta energía estilo gimnasio (Royalty Free para evitar problemas de copyright en demos)
const PLAYLISTS: Playlist[] = [
    {
        id: '1',
        name: 'Gym Phonk 😈',
        genre: 'Hard Phonk / Trap',
        bpm: '160 BPM',
        color: 'from-purple-600 to-indigo-700',
        icon: '💀',
        audioSrc: 'https://cdn.pixabay.com/download/audio/2023/06/13/audio_4048074697.mp3' // Phonk style track
    },
    {
        id: '2',
        name: 'Pump It Up ⚡',
        genre: 'EDM / House',
        bpm: '128 BPM',
        color: 'from-blue-500 to-cyan-400',
        icon: '👟',
        audioSrc: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3' // Upbeat cardio
    },
    {
        id: '3',
        name: 'Beast Mode 🦁',
        genre: 'Epic / Rock Hybrid',
        bpm: '140 BPM',
        color: 'from-red-600 to-orange-600',
        icon: '🔥',
        audioSrc: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_28c9466378.mp3' // Epic sport
    },
    {
        id: '4',
        name: 'Cooldown Flow 🍃',
        genre: 'Lofi / Ambient',
        bpm: '80 BPM',
        color: 'from-emerald-400 to-green-500',
        icon: '🧘',
        audioSrc: 'https://cdn.pixabay.com/download/audio/2021/11/25/audio_91b721839e.mp3' // Ambient
    }
];

interface MusicWidgetProps {
    isOpen: boolean;
    onClose: () => void;
}

const EqualizerBar = () => (
    <div className="flex items-end gap-0.5 h-4">
        <div className="w-1 bg-brand-primary animate-[bounce_1s_infinite] h-2"></div>
        <div className="w-1 bg-brand-primary animate-[bounce_1.2s_infinite] h-3"></div>
        <div className="w-1 bg-brand-primary animate-[bounce_0.8s_infinite] h-1.5"></div>
        <div className="w-1 bg-brand-primary animate-[bounce_1.1s_infinite] h-4"></div>
    </div>
);

export const MusicWidget: React.FC<MusicWidgetProps> = ({ isOpen, onClose }) => {
    const [currentTrack, setCurrentTrack] = useState<Playlist | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const audioRef = useRef<HTMLAudioElement>(null);

    // Initial volume set
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, []);

    // Update volume when slider changes
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    // Handle play/pause logic
    useEffect(() => {
        if (currentTrack && audioRef.current) {
            if (isPlaying) {
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch(e => {
                        // FIX: Avoid logging full event/error objects to prevent circular structure JSON errors in some consoles
                        // e might not always be an Error object with a message property in all browsers
                        const errorMessage = e instanceof Error ? e.message : String(e);
                        console.error("Playback failed:", errorMessage);
                        setIsPlaying(false);
                    });
                }
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, currentTrack]);

    const handleTrackClick = (track: Playlist) => {
        if (currentTrack?.id === track.id) {
            // Toggle play/pause if same track
            setIsPlaying(!isPlaying);
        } else {
            // New track
            setCurrentTrack(track);
            setIsPlaying(true);
            if (audioRef.current) {
                audioRef.current.src = track.audioSrc;
                audioRef.current.load();
                // Play is triggered by the useEffect dependency on currentTrack/isPlaying
            }
        }
    };

    const handleAudioError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
        // FIX: Log specific properties instead of the full event object
        const target = e.currentTarget;
        const errorCode = target.error ? target.error.code : 'unknown';
        const errorMessage = target.error ? target.error.message : 'Unknown error occurred';

        console.error(`Audio error (Code: ${errorCode}): ${errorMessage}`);
        setIsPlaying(false);
    }

    // Control de visibilidad: Mantenemos el componente montado pero oculto
    // para que la música siga sonando en segundo plano.
    const containerClass = isOpen
        ? "opacity-100 pointer-events-auto translate-y-0"
        : "opacity-0 pointer-events-none -translate-y-2";

    return (
        <>
            {/* Invisible Audio Element with error handling */}
            <audio
                ref={audioRef}
                loop
                onError={handleAudioError}
                crossOrigin="anonymous"
                preload="auto"
                playsInline
            />

            {/* Backdrop for mobile to close when clicking outside */}
            {isOpen && (
                <div className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px] md:hidden" onClick={onClose} />
            )}

            <div className={`absolute top-16 right-0 md:right-10 w-80 z-50 transition-all duration-300 ease-in-out transform origin-top-right ${containerClass}`}>
                <div className="bg-white/90 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center ${isPlaying ? 'animate-pulse shadow-[0_0_10px_rgba(0,255,200,0.5)]' : ''}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-sm tracking-wide">FitnessFlow Vibe</span>
                                {currentTrack && isPlaying ? (
                                    <span className="text-[10px] text-brand-primary animate-pulse">Reproduciendo...</span>
                                ) : (
                                    <span className="text-[10px] text-slate-400">Selecciona música</span>
                                )}
                            </div>
                        </div>
                        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>

                    {/* Playlist List */}
                    <div className="p-2 space-y-1 max-h-64 overflow-y-auto">
                        {PLAYLISTS.map((playlist) => {
                            const isActive = currentTrack?.id === playlist.id;
                            return (
                                <button
                                    key={playlist.id}
                                    onClick={() => handleTrackClick(playlist)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group cursor-pointer text-left border ${isActive ? 'bg-slate-100 dark:bg-slate-700/60 border-brand-primary/30' : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-700/30'}`}
                                >
                                    <div className={`relative w-12 h-12 rounded-lg bg-gradient-to-br ${playlist.color} flex items-center justify-center text-xl shadow-sm group-hover:scale-105 transition-transform flex-shrink-0`}>
                                        {playlist.icon}
                                        {isActive && isPlaying && (
                                            <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                                                <EqualizerBar />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <p className={`font-bold text-sm truncate ${isActive ? 'text-brand-primary' : 'text-slate-800 dark:text-slate-200'}`}>{playlist.name}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{playlist.genre}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-600 text-slate-500 dark:text-slate-300 px-2 py-0.5 rounded-full">
                                            {playlist.bpm}
                                        </span>
                                        {isActive && (
                                            <div className="text-brand-primary">
                                                {isPlaying ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Volume Control Footer */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-3 px-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                            </svg>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={volume}
                                onChange={(e) => setVolume(parseFloat(e.target.value))}
                                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
