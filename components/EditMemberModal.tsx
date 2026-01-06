import React, { useState, useEffect } from 'react';
import type { GymMember } from '../services/gymService';

interface EditMemberModalProps {
    member: GymMember;
    onClose: () => void;
    onUpdateMember: (updatedMember: GymMember) => void;
}

export const EditMemberModal: React.FC<EditMemberModalProps> = ({ member, onClose, onUpdateMember }) => {
    const [formData, setFormData] = useState<GymMember>(member);

    useEffect(() => {
        setFormData(member);
    }, [member]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value } as GymMember));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.full_name.trim() || !formData.email.trim()) return;
        onUpdateMember(formData);
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-member-modal-title"
        >
            <div
                className="bg-white rounded-2xl shadow-xl w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
            >
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                        <h2 id="edit-member-modal-title" className="text-xl font-bold text-slate-800">Editar Miembro</h2>
                        <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-800" aria-label="Cerrar modal">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div>
                            <label htmlFor="full_name" className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo *</label>
                            <input type="text" id="full_name" name="full_name" value={formData.full_name} onChange={handleChange} required className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico (Solo lectura)</label>
                            <input type="email" id="email" name="email" value={formData.email} disabled className="w-full p-2 border border-slate-300 rounded-lg bg-slate-100 focus:outline-none cursor-not-allowed" />
                        </div>
                        <div>
                            <label htmlFor="plan" className="block text-sm font-medium text-slate-700 mb-1">Plan *</label>
                            <select id="plan" name="plan" value={formData.plan} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-brand-primary" >
                                <option value="básico">Básico</option>
                                <option value="premium">Premium</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1">Estado del Pago *</label>
                            <select id="status" name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-brand-primary" >
                                <option value="Al día">Al día</option>
                                <option value="Vencido">Vencido</option>
                            </select>
                        </div>
                    </div>

                    <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">
                            Cancelar
                        </button>
                        <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-brand-primary rounded-lg hover:bg-brand-secondary">
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
