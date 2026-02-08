import React, { useState } from 'react';
import { TermsModal, PrivacyModal } from './LegalModals';

// ============================================================================
// PIE DE PÁGINA (LandingFooter.tsx)
// ============================================================================
// Footer principal que contiene enlaces legales, sociales y de navegación rápida.
// Incluye modales para Términos y Condiciones y Política de Privacidad.
// ============================================================================

const SocialIcon: React.FC<{ href: string, children: React.ReactNode }> = ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-brand-primary transition-colors">
        {children}
    </a>
);

export const LandingFooter: React.FC = () => {
    const [showTerms, setShowTerms] = useState(false);
    const [showPrivacy, setShowPrivacy] = useState(false);

    const handleScroll = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <footer className="bg-slate-50 border-t border-slate-200">
            <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-1">
                        <h2 className="text-2xl font-bold text-slate-900">
                            Fitness<span className="text-brand-primary">Flow</span>
                        </h2>
                        <p className="mt-2 text-slate-600 text-sm">Transforma tu cuerpo, transforma tu vida.</p>
                        <div className="mt-4 flex space-x-4">
                            <SocialIcon href="#"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></SocialIcon>
                            <SocialIcon href="#"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></SocialIcon>
                            <SocialIcon href="#"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg></SocialIcon>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 md:col-span-3 gap-8">
                        <div>
                            <h4 className="font-semibold text-slate-800">Producto</h4>
                            <ul className="mt-2 space-y-2 text-sm text-slate-600">
                                <li><button onClick={() => handleScroll('features')} className="hover:underline">Características</button></li>
                                <li><button onClick={() => handleScroll('plans')} className="hover:underline">Planes</button></li>
                                <li><a href="#" className="hover:underline">AI Coach</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-800">Compañía</h4>
                            <ul className="mt-2 space-y-2 text-sm text-slate-600">
                                <li><button onClick={() => handleScroll('nosotros')} className="hover:underline">Nosotros</button></li>
                                <li><a href="#" className="hover:underline">Prensa</a></li>
                                <li><a href="#" className="hover:underline">Carreras</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-800">Legal</h4>
                            <ul className="mt-2 space-y-2 text-sm text-slate-600">
                                <li><button onClick={() => setShowTerms(true)} className="hover:underline text-left">Términos y Condiciones</button></li>
                                <li><button onClick={() => setShowPrivacy(true)} className="hover:underline text-left">Política de Privacidad</button></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-slate-200 text-center text-sm text-slate-500">
                    <p>&copy; {new Date().getFullYear()} FitnessFlow. Todos los derechos reservados.</p>
                </div>
            </div>
            <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
            <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
        </footer>
    );
};