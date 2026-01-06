import React, { useState, useEffect } from 'react';
import type { InventoryItem } from '../types';

interface EditInventoryModalProps {
    item: InventoryItem;
    onClose: () => void;
    onUpdate: (updatedItem: InventoryItem) => void;
}

export const EditInventoryModal: React.FC<EditInventoryModalProps> = ({ item, onClose, onUpdate }) => {
    const [formData, setFormData] = useState<InventoryItem>(item);
    // Detectamos el tipo basado en los datos existentes o asumimos 'equipment'
    const isProduct = formData.type === 'product';

    useEffect(() => {
        setFormData(item);
    }, [item]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: (name === 'quantity' || name === 'price') ? parseFloat(value) : value
        } as InventoryItem));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.item_name.trim() || formData.quantity < 0) return;
        onUpdate(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b border-slate-200 bg-slate-50">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-800">
                                Editar {isProduct ? 'Producto' : 'Equipo'}
                            </h2>
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-200 px-2 py-1 rounded">
                                {isProduct ? 'Tienda' : 'Maquinaria'}
                            </span>
                        </div>
                    </div>

                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre *</label>
                            <input type="text" name="item_name" value={formData.item_name} onChange={handleChange} required className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
                                <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2.5 border border-slate-300 rounded-lg bg-white">
                                    {isProduct ? (
                                        <>
                                            <option value="Suplementos">Suplementos</option>
                                            <option value="Bebidas">Bebidas</option>
                                            <option value="Ropa">Ropa</option>
                                            <option value="Otros">Otros</option>
                                        </>
                                    ) : (
                                        <>
                                            <option value="General">General</option>
                                            <option value="Fuerza">Fuerza</option>
                                            <option value="Cardio">Cardio</option>
                                            <option value="Accesorios">Accesorios</option>
                                        </>
                                    )}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Cantidad *</label>
                                <input type="number" name="quantity" min="0" value={formData.quantity} onChange={handleChange} required className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none" />
                            </div>
                        </div>

                        {isProduct && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Precio ($)</label>
                                <input type="number" name="price" min="0" step="1000" value={formData.price || ''} onChange={handleChange} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none" placeholder="0.00" />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Estado</label>
                            <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2.5 border border-slate-300 rounded-lg bg-white">
                                {isProduct ? (
                                    <>
                                        <option value="Disponible">Disponible</option>
                                        <option value="Bajo Stock">Bajo Stock</option>
                                        <option value="Agotado">Agotado</option>
                                    </>
                                ) : (
                                    <>
                                        <option value="Operativo">Operativo</option>
                                        <option value="En Mantenimiento">En Mantenimiento</option>
                                        <option value="Fuera de Servicio">Fuera de Servicio</option>
                                    </>
                                )}
                            </select>
                        </div>
                    </div>

                    <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">Cancelar</button>
                        <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-brand-primary hover:bg-brand-primary-dark rounded-xl shadow-lg shadow-brand-primary/20 transition-colors">Guardar Cambios</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
