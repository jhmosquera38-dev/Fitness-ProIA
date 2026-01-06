import React, { useState } from 'react';

interface NewMemberData {
    name: string;
    email: string;
    password: string;
    plan: 'básico' | 'premium';
    joinDate: string;
    firstPaymentDate: string;
    amount: number;
}

interface AddMemberModalProps {
    onClose: () => void;
    onAddMember: (memberData: NewMemberData) => void;
}

const InputField: React.FC<{ id: string; name: string; label: string; type: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean; }> = ({ id, name, label, type, value, onChange, required }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}{required && ' *'}</label>
        <input
            type={type}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none"
        />
    </div>
);

export const AddMemberModal: React.FC<AddMemberModalProps> = ({ onClose, onAddMember }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    // Password field removed for CRM mode
    const [plan, setPlan] = useState<'básico' | 'premium'>('básico');
    const [amount, setAmount] = useState<number>(30000); // Default for basic
    const [joinDate, setJoinDate] = useState(new Date().toISOString().split('T')[0]); // Default to today
    const [firstPaymentDate, setFirstPaymentDate] = useState(new Date().toISOString().split('T')[0]);
    const [error, setError] = useState('');

    React.useEffect(() => {
        if (plan === 'básico') setAmount(30000);
        else if (plan === 'premium') setAmount(50000);
    }, [plan]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !joinDate || !email.trim() || !firstPaymentDate || amount <= 0) {
            setError('Por favor, completa todos los campos obligatorios.');
            return;
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            setError('Por favor, introduce un correo electrónico válido.');
            return;
        }
        setError('');
        // NewMemberData interface might need update in parent, but here we pass object with amount
        onAddMember({ name, email, password: '', plan, joinDate, firstPaymentDate, amount });
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-member-modal-title"
        >
            <div
                className="bg-white rounded-2xl shadow-xl w-full max-w-md"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                <form onSubmit={handleSubmit}>
                    {/* Header */}
                    <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                        <h2 id="add-member-modal-title" className="text-xl font-bold text-slate-800">Añadir Nuevo Miembro</h2>
                        <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-800" aria-label="Cerrar modal">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-4">
                        <InputField id="name" name="name" label="Nombre Completo" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                        <InputField id="email" name="email" label="Correo Electrónico" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        {/* Password field removed */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="plan" className="block text-sm font-medium text-slate-700 mb-1">Plan *</label>
                                <select
                                    id="plan"
                                    value={plan}
                                    onChange={(e) => setPlan(e.target.value as 'básico' | 'premium')}
                                    className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-brand-primary"
                                >
                                    <option value="básico">Básico</option>
                                    <option value="premium">Premium</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-1">Valor Mensual *</label>
                                <input
                                    id="amount"
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(Number(e.target.value))}
                                    className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-brand-primary"
                                    min="0"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <InputField id="joinDate" name="joinDate" label="Fecha de Ingreso" type="date" value={joinDate} onChange={(e) => setJoinDate(e.target.value)} required />
                            <InputField id="firstPaymentDate" name="firstPaymentDate" label="Fecha de Primer Pago" type="date" value={firstPaymentDate} onChange={(e) => setFirstPaymentDate(e.target.value)} required />
                        </div>
                        {error && <p className="text-sm text-red-600">{error}</p>}
                    </div>

                    {/* Footer */}
                    <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">
                            Cancelar
                        </button>
                        <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-brand-primary rounded-lg hover:bg-brand-secondary">
                            Guardar Miembro
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};