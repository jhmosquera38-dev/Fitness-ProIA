
import React, { useState } from 'react';
import { User } from '../types';
import { FitnessFlowLogo } from './FormIcons';

interface DigitalMemberCardProps {
    user: User;
    onClose: () => void;
}

export const DigitalMemberCard: React.FC<DigitalMemberCardProps> = ({ user, onClose }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => setIsFlipped(!isFlipped);

    // QR API for demo purposes (encodes user email)
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(user.email)}&color=0f172a`;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex flex-col items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            
            <div className="text-white text-center mb-6" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-2">Tu Pase Digital</h2>
                <p className="text-white/70 text-sm">Escanea este código en el torniquete o recepción</p>
            </div>

            {/* Card Container (Perspective) */}
            <div 
                className="relative w-full max-w-sm aspect-[1.586/1] cursor-pointer group perspective-1000"
                onClick={(e) => { e.stopPropagation(); handleFlip(); }}
            >
                {/* Inner Container (Transform) */}
                <div className={`relative w-full h-full duration-700 preserve-3d transition-transform ${isFlipped ? 'rotate-y-180' : ''}`}>
                    
                    {/* FRONT FACE */}
                    <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 text-white p-6 flex flex-col justify-between">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-primary via-transparent to-transparent"></div>
                        
                        {/* Header */}
                        <div className="flex justify-between items-start z-10">
                            <div className="flex items-center gap-2">
                                <div className="bg-white/10 p-1.5 rounded-lg backdrop-blur-sm">
                                    <div className="scale-75"><FitnessFlowLogo /></div>
                                </div>
                                <span className="font-bold tracking-wider text-lg">FITNESSFLOW</span>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${user.subscriptionStatus === 'subscribed' ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-red-500/20 border-red-500 text-red-400'}`}>
                                {user.subscriptionStatus === 'subscribed' ? 'Activo' : 'Inactivo'}
                            </div>
                        </div>

                        {/* Chip */}
                        <div className="w-12 h-9 rounded bg-gradient-to-br from-yellow-200 to-yellow-500 border border-yellow-600 opacity-80 z-10"></div>

                        {/* User Info */}
                        <div className="z-10">
                            <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Miembro</p>
                            <p className="text-xl font-bold font-mono uppercase tracking-wide shadow-black drop-shadow-md">{user.name}</p>
                            <div className="flex justify-between items-end mt-4">
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase">ID</p>
                                    <p className="font-mono text-sm">9928 1029 3847</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-slate-400 uppercase">Plan</p>
                                    <p className="font-bold text-brand-primary uppercase">{user.plan}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* BACK FACE */}
                    <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl overflow-hidden shadow-2xl bg-white border-4 border-slate-900 p-6 flex flex-col items-center justify-center">
                        <div className="absolute top-0 left-0 w-full h-12 bg-slate-900"></div>
                        <div className="mt-8 bg-white p-2 rounded-xl border-2 border-slate-100 shadow-inner">
                            <img src={qrUrl} alt="QR Access Code" className="w-32 h-32 object-contain" />
                        </div>
                        <p className="mt-4 text-slate-900 font-bold text-sm tracking-wider">ESCANEAR PARA ENTRAR</p>
                        <p className="text-xs text-slate-400 mt-1">{user.email}</p>
                    </div>

                </div>
            </div>

            <div className="mt-8 text-white/50 text-sm flex items-center gap-2 animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                Toca la tarjeta para voltear
            </div>

            <button onClick={onClose} className="mt-8 bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full font-semibold transition-colors border border-white/20">
                Cerrar
            </button>
        </div>
    );
};
