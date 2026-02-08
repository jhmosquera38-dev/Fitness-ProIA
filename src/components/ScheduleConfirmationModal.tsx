
import React, { useState, useMemo } from 'react';
import { GroupClass, ClassSchedule } from '../types';

interface ScheduleConfirmationModalProps {
  session: GroupClass;
  coachAvailability: { day: string; hours: string[] }[];
  onClose: () => void;
  onConfirm: (classId: number, newSchedule: ClassSchedule) => void;
}

const dayOfWeekMap: { [key: number]: string } = {
    0: 'Domingo', 1: 'Lunes', 2: 'Martes', 3: 'Miércoles', 4: 'Jueves', 5: 'Viernes', 6: 'Sábado'
};

export const ScheduleConfirmationModal: React.FC<ScheduleConfirmationModalProps> = ({ session, coachAvailability, onClose, onConfirm }) => {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [error, setError] = useState('');

    const availableTimes = useMemo(() => {
        if (!selectedDate) return [];
        const date = new Date(`${selectedDate}T00:00:00-05:00`); // Use a timezone to avoid UTC conversion issues
        const dayName = dayOfWeekMap[date.getDay()];
        const dayAvailability = coachAvailability.find(a => a.day === dayName);
        return dayAvailability ? dayAvailability.hours : [];
    }, [selectedDate, coachAvailability]);

    const handleSubmit = () => {
        if (!selectedDate || !selectedTime) {
            setError('Por favor, selecciona una fecha y una hora.');
            return;
        }
        setError('');
        
        const formattedDate = new Date(`${selectedDate}T00:00:00-05:00`).toLocaleDateString('es-CO', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
        
        onConfirm(session.id, { day: formattedDate, time: selectedTime });
    };

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-schedule-modal-title"
        >
            <div 
                className="bg-white rounded-2xl shadow-xl w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-slate-200">
                    <h2 id="confirm-schedule-modal-title" className="text-xl font-bold text-slate-800">Agendar Sesión</h2>
                    <p className="text-sm text-slate-500">con {session.bookedBy} para "{session.name}"</p>
                </div>
                
                <div className="p-6 space-y-4">
                    <div>
                        <label htmlFor="session-date" className="block text-sm font-medium text-slate-700 mb-1">Selecciona la fecha</label>
                        <input
                            type="date"
                            id="session-date"
                            value={selectedDate}
                            onChange={(e) => {
                                setSelectedDate(e.target.value);
                                setSelectedTime(''); // Reset time when date changes
                            }}
                            min={new Date().toISOString().split('T')[0]} // Prevent selecting past dates
                            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none"
                        />
                    </div>
                     <div>
                        <label htmlFor="session-time" className="block text-sm font-medium text-slate-700 mb-1">Selecciona la hora</label>
                        <select
                            id="session-time"
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            disabled={!selectedDate || availableTimes.length === 0}
                            className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-brand-primary focus:outline-none disabled:bg-slate-100"
                        >
                            <option value="">-- {availableTimes.length === 0 ? 'No hay horas disponibles' : 'Elige una hora'} --</option>
                            {availableTimes.map(time => (
                                <option key={time} value={time}>{time}</option>
                            ))}
                        </select>
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">
                        Cancelar
                    </button>
                    <button type="button" onClick={handleSubmit} className="px-4 py-2 text-sm font-semibold text-white bg-brand-primary rounded-lg hover:bg-brand-secondary">
                        Confirmar Horario
                    </button>
                </div>
            </div>
        </div>
    );
};
