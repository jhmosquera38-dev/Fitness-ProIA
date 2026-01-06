import React, { useState } from 'react';
import { InventoryItem } from '../types';

interface AddInventoryModalProps {
    onClose: () => void;
    onAdd: (itemData: Omit<InventoryItem, 'id' | 'gym_id'>) => void;
}

export const AddInventoryModal: React.FC<AddInventoryModalProps> = ({ onClose, onAdd }) => {
    const [type, setType] = useState<'equipment' | 'product'>('equipment');
    const [itemName, setItemName] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [category, setCategory] = useState<string>('General');
    const [status, setStatus] = useState<string>('Operativo');
    const [price, setPrice] = useState<number>(0);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!itemName.trim() || quantity < 0) {
            setError('Por favor, completa todos los campos correctamente.');
            return;
        }

        // Determinar estado por defecto si es producto
        let finalStatus = status;
        if (type === 'product') {
            if (quantity === 0) finalStatus = 'Agotado';
            else if (quantity < 5) finalStatus = 'Bajo Stock';
            else finalStatus = 'Disponible';
        }

        onAdd({
            item_name: itemName,
            quantity,
            status: finalStatus as any,
            category,
            type,
            price: type === 'product' ? price : undefined
            // expiration_date would be added here if implemented in UI
        });
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b border-slate-200 bg-slate-50">
                        <h2 className="text-xl font-bold text-slate-800">Añadir Nuevo {type === 'equipment' ? 'Equipo' : 'Producto'}</h2>
                        <div className="flex mt-3 gap-2">
                            <button
                                type="button"
                                onClick={() => { setType('equipment'); setStatus('Operativo'); }}
                                className={`flex-1 py-1.5 text-sm font-bold rounded-lg transition-colors ${type === 'equipment' ? 'bg-white shadow text-brand-primary' : 'text-slate-500 hover:bg-slate-200'}`}
                            >
                                🏋️ Equipo
                            </button>
                            <button
                                type="button"
                                onClick={() => { setType('product'); setStatus('Disponible'); }}
                                className={`flex-1 py-1.5 text-sm font-bold rounded-lg transition-colors ${type === 'product' ? 'bg-white shadow text-brand-primary' : 'text-slate-500 hover:bg-slate-200'}`}
                            >
                                💊 Producto
                            </button>
                        </div>
                    </div>

                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre *</label>
                            <input type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} required className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none" placeholder={type === 'equipment' ? 'Ej: Banco Plano' : 'Ej: Proteína Whey'} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
                                {type === 'equipment' ? (
                                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2.5 border border-slate-300 rounded-lg bg-white">
                                        <option value="General">General</option>
                                        <option value="Fuerza">Fuerza</option>
                                        <option value="Cardio">Cardio</option>
                                        <option value="Accesorios">Accesorios</option>
                                    </select>
                                ) : (
                                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2.5 border border-slate-300 rounded-lg bg-white">
                                        <option value="Suplementos">Suplementos</option>
                                        <option value="Bebidas">Bebidas</option>
                                        <option value="Ropa">Ropa</option>
                                        <option value="Otros">Otros</option>
                                    </select>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Cantidad *</label>
                                <input type="number" min="0" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 0)} required className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none" />
                            </div>
                        </div>

                        {type === 'product' && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Precio de Venta ($)</label>
                                <input type="number" min="0" step="1000" value={price} onChange={(e) => setPrice(parseFloat(e.target.value) || 0)} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none" placeholder="0.00" />
                            </div>
                        )}

                        {type === 'equipment' && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Estado Operativo</label>
                                <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full p-2.5 border border-slate-300 rounded-lg bg-white">
                                    <option value="Operativo">🟢 Operativo</option>
                                    <option value="En Mantenimiento">🟡 En Mantenimiento</option>
                                    <option value="Fuera de Servicio">🔴 Fuera de Servicio</option>
                                </select>
                            </div>
                        )}

                        {error && <p className="text-sm text-red-600 font-medium bg-red-50 p-2 rounded-lg">{error}</p>}
                    </div>

                    <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">Cancelar</button>
                        <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-brand-primary hover:bg-brand-primary-dark rounded-xl shadow-lg shadow-brand-primary/20 transition-colors">Guardar Registro</button>
                    </div>
                </form>
            </div>
        </div>
    );
};