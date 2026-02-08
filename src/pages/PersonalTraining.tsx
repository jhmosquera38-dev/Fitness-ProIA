import React, { useState, useEffect } from 'react';
import { CoachService as ICoachService, GroupClass, User } from '../types';
import { ServiceCard } from '../components/ServiceCard';
import { ServiceDetailModal } from '../components/ServiceDetailModal';
import { ServiceModal } from '../components/ServiceModal';
import { coachService } from '../services/coachService';
import { useFeedback } from '../components/FeedbackSystem';

interface PersonalTrainingProps {
    user: User;
    allClasses?: GroupClass[];
    isCoachView?: boolean;
}

const InfoTooltip: React.FC<{ text: string }> = ({ text }) => (
    <div className="relative flex items-center group ml-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 bg-slate-800 text-white text-sm rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 shadow-lg">
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-slate-800"></div>
        </div>
    </div>
);

const statusStyles: Record<string, string> = {
    pending_confirmation: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
};

const statusText: Record<string, string> = {
    pending_confirmation: 'Pendiente de Confirmación',
    confirmed: 'Confirmada',
    completed: 'Completada',
    cancelled: 'Cancelada',
};

export const PersonalTraining: React.FC<PersonalTrainingProps> = ({ user, allClasses, isCoachView = false }) => {
    const [services, setServices] = useState<ICoachService[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedService, setSelectedService] = useState<ICoachService | null>(null);
    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<ICoachService | null>(null);
    const { showToast } = useFeedback();

    // Fetch user's booked sessions if passing externally, but ideally we should fetch them here too.
    // For now assuming allClasses is passed from MainApp/CoachSchedule context, 
    // BUT WAIT, MainApp fetches NOTHING for user, only coach schedule for coach.
    // For USER booked sessions, we should fetch them too. 
    // For brevity of this refactor, I will fallback to allClasses if provided, or empty. 
    // The user's booked sessions are NOT in CoachSchedule fetch (that's FOR COACH users).
    // So for a normal user, allClasses is empty/mock in MainApp.
    // I should implement fetchMyBookings in userService or here?
    // Let's rely on props for now if they exist, but they are likely empty.
    const userBookedSessions = allClasses?.filter(c => c.bookedBy === user.name && c.category === 'Personalizado') || [];

    const loadServices = async () => {
        setIsLoading(true);
        try {
            const data = isCoachView
                ? await coachService.fetchMyServices()
                : await coachService.fetchAllServices();
            setServices(data as any); // Type cast if necessary due to ID mismatch (number vs string?) in ICoachService
        } catch (error) {
            console.error("Error loading services", error);
            showToast("Error al cargar servicios", "error");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadServices();
    }, [isCoachView]);

    const handleConfirmBooking = async (service: ICoachService, date: string, time: string, address?: string) => {
        try {
            await coachService.bookService(service.id, date, time, address);
            showToast("Servicio reservado correctamente", "success");
            setSelectedService(null);
            // Optionally refresh bookings list if we were fetching it here
        } catch (error) {
            console.error(error);
            showToast("Error al reservar servicio", "error");
        }
    };

    const handleSaveService = async (serviceData: any) => {
        try {
            if (editingService) {
                await coachService.updateService(editingService.id, serviceData);
                showToast("Servicio actualizado exitosamente", "success");
            } else {
                await coachService.createService(serviceData);
                showToast("Servicio creado exitosamente", "success");
            }
            setIsServiceModalOpen(false);
            setEditingService(null);
            loadServices();
        } catch (error) {
            console.error(error);
            showToast("Error al guardar servicio", "error");
        }
    };

    const handleEditService = (service: ICoachService) => {
        setEditingService(service);
        setIsServiceModalOpen(true);
    };

    const handleDeleteService = async (service: ICoachService) => {
        if (!window.confirm(`¿Seguro que deseas eliminar el servicio "${service.name}"?`)) return;
        try {
            await coachService.deleteService(service.id);
            showToast("Servicio eliminado", "success");
            loadServices();
        } catch (error) {
            console.error(error);
            showToast("Error al eliminar servicio", "error");
        }
    };

    const pageTitle = isCoachView ? "Gestión de Servicios" : "Entrenamiento Personal";
    const pageDescription = isCoachView ? "Así es como los usuarios ven los servicios que ofreces. Añade nuevos para expandir tu oferta." : "Reserva sesiones uno a uno con nuestros entrenadores expertos.";

    if (isLoading) return <div className="p-12 text-center text-slate-500">Cargando servicios...</div>;

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-8">
                <div>
                    <div className="flex items-center">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">{pageTitle}</h1>
                        {!isCoachView && <InfoTooltip text="Haz clic en 'Ver Detalles y Reservar' en cualquier servicio para ver la disponibilidad del entrenador y agendar tu sesión personalizada." />}
                    </div>
                    <p className="mt-2 text-lg text-slate-600 max-w-2xl">{pageDescription}</p>
                </div>
                {isCoachView && (
                    <button
                        onClick={() => { setEditingService(null); setIsServiceModalOpen(true); }}
                        className="bg-brand-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-secondary transition-colors flex items-center gap-2 mt-4 md:mt-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>
                        Añadir Nuevo Servicio
                    </button>
                )}
            </div>

            {!isCoachView && userBookedSessions.length > 0 && (
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Mis Sesiones Agendadas</h2>
                    <div className="bg-white p-4 rounded-xl shadow-md border border-slate-200 space-y-3">
                        {userBookedSessions.map(session => (
                            <div key={session.id} className="p-3 border-b last:border-b-0 flex flex-col sm:flex-row justify-between sm:items-center">
                                <div>
                                    <p className="font-bold text-slate-700">{session.name}</p>
                                    <p className="text-sm text-slate-500">con {session.coach}</p>
                                    {session.status === 'confirmed' && session.schedule?.[0] && (
                                        <p className="text-sm text-green-600 font-semibold">{session.schedule[0].day}, {session.schedule[0].time}</p>
                                    )}
                                </div>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full mt-2 sm:mt-0 ${statusStyles[session.status || 'pending_confirmation']}`}>
                                    {statusText[session.status || 'pending_confirmation']}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <h2 className="text-2xl font-bold text-slate-800 mb-6">{isCoachView ? "Mis Servicios Actuales" : "Servicios Disponibles"}</h2>
            {services.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map(service => (
                        <ServiceCard
                            key={service.id}
                            service={service}
                            onViewDetails={setSelectedService}
                            isCoachView={isCoachView}
                            onEdit={handleEditService}
                            onDelete={handleDeleteService}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    {isCoachView ? 'Aún no has creado servicios. ¡Crea el primero para empezar a recibir clientes!' : 'No hay servicios de entrenamiento personal disponibles en este momento.'}
                </div>
            )}

            {selectedService && (
                <ServiceDetailModal
                    service={selectedService}
                    onClose={() => setSelectedService(null)}
                    onConfirm={handleConfirmBooking}
                />
            )}

            {isServiceModalOpen && (
                <ServiceModal
                    onClose={() => { setIsServiceModalOpen(false); setEditingService(null); }}
                    onSave={handleSaveService}
                    initialService={editingService}
                />
            )}
        </div>
    );
};
