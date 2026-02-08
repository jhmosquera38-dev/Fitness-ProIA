import React, { useState, useEffect } from 'react';
import { emailService, EmailConfig } from '../services/emailService';
import { useFeedback } from './FeedbackSystem';

export const EmailConfigComponent: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [config, setConfig] = useState<EmailConfig>({
        serviceId: '',
        templateId: '',
        publicKey: ''
    });
    const { showToast } = useFeedback();

    useEffect(() => {
        const stored = emailService.getConfig();
        if (stored) setConfig(stored);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfig({ ...config, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        if (!config.serviceId || !config.templateId || !config.publicKey) {
            showToast('Por favor completa todos los campos', 'error');
            return;
        }
        emailService.saveConfig(config);
        showToast('Configuración guardada exitosamente', 'success');
        onClose();
    };

    const handleTest = async () => {
        if (!config.serviceId || !config.templateId || !config.publicKey) {
            showToast('Guarda primero la configuración', 'error');
            return;
        }
        // Guardar temporalmente para probar
        emailService.saveConfig(config);

        showToast('Enviando correo de prueba...', 'info');
        const res = await emailService.sendEmail(
            'test@example.com', // Este email fallará si el usuario no tiene habilitado whitelist en free tier, pero validará la credencial
            'Test User',
            'Este es un correo de prueba de validación.',
            'Validación Configuración EmailJS'
        );

        if (res.success) {
            showToast('¡Prueba exitosa! Revisa la consola o tu bandeja.', 'success');
        } else {
            showToast('Error en la prueba. Revisa las credenciales.', 'error');
            console.error(res.error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-slate-700">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                            <span className="text-2xl">📧</span> Configurar Email Real
                        </h2>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    <div className="space-y-4 mb-6">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                Para enviar correos reales, necesitas una cuenta gratuita de <strong>EmailJS</strong>.
                                <br />
                                <a href="https://www.emailjs.com/" target="_blank" rel="noopener noreferrer" className="underline font-bold hover:text-blue-600">Crear cuenta gratis aquí</a>
                            </p>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Service ID</label>
                            <input
                                name="serviceId"
                                value={config.serviceId}
                                onChange={handleChange}
                                placeholder="service_xxxxx"
                                className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Template ID</label>
                            <input
                                name="templateId"
                                value={config.templateId}
                                onChange={handleChange}
                                placeholder="template_xxxxx"
                                className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Public Key</label>
                            <input
                                name="publicKey"
                                value={config.publicKey}
                                onChange={handleChange}
                                placeholder="Public key (ej. user_xxxxx)"
                                className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-primary"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleTest}
                            className="flex-1 py-2.5 px-4 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white font-bold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                        >
                            Probar
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex-1 py-2.5 px-4 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-secondary transition-colors shadow-lg shadow-brand-primary/25"
                        >
                            Guardar Configuración
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
