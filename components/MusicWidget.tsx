import React, { useState, useEffect } from 'react';
import { musicService, MusicCatalog, MusicTrack } from '../services/musicService';

interface MusicWidgetProps {
    isOpen: boolean;
    onClose: () => void;
}

const CATEGORIES: { key: keyof MusicCatalog; label: string; icon: string; color: string }[] = [
    { key: 'cardio_hiit', label: 'Cardio', icon: '⚡', color: 'from-blue-500 to-cyan-400' },
    { key: 'fuerza', label: 'Fuerza', icon: '💪', color: 'from-red-600 to-orange-600' },
    { key: 'running_cycling', label: 'Run/Ride', icon: '🏃', color: 'from-green-500 to-emerald-400' },
    { key: 'yoga_recovery', label: 'Yoga', icon: '🧘', color: 'from-indigo-400 to-purple-500' },
];

const EqualizerBar = () => (
    <div className="flex items-end gap-0.5 h-4">
        <div className="w-1 bg-brand-primary animate-[bounce_1s_infinite] h-2"></div>
        <div className="w-1 bg-brand-primary animate-[bounce_1.2s_infinite] h-3"></div>
        <div className="w-1 bg-brand-primary animate-[bounce_0.8s_infinite] h-1.5"></div>
        <div className="w-1 bg-brand-primary animate-[bounce_1.1s_infinite] h-4"></div>
    </div>
);

// Helper to extract YouTube ID
const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

export const MusicWidget: React.FC<MusicWidgetProps> = ({ isOpen, onClose }) => {
    const [catalog, setCatalog] = useState<MusicCatalog | null>(null);
    const [activeCategory, setActiveCategory] = useState<keyof MusicCatalog>('cardio_hiit');
    const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // Fetch Catalog on mount
    useEffect(() => {
        const fetchMusic = async () => {
            const data = await musicService.getCatalog();
            setCatalog(data);
        };
        fetchMusic();
    }, []);

    const handleTrackClick = (track: MusicTrack) => {
        if (currentTrack?.id === track.id) {
            setIsPlaying(!isPlaying);
        } else {
            setCurrentTrack(track);
            setIsPlaying(true);
        }
    };

    const containerClass = isOpen
        ? "opacity-100 pointer-events-auto translate-y-0"
        : "opacity-0 pointer-events-none -translate-y-2";

    const currentTracks = catalog ? catalog[activeCategory] : [];

    // YouTube Embed URL construction
    const youtubeId = currentTrack ? getYoutubeId(currentTrack.url) : null;
    const embedUrl = youtubeId
        ? `https://www.youtube.com/embed/${youtubeId}?autoplay=${isPlaying ? 1 : 0}&enablejsapi=1&controls=0&loop=1`
        : '';

    return (
        <>
            {/* Backdrop for mobile */}
            {isOpen && (
                <div className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px] md:hidden" onClick={onClose} />
            )}

            <div className={`absolute top-16 right-0 md:right-10 w-80 md:w-96 z-50 transition-all duration-300 ease-in-out transform origin-top-right ${containerClass}`}>
                <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">

                    {/* Header */}
                    <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex justify-between items-center flex-shrink-0">
                        <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center ${isPlaying ? 'animate-pulse shadow-[0_0_10px_rgba(0,255,200,0.5)]' : ''}`}>
                                <span className="text-lg">🎵</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-sm tracking-wide">FitnessFlow Music</span>
                                {currentTrack ? (
                                    <span className="text-[10px] text-brand-primary truncate max-w-[150px] block">
                                        {isPlaying ? 'Reproduciendo:' : 'Pausado:'} {currentTrack.title}
                                    </span>
                                ) : (
                                    <span className="text-[10px] text-slate-400">Selecciona tu ritmo</span>
                                )}
                            </div>
                        </div>
                        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                            ✖
                        </button>
                    </div>

                    {/* YouTube Player Container (Visible when playing to comply with TOS, but small/integrated) */}
                    {youtubeId && (
                        <div className="w-full aspect-video bg-black flex-shrink-0 relative group">
                            {/* Overlay to prevent stealing clicks if needed, or allow interaction */}
                            {!isPlaying && <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 pointer-events-none"><span className="text-white text-xs">Pausado</span></div>}

                            <iframe
                                width="100%"
                                height="100%"
                                src={embedUrl}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                            ></iframe>
                        </div>
                    )}

                    {/* Category Tabs */}
                    <div className="flex overflow-x-auto p-2 gap-2 border-b border-slate-200 dark:border-slate-700 scrollbar-hide flex-shrink-0">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.key}
                                onClick={() => setActiveCategory(cat.key)}
                                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${activeCategory === cat.key
                                    ? 'bg-brand-primary text-slate-900'
                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                    }`}
                            >
                                <span>{cat.icon}</span>
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Track List */}
                    <div className="p-2 space-y-1 overflow-y-auto flex-1 min-h-[200px]">
                        {currentTracks.length === 0 ? (
                            <div className="p-8 text-center text-slate-400 text-sm">
                                No hay pistas en esta categoría.
                            </div>
                        ) : (
                            currentTracks.map((track) => {
                                const isActive = currentTrack?.id === track.id;
                                const categoryConfig = CATEGORIES.find(c => c.key === activeCategory);

                                return (
                                    <button
                                        key={track.id}
                                        onClick={() => handleTrackClick(track)}
                                        className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all duration-200 group cursor-pointer text-left border ${isActive ? 'bg-slate-100 dark:bg-slate-700/60 border-brand-primary/30' : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-700/30'}`}
                                    >
                                        <div className={`relative w-10 h-10 rounded-lg bg-gradient-to-br ${categoryConfig?.color || 'from-gray-500 to-gray-600'} flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform flex-shrink-0`}>
                                            {/* Generic Cover or Icon */}
                                            <span className="text-xs">▶</span>
                                            {isActive && isPlaying && (
                                                <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                                                    <EqualizerBar />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <p className={`font-bold text-sm truncate ${isActive ? 'text-brand-primary' : 'text-slate-800 dark:text-slate-200'}`}>{track.title}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{track.artist}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-600 text-slate-500 dark:text-slate-300 px-1.5 py-0.5 rounded-full">
                                                {track.bpm} BPM
                                            </span>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>

                    <div className="p-2 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 text-center">
                        <p className="text-[10px] text-slate-400">Powered by YouTube Embeds</p>
                    </div>

                </div>
            </div>
        </>
    );
};
