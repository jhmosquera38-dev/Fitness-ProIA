// ============================================================================
// AUTOMATIZACIÓN DE MARKETING (MarketingAutomations.tsx)
// ============================================================================

import React, { useState } from 'react';
import { useFeedback } from '../components/FeedbackSystem';
import { User } from '../types';
// Import services and components
import { emailService } from '../services/emailService';
import { EmailConfigComponent } from '../components/EmailConfigComponent';

interface Campaign {
    id: string;
    name: string;
    trigger: string;
    status: 'active' | 'paused';
    message: string;
    stats: {
        sent: number;
        opened: string;
        roi: string;
    };
}

const INITIAL_CAMPAIGNS: Campaign[] = [
    {
        id: '1',
        name: 'Recuperación de Riesgo',
        trigger: 'Ausencia > 7 días',
        status: 'active',
        message: "Hola {nombre}, ¡te extrañamos en el gimnasio! 💪 Tu salud es lo primero. Vuelve esta semana y recibe un batido de cortesía.",
        stats: { sent: 142, opened: '68%', roi: 'High' }
    },
    {
        id: '2',
        name: 'Felicitación de Cumpleaños',
        trigger: 'Fecha de Nacimiento = Hoy',
        status: 'active',
        message: "¡Feliz Cumpleaños {nombre}! 🎉 Hoy tu entrenamiento corre por nuestra cuenta. ¡Pásala increíble!",
        stats: { sent: 45, opened: '92%', roi: 'N/A' }
    },
    {
        id: '3',
        name: 'Renovación de Plan',
        trigger: 'Vencimiento en 3 días',
        status: 'paused',
        message: "{nombre}, tu plan está por vencer. Renueva hoy online para asegurar tu tarifa actual.",
        stats: { sent: 89, opened: '45%', roi: 'Med' }
    },
    {
        id: '4',
        name: 'Bienvenida Nuevo Miembro',
        trigger: 'Nuevo Registro',
        status: 'active',
        message: "Bienvenido a la familia, {nombre}. Recuerda agendar tu valoración física inicial desde la app.",
        stats: { sent: 210, opened: '88%', roi: 'N/A' }
    }
];

interface MarketingAutomationsProps {
    users: User[];
    onSendNotification: (email: string, message: string) => void;
}

interface EmailLog {
    id: number;
    campaignName: string;
    recipient: string;
    status: 'sent' | 'delivered' | 'opened' | 'failed';
    timestamp: string;
    details?: string;
}

