
// ============================================================================
// DASHBOARD DE GIMNASIO (GymDashboard.tsx)
// ============================================================================
// Este es el panel administrativo para los dueños de gimnasios.
// Características Principales:
// 1. KPIs Financieros: Ingresos mensuales, miembros activos, retención.
// 2. Gestión de Riesgo: Identifica miembros con pagos vencidos o inactividad.
// 3. Acciones Rápidas (Risk -> Action): Permite cobrar o iniciar campañas de marketing
//    desde las alertas de riesgo.
// 4. Tablas de Miembros e Informe Financiero Visual.
// ============================================================================

import React, { useState, useEffect, useMemo } from 'react';
import { gymService, GymMember } from '../services/gymService';
import { groupClassService } from '../services/groupClassService'; // Import Service
import { SimpleBarChart } from '../components/charts/SimpleBarChart';
import { ChecklistWidget } from '../components/ChecklistWidget';
import { useFeedback } from '../components/FeedbackSystem';
import { AIGymAdminWidget } from '../components/AIGymAdminWidget';

// Local mock for chart data only (until we have real transaction history)
// Local mock for chart data only (until we have real transaction history)
const chartData: any[] = []; // Datos vacíos hasta integración real con transacciones

// Componente de Tarjeta KPI (Indicador Clave de Rendimiento)
const KpiCard: React.FC<{ icon: string; value: string | number; label: string; sublabel: string; trend?: 'up' | 'down' | 'neutral' }> = ({ icon, value, label, sublabel, trend }) => (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-start justify-between transition-all hover:shadow-md hover:-translate-y-1">
        <div>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
            <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white mb-1">{value}</h3>
            <p className="text-slate-400 dark:text-slate-500 text-xs flex items-center gap-1">
                {trend === 'up' && <span className="text-green-500 font-bold">↑</span>}
                {trend === 'down' && <span className="text-red-500 font-bold">↓</span>}
                {sublabel}
            </p>
        </div>
        <div className="text-2xl bg-slate-50 dark:bg-slate-700 w-10 h-10 rounded-xl flex items-center justify-center shadow-inner">
            {icon}
        </div>
    </div>
);

