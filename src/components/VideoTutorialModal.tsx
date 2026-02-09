import React, { useState } from 'react';

interface VideoTutorialModalProps {
    videoSrc: string;
    onClose: () => void;
    onComplete?: () => void;
}

export const VideoTutorialModal: React.FC<VideoTutorialModalProps> = ({ videoSrc, onClose, onComplete }) => {
    const [hasError, setHasError] = useState(false);
    const [useFallback, setUseFallback] = useState(false);

    // High quality fitness demo fallback
    const fallbackSrc = "https://player.vimeo.com/external/517090025.hd.mp4?s=f0227f27b7d03157579f972b9a7c6454d68e3760&profile_id=175";

    const currentSrc = useFallback ? fallbackSrc : videoSrc;

    return (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-0 md:p-4 bg-black/95 backdrop-blur-md animate-fade-in">
            <div className="bg-slate-900 w-full h-full md:h-auto md:max-w-5xl md:aspect-video md:rounded-3xl overflow-hidden shadow-2xl relative border border-white/5 mx-auto">
                {!hasError ? (
                    <div className="relative w-full h-full group">
                        <video
                            src={currentSrc}
                            autoPlay
                            controls
                            className="w-full h-full object-contain"
                            onEnded={onComplete || onClose}
                            onError={() => {
                                if (!useFallback) {
                                    setUseFallback(true);
                                } else {
                                    setHasError(true);
                                }
                            }}
                        />
                        {/* Custom Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 w-12 h-12 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all z-50 border border-white/10"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {useFallback && !hasError && (
                            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-brand-primary/20 backdrop-blur-md px-4 py-2 rounded-full border border-brand-primary/30 text-brand-primary text-[10px] md:text-xs font-bold animate-pulse pointer-events-none">
                                Modo Demo: Video local no encontrado
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-white p-6 md:p-12 text-center bg-brand-dark/95 backdrop-blur-md">
                        <div className="text-6xl md:text-8xl mb-6 drop-shadow-[0_0_20px_rgba(0,224,198,0.5)]">✨</div>
                        <h3 className="text-2xl md:text-3xl font-black mb-4 tracking-tight bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
                            ¡Bienvenido al Perfil Entrenador!
                        </h3>
                        <p className="text-slate-300 text-lg md:text-xl max-w-lg leading-relaxed mb-10 font-medium">
                            Ya puedes comenzar a gestionar tus clientes y servicios desde el Dashboard. Estamos aquí para potenciar tu éxito.
                        </p>

                        <button
                            onClick={onClose}
                            className="bg-brand-primary text-brand-dark px-10 py-4 rounded-2xl font-black text-xl hover:bg-brand-secondary transition-all shadow-[0_10px_30px_rgba(0,224,198,0.3)] active:scale-95 transform hover:-translate-y-1"
                        >
                            Ir al Dashboard
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
