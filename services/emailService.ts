import emailjs from '@emailjs/browser';

// Claves de configuración (User debe proveerlas o usar defaults para demo si existen)
const STORAGE_KEY = 'emailjs_config';

export interface EmailConfig {
    serviceId: string;
    templateId: string;
    publicKey: string;
}

export const emailService = {
    // Guardar configuración
    saveConfig: (config: EmailConfig) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
        // Inicializar inmediatamente si es necesario
        emailjs.init(config.publicKey);
    },

    // Obtener configuración
    getConfig: (): EmailConfig | null => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    },

    // Eliminar configuración
    clearConfig: () => {
        localStorage.removeItem(STORAGE_KEY);
    },

    // Enviar correo
    sendEmail: async (to_email: string, to_name: string, message: string, subject: string = 'Notificación FitnessFlow') => {
        const config = emailService.getConfig();

        if (!config || !config.publicKey) {
            console.warn("EmailJS no configurado. Simulando envío.");
            return { success: false, error: 'Faltan credenciales de EmailJS' }; // Devolvemos error controlado
        }

        try {
            // Inicializar por si acaso no se hizo antes (idempotente en nuevas versiones)
            // Nota: En EmailJS v3+ init() no es estrictamente necesario si se pasa publicKey en send(), pero es buena práctica.

            const templateParams = {
                to_email,
                to_name,
                message,
                subject,
                from_name: 'FitnessFlow App' // Valor por defecto
            };

            const response = await emailjs.send(
                config.serviceId,
                config.templateId,
                templateParams,
                config.publicKey
            );

            console.log('Email enviado:', response);
            return { success: true, response };
        } catch (error) {
            console.error('Error enviando email:', error);
            return { success: false, error };
        }
    },

    // Verificar si está listo para usar
    isReady: () => {
        const config = emailService.getConfig();
        return !!(config?.serviceId && config?.templateId && config?.publicKey);
    }
};
