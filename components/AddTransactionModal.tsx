import React, { useState } from 'react';
import { Transaction } from '../data/gym';

interface AddTransactionModalProps {
  onClose: () => void;
  onAdd: (transactionData: Omit<Transaction, 'id'>) => void;
}

const incomeCategories = ['Membresías', 'Venta de Productos', 'Entrenamiento Personal', 'Otro'];
const expenseCategories = ['Salarios', 'Arriendo', 'Servicios Públicos', 'Mantenimiento', 'Marketing', 'Otro'];

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ onClose, onAdd }) => {
    const [type, setType] = useState<'Ingreso' | 'Gasto'>('Ingreso');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState(incomeCategories[0]);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [error, setError] = useState('');

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = e.target.value as 'Ingreso' | 'Gasto';
        setType(newType);
        // Reset category when type changes
        setCategory(newType === 'Ingreso' ? incomeCategories[0] : expenseCategories[0]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numericAmount = parseFloat(amount);
        if (!description.trim() || !amount.trim() || isNaN(numericAmount) || numericAmount <= 0) {
            setError('Por favor, completa todos los campos con valores válidos.');
            return;
        }
        setError('');
        onAdd({
            date,
            description,
            type,
            amount: numericAmount,
            category,
        });
    };

    const categories = type === 'Ingreso' ? incomeCategories : expenseCategories;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b border-slate-200">
                        <h2 className="text-xl font-bold text-slate-800">Registrar Transacción</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-slate-700 mb-1">Tipo de Transacción *</label>
                            <select id="type" value={type} onChange={handleTypeChange} className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-brand-primary">
                                <option value="Ingreso">Ingreso</option>
                                <option value="Gasto">Gasto</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">Descripción *</label>
                            <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none" />
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-1">Monto (COP) *</label>
                                <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} required className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none" placeholder="Ej: 50000" />
                            </div>
                             <div>
                                <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-1">Fecha *</label>
                                <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none" />
                            </div>
                        </div>
                         <div>
                            <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">Categoría *</label>
                            <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-brand-primary">
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        {error && <p className="text-sm text-red-600">{error}</p>}
                    </div>
                    <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">Cancelar</button>
                        <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-brand-primary rounded-lg hover:bg-brand-secondary">Guardar Transacción</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
