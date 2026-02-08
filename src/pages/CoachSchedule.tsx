
import { useState, useEffect, useMemo } from 'react';
import { GroupClass } from '../types';
import { coachService } from '../services/coachService';
import { useFeedback } from '../components/FeedbackSystem';

// --- SUB-COMPONENTS ---

// 1. SOLICITUDES PENDIENTES (TABLE)
const RequestsTable = ({ requests, onConfirm, onCancel }: { requests: any[], onConfirm: (id: any) => void, onCancel: (id: any) => void }) => {
    if (requests.length === 0) return <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">No hay solicitudes pendientes.</div>;

    return (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left bg-white">
                <thead className="bg-slate-50 text-slate-500 font-semibold text-xs uppercase tracking-wider border-b border-slate-100">
                    <tr>
                        <th className="p-4">Cliente</th>
                        <th className="p-4">Servicio / Clase</th>
                        <th className="p-4">Fecha & Hora</th>
                        <th className="p-4 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {requests.map(req => (
                        <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-4 font-medium text-slate-800">{req.bookedBy}</td>
                            <td className="p-4 text-slate-600">{req.name} {req.category === 'Clase' && <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded ml-2">Grupal</span>}</td>
                            <td className="p-4 text-slate-600">
                                {req.schedule[0].day} <br />
                                <span className="text-xs text-slate-400">{req.schedule[0].time}</span>
                            </td>
                            <td className="p-4 text-right space-x-2">
                                <button onClick={() => onCancel(req.id)} className="text-red-500 hover:text-red-700 text-sm font-medium px-2 py-1">Rechazar</button>
                                <button onClick={() => onConfirm(req.id)} className="bg-brand-primary text-white text-sm font-bold px-4 py-1.5 rounded-lg hover:bg-brand-secondary transition-colors shadow-sm">Confirmar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// 2. HISTORIAL DE SESIONES (TABLE)
const HistoryTable = ({ sessions }: { sessions: any[] }) => {
    if (sessions.length === 0) return <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">No hay historial de sesiones.</div>;

    return (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left bg-white">
                <thead className="bg-slate-50 text-slate-500 font-semibold text-xs uppercase tracking-wider border-b border-slate-100">
                    <tr>
                        <th className="p-4">Fecha</th>
                        <th className="p-4">Cliente</th>
                        <th className="p-4">Actividad</th>
                        <th className="p-4">Estado</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {sessions.map(session => (
                        <tr key={session.id} className="hover:bg-slate-50/50">
                            <td className="p-4 text-slate-600">
                                {session.schedule[0].day}
                                <span className="block text-xs text-slate-400">{session.schedule[0].time}</span>
                            </td>
                            <td className="p-4 text-slate-800">{session.bookedBy}</td>
                            <td className="p-4 text-slate-600 font-medium">{session.name}</td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${session.status === 'completed' ? 'bg-green-100 text-green-700' :
                                    session.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                                    }`}>
                                    {session.status === 'completed' ? 'Completada' : session.status === 'cancelled' ? 'Cancelada' : session.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// 3. EDITOR DE DISPONIBILIDAD (GRID)
const AvailabilityEditor = ({ availability, onSave, isSaving }: { availability: any[], onSave: (av: any[]) => void, isSaving: boolean }) => {
    const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const HOURS = Array.from({ length: 15 }, (_, i) => `${i + 6}:00`.padStart(5, '0')); // 06:00 - 20:00

    const [localAvailability, setLocalAvailability] = useState(availability);

    useEffect(() => { setLocalAvailability(availability) }, [availability]);

    const toggleSlot = (day: string, hour: string) => {
        setLocalAvailability(prev => {
            const dayEntry = prev.find(d => d.day === day);
            if (dayEntry) {
                const hasHour = dayEntry.hours.includes(hour);
                const newHours = hasHour ? dayEntry.hours.filter((h: string) => h !== hour) : [...dayEntry.hours, hour];
                const cleanPrev = prev.filter((d: any) => d.day !== day);
                return newHours.length > 0 ? [...cleanPrev, { day, hours: newHours }] : cleanPrev;
            } else {
                return [...prev, { day, hours: [hour] }];
            }
        });
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Horario Base Semanal</h3>
                    <p className="text-sm text-slate-500">Define tus franjas horarias generales.</p>
                </div>
                <button
                    onClick={() => onSave(localAvailability)}
                    disabled={isSaving}
                    className="bg-brand-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-brand-secondary transition-colors disabled:opacity-50"
                >
                    {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
                {DAYS.map(day => (
                    <div key={day} className="border border-slate-100 rounded-lg p-3 bg-slate-50/50">
                        <h4 className="font-bold text-center text-slate-700 mb-3 text-sm">{day}</h4>
                        <div className="grid grid-cols-2 gap-1">
                            {HOURS.map(hour => {
                                const isSelected = localAvailability.find((d: any) => d.day === day)?.hours.includes(hour);
                                return (
                                    <button
                                        key={hour}
                                        onClick={() => toggleSlot(day, hour)}
                                        className={`text-xs py-1 rounded transition-colors ${isSelected ? 'bg-brand-primary text-white font-bold' : 'bg-white text-slate-400 hover:bg-slate-200'
                                            }`}
                                    >
                                        {hour}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// 4. MAIN AGENDA VIEW (List + Blocks)
const AgendaView = ({ upcomingSessions, blockedTimes, onBlockTime, onUnblockTime }: { upcomingSessions: any[], blockedTimes: any[], onBlockTime: () => void, onUnblockTime: (id: number) => void }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                        <h3 className="font-bold text-slate-700">Próximas Sesiones</h3>
                        <span className="text-xs font-semibold bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded-full">{upcomingSessions.length} Activas</span>
                    </div>
                    {upcomingSessions.length > 0 ? (
                        <div className="divide-y divide-slate-100">
                            {upcomingSessions.map(session => (
                                <div key={session.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-indigo-100 text-indigo-600 w-12 h-12 rounded-lg flex flex-col items-center justify-center font-bold text-xs leading-none">
                                            <span className="text-lg">{session.schedule[0].day.split('/')[0]}</span>
                                            <span className="uppercase text-[10px] opacity-75">DIC</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800">{session.name}</h4>
                                            <p className="text-sm text-slate-500">{session.bookedBy} • {session.schedule[0].time}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-xs font-bold px-2 py-1 rounded border ${session.category === 'Personalizado' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                                            {session.category}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-slate-400 italic">No tienes sesiones próximas confirmadas.</div>
                    )}
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-slate-800 text-white rounded-xl p-6 shadow-lg">
                    <h3 className="font-bold text-lg mb-2">Bloqueos Excepcionales</h3>
                    <p className="text-slate-400 text-sm mb-4">Gestiona tiempos no disponibles fuera de tu horario base.</p>

                    <button onClick={onBlockTime} className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold border border-white/20 mb-4 transition-colors">
                        + Añadir Bloqueo (Día Libre)
                    </button>

                    <div className="space-y-2">
                        {blockedTimes.map(block => (
                            <div key={block.id} className="bg-slate-700/50 p-3 rounded flex justify-between items-center text-sm">
                                <div>
                                    <span className="block font-bold text-slate-200">{block.date}</span>
                                    <span className="text-xs text-slate-400">{block.time || 'Todo el día'} - {block.note}</span>
                                </div>
                                <button onClick={() => onUnblockTime(block.id)} className="text-red-400 hover:text-red-300">✕</button>
                            </div>
                        ))}
                        {blockedTimes.length === 0 && <p className="text-xs text-slate-500 italic">No hay bloqueos activos.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---
export const CoachSchedule = () => {
    const [activeTab, setActiveTab] = useState<'agenda' | 'solicitudes' | 'historial' | 'config'>('agenda');
    const [schedule, setSchedule] = useState<GroupClass[]>([]);
    const [availability, setAvailability] = useState<{ day: string; hours: string[] }[]>([]);
    const [blockedTimes, setBlockedTimes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useFeedback();

    const refreshData = async () => {
        setLoading(true);
        try {
            const [sched, avail, blocks] = await Promise.all([
                coachService.fetchSchedule(),
                coachService.fetchAvailability(),
                coachService.fetchBlockedTimes()
            ]);
            setSchedule(sched as any);
            setAvailability(avail);
            setBlockedTimes(blocks || []);
        } catch (err) {
            console.error(err);
            showToast('Error cargando datos', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { refreshData(); }, []);

    const pendingRequests = useMemo(() => schedule.filter(s => s.status === 'pending_confirmation'), [schedule]);

    const upcomingSessions = useMemo(() => schedule.filter(s => {
        if (s.status !== 'confirmed') return false;
        if (!s.rawDate) return true;
        return new Date(s.rawDate) >= new Date();
    }).sort((a, b) => new Date(a.rawDate || a.schedule[0].day).getTime() - new Date(b.rawDate || b.schedule[0].day).getTime()), [schedule]);

    const historySessions = useMemo(() => schedule.filter(s => {
        const isPastConfirmed = s.status === 'confirmed' && s.rawDate && new Date(s.rawDate) < new Date();
        return ['completed', 'cancelled'].includes(s.status!) || isPastConfirmed;
    }).sort((a, b) => new Date(b.rawDate || b.schedule[0].day).getTime() - new Date(a.rawDate || a.schedule[0].day).getTime()), [schedule]);

    const handleConfirm = async (id: number) => {
        try {
            await coachService.updateBookingStatus(id, 'confirmed');
            showToast('Solicitud confirmada', 'success');
            refreshData();
        } catch (e) { showToast('Error al confirmar', 'error'); }
    };

    const handleCancel = async (id: number) => {
        if (confirm('¿Rechazar solicitud?')) {
            try {
                await coachService.updateBookingStatus(id, 'cancelled');
                showToast('Solicitud rechazada', 'info');
                refreshData();
            } catch (e) { showToast('Error', 'error'); }
        }
    };

    const handleSaveAvailability = async (newAvail: any[]) => {
        try {
            await coachService.updateAvailability(newAvail);
            setAvailability(newAvail);
            showToast('Disponibilidad actualizada', 'success');
        } catch (e) { showToast('Error guardando', 'error'); }
    };

    const handleAddBlock = async () => {
        const date = prompt("Ingresa la fecha a bloquear (YYYY-MM-DD):");
        if (!date) return;
        const time = prompt("Hora (HH:MM) o dejalo vacio para todo el dia:", "08:00");
        if (!time) return;

        try {
            await coachService.blockTime(date, time, "Bloqueo manual");
            showToast('Bloqueo añadido', 'success');
            refreshData();
        } catch (e) {
            console.error(e);
            showToast('Error', 'error');
        }
    };

    const handleUnblock = async (id: number) => {
        if (confirm('¿Eliminar bloqueo?')) {
            try {
                await coachService.unblockTime(id);
                showToast('Bloqueo eliminado', 'success');
                refreshData();
            } catch (e) { showToast('Error', 'error'); }
        }
    };

    if (loading) return <div className="p-12 text-center animate-pulse text-slate-400">Cargando Gestor de Agenda...</div>;

    return (
        <div className="container mx-auto px-4 py-8 animate-fade-in space-y-8">
            <header className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-slate-100 pb-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900">Mi Horario</h1>
                    <p className="text-slate-500">Gestión centralizada de tu tiempo y sesiones.</p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-xl overflow-hidden shadow-sm">
                    {['agenda', 'solicitudes', 'historial', 'config'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === tab ? 'bg-white text-brand-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            {tab === 'solicitudes' && pendingRequests.length > 0 && (
                                <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{pendingRequests.length}</span>
                            )}
                        </button>
                    ))}
                </div>
            </header>

            <main>
                {activeTab === 'agenda' && (
                    <AgendaView
                        upcomingSessions={upcomingSessions}
                        blockedTimes={blockedTimes}
                        onBlockTime={handleAddBlock}
                        onUnblockTime={handleUnblock}
                    />
                )}

                {activeTab === 'solicitudes' && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-slate-800">Solicitudes por Confirmar</h2>
                        <RequestsTable requests={pendingRequests} onConfirm={handleConfirm} onCancel={handleCancel} />
                    </div>
                )}

                {activeTab === 'historial' && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-slate-800">Historial de Actividad</h2>
                        <HistoryTable sessions={historySessions} />
                    </div>
                )}

                {activeTab === 'config' && (
                    <AvailabilityEditor
                        availability={availability}
                        onSave={handleSaveAvailability}
                        isSaving={false}
                    />
                )}
            </main>
        </div>
    );
};
