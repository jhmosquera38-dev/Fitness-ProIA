import React, { useState, useMemo } from 'react';
import { CoachService } from '../types';


interface ServiceDetailModalProps {
    service: CoachService;
    onClose: () => void;
    onConfirm: (service: CoachService, date: string, time: string, address?: string) => void;
}

const dayOfWeekMap: { [key: number]: string } = {
    0: 'Domingo', 1: 'Lunes', 2: 'Martes', 3: 'Miércoles', 4: 'Jueves', 5: 'Viernes', 6: 'Sábado'
};

const generateDefaultHours = () => {
    const hours = [];
    for (let i = 6; i <= 21; i++) {
        hours.push(`${i.toString().padStart(2, '0')}:00`);
    }
    return hours;
};

const DEFAULT_AVAILABILITY = [
    { day: 'Lunes', hours: generateDefaultHours() },
    { day: 'Martes', hours: generateDefaultHours() },
    { day: 'Miércoles', hours: generateDefaultHours() },
    { day: 'Jueves', hours: generateDefaultHours() },
    { day: 'Viernes', hours: generateDefaultHours() },
    { day: 'Sábado', hours: generateDefaultHours() },
    { day: 'Domingo', hours: generateDefaultHours() }
];

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({ service, onClose, onConfirm }) => {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [clientAddress, setClientAddress] = useState('');
    const [error, setError] = useState('');
    // const { showToast } = useFeedback(); // Unused in this file



    // Compute availability source once
    const availabilitySource = useMemo(() => {
        return (service.availability && service.availability.length > 0)
            ? service.availability
            : DEFAULT_AVAILABILITY;
    }, [service.availability]);

    const availableTimes = useMemo(() => {
        if (!selectedDate) return [];
        // Use T12:00:00 to avoid timezone shifts affecting the day
        const date = new Date(`${selectedDate}T12:00:00`);
        const dayName = dayOfWeekMap[date.getDay()];

        const dayAvailability = availabilitySource.find(a => a.day === dayName);
        return dayAvailability ? dayAvailability.hours : [];
    }, [selectedDate, availabilitySource]);

    const handleSubmit = () => {
        if (!selectedDate || !selectedTime) {
            setError('Por favor, selecciona una fecha y hora.');
            return;
        }
        if (service.locationType === 'A Domicilio' && !clientAddress.trim()) {
            setError('Por favor, ingresa tu dirección para el servicio a domicilio.');
            return;
        }
        setError('');
        onConfirm(service, selectedDate, selectedTime, clientAddress);
        // Toast removed here, handled by parent (onConfirm)
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center sticky top-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm z-10">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{service.name}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-800 dark:hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <img src={service.imageUrl} alt={service.name} className="w-full h-auto object-cover rounded-xl shadow-md mb-4" />
                        <p className="text-slate-600 dark:text-slate-300">{service.description}</p>
                        <div className="mt-4 text-sm space-y-2 text-slate-700 dark:text-slate-300">
                            <p><span className="font-semibold">Coach:</span> {service.coach}</p>
                            <p><span className="font-semibold">Duración:</span> {service.duration} minutos</p>
                            <p><span className="font-semibold">Ubicación:</span> {service.locationType}</p>
                            <p className="text-xl font-bold text-brand-primary mt-2">${service.price.toLocaleString('es-CO')}</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Agendar tu sesión</h3>
                        <div>
                            <label htmlFor="booking-date" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">1. Selecciona la fecha</label>
                            <input
                                type="date"
                                id="booking-date"
                                value={selectedDate}
                                onChange={(e) => { setSelectedDate(e.target.value); setSelectedTime(''); }}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-primary"
                            />
                        </div>
                        <div>
                            <label htmlFor="booking-time" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">2. Selecciona la hora</label>
                            <select
                                id="booking-time"
                                value={selectedTime}
                                onChange={(e) => setSelectedTime(e.target.value)}
                                disabled={!selectedDate || availableTimes.length === 0}
                                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-primary disabled:bg-slate-100 dark:disabled:bg-slate-800 dark:disabled:text-slate-500"
                            >
                                <option value="">-- {availableTimes.length > 0 ? 'Horas disponibles' : 'No hay horas disponibles'} --</option>
                                {availableTimes.map(time => <option key={time} value={time}>{time}</option>)}
                            </select>
                        </div>
                        {service.locationType === 'A Domicilio' && (
                            <div>
                                <label htmlFor="client-address" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">3. Ingresa tu dirección *</label>
                                <input
                                    type="text"
                                    id="client-address"
                                    value={clientAddress}
                                    onChange={(e) => setClientAddress(e.target.value)}
                                    placeholder="Ej: Calle 10 #43A-50, Apto 123"
                                    className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-primary"
                                />
                            </div>
                        )}
                        <h3 className="font-semibold text-slate-800 dark:text-white mb-2">Disponibilidad (Horario General)</h3>
                        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                            {availabilitySource.length > 0 ? (
                                availabilitySource.map((slot, index) => (
                                    <div key={index} className="bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-lg text-sm w-full">
                                        <span className="font-bold text-slate-700 dark:text-slate-200 block">{slot.day}</span>
                                        <span className="text-slate-600 dark:text-slate-400 text-xs">{slot.hours.length > 5 ? `${slot.hours[0]} - ${slot.hours[slot.hours.length - 1]} (${slot.hours.length} slots)` : slot.hours.join(', ')}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-500 text-sm">No hay horarios definidos.</p>
                            )}
                        </div>
                        {error && <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded">{error}</p>}
                    </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 sticky bottom-0">
                    <button
                        onClick={handleSubmit}
                        disabled={!selectedDate || !selectedTime}
                        className="w-full bg-brand-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-brand-secondary transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed shadow-lg">
                        Enviar Solicitud de Reserva
                    </button>
                </div>
            </div>
        </div>
    );
};