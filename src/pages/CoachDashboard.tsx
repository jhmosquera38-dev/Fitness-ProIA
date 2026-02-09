
// ============================================================================
// DASHBOARD DE ENTRENADOR (CoachDashboard.tsx)
// ============================================================================
// Este es el panel para los entrenadores personales.
// Características Principales:
// 1. Gestión de Clientes: Lista de alumnos activos y su estado.
// 2. Finanzas Personales: Visualización de ingresos (Comisiones, Clases).
// 3. Feedback y Calificaciones: Muestra reseñas de los usuarios para mejorar la reputación.
// ============================================================================

import React, { useState, useEffect } from 'react';

import { User } from '../types';

interface CoachDashboardProps {
    user: User;
    onNavigate: (view: string) => void;
    onStartTour?: () => void;
}

interface StatCardProps {
    label: string;
    value: string | number;
    icon: string;
    colorClass?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, colorClass = "text-brand-primary" }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4 hover:shadow-md transition-shadow">
        <div className={`p-4 rounded-xl bg-slate-50 dark:bg-slate-700 ${colorClass} text-2xl`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{label}</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{value}</h3>
        </div>
    </div>
);

interface ServiceCardProps {
    service: any;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => (
    <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-200 dark:border-slate-600">
        <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-slate-800 dark:text-white">{service.name}</h3>
            <span className="text-brand-primary font-bold">${service.price}</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{service.description}</p>
        <div className="flex justify-between items-center text-xs">
            <span className="flex items-center gap-1">👤 {service.activeClients || 0} Activos</span>
            <span className="flex items-center gap-1 text-yellow-500">⭐ {service.rating || 'N/A'}</span>
        </div>
    </div>
);

export const CoachDashboard: React.FC<CoachDashboardProps> = ({ user, onNavigate, onStartTour }) => {

    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({ clients: 0, income: 0, rating: 0 });
    const [services, setServices] = useState<any[]>([]);
    const [myClasses, setMyClasses] = useState<any[]>([]);
    const [clients, setClients] = useState<any[]>([]);
    const [reviews, setReviews] = useState<any[]>([]);

    // State for Class Modal
    const [classModalOpen, setClassModalOpen] = useState(false);
    const [editingClassId, setEditingClassId] = useState<string | null>(null);
    const [newClass, setNewClass] = useState({
        name: '',
        description: '',
        coach: '',
        date: '',
        time: '',
        capacity: 20,
        category: 'Funcional'
    });

    useEffect(() => {
        const fetchCoachData = async () => {
            if (!user) return;
            try {
                setIsLoading(true);
                // 1. Fetch Stats (Mocked or Real)
                // For demo, we might use hardcoded or fetch from DB
                // const profile = await UserService.getProfile(user.id);

                // Mock data for now to ensure dashboard renders
                // Mok data removed to ensure dashboard shows real state
                setStats({
                    clients: 0,
                    income: 0,
                    rating: 0
                });

                // 2. Fetch Services (Reset to empty)
                setServices([]);

                // 3. Fetch Classes (Reset to empty)
                setMyClasses([]);

                // 4. Fetch Clients (Reset to empty)
                setClients([]);

                // 5. Fetch Reviews (Reset to empty)
                setReviews([]);

            } catch (error) {
                console.error("Error loading coach data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCoachData();
    }, [user]);

    const handleSaveClass = () => {
        // Logic to save/update class
        console.log("Saving class:", newClass);
        // Mock update
        if (editingClassId) {
            setMyClasses(prev => prev.map(c => c.id === editingClassId ? { ...c, ...newClass, id: c.id } : c));
        } else {
            setMyClasses(prev => [...prev, { ...newClass, id: Date.now().toString(), schedule: [{ day: newClass.date, time: newClass.time }] }]);
        }
        setClassModalOpen(false);
    };

    const handleEditClick = (cls: any) => {
        setEditingClassId(cls.id);
        setNewClass({
            name: cls.name,
            description: cls.description || '',
            coach: cls.coach || '', // details might be missing in simple list
            date: cls.schedule?.[0]?.day || '',
            time: cls.schedule?.[0]?.time || '',
            capacity: cls.capacity || 20,
            category: cls.category || 'Funcional'
        });
        setClassModalOpen(true);
    };

    const handleDeleteClass = (id: string) => {
        if (confirm('¿Estás seguro de eliminar esta clase?')) {
            setMyClasses(prev => prev.filter(c => c.id !== id));
        }
    };

    if (isLoading) return <div className="p-10 text-center">Cargando panel...</div>;

    return (
        <div className="container mx-auto px-4 py-8 md:py-10 space-y-8 animate-fade-in">


            {/* Encabezado */}
            <div id="coach-header" className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-200 dark:border-slate-700 pb-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">Panel de Entrenador</h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">Gestiona tus clientes y servicios en <span className="font-bold text-brand-secondary">FitnessFlow</span></p>
                </div>
                <div className="flex gap-3">
                    <button id="coach-start-tour-btn" onClick={onStartTour} className="bg-white dark:bg-slate-800 text-brand-primary border border-brand-primary font-bold py-2 px-4 rounded-lg hover:bg-brand-primary hover:text-white transition-colors text-sm flex items-center gap-2">
                        <span>🚀</span> Iniciar Tour
                    </button>
                    <button id="coach-create-class-btn" onClick={() => { setEditingClassId(null); setNewClass({ name: '', description: '', coach: '', date: '', time: '', capacity: 20, category: 'Funcional' }); setClassModalOpen(true); }} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-200 transition-colors text-sm">
                        + Publicar Clase
                    </button>
                </div>
            </div>

            {/* Estadísticas Reales */}
            <div id="coach-stats" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Total Clientes" value={stats.clients} icon="👥" />
                <StatCard label="Ingresos Activos" value={`$${stats.income.toLocaleString()}`} icon="💵" colorClass="text-green-500" />
                <StatCard label="Calificación" value={stats.rating.toFixed(1)} icon="⭐" colorClass="text-yellow-500" />
                <StatCard label="Servicios Activos" value={services.length} icon="🏋️" colorClass="text-brand-primary" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Columna Principal */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Mis Clases Publicadas (NUEVA SECCIÓN COMPACTA) */}
                    <div id="coach-classes-section">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Mis Clases Grupales</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {myClasses.length === 0 ? (
                                <p className="text-slate-500 text-sm">No has publicado clases grupales aún.</p>
                            ) : myClasses.map(cls => (
                                <div key={cls.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border-l-4 border-brand-secondary flex justify-between items-center hover:shadow-md transition-all">
                                    <div>
                                        <h3 className="font-bold text-slate-800 dark:text-white text-sm">{cls.name}</h3>
                                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                            <span>📅 {cls.schedule?.[0]?.day || 'Fecha pendiente'}</span>
                                            <span>⏰ {cls.schedule?.[0]?.time || 'Hora pendiente'}</span>
                                        </div>
                                        <div className="mt-2">
                                            <span className="text-[10px] uppercase font-bold bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-500">
                                                {cls.schedule?.[0]?.day && new Date(cls.schedule[0].day) < new Date() ? 'Finalizada' : 'Activa'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEditClick(cls)} className="p-2 text-slate-400 hover:text-blue-500 transition-colors" title="Editar">
                                            ✏️
                                        </button>
                                        <button onClick={() => handleDeleteClass(cls.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Eliminar">
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mis Servicios */}
                    <div id="coach-services-section">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Mis Servicios</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {services.length === 0 ? (
                                <p className="text-slate-500">No tienes servicios activos. ¡Crea uno nuevo!</p>
                            ) : services.map(service => (
                                <ServiceCard key={service.id} service={service} />
                            ))}
                        </div>
                    </div>

                    {/* Clientes Recientes */}
                    <div id="coach-clients-section" className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700">
                        {/* Same Table Structure, but using mapped real 'clients' */}
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Clientes Recientes</h2>
                            <button onClick={() => onNavigate('clients')} className="text-sm font-bold text-brand-secondary hover:underline">Ver Todos</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                    <tr>
                                        <th className="p-3 font-semibold rounded-l-lg">Cliente</th>
                                        <th className="p-3 font-semibold">Membresía</th>
                                        <th className="p-3 font-semibold text-center">Progreso</th>
                                        <th className="p-3 font-semibold rounded-r-lg">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {clients.length === 0 ? (
                                        <tr><td colSpan={4} className="p-4 text-center text-slate-500">No tienes clientes aún.</td></tr>
                                    ) : clients.slice(0, 5).map(client => (
                                        <tr key={client.id} className="border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                            <td className="p-3 font-bold text-slate-700 dark:text-slate-200">{client.name}</td>
                                            <td className="p-3 text-slate-500 dark:text-slate-400">{client.memberships}</td>
                                            <td className="p-3 text-center">
                                                <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-1.5 mt-1 relative">
                                                    <div className="bg-green-500 h-1.5 rounded-full absolute top-0 left-0" style={{ width: `${client.progress}%` }}></div>
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <button onClick={() => onNavigate('clients')} className="text-xs font-bold text-brand-secondary hover:underline">Ver Detalles</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Columna Lateral: Reseñas */}
                <div className="space-y-8">
                    <div id="coach-reviews-section" className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Opiniones</h2>
                            <span className="text-xs text-slate-400">Feedback Real</span>
                        </div>
                        <div className="space-y-4">
                            {reviews.length === 0 ? <p className="text-xs text-slate-500">Sin reseñas aún.</p> : reviews.map(review => (
                                <div key={review.id} className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-bold text-slate-800 dark:text-white text-sm">{review.client}</span>
                                        <span className="text-[10px] text-slate-400">{review.date}</span>
                                    </div>
                                    <div className="flex text-yellow-400 text-xs mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                                        ))}
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-300 italic">"{review.comment}"</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Tarjeta Azul ELIMINADA */}
                </div>
            </div>

            {/* Modal Crear/Editar Clase */}
            {classModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold mb-4 dark:text-white">{editingClassId ? 'Editar Clase' : 'Publicar Nueva Clase'}</h3>
                        <div className="space-y-4">
                            <input type="text" placeholder="Nombre" className="w-full p-2 border rounded" value={newClass.name} onChange={e => setNewClass({ ...newClass, name: e.target.value })} />
                            <input type="text" placeholder="Entrenador" className="w-full p-2 border rounded" value={newClass.coach} onChange={e => setNewClass({ ...newClass, coach: e.target.value })} />
                            <input type="number" placeholder="Cupos" className="w-full p-2 border rounded" value={newClass.capacity} onChange={e => setNewClass({ ...newClass, capacity: parseInt(e.target.value) || 0 })} />
                            <div className="grid grid-cols-2 gap-2">
                                <input type="date" className="w-full p-2 border rounded" value={newClass.date} onChange={e => setNewClass({ ...newClass, date: e.target.value })} />
                                <input type="time" className="w-full p-2 border rounded" value={newClass.time} onChange={e => setNewClass({ ...newClass, time: e.target.value })} />
                            </div>
                            <textarea placeholder="Descripción" className="w-full p-2 border rounded" rows={3} value={newClass.description} onChange={e => setNewClass({ ...newClass, description: e.target.value })}></textarea>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setClassModalOpen(false)} className="flex-1 py-2 text-slate-500">Cancelar</button>
                            <button onClick={handleSaveClass} className="flex-1 py-2 bg-brand-secondary text-white rounded">
                                {editingClassId ? 'Guardar Cambios' : 'Publicar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};
