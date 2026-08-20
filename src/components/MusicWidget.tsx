
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
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

// YouTube Iframe API loader (loaded once, shared across widget instances)
let ytApiPromise: Promise<any> | null = null;
const loadYoutubeApi = (): Promise<any> => {
    if ((window as any).YT && (window as any).YT.Player) {
        return Promise.resolve((window as any).YT);
    }
    if (ytApiPromise) return ytApiPromise;

    ytApiPromise = new Promise((resolve) => {
        const prevCallback = (window as any).onYouTubeIframeAPIReady;
        (window as any).onYouTubeIframeAPIReady = () => {
            if (typeof prevCallback === 'function') prevCallback();
            resolve((window as any).YT);
        };
        if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            document.head.appendChild(tag);
        }
    });
    return ytApiPromise;
};

export const MusicWidget: React.FC<MusicWidgetProps> = ({ isOpen, onClose }) => {
    const [catalog, setCatalog] = useState<MusicCatalog | null>(null);
    const [activeCategory, setActiveCategory] = useState<keyof MusicCatalog>('cardio_hiit');
    const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [playerReady, setPlayerReady] = useState(false);

    const playerRef = useRef<any>(null);
    const playerContainerRef = useRef<HTMLDivElement>(null);
    const currentTrackRef = useRef<MusicTrack | null>(null);
    const isPlayingRef = useRef(false);
    const catalogRef = useRef<MusicCatalog | null>(null);
    const activeCategoryRef = useRef<keyof MusicCatalog>('cardio_hiit');
    // Tracks the video ID of the most recent load command, so a delayed/stale
    // error or watchdog callback from a previous track can't interfere with
    // whatever the user has since switched to.
    const pendingVideoIdRef = useRef<string | null>(null);
    const watchdogTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => { currentTrackRef.current = currentTrack; }, [currentTrack]);
    useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
    useEffect(() => { catalogRef.current = catalog; }, [catalog]);
    useEffect(() => { activeCategoryRef.current = activeCategory; }, [activeCategory]);

    // Fetch Catalog on mount
    useEffect(() => {
        const fetchMusic = async () => {
            const data = await musicService.getCatalog();
            setCatalog(data);
        };
        fetchMusic();
    }, []);

    const playTrackAtOffset = useCallback((offset: number) => {
        const cat = catalogRef.current;
        const track = currentTrackRef.current;
        if (!cat) return;
        const list = cat[activeCategoryRef.current];
        if (!list || list.length === 0) return;

        let nextIndex = 0;
        if (track) {
            const idx = list.findIndex(t => t.id === track.id);
            nextIndex = idx === -1 ? 0 : (idx + offset + list.length) % list.length;
        }
        setCurrentTrack(list[nextIndex]);
        setIsPlaying(true);
    }, []);

    const playNext = useCallback(() => playTrackAtOffset(1), [playTrackAtOffset]);
    const playPrevious = useCallback(() => playTrackAtOffset(-1), [playTrackAtOffset]);

    const clearWatchdog = useCallback(() => {
        if (watchdogTimerRef.current) {
            clearTimeout(watchdogTimerRef.current);
            watchdogTimerRef.current = null;
        }
    }, []);

    // Initialize the YouTube player once
    useEffect(() => {
        let cancelled = false;
        loadYoutubeApi().then((YT) => {
            if (cancelled || !playerContainerRef.current || playerRef.current) return;
            // IMPORTANT: never hand the YT API a DOM node that React itself
            // renders/tracks (like playerContainerRef.current directly). The
            // IFrame API *replaces* whatever element you give it with its own
            // <iframe>, outside of React's knowledge. If that swapped-out node
            // is one React still holds a reference to, the next time React
            // needs to reorder a sibling near it (e.g. toggling the "Pausado"
            // overlay when switching tracks) it calls insertBefore against a
            // detached node and crashes with an uncaught
            // "NotFoundError: ...insertBefore... is not a child of this node",
            // which — with no error boundary in the app — blanks the whole UI.
            // So we give YT a plain child <div> that React never renders/owns;
            // only that throwaway node gets swapped, and React's own ref stays
            // valid and stable no matter what YT does to its contents.
            const mountNode = document.createElement('div');
            mountNode.style.width = '100%';
            mountNode.style.height = '100%';
            playerContainerRef.current.appendChild(mountNode);
            playerRef.current = new YT.Player(mountNode, {
                height: '100%',
                width: '100%',
                playerVars: { controls: 0, playsinline: 1, rel: 0 },
                events: {
                    onReady: () => setPlayerReady(true),
                    onStateChange: (event: any) => {
                        const YTState = (window as any).YT.PlayerState;
                        if (event.data === YTState.ENDED) {
                            clearWatchdog();
                            playTrackAtOffset(1);
                        } else if (event.data === YTState.PLAYING) {
                            clearWatchdog();
                            setIsPlaying(true);
                            setStatusMessage(null);
                        } else if (event.data === YTState.PAUSED || event.data === YTState.CUED) {
                            clearWatchdog();
                            if (event.data === YTState.PAUSED) setIsPlaying(false);
                        }
                    },
                    onError: () => {
                        // A load can fail asynchronously after the user has already
                        // switched to a different track; only auto-skip if this
                        // error still corresponds to the track we're waiting on.
                        const failedVideoId = pendingVideoIdRef.current;
                        clearWatchdog();
                        setStatusMessage('Video no disponible, saltando a la siguiente...');
                        setTimeout(() => {
                            if (pendingVideoIdRef.current === failedVideoId) {
                                playTrackAtOffset(1);
                            }
                        }, 900);
                    },
                },
            });
        });
        return () => { cancelled = true; clearWatchdog(); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Load/play the selected track whenever it changes
    useEffect(() => {
        if (!playerReady || !playerRef.current || !currentTrack) return;
        const youtubeId = getYoutubeId(currentTrack.url);
        if (!youtubeId) {
            setStatusMessage('Enlace de video inválido, saltando a la siguiente...');
            setTimeout(() => playTrackAtOffset(1), 900);
            return;
        }

        pendingVideoIdRef.current = youtubeId;
        clearWatchdog();

        const runLoad = () => {
            try {
                if (isPlaying) {
                    playerRef.current.loadVideoById(youtubeId);
                } else {
                    playerRef.current.cueVideoById(youtubeId);
                }
            } catch (e) {
                // Retry once shortly after; the underlying iframe may still be
                // finishing a previous transition.
                setTimeout(() => {
                    try { playerRef.current?.loadVideoById(youtubeId); } catch (e2) { /* give up silently */ }
                }, 400);
            }
        };
        runLoad();

        // Watchdog: if the player never confirms this load (no PLAYING/PAUSED/
        // CUED/ERROR within 6s — e.g. the postMessage bridge to the iframe got
        // stuck after a rapid track switch), force a single retry.
        watchdogTimerRef.current = setTimeout(() => {
            if (pendingVideoIdRef.current === youtubeId) {
                runLoad();
            }
        }, 6000);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentTrack, playerReady]);

    // Sync play/pause toggle from UI controls to the actual player
    useEffect(() => {
        if (!playerReady || !playerRef.current || !currentTrack) return;
        try {
            if (isPlaying) {
                playerRef.current.playVideo();
            } else {
                playerRef.current.pauseVideo();
            }
        } catch (e) {
            // ignore
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPlaying, playerReady]);

    const handleTrackClick = (track: MusicTrack) => {
        if (currentTrack?.id === track.id) {
            setIsPlaying(!isPlaying);
        } else {
            setCurrentTrack(track);
            setIsPlaying(true);
        }
    };

    const currentTracks = catalog ? catalog[activeCategory] : [];

    // Portal to body
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return createPortal(
        <>
            {/* Backdrop for mobile - ONLY when open AND NOT minimized */}
            {isOpen && !isMinimized && (
                <div className="fixed inset-0 z-[9998] bg-black/10 backdrop-blur-[1px] md:hidden" onClick={onClose} />
            )}

            {/* Container - Fixed on both Mobile and Desktop (via Portal) */}
            <div id="music-widget-portal" className={`
                z-[9999] transition-all duration-300 ease-in-out
                fixed right-4 md:right-10 bottom-24 md:bottom-auto md:top-20 md:w-96
                ${isOpen
                    ? 'translate-y-0 opacity-100 pointer-events-auto'
                    : 'translate-y-10 opacity-0 pointer-events-none'
                }
                ${isMinimized ? 'w-[200px] md:w-[240px]' : 'w-[calc(100%-2rem)] md:w-96'}
            `}>
                <div className={`
                    bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300
                    ${isMinimized ? 'h-16' : 'h-[60vh] md:h-auto md:max-h-[80vh]'}
                `}>

                    {/* Header */}
                    <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex justify-between items-center flex-shrink-0">
                        <div className="flex items-center gap-2 min-w-0">
                            <div className={`w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center flex-shrink-0 ${isPlaying ? 'animate-pulse shadow-[0_0_10px_rgba(0,255,200,0.5)]' : ''}`}>
                                <span className="text-lg">🎵</span>
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="font-bold text-[11px] md:text-xs tracking-wide">FitnessFlow Music</span>
                                {currentTrack ? (
                                    <span className="text-[9px] text-brand-primary truncate max-w-[100px] md:max-w-[150px] block">
                                        {isPlaying ? 'Reproduciendo:' : 'Pausado:'} {currentTrack.title}
                                    </span>
                                ) : (
                                    <span className="text-[9px] text-slate-400">Selecciona tu ritmo</span>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            {currentTrack && (
                                <>
                                    <button onClick={playPrevious} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white transition-colors text-sm" title="Anterior">⏮</button>
                                    <button onClick={() => setIsPlaying(!isPlaying)} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white transition-colors text-sm" title={isPlaying ? 'Pausar' : 'Reproducir'}>{isPlaying ? '⏸' : '▶'}</button>
                                    <button onClick={playNext} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white transition-colors text-sm" title="Siguiente">⏭</button>
                                </>
                            )}
                            <button
                                onClick={() => setIsMinimized(!isMinimized)}
                                className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white transition-colors text-lg"
                                title={isMinimized ? "Maximizar" : "Minimizar"}
                            >
                                {isMinimized ? '🔼' : '🔽'}
                            </button>
                            <button onClick={onClose} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                                ✖
                            </button>
                        </div>
                    </div>

                    {/* YouTube Player - stays mounted (even when minimized) so playback continues in the background.
                        The player mount must stay the FIRST child here and never be reordered/removed by React,
                        since the underlying <iframe> node is owned by the YouTube API, not React. */}
                    <div className={`w-full bg-black flex-shrink-0 relative group ${isMinimized || !currentTrack ? 'h-0 overflow-hidden' : 'aspect-video'}`}>
                        <div ref={playerContainerRef} className="w-full h-full" />
                        {currentTrack && !isPlaying && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 pointer-events-none"><span className="text-white text-xs">Pausado</span></div>
                        )}
                        {statusMessage && (
                            <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20 pointer-events-none">
                                <span className="text-white text-xs px-3 text-center">{statusMessage}</span>
                            </div>
                        )}
                    </div>

                    {/* Content below header - Only visible when NOT minimized */}
                    {!isMinimized && (
                        <>
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
                        </>
                    )}
                </div>
            </div>
        </>,
        document.body
    );
};
