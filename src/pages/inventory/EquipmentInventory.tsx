import React, { useState, useEffect } from 'react';
import { gymService, EquipmentItem } from '../../services/gymService';

export const EquipmentInventory: React.FC = () => {
    const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<EquipmentItem | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        item_name: '',
        brand: '',
        category: 'General',
        status: 'Operativo',
        quantity: 1,
        serial_number: '',
        last_maintenance: ''
    });

    useEffect(() => {
        loadEquipment();
    }, []);

    const loadEquipment = async () => {
        try {
            const data = await gymService.fetchEquipment();
            setEquipment(data);
        } catch (error) {
            console.error("Error loading equipment:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item: EquipmentItem) => {
        setEditingItem(item);
        setFormData({
            item_name: item.item_name,
            brand: item.brand || '',
            category: item.category,
            status: item.status,
            quantity: item.quantity,
            serial_number: item.serial_number || '',
            last_maintenance: item.last_maintenance || ''
        });
        setIsFormOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await gymService.updateEquipment(editingItem.id, formData);
            } else {
                await gymService.addEquipment(formData);
            }
            setIsFormOpen(false);
            setEditingItem(null);
            resetForm();
            loadEquipment();
        } catch (error) {
            console.error("Error saving equipment:", error);
            alert("Error al guardar el equipo");
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Estás seguro de eliminar este equipo?')) {
            try {
                await gymService.deleteEquipment(id);
                loadEquipment();
            } catch (error) {
                console.error("Error deleting equipment:", error);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            item_name: '',
            brand: '',
            category: 'General',
            status: 'Operativo',
            quantity: 1,
            serial_number: '',
            last_maintenance: ''
        });
    }

    return (
        <div className="space-y-6">
            {/* Header & Actions */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Inventario de Equipos</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Gestiona maquinaria, pesas y activos fijos.</p>
                </div>
                <button
                    onClick={() => { setIsFormOpen(!isFormOpen); setEditingItem(null); resetForm(); }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <span className="text-xl">{isFormOpen ? '−' : '+'}</span>
                    {isFormOpen ? 'Cerrar Formulario' : 'Nuevo Equipo'}
                </button>
            </div>

            {/* Inline Form */}
            {isFormOpen && (
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 animate-in slide-in-from-top-4 duration-300">
                    <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">
                        {editingItem ? 'Editar Equipo' : 'Registrar Nuevo Equipo'}
                    </h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre del Equipo</label>
                            <input
                                type="text"
                                required
                                value={formData.item_name}
                                onChange={e => setFormData({ ...formData, item_name: e.target.value })}
                                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                placeholder="Ej. Caminadora Pro X5"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Marca / Modelo</label>
                            <input
                                type="text"
                                value={formData.brand}
                                onChange={e => setFormData({ ...formData, brand: e.target.value })}
                                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                placeholder="Ej. LifeFitness"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Categoría</label>
                            <select
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            >
                                <option value="Cardio">Cardio</option>
                                <option value="Fuerza">Fuerza</option>
                                <option value="Peso Libre">Peso Libre</option>
                                <option value="Funcional">Funcional</option>
                                <option value="General">General</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Estado</label>
                            <select
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            >
                                <option value="Operativo">Operativo</option>
                                <option value="En Mantenimiento">En Mantenimiento</option>
                                <option value="Fuera de Servicio">Fuera de Servicio</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Último Mantenimiento</label>
                            <input
                                type="date"
                                value={formData.last_maintenance}
                                onChange={e => setFormData({ ...formData, last_maintenance: e.target.value })}
                                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            />
                        </div>

                        <div className="col-span-1 md:col-span-3 flex justify-end gap-3 mt-4 border-t pt-4 dark:border-slate-700">
                            <button
                                type="button"
                                onClick={() => setIsFormOpen(false)}
                                className="px-4 py-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors"
                            >
                                {editingItem ? 'Guardar Cambios' : 'Registrar Equipo'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* List/Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Nombre</th>
                                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Marca</th>
                                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Categoría</th>
                                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Estado</th>
                                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Mantenimiento</th>
                                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {loading ? (
                                <tr><td colSpan={6} className="p-8 text-center text-slate-500">Cargando equipos...</td></tr>
                            ) : equipment.length === 0 ? (
                                <tr><td colSpan={6} className="p-8 text-center text-slate-500">No hay equipos registrados.</td></tr>
                            ) : (
                                equipment.map(item => (
                                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                        <td className="p-4 font-medium text-slate-800 dark:text-white">{item.item_name}</td>
                                        <td className="p-4 text-slate-600 dark:text-slate-300">{item.brand || '-'}</td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-xs rounded-full text-slate-600 dark:text-slate-300">
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <StatusBadge status={item.status} />
                                        </td>
                                        <td className="p-4 text-sm text-slate-500 dark:text-slate-400">
                                            {item.last_maintenance ? new Date(item.last_maintenance).toLocaleDateString() : 'Pendiente'}
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-800 font-medium text-sm">Editar</button>
                                            <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 text-sm">Eliminar</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const StatusBadge = ({ status }: { status: string }) => {
    const colors = {
        'Operativo': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        'En Mantenimiento': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        'Fuera de Servicio': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    const colorClass = (colors as any)[status] || 'bg-slate-100 text-slate-700';

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
            {status}
        </span>
    );
};
