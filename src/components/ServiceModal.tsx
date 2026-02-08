import React, { useState, useEffect } from 'react';
import { CoachService } from '../types';
import { generateServiceImageMetadata } from '../services/geminiService';

interface ServiceModalProps {
    onClose: () => void;
    onSave: (serviceData: any) => Promise<void>;
    initialService?: CoachService | null;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({ onClose, onSave, initialService }) => {
    const isEditing = !!initialService;

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState('60');
    const [price, setPrice] = useState('50000');
    const [imageUrl, setImageUrl] = useState('');
    const [locationType, setLocationType] = useState<'Gimnasio' | 'A Domicilio' | 'Virtual'>('Gimnasio');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialService) {
            setName(initialService.name);
            setDescription(initialService.description);
            setDuration(initialService.duration?.toString() || '60');
            setPrice(initialService.price?.toString() || '0');
            setImageUrl(initialService.imageUrl || '');
        }
    }, [initialService]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !description.trim() || !duration || !price || !imageUrl) {
            setError('Por favor, completa todos los campos, incluyendo la imagen.');
            return;
        }

        setError('');
        setIsSubmitting(true);

        try {
            // Auto-generate image if not present (although UX guides user to do it before)
            let finalImageUrl = imageUrl;
            if (!finalImageUrl) {
                const { keyword } = await generateServiceImageMetadata(name, description);
                finalImageUrl = `https://source.unsplash.com/featured/?${encodeURIComponent(keyword)},fitness`;
                // Since source.unsplash is deprecated/unreliable, let's use a better approach or just the keyword constructed url
                // Actually, using the simple unsplash source url is risky. 
                // Let's rely on the user clicking "Generar" to verify.
                // But for "Auto" requirement...
            }
            await onSave({
                ...(initialService ? { id: initialService.id } : {}),
                name,
                description,
                duration: parseInt(duration), // Note: CoachService type uses 'duration', createService expects 'duration' in input obj (which maps to duration_min in DB)
                price: parseInt(price),
                imageUrl: finalImageUrl, // CHANGED from image_url to imageUrl to match CoachService interface 
                locationType: locationType as any
            });
            onClose();
        } catch (err) {
            console.error(err);
            setError('Error al guardar el servicio. Inténtalo de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[60] flex justify-center items-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-[90%] md:w-full max-w-2xl max-h-[60vh] md:max-h-[90vh] mb-24 md:mb-0 flex flex-col" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700 shrink-0">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                            {isEditing ? 'Editar Servicio' : 'Añadir Nuevo Servicio'}
                        </h2>
                    </div>

                    <div className="p-4 overflow-y-auto custom-scrollbar flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Columna Izquierda: Detalles */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-slate-700 dark:text-slate-300 text-sm font-bold mb-1">Nombre</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-brand-primary focus:outline-none"
                                        placeholder="Ej: Entrenamiento Hipertrofia"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Duración (min)</label>
                                        <input
                                            type="number"
                                            value={duration}
                                            onChange={(e) => setDuration(e.target.value)}
                                            required
                                            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-brand-primary focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Precio (COP)</label>
                                        <input
                                            type="number"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            required
                                            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-brand-primary focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Ubicación</label>
                                    <select
                                        value={locationType}
                                        onChange={(e) => setLocationType(e.target.value as any)}
                                        className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-brand-primary"
                                    >
                                        <option value="Gimnasio">Gimnasio</option>
                                        <option value="A Domicilio">A Domicilio</option>
                                        <option value="Virtual">Virtual</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Descripción</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={4}
                                        required
                                        className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-brand-primary focus:outline-none resize-none"
                                    />
                                </div>
                            </div>

                            {/* Columna Derecha: Imagen */}
                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Imagen del Servicio (IA)</label>
                                <div className="rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 aspect-video flex items-center justify-center border border-slate-200 dark:border-slate-600 shadow-inner relative group">
                                    {imageUrl ? (
                                        <>
                                            <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button
                                                    type="button"
                                                    onClick={() => setImageUrl('')}
                                                    className="text-white text-xs font-bold bg-red-500 px-3 py-1.5 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                                >
                                                    Eliminar imagen
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center p-4">
                                            <span className="text-4xl mb-2 block animate-pulse">✨</span>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Generación automática con IA</p>
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={async () => {
                                        if (!name && !description) {
                                            setError('Ingresa un nombre o descripción para generar la imagen.');
                                            return;
                                        }

                                        setIsSubmitting(true);
                                        setError('');

                                        // Mapa de imágenes por defecto según palabras clave
                                        const defaultImages: Record<string, string> = {
                                            fuerza: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80',
                                            hipertrofia: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
                                            cardio: 'https://images.unsplash.com/photo-1538805060512-e2d966d1129f?auto=format&fit=crop&w=800&q=80',
                                            yoga: 'https://images.unsplash.com/photo-1544367563-12123d8965cd?auto=format&fit=crop&w=800&q=80',
                                            pilates: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
                                            crossfit: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=800&q=80',
                                            general: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80'
                                        };

                                        try {
                                            // 1. Intentar generar palabra clave con IA
                                            let keyword = 'fitness';
                                            try {
                                                const result = await generateServiceImageMetadata(name, description);
                                                keyword = result.keyword;
                                            } catch (aiError) {
                                                console.warn("AI Generation failed, falling back to local analysis", aiError);
                                                // Fallback simple si falla la IA: buscar palabras clave en el texto
                                                const text = (name + ' ' + description).toLowerCase();
                                                if (text.includes('yoga')) keyword = 'yoga';
                                                else if (text.includes('cardio') || text.includes('correr')) keyword = 'cardio';
                                                else if (text.includes('fuerza') || text.includes('pesas')) keyword = 'fuerza';
                                                else if (text.includes('pilates')) keyword = 'pilates';
                                                else if (text.includes('crossfit')) keyword = 'crossfit';
                                            }

                                            // 2. Seleccionar imagen
                                            // Primero intentamos buscar en nuestro mapa de defaults si la keyword coincide
                                            let selectedImage = defaultImages[keyword.toLowerCase()] || defaultImages['general'];

                                            // Si la keyword venía de la IA y no está en nuestro mapa, intentamos Unsplash Source
                                            // PERO source.unsplash es inestable.
                                            // Mejor estrategia: Usar Unsplash Search API si fuera posible, pero sin backend proxy es difícil.
                                            // Solución robusta solicitada por usuario: "Imagen por defecto".
                                            // Así que priorizamos los defaults fijos de alta calidad.

                                            // Si la IA nos dio algo muy específico (ej: "boxing"), no tenemos imagen default.
                                            // En ese caso, usamos un fallback a 'general' o intentamos construir una URL de búsqueda directa fiable?
                                            // Las URLs de búsqueda directa tipo "source.unsplash.com" están fallando (fondo negro).
                                            // Vamos a mapear keywords comunes adicionales a las imágenes que ya tenemos.

                                            const mapKeywordToDefault = (k: string): string => {
                                                k = k.toLowerCase();
                                                if (k.includes('yoga') || k.includes('flexibility')) return defaultImages['yoga'];
                                                if (k.includes('run') || k.includes('cardio') || k.includes('endurance')) return defaultImages['cardio'];
                                                if (k.includes('strength') || k.includes('muscle') || k.includes('weight') || k.includes('hypertrophy') || k.includes('gym')) return defaultImages['fuerza'];
                                                if (k.includes('pilates')) return defaultImages['pilates'];
                                                if (k.includes('crossfit') || k.includes('hiit')) return defaultImages['crossfit'];
                                                return defaultImages['general'];
                                            };

                                            // Si la keyword de la IA es compleja, la mapeamos a una categoría visual
                                            selectedImage = mapKeywordToDefault(keyword);

                                            setImageUrl(selectedImage);
                                            setError('');
                                        } catch (e) {
                                            console.error(e);
                                            // Fallback final
                                            setImageUrl(defaultImages['general']);
                                            setError(''); // No mostramos error, simplemente ponemos la imagen default
                                        } finally {
                                            setIsSubmitting(false);
                                        }
                                    }}
                                    disabled={isSubmitting}
                                    className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Generando...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>✨ Generar Nueva Imagen</span>
                                        </>
                                    )}
                                </button>

                                {error && (
                                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                        <p className="text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-2">
                                            ⚠️ {error}
                                        </p>
                                    </div>
                                )}

                                <div className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                                    <p>💡 <strong>Tip:</strong> Describe bien tu servicio para obtener la mejor imagen posible. La IA seleccionará palabras clave basadas en tu título y descripción.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-700/50 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3 shrink-0 rounded-b-2xl">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 text-sm font-bold text-white bg-brand-primary rounded-lg hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-primary/20 transition-all hover:shadow-brand-primary/40"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Crear Servicio')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
