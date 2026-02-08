
import React, { useState } from 'react';
import { User } from '../types';

type Availability = { day: string; hours: string[] }[];

interface AvailabilityModalProps {
  user: User;
  onClose: () => void;
  onSave: (newAvailability: Availability) => void;
}

const allDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export const AvailabilityModal: React.FC<AvailabilityModalProps> = ({ user, onClose, onSave }) => {
    const [availability, setAvailability] = useState<Availability>(user.availability || []);
    const [newTimes, setNewTimes] = useState<{ [key: string]: string }>({});

    const handleDayToggle = (day: string) => {
        setAvailability(prev => {
            const dayExists = prev.some(d => d.day === day);
            if (dayExists) {
                return prev.filter(d => d.day !== day);
            } else {
                return [...prev, { day, hours: [] }].sort((a, b) => allDays.indexOf(a.day) - allDays.indexOf(b.day));
            }
        });
    };

    const handleTimeChange = (day: string, value: string) => {
        setNewTimes(prev => ({ ...prev, [day]: value }));
    };

    const handleAddTime = (day: string) => {
        const time = newTimes[day];
        if (time && /^\d{2}:\d{2}$/.test(time)) {
            setAvailability(prev => prev.map(d => {
                if (d.day === day && !d.hours.includes(time)) {
                    return { ...d, hours: [...d.hours, time].sort() };
                }
                return d;
            }));
            setNewTimes(prev => ({ ...prev, [day]: '' }));
        } else {
            alert('Por favor, introduce una hora en formato HH:MM (ej: 09:00).');
        }
    };

    const handleRemoveTime = (day: string, timeToRemove: string) => {
        setAvailability(prev => prev.map(d => {
            if (d.day === day) {
                return { ...d, hours: d.hours.filter(h => h !== timeToRemove) };
            }
            return d;
        }));
    };
    
    const handleSave = () => {
        onSave(availability);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-slate-800">Gestionar Disponibilidad</h2>
                    <p className="text-sm text-slate-500">Define los días y horas en que estás disponible para sesiones.</p>
                </div>
                
                <div className="p-6 space-y-4 overflow-y-auto">
                    {allDays.map(day => {
                        const dayData = availability.find(d => d.day === day);
                        const isChecked = !!dayData;
                        return (
                            <div key={day} className={`p-4 rounded-lg border ${isChecked ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'}`}>
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => handleDayToggle(day)}
                                        className="h-5 w-5 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                                    />
                                    <span className="ml-3 font-semibold text-slate-700">{day}</span>
                                </label>
                                {isChecked && (
                                    <div className="mt-4 pl-8 space-y-2">
                                        {dayData.hours.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {dayData.hours.map(hour => (
                                                    <div key={hour} className="flex items-center gap-2 bg-white px-2 py-1 rounded-full border border-slate-300">
                                                        <span className="text-sm text-slate-600">{hour}</span>
                                                        <button onClick={() => handleRemoveTime(day, hour)} className="text-slate-400 hover:text-red-500">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : <p className="text-sm text-slate-500 italic">No hay horas añadidas.</p>}
                                        <div className="flex items-center gap-2 pt-2">
                                            <input
                                                type="time"
                                                value={newTimes[day] || ''}
                                                onChange={e => handleTimeChange(day, e.target.value)}
                                                className="w-32 p-1 border border-slate-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:outline-none"
                                            />
                                            <button onClick={() => handleAddTime(day)} className="px-3 py-1 text-sm font-semibold text-white bg-brand-primary rounded-lg hover:bg-brand-secondary">
                                                Añadir
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
                
                <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 mt-auto">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">Cancelar</button>
                    <button type="button" onClick={handleSave} className="px-4 py-2 text-sm font-semibold text-white bg-brand-primary rounded-lg hover:bg-brand-secondary">Guardar Cambios</button>
                </div>
            </div>
        </div>
    );
};
