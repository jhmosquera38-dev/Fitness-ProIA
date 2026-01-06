import React, { useState, useEffect } from 'react';
import { gymService, ProductItem } from '../../services/gymService';

export const ProductInventory: React.FC = () => {
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<ProductItem | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        category: 'Suplementos',
        price: 0,
        stock_quantity: 0,
        sku: '',
        expiration_date: ''
    });

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const data = await gymService.fetchProducts();
            setProducts(data);
        } catch (error) {
            console.error("Error loading products:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item: ProductItem) => {
        setEditingItem(item);
        setFormData({
            name: item.name,
            brand: item.brand || '',
            category: item.category,
            price: item.price,
            stock_quantity: item.stock_quantity,
            sku: item.sku || '',
            expiration_date: item.expiration_date || ''
        });
        setIsFormOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await gymService.updateProduct(editingItem.id, formData);
            } else {
                await gymService.addProduct(formData);
            }
            setIsFormOpen(false);
            setEditingItem(null);
            resetForm();
            loadProducts();
        } catch (error) {
            console.error("Error saving product:", error);
            alert("Error al guardar el producto");
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Estás seguro de eliminar este producto?')) {
            try {
                await gymService.deleteProduct(id);
                loadProducts();
            } catch (error) {
                console.error("Error deleting product:", error);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            brand: '',
            category: 'Suplementos',
            price: 0,
            stock_quantity: 0,
            sku: '',
            expiration_date: ''
        });
    }

    return (
        <div className="space-y-6">
            {/* Header & Actions */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Inventario de Productos</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Tienda, suplementos y ventas.</p>
                </div>
                <button
                    onClick={() => { setIsFormOpen(!isFormOpen); setEditingItem(null); resetForm(); }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <span className="text-xl">{isFormOpen ? '−' : '+'}</span>
                    {isFormOpen ? 'Cerrar Formulario' : 'Nuevo Producto'}
                </button>
            </div>

            {/* Inline Form */}
            {isFormOpen && (
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 animate-in slide-in-from-top-4 duration-300">
                    <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">
                        {editingItem ? 'Editar Producto' : 'Registrar Nuevo Producto'}
                    </h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre del Producto</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                placeholder="Ej. Whey Protein Chocolate"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Marca</label>
                            <input
                                type="text"
                                value={formData.brand}
                                onChange={e => setFormData({ ...formData, brand: e.target.value })}
                                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                placeholder="Ej. Optimum Nutrition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Categoría</label>
                            <select
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            >
                                <option value="Suplementos">Suplementos</option>
                                <option value="Bebidas">Bebidas</option>
                                <option value="Ropa">Ropa</option>
                                <option value="Accesorios">Accesorios</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Precio Venta ($)</label>
                            <input
                                type="number"
                                min="0"
                                step="100"
                                required
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Stock</label>
                            <input
                                type="number"
                                min="0"
                                required
                                value={formData.stock_quantity}
                                onChange={e => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) || 0 })}
                                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Vencimiento</label>
                            <input
                                type="date"
                                value={formData.expiration_date}
                                onChange={e => setFormData({ ...formData, expiration_date: e.target.value })}
                                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            />
                        </div>

                        <div className="col-span-1 md:col-span-4 flex justify-end gap-3 mt-4 border-t pt-4 dark:border-slate-700">
                            <button
                                type="button"
                                onClick={() => setIsFormOpen(false)}
                                className="px-4 py-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm transition-colors"
                            >
                                {editingItem ? 'Guardar Cambios' : 'Registrar Producto'}
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
                                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Precio</th>
                                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Stock</th>
                                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Vencimiento</th>
                                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {loading ? (
                                <tr><td colSpan={6} className="p-8 text-center text-slate-500">Cargando productos...</td></tr>
                            ) : products.length === 0 ? (
                                <tr><td colSpan={6} className="p-8 text-center text-slate-500">No hay productos registrados.</td></tr>
                            ) : (
                                products.map(item => (
                                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                        <td className="p-4 font-medium text-slate-800 dark:text-white">{item.name}</td>
                                        <td className="p-4 text-slate-600 dark:text-slate-300">{item.brand || '-'}</td>
                                        <td className="p-4 font-semibold text-emerald-600 dark:text-emerald-400">
                                            $ {item.price.toLocaleString()}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.stock_quantity <= 5
                                                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                    : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                }`}>
                                                {item.stock_quantity} un.
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-slate-500 dark:text-slate-400">
                                            {item.expiration_date ? new Date(item.expiration_date).toLocaleDateString() : '-'}
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