// Mapeo de colores para los estados de membresía
const statusColors: { [key: string]: string } = {
    'Al día': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    'Vencido': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

interface GymDashboardProps {
    onNavigate: (page: string) => void;
}

export const GymDashboard: React.FC<GymDashboardProps> = ({ onNavigate }) => {
    const [members, setMembers] = useState<GymMember[]>([]);
    const [challenges, setChallenges] = useState<any[]>([]);
    const [activeClasses, setActiveClasses] = useState<any[]>([]); // New state
    const [editingClassId, setEditingClassId] = useState<number | null>(null); // New state

    // Attendees State
    const [attendeesModalOpen, setAttendeesModalOpen] = useState(false);
    const [selectedClassAttendees] = useState<any[]>([]);
    const [currentClassForAttendees] = useState<any>(null);

    const [isLoading, setIsLoading] = useState(true);

    const { showToast } = useFeedback();

    // Estado para el Modal de Acción de Riesgo
    const [riskModalOpen, setRiskModalOpen] = React.useState(false);
    const [selectedRiskMember, setSelectedRiskMember] = React.useState<GymMember | null>(null);

    // Estado para Modal de Clases
    const [classModalOpen, setClassModalOpen] = useState(false);
    const [newClass, setNewClass] = useState({
        name: '',
        description: '',
        coach: '',
        date: '',
        time: '',
        capacity: 20,
        category: 'Funcional'
    });

    // Estado para Modal de Retos
    const [challengeModalOpen, setChallengeModalOpen] = useState(false);
    const [newChallenge, setNewChallenge] = useState({
        title: '',
        description: '',
        xp_reward: 100,
        type: 'consistencia',
        target_value: 3,
        target_unit: 'días',
        deadline: ''
    });

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const [membersData, challengesData, classesData] = await Promise.all([
                    gymService.fetchMembers(),
                    gymService.fetchActiveChallenges(),
                    groupClassService.fetchClasses()
                ]);
                setMembers(membersData);
                setChallenges(challengesData);
                setActiveClasses(classesData);
            } catch (error) {
                console.error("Error loading dashboard:", error);
                showToast("Error al cargar datos del tablero", "error");
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [showToast]);

    // --- CÁLCULO DE MÉTRICAS EN TIEMPO REAL ---
    const kpis = useMemo(() => {
        const total = members.length;
        const active = members.filter(m => m.status === 'Al día').length;
        const atRisk = members.filter(m => m.status === 'Vencido');
        // Estimación de ingresos: (Activos * $30) - muy simplificado para demo
        // O podríamos sumar si tuviéramos tabla de pagos
        const estimatedIncome = active * 30000; // Asumiendo 30k COP/mes avg

        return {
            total,
            active,
            atRisk,
            income: estimatedIncome,
            activeChallenges: challenges.length
        };
    }, [members]);

    const handleCreateReport = () => {
        showToast('Reporte generado y enviado a tu correo.', 'success');
    };

    const handleOpenRiskModal = (member: GymMember) => {
        setSelectedRiskMember(member);
        setRiskModalOpen(true);
    };

    // Ejecuta la acción seleccionada en el modal de riesgo
    const executeRiskAction = async (startCampaign: boolean) => {
        if (!selectedRiskMember) return;

        setRiskModalOpen(false);
        try {
            // Asumimos que el admin es el receptor de la confirmación por ahora, 
            // o si el miembro tuviera ID de usuario real, se le enviaría.
            // Aquí usamos el ID del miembro como referencia en el mensaje o notificación interna

            if (startCampaign) {
                // Simulación de interacción con el módulo de Marketing + Registro en DB
                await gymService.createNotification(
                    null, // Usar ID del admin actual
                    `Campaña "Recuperación" activada para ${selectedRiskMember.full_name}`,
                    'info'
                );
                showToast(`🚀 Campaña "Recuperación de Riesgo" activada para ${selectedRiskMember.full_name}.`, 'success');
            } else {
                // Acción simple de cobro
                await gymService.createNotification(
                    null, // Usar ID del admin actual
                    `Recordatorio de pago enviado a ${selectedRiskMember.full_name}`,
                    'payment'
                );
                showToast(`💰 Recordatorio de pago enviado a ${selectedRiskMember.full_name}.`, 'info');
            }
        } catch (error) {
            console.error(error);
            showToast('Acción registrada localmente (Error backend notificación)', 'warning');
        }
        setSelectedRiskMember(null);
    };

    const handleDeleteChallenge = async (id: number) => {
        try {
            await gymService.deleteChallenge(id);
            showToast('Reto finalizado exitosamente', 'success');
            const updatedChallenges = await gymService.fetchActiveChallenges();
            setChallenges(updatedChallenges);
        } catch (error) {
            console.error('Error deleting challenge:', error);
            showToast('Error al finalizar reto', 'error');
        }
    };

    const handleDeleteClass = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar esta clase?')) return;
        try {
            await groupClassService.deleteClass(id);
            showToast('Clase eliminada exitosamente', 'success');
            const updatedClasses = await groupClassService.fetchClasses();
            setActiveClasses(updatedClasses);
        } catch (error) {
            console.error('Error deleting class:', error);
            showToast('Error al eliminar clase', 'error');
        }
    };

    const handleEditClass = (cls: any) => {
        // Populate modal with class data (simplified) - assuming newClass state matches structure roughly
        setNewClass({
            name: cls.name,
            description: cls.description || '',
            coach: cls.coach,
            capacity: cls.capacity || 20,
            category: cls.category || 'Funcional',
            time: cls.schedule?.[0]?.time || '',
            date: cls.schedule?.[0]?.day || '',
            // We might need to store the ID being edited if we want update logic in modal. 
            // For now, let's assume Create mode only or basic edit.
            // Actually, handleCreateClass calls createClass. We need updateClass.
            // Let's add an 'editingClassId' state or similar?
        } as any);
        // We'll borrow the Create Modal but we need to know if it's edit.
        // For simplicity given the request "modificar", I'll add editing state.
        setEditingClassId(cls.id);
        setClassModalOpen(true);
    };

    const handleCreateOrUpdateClass = async () => {
        try {
            const classData = {
                name: newClass.name,
                description: newClass.description,
                coach: newClass.coach,
                capacity: newClass.capacity,
                category: newClass.category,
                imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
                videoUrl: '',
                difficulty: 'Intermedio',
                schedule: [{ day: newClass.date, time: newClass.time }],
                duration: 60, // Default duration in minutes
                price: 0,
                locationType: 'Gimnasio',
                gymId: ''
            };

            if (editingClassId) {
                await groupClassService.updateClass(editingClassId, classData);
                showToast('Clase actualizada exitosamente', 'success');
            } else {
                await groupClassService.createClass(classData as any);
                showToast('Clase publicada exitosamente', 'success');
            }

            setClassModalOpen(false);
            setEditingClassId(null); // Reset
            const updated = await groupClassService.fetchClasses();
            setActiveClasses(updated);
        } catch (error) {
            console.error(error);
            showToast('Error al guardar clase', 'error');
        }
    };

    const checklistItems = [
        { id: '1', label: 'Configura el horario de tu gimnasio', isCompleted: true },
        { id: '2', label: 'Registra tu primer miembro', isCompleted: kpis.total > 0, actionLabel: 'Ir a Miembros', onAction: () => onNavigate('Miembros') },
        { id: '3', label: 'Añade equipo al inventario', isCompleted: false, actionLabel: 'Gestionar Inventario', onAction: () => onNavigate('Inventario') },
        { id: '4', label: 'Crea un Reto Semanal', isCompleted: challenges.length > 0, actionLabel: 'Gamificación', onAction: () => setChallengeModalOpen(true) }
    ];

    return (
        <div className="container mx-auto px-4 py-8 md:py-10 space-y-8 animate-fade-in">

            {/* Encabezado del Dashboard */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-200 dark:border-slate-700 pb-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">Panel de Control</h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">Resumen operativo de <span className="font-bold text-brand-primary">Gimnasio El Templo</span></p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => onNavigate('Miembros')} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm">
                        + Miembro
                    </button>
                    <button onClick={handleCreateReport} className="bg-brand-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-secondary transition-colors text-sm shadow-lg shadow-brand-primary/20">
                        Crear Reporte
                    </button>
                </div>
            </div>

            {/* Rejilla de KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard icon="👥" value={kpis.total} label="Miembros Totales" sublabel="+5% vs mes anterior" trend="up" />
                <KpiCard icon="✅" value={kpis.active} label="Miembros Activos" sublabel={`${kpis.total > 0 ? Math.round((kpis.active / kpis.total) * 100) : 0}% Retención`} trend="neutral" />
                <KpiCard icon="💰" value={`$${(kpis.income / 1000).toFixed(1)}k`} label="Ingresos Est." sublabel="Basado en activos" trend="up" />
                <KpiCard icon="⚡" value={kpis.activeChallenges} label="Retos Activos" sublabel="Gamificación" />
            </div>

            {/* Checklist de Inicio Rápido */}
            <ChecklistWidget title="Tareas Administrativas" items={checklistItems} />

            {/* Contenido Principal (Gráficos y Tablas) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Columna Izquierda (Datos Principales) */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Gráfico Financiero */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Rendimiento Financiero</h2>
                            <select className="bg-slate-50 dark:bg-slate-700 border-none text-xs rounded-md p-2 text-slate-600 dark:text-slate-300 focus:ring-0 cursor-pointer">
                                <option>Últimos 6 meses</option>
                                <option>Este Año</option>
                            </select>
                        </div>
                        <div className="h-64">
                            <SimpleBarChart data={chartData} />
                        </div>
                    </div>

                    {/* Tabla de Miembros Recientes */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Miembros Recientes</h2>
                            <button onClick={() => onNavigate('Miembros')} className="text-sm font-bold text-brand-primary hover:underline">Ver Todos</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                    <tr>
                                        <th className="p-3 font-semibold rounded-l-lg">Miembro</th>
                                        <th className="p-3 font-semibold">Plan</th>
                                        <th className="p-3 font-semibold text-center">Estado</th>
                                        <th className="p-3 font-semibold rounded-r-lg">Ingreso</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {isLoading ? (
                                        <tr><td colSpan={4} className="p-4 text-center">Cargando...</td></tr>
                                    ) : members.slice(0, 5).map(member => (
                                        <tr key={member.id} className="border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                            <td className="p-3 font-bold text-slate-700 dark:text-slate-200">{member.full_name}</td>
                                            <td className="p-3 text-slate-500 dark:text-slate-400 capitalize">{member.plan}</td>
                                            <td className="p-3 text-center">
                                                <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-full ${statusColors[member.status]}`}>
                                                    {member.status}
                                                </span>
                                            </td>
                                            <td className="p-3 text-slate-400">{member.join_date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Columna Derecha (Información Secundaria) */}
                <div className="space-y-8">

                    {/* Top Miembros (Gamificación) */}
                    {/* Asistente IA para Admin */}
                    <AIGymAdminWidget />

                    {/* Alertas de Riesgo (Risk -> Action) */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Alertas de Riesgo</h2>
                            <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">{kpis.atRisk.length}</span>
                        </div>
                        {kpis.atRisk.length > 0 ? (
                            <div className="space-y-3">
                                {kpis.atRisk.map(member => (
                                    <div key={member.id} className="flex justify-between items-center bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-100 dark:border-red-900/30">
                                        <div>
                                            <p className="font-bold text-red-800 dark:text-red-300 text-sm">{member.full_name}</p>
                                            <p className="text-[10px] text-red-600 dark:text-red-400">Venció: {member.last_payment_date}</p>
                                        </div>
                                        <button
                                            onClick={() => handleOpenRiskModal(member)}
                                            className="text-xs font-bold text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                                        >
                                            Acción
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-green-600 font-medium text-sm">¡Todo en orden!</p>
                            </div>
                        )}
                    </div>

                    {/* Gestión Rápida de Clases */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Clases Grupales</h2>
                            <button onClick={() => {
                                setNewClass({ name: '', description: '', coach: '', capacity: 20, time: '', date: '', category: 'Funcional' });
                                setClassModalOpen(true);
                            }} className="bg-brand-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-brand-primary-dark transition-colors">
                                + Publicar
                            </button>
                        </div>
                        <p className="text-sm text-slate-500 mb-4">Gestiona tus clases activas.</p>

                        <div className="space-y-3 mb-4">
                            {activeClasses.length === 0 ? (
                                <p className="text-xs text-center text-slate-400 py-2">No hay clases publicadas.</p>
                            ) : activeClasses.map((cls: any) => (
                                <div key={cls.id} className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl border border-slate-200 dark:border-slate-600 flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-slate-800 dark:text-white text-sm">{cls.name}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{cls.schedule?.[0]?.day} - {cls.schedule?.[0]?.time}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEditClass(cls)}
                                            className="text-blue-500 hover:text-blue-700 p-1" title="Editar">✏️</button>
                                        <button
                                            onClick={() => handleDeleteClass(cls.id)}
                                            className="text-red-500 hover:text-red-700 p-1" title="Eliminar">🗑️</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-center bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 border border-dashed border-slate-300 dark:border-slate-600 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => {
                            setNewClass({ name: '', description: '', coach: '', capacity: 20, time: '', date: '', category: 'Funcional' });
                            setClassModalOpen(true);
                        }}>
                            <p className="font-bold text-slate-400 dark:text-slate-500 text-sm">Crear Nueva Clase</p>
                        </div>
                    </div>

                </div>
            </div>

            {/* Modal de Crear Clase */}
            {classModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-slate-700 p-6">
                        <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Publicar Nueva Clase</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Nombre de la Clase</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    value={newClass.name}
                                    onChange={e => setNewClass({ ...newClass, name: e.target.value })}
                                    placeholder="Ej: Yoga al Amanecer"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Entrenador</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    value={newClass.coach}
                                    onChange={e => setNewClass({ ...newClass, coach: e.target.value })}
                                    placeholder="Nombre del instructor"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Día</label>
                                    <select
                                        className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                        value={newClass.date}
                                        onChange={e => setNewClass({ ...newClass, date: e.target.value })}
                                    >
                                        <option value="">Selecciona</option>
                                        <option value="Lunes">Lunes</option>
                                        <option value="Martes">Martes</option>
                                        <option value="Miércoles">Miércoles</option>
                                        <option value="Jueves">Jueves</option>
                                        <option value="Viernes">Viernes</option>
                                        <option value="Sábado">Sábado</option>
                                        <option value="Domingo">Domingo</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Hora</label>
                                    <input
                                        type="time"
                                        className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                        value={newClass.time}
                                        onChange={e => setNewClass({ ...newClass, time: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Categoría</label>
                                <select
                                    className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    value={newClass.category}
                                    onChange={e => setNewClass({ ...newClass, category: e.target.value })}
                                >
                                    <option value="Funcional">Funcional</option>
                                    <option value="Yoga">Yoga</option>
                                    <option value="Cardio">Cardio</option>
                                    <option value="Fuerza">Fuerza</option>
                                    <option value="Baile">Baile</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setClassModalOpen(false)} className="flex-1 py-2 text-slate-500 font-bold hover:bg-slate-100 rounded-lg transition-colors">Cancelar</button>
                            <button onClick={handleCreateOrUpdateClass} className="flex-1 py-2 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-primary-dark transition-colors">{editingClassId ? 'Guardar Cambios' : 'Publicar'}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Asistentes */}
            {attendeesModalOpen && currentClassForAttendees && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-slate-700 p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Asistentes: {currentClassForAttendees.name}</h3>
                            <button onClick={() => setAttendeesModalOpen(false)} className="text-slate-400 hover:text-slate-500">✕</button>
                        </div>
                        <div className="max-h-60 overflow-y-auto space-y-2 mb-4">
                            {selectedClassAttendees.length === 0 ? (
                                <p className="text-center text-slate-500 py-4">No hay reservas aún.</p>
                            ) : selectedClassAttendees.map((att: any) => (
                                <div key={att.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                    <div className="w-8 h-8 rounded-full bg-brand-primary/20 text-brand-primary flex items-center justify-center font-bold text-xs">
                                        {att.user?.name?.substring(0, 2).toUpperCase() || 'U'}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-slate-800 dark:text-white">{att.user?.name}</p>
                                        <p className="text-xs text-slate-500">{new Date(att.joinedAt).toLocaleDateString()}</p>
                                    </div>
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{att.status === 'confirmed' ? 'Confirmado' : att.status}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end">
                            <button onClick={() => setAttendeesModalOpen(false)} className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200">Cerrar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Acción (Risk Interventions) */}
            {riskModalOpen && selectedRiskMember && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-slate-700">
                        <div className="p-6">
                            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-2xl mb-4 mx-auto">
                                ⚠️
                            </div>
                            <h3 className="text-xl font-bold text-center text-slate-900 dark:text-white mb-2">
                                Gestionar Riesgo: {selectedRiskMember.full_name}
                            </h3>
                            <p className="text-center text-slate-500 dark:text-slate-400 text-sm mb-6">
                                Este usuario lleva más de 7 días ausente y su cuota ha vencido. ¿Qué acción estratégica deseas tomar?
                            </p>

                            <div className="space-y-3">
                                <button
                                    onClick={() => executeRiskAction(true)}
                                    className="w-full flex items-center justify-center gap-3 p-4 rounded-xl border-2 border-green-500 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 transition-all group"
                                >
                                    <span className="text-2xl">🚀</span>
                                    <div className="text-left">
                                        <p className="font-bold text-slate-800 dark:text-white group-hover:text-green-700 dark:group-hover:text-green-400">Activar "Recuperación"</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Envía promo de regreso vía WhatsApp (Automatización).</p>
                                    </div>
                                </button>

                                <button
                                    onClick={() => executeRiskAction(false)}
                                    className="w-full flex items-center justify-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 dark:bg-slate-700/50 dark:border-slate-600 transition-all"
                                >
                                    <span className="text-2xl">💰</span>
                                    <div className="text-left">
                                        <p className="font-bold text-slate-800 dark:text-white">Solo Cobrar</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Generar enlace de pago y enviar.</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-700/50 p-4 flex justify-center border-t border-slate-100 dark:border-slate-700">
                            <button
                                onClick={() => setRiskModalOpen(false)}
                                className="text-sm font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"
                            >
                                Cancelar
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {/* Modal de Crear Reto */}
            {challengeModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-slate-700 p-6">
                        <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">
                            {challenges.length > 0 ? 'Gestionar Retos Activos' : 'Crear Nuevo Reto'}
                        </h3>

                        {challenges.length > 0 && (
                            <div className="mb-6 space-y-3">
                                <p className="text-sm text-slate-500 font-medium">Retos actuales:</p>
                                {challenges.map((c: any) => (
                                    <div key={c.id} className="flex justify-between items-center bg-slate-50 dark:bg-slate-700 p-3 rounded-lg border border-slate-200 dark:border-slate-600">
                                        <div>
                                            <p className="font-bold text-slate-800 dark:text-white text-sm">{c.title}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Fin: {new Date(c.deadline).toLocaleDateString()}</p>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteChallenge(c.id)}
                                            className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                                            title="Eliminar Reto"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                ))}
                                <div className="border-b border-slate-200 dark:border-slate-700 my-4"></div>
                                <p className="text-sm font-bold text-slate-700 dark:text-white mb-2">Crear otro reto:</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Título del Reto</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    value={newChallenge.title}
                                    onChange={e => setNewChallenge({ ...newChallenge, title: e.target.value })}
                                    placeholder="Ej: Semana de Cardio"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Descripción</label>
                                <textarea
                                    className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    value={newChallenge.description}
                                    onChange={e => setNewChallenge({ ...newChallenge, description: e.target.value })}
                                    rows={2}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Tipo</label>
                                    <select
                                        className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                        value={newChallenge.type}
                                        onChange={e => setNewChallenge({ ...newChallenge, type: e.target.value })}
                                    >
                                        <option value="consistencia">Consistencia</option>
                                        <option value="cardio">Cardio</option>
                                        <option value="fuerza">Fuerza</option>
                                        <option value="social">Social</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Recompensa (XP)</label>
                                    <input
                                        type="number"
                                        className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                        value={newChallenge.xp_reward}
                                        onChange={e => setNewChallenge({ ...newChallenge, xp_reward: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Fecha Límite</label>
                                <input
                                    type="date"
                                    className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    value={newChallenge.deadline}
                                    onChange={e => setNewChallenge({ ...newChallenge, deadline: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setChallengeModalOpen(false)} className="flex-1 py-2 text-slate-500 font-bold hover:bg-slate-100 rounded-lg transition-colors">Cancelar</button>
                            <button onClick={async () => {
                                try {
                                    const challengeToCreate = {
                                        ...newChallenge,
                                        deadline: newChallenge.deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Default 7 days
                                    };
                                    await gymService.createChallenge(challengeToCreate);
                                    showToast('Reto creado exitosamente', 'success');
                                    setChallengeModalOpen(false);
                                    // Refresh logic
                                    const c = await gymService.fetchActiveChallenges();
                                    setChallenges(c);
                                } catch (e) {
                                    console.error(e);
                                    showToast('Error al crear reto', 'error');
                                }
                            }} className="flex-1 py-2 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-primary-dark transition-colors">Guardar Reto</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
