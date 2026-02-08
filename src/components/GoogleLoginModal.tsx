// FIX: Created the missing GoogleLoginModal component to handle the Google login flow.
import React from 'react';
import { authService } from '../services/authService';

// ============================================================================
// MODAL DE LOGIN CON GOOGLE (GoogleLoginModal.tsx)
// ============================================================================
// Simula el flujo de autenticación con Google Identity Services.
// Permite elegir una cuenta de una lista mock.
// ============================================================================

interface GoogleLoginModalProps {
    onClose: () => void;
}



export const GoogleLoginModal: React.FC<GoogleLoginModalProps> = ({ onClose }) => {
    // Iniciamos el login inmediatamente o mostramos un spinner.
    // En este caso, mostraremos un mensaje simple antes de redirigir.

    const handleLogin = async () => {
        try {
            // Debugging: Verificar qué tipo de cuenta se está intentando registrar
            const pendingType = localStorage.getItem('pendingAccountType');
            console.log("Iniciando Google Auth. Tipo de cuenta pendiente:", pendingType);

            await authService.loginWithGoogle(pendingType || undefined);
        } catch (error) {
            console.error(error);
            alert("Error al iniciar sesión con Google");
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 animate-fade-in" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="google-login-title">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center" onClick={(e) => e.stopPropagation()}>
                <h2 id="google-login-title" className="text-xl font-bold text-slate-800 mb-4">Iniciar con Google</h2>
                <p className="text-slate-600 mb-6">Serás redirigido a Google para verificar tu identidad de forma segura.</p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleLogin}
                        className="w-full py-3 px-4 bg-brand-primary text-white rounded-lg font-bold hover:bg-brand-primary-dark transition-colors flex items-center justify-center gap-2"
                    >
                        Continuar
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full py-2 text-slate-500 hover:text-slate-700 font-medium"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};
