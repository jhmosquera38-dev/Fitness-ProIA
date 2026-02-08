
import React, { useState, useEffect } from 'react';

type PaymentStep = 'confirmation' | 'processing' | 'success';

export const PSEPaymentModal: React.FC<{ onClose: () => void; onPaymentSuccess: () => void }> = ({ onClose, onPaymentSuccess }) => {
    const [step, setStep] = useState<PaymentStep>('confirmation');

    useEffect(() => {
        if (step === 'processing') {
            const timer = setTimeout(() => {
                setStep('success');
            }, 3000);
            return () => clearTimeout(timer);
        }
        if (step === 'success') {
            const timer = setTimeout(() => {
                onPaymentSuccess();
                // El componente padre se encargará de cerrar el modal después de actualizar el estado.
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [step, onPaymentSuccess]);

    const handlePayment = () => {
        setStep('processing');
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                {step === 'confirmation' && (
                    <>
                        <div className="p-6 border-b border-slate-200">
                            <h2 className="text-xl font-bold text-slate-800">Confirmar Pago</h2>
                            <p className="text-sm text-slate-500">Revisa los detalles de tu suscripción.</p>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex justify-between items-center text-slate-700">
                                <span>Plan Premium FitnessFlow</span>
                                <span className="font-bold text-lg">$20.000 COP</span>
                            </div>
                            <p className="text-xs text-slate-500 bg-slate-100 p-3 rounded-lg">
                                Serás redirigido a una pasarela de pagos segura para completar tu transacción. Este es un entorno de demostración.
                            </p>
                        </div>
                        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
                            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">Cancelar</button>
                            <button type="button" onClick={handlePayment} className="px-4 py-2 text-sm font-semibold text-white bg-brand-primary rounded-lg hover:bg-brand-secondary">
                                Ir a Pagar
                            </button>
                        </div>
                    </>
                )}
                {step === 'processing' && (
                    <div className="p-12 flex flex-col items-center justify-center gap-4">
                        <div className="w-16 h-16 border-4 border-brand-primary border-solid border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-slate-600 font-semibold">Procesando tu pago...</p>
                        <p className="text-slate-500 text-sm">Por favor espera un momento.</p>
                    </div>
                )}
                {step === 'success' && (
                     <div className="p-12 flex flex-col items-center justify-center gap-4 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">¡Pago Exitoso!</h3>
                        <p className="text-slate-600">Tu suscripción ha sido activada. ¡Gracias!</p>
                    </div>
                )}
            </div>
        </div>
    );
};