export const MarketingAutomations: React.FC<MarketingAutomationsProps> = ({ users, onSendNotification }) => {
    const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
    const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
    const [showEmailConfig, setShowEmailConfig] = useState(false);
    const { showToast } = useFeedback();

    const toggleStatus = (id: string) => {
        setCampaigns(prev => prev.map(c => {
            if (c.id === id) {
                const newStatus = c.status === 'active' ? 'paused' : 'active';
                showToast(`Campaña "${c.name}" ${newStatus === 'active' ? 'activada' : 'pausada'}`, newStatus === 'active' ? 'success' : 'info');
                return { ...c, status: newStatus };
            }
            return c;
        }));
    };

    const handleEditMessage = (id: string, newMessage: string) => {
        setCampaigns(prev => prev.map(c => c.id === id ? { ...c, message: newMessage } : c));
    };

    const handleTest = async (campaign: Campaign) => {
        // Verificar si hay configuración real de EmailJS
        const isEmailReady = emailService.isReady();
        if (!isEmailReady) {
            const confirmConfig = window.confirm("EmailJS no está configurado. ¿Deseas configurarlo ahora para enviar correos REALES? \nCancelar = Simulación");
            if (confirmConfig) {
                setShowEmailConfig(true);
                return;
            }
        }

        // 1. Enviar a usuarios elegibles (demo: 3 primeros o menos si hay pocos)
        const targetUsers = users.slice(0, 3);
        let sentCount = 0;
        let failedCount = 0;

        showToast(isEmailReady ? 'Iniciando envío real via EmailJS...' : 'Iniciando simulación de envío...', 'info');

        for (const user of targetUsers) {
            // Personalizar mensaje
            const personalizedMessage = campaign.message.replace('{nombre}', user.name.split(' ')[0]);

            // A. Notificación Interna (Siempre)
            onSendNotification(user.email, `📢 ${campaign.name}: ${personalizedMessage}`);

            // B. Email Real (si está configurado) o Simulación
            let status: EmailLog['status'] = 'sent';
            let details = 'Simulado';

            if (isEmailReady) {
                const result = await emailService.sendEmail(user.email, user.name, personalizedMessage, `FitnessFlow: ${campaign.name}`);
                if (result.success) {
                    status = 'delivered';
                    details = 'Enviado via Gmail/Outlook';
                } else {
                    status = 'failed';
                    console.error("Fallo EmailJS:", result.error);
                    details = 'Error de conexión EmailJS';
                    failedCount++;
                }
            }

            // Registrar en log visual
            const newLog: EmailLog = {
                id: Date.now() + Math.random(),
                campaignName: campaign.name,
                recipient: user.email,
                status: status,
                timestamp: new Date().toLocaleTimeString(),
                details
            };
            setEmailLogs(prev => [newLog, ...prev]);
            if (status !== 'failed') sentCount++;
        }

        // Actualizar estadísticas de la campaña
        setCampaigns(prev => prev.map(c => c.id === campaign.id ? {
            ...c,
            stats: { ...c.stats, sent: c.stats.sent + sentCount }
        } : c));

        if (failedCount > 0) {
            showToast(`Campaña finalizada. ${sentCount} enviados, ${failedCount} fallidos.`, 'warning');
        } else {
            showToast(`Campaña disparada exitosamente a ${sentCount} usuarios.`, 'success');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 animate-fade-in space-y-8 relative">

            {showEmailConfig && <EmailConfigComponent onClose={() => setShowEmailConfig(false)} />}

            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Automatización y Retención</h1>
                    <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">El piloto automático para el crecimiento de tu gimnasio.</p>
                </div>
                <button
                    onClick={() => setShowEmailConfig(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white rounded-lg font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors shadow-sm border border-slate-200 dark:border-slate-600"
                >
                    <span className="text-xl">⚙️</span>
                    <span>Configurar Email Real</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Columna Izquierda: Campañas */}
                <div className="lg:col-span-2 space-y-6">
                    {campaigns.map(campaign => (
                        <div key={campaign.id} className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border transition-all duration-300 ${campaign.status === 'active' ? 'border-green-200 dark:border-green-900/30 shadow-green-100/50' : 'border-slate-200 dark:border-slate-700 opacity-90'}`}>
                            <div className="p-6 flex flex-col gap-4">

                                {/* Header Campaign */}
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${campaign.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-800 dark:text-white">{campaign.name}</h3>
                                            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">Trigger: {campaign.trigger}</span>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={campaign.status === 'active'} onChange={() => toggleStatus(campaign.id)} />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"></div>
                                    </label>
                                </div>

                                {/* Message Editor & Stats */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-100 dark:border-slate-700">
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Mensaje</label>
                                        <textarea
                                            className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md p-3 text-sm text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-brand-primary outline-none resize-none h-24"
                                            value={campaign.message}
                                            onChange={(e) => handleEditMessage(campaign.id, e.target.value)}
                                        />
                                        <div className="flex justify-end mt-2">
                                            <button
                                                onClick={() => handleTest(campaign)}
                                                className="text-xs font-bold bg-brand-primary text-white px-3 py-1.5 rounded-lg hover:bg-brand-secondary transition-colors flex items-center gap-2"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                                Ejecutar Ahora
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-col justify-center space-y-4 px-4">
                                        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-2">
                                            <span className="text-slate-500 text-sm">Enviados Totales</span>
                                            <span className="font-bold text-slate-800 dark:text-white text-lg">{campaign.stats.sent}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-2">
                                            <span className="text-slate-500 text-sm">Tasa Apertura</span>
                                            <span className="font-bold text-green-500 text-lg">{campaign.stats.opened}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-500 text-sm">ROI Estimado</span>
                                            <span className="font-bold text-brand-primary text-lg">{campaign.stats.roi}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Columna Derecha: Live Log */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 p-6 h-fit sticky top-6">
                    <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        Actividad en Vivo
                    </h3>

                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        {emailLogs.length === 0 ? (
                            <div className="text-center py-8 text-slate-400 text-sm">
                                No hay actividad reciente.<br />Ejecuta una campaña para ver el log.
                            </div>
                        ) : (
                            emailLogs.map(log => (
                                <div key={log.id} className="text-sm border-l-2 border-green-500 pl-3 py-1 animate-slide-in-right">
                                    <p className="font-bold text-slate-700 dark:text-slate-200">{log.campaignName}</p>
                                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                                        <span>Para: {log.recipient}</span>
                                        <span>{log.timestamp}</span>
                                    </div>
                                    <div className="flex gap-2 mt-1">
                                        <span className={`inline-block text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${log.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                            {log.status === 'delivered' ? 'Enviado Real' : log.status}
                                        </span>
                                        {log.details && <span className="text-[10px] text-slate-400 truncate max-w-[120px]" title={log.details}>{log.details}</span>}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
