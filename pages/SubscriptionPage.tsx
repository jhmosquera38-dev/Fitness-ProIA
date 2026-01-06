import React, { useState } from 'react';
import { PSEPaymentModal } from '../components/PSEPaymentModal';

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-primary" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

const userPlans = [
  {
    name: 'Básica',
    price: '15.000',
    description: 'Perfecto para comenzar tu journey fitness',
    features: ['Acceso al gimnasio', 'Rutinas básicas', 'Seguimiento de progreso', 'Biblioteca de ejercicios'],
    isPopular: false,
  },
  {
    name: 'Premium',
    price: '20.000',
    description: 'La experiencia completa para resultados serios',
    features: ['Todo del plan Básico', 'Rutinas personalizadas', 'Clases grupales ilimitadas', 'AI Coach personalizado', 'Análisis de progreso avanzado'],
    isPopular: true,
  },
];

const PricingCard: React.FC<{ plan: typeof userPlans[0], onSelectPlan: () => void }> = ({ plan, onSelectPlan }) => (
    <div className={`border rounded-xl p-6 flex flex-col ${plan.isPopular ? 'border-brand-primary border-2' : 'border-slate-200'}`}>
        {plan.isPopular && <span className="bg-brand-primary text-white text-xs font-bold px-3 py-1 rounded-full self-start mb-4">Más Popular</span>}
        <h3 className="text-xl font-bold">{plan.name}</h3>
        <p className="text-4xl font-extrabold my-2">${plan.price}<span className="text-base font-medium text-slate-500">/mes</span></p>
        <p className="text-slate-600 mb-6 h-12">{plan.description}</p>
        <ul className="space-y-3 mb-8 flex-grow">
            {plan.features.map(feature => (
                <li key={feature} className="flex items-center gap-3">
                    <CheckIcon />
                    <span className="text-slate-700">{feature}</span>
                </li>
            ))}
        </ul>
        <button onClick={onSelectPlan} className={`w-full py-3 rounded-lg font-semibold transition-colors ${plan.isPopular ? 'bg-brand-primary text-white hover:bg-brand-secondary' : 'bg-white text-brand-primary border border-brand-primary hover:bg-green-50'}`}>
            Elegir Plan
        </button>
    </div>
);

interface SubscriptionPageProps {
  onSubscriptionSuccess: () => void;
  isGymMember?: boolean;
}

export const SubscriptionPage: React.FC<SubscriptionPageProps> = ({ onSubscriptionSuccess, isGymMember }) => {
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const handleSelectPlan = () => {
        setIsPaymentModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            {isGymMember ? (
                 <div className="container mx-auto text-center max-w-xl">
                    <div className="bg-white p-8 rounded-xl shadow-md border border-slate-200">
                        <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">Membresía Vencida</h1>
                        <p className="mt-4 text-slate-600">
                            Tu acceso a la plataforma ha sido suspendido porque tu pago se encuentra vencido.
                        </p>
                        <p className="mt-2 font-semibold text-slate-700">
                           Por favor, contacta a la administración de tu gimnasio para renovar tu membresía y reactivar tu cuenta.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="container mx-auto text-center max-w-4xl">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">Tu período de prueba ha terminado</h1>
                    <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                        ¡Gracias por probar FitnessFlow! Para seguir disfrutando de todas las funcionalidades, por favor elige un plan.
                    </p>
                    
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                       {userPlans.map(plan => (
                           <PricingCard key={plan.name} plan={plan} onSelectPlan={handleSelectPlan} />
                       ))}
                    </div>
                </div>
            )}

            {isPaymentModalOpen && (
                <PSEPaymentModal 
                    onClose={() => setIsPaymentModalOpen(false)}
                    onPaymentSuccess={onSubscriptionSuccess}
                />
            )}
        </div>
    );
};
