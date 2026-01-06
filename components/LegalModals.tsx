
import React from 'react';

// ============================================================================
// MODALES LEGALES (LegalModals.tsx)
// ============================================================================
// Contiene los términos de uso y políticas de privacidad que el usuario debe
// aceptar durante el registro.
// ============================================================================

interface LegalModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// Componente base para modales legales, maneja el layout y el cierre
const BaseModal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                {/* Overlay de fondo */}
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                {/* Contenido del Modal */}
                <div className="relative inline-block align-bottom bg-white dark:bg-slate-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full border border-slate-200 dark:border-slate-700">
                    <div className="bg-white dark:bg-slate-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-2xl leading-6 font-bold text-slate-900 dark:text-white" id="modal-title">
                                        {title}
                                    </h3>
                                    <button onClick={onClose} className="text-slate-400 hover:text-slate-500 focus:outline-none">
                                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="mt-4 text-slate-600 dark:text-slate-300 space-y-4 max-h-[60vh] overflow-y-auto pr-2 text-sm leading-relaxed">
                                    {children}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Botón de Acción Principal */}
                    <div className="bg-slate-50 dark:bg-slate-900 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-brand-primary text-base font-medium text-white hover:bg-brand-secondary focus:outline-none sm:ml-3 sm:w-auto sm:text-sm" onClick={onClose}>
                            Entendido
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const TermsModal: React.FC<LegalModalProps> = (props) => (
    <BaseModal {...props} title="Términos y Condiciones de Uso">
        <p className="font-bold">1. Aceptación de los Términos</p>
        <p>Al descargar, acceder o utilizar FitnessFlow Pro, usted acepta estar legalmente vinculado por estos términos. El servicio es operado desde Colombia y se rige por las leyes de la República de Colombia.</p>

        <p className="font-bold">2. Uso de la Aplicación</p>
        <p>FitnessFlow Pro proporciona herramientas de seguimiento fitness y gestión para gimnasios. Usted se compromete a utilizar la aplicación solo para fines legales y de acuerdo con estos términos. Las recomendaciones de IA son sugerencias y no constituyen consejo médico profesional.</p>

        <p className="font-bold">3. Limitación de Responsabilidad</p>
        <p>El uso de la aplicación es bajo su propio riesgo. FitnessFlow Pro no se hace responsable de lesiones, problemas de salud o daños directos o indirectos resultantes del uso de las rutinas o clases sugeridas. Siempre consulte a un médico antes de comenzar cualquier programa de ejercicios.</p>

        <p className="font-bold">4. Propiedad Intelectual</p>
        <p>Todo el contenido, diseño, gráficos y código son propiedad de FitnessFlow Pro SAS y están protegidos por las leyes de derechos de autor colombianas e internacionales.</p>

        <p className="font-bold">5. Pagos y Suscripciones</p>
        <p>Las tarifas para planes Premium se cobran por adelantado. Nos reservamos el derecho de modificar los precios con previo aviso. Las cancelaciones se rigen por nuestra política de reembolso vigente.</p>
    </BaseModal>
);

export const PrivacyModal: React.FC<LegalModalProps> = (props) => (
    <BaseModal {...props} title="Política de Privacidad y Tratamiento de Datos">
        <p className="italic mb-4">En cumplimiento con la Ley 1581 de 2012 y el Decreto 1377 de 2013 de la República de Colombia.</p>

        <p className="font-bold">1. Responsable del Tratamiento</p>
        <p>FitnessFlow Pro SAS, con domicilio en Medellín, Colombia, es el responsable del tratamiento de los datos personales recolectados a través de esta aplicación.</p>

        <p className="font-bold">2. Datos Recolectados</p>
        <p>Podemos recolectar información como: nombre, correo electrónico, datos físicos (peso, altura) y hábitos de ejercicio. Estos datos son necesarios para personalizar su experiencia y las recomendaciones de la IA.</p>

        <p className="font-bold">3. Finalidad</p>
        <p>Sus datos serán utilizados exclusivamente para: proveer los servicios de la app, procesar pagos, enviar notificaciones relevantes y mejorar nuestros algoritmos. No vendemos sus datos a terceros.</p>

        <p className="font-bold">4. Derechos del Titular (Habeas Data)</p>
        <p>Como usuario, usted tiene derecho a conocer, actualizar, rectificar y suprimir su información personal en cualquier momento. Puede ejercer estos derechos escribiendo a privacidad@fitnessflow.pro.</p>

        <p className="font-bold">5. Seguridad</p>
        <p>Implementamos medidas técnicas y administrativas para proteger su información contra acceso no autorizado, pérdida o alteración.</p>
    </BaseModal>
);
