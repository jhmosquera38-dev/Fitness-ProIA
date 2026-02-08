import React, { useState } from 'react';

interface VideoTutorialModalProps {
    videoSrc: string;
    onClose: () => void;
    onComplete?: () => void;
}

export const VideoTutorialModal: React.FC<VideoTutorialModalProps> = ({ videoSrc, onClose, onComplete }) => {
    const [hasError, setHasError] = useState(false);

    return (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in p-4">
            <div className="relative w-full max-w-4xl aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition-colors"
                    title="Cerrar"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {!hasError ? (
                    <video
                        src={videoSrc}
                        autoPlay
                        controls
                        className="w-full h-full"
                        onEnded={onComplete || onClose}
                        onError={() => setHasError(true)}
                    >
                        Tu navegador no soporta el formato de video.
                    </video>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-white p-8 text-center">
                        <div className="text-6xl mb-4">📽️</div>
                        <h3 className="text-xl font-bold mb-2">Tutorial no disponible</h3>
                        <p className="text-slate-400 max-w-md">
                            No se encontró el archivo de video en <code>{videoSrc}</code>.
                            Por favor, asegúrate de renderizar el proyecto de Remotion y guardar el resultado como <code>video.mp4</code> en la carpeta <code>public</code>.
                        </p>
                        <button
                            onClick={onClose}
                            className="mt-6 bg-brand-primary text-brand-dark px-6 py-2 rounded-lg font-bold hover:bg-brand-secondary transition-all"
                        >
                            Continuar al Dashboard
                        </button>
                    </div>
                )}

                {/* Info Overlay (Optional) */}
                <div className="absolute bottom-4 left-4 pointer-events-none opacity-50">
                    <p className="text-[10px] text-white font-mono uppercase tracking-widest">FitnessFlow Pro • Video Tutorial</p>
                </div>
            </div>
        </div>
    );
};
