
import React, { useState, useEffect } from 'react';
import type { Client } from '../types';
import { useFeedback } from '../components/FeedbackSystem';
import { coachService } from '../services/coachService';

// A simple modal for adding notes
const EvaluationModal: React.FC<{ client: Client, onClose: () => void }> = ({ client, onClose }) => {
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [recommendations, setRecommendations] = useState('');
    const [observations, setObservations] = useState('');
    const [generalValuation, setGeneralValuation] = useState('En Progreso');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showToast } = useFeedback();

    useEffect(() => {
        const loadExisting = async () => {
            try {
                const data = await coachService.getClientEvaluation(client.id.toString());
                if (data) {
                    setRating(data.rating || 0);
                    setFeedback(data.feedback || '');
                    setRecommendations(data.recommendations || '');
                    setObservations(data.observations || '');
                    setGeneralValuation(data.general_valuation || 'En Progreso');
                }
            } catch (e) {
                // No existing evaluation or error, ignore
            }
        };
        loadExisting();
    }, [client.id]);

    const handleSave = async () => {
        setIsSubmitting(true);
        try {
            await coachService.saveClientEvaluation({
                client_id: client.id.toString(),
                rating,
                feedback,
                recommendations,
                observations,
                general_valuation: generalValuation
            });
            showToast('Evaluación guardada correctamente', 'success');
            onClose();
        } catch (error) {
            console.error(error);
            showToast('Error al guardar evaluación', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Evaluación de Progreso: {client.name}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">✕</button>
                </div>
                <div className="p-6 overflow-y-auto space-y-6">
                    {/* Rating */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Calificación de Desempeño</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className={`text-3xl transition-transform hover:scale-110 ${star <= rating ? 'text-yellow-400' : 'text-slate-300 dark:text-slate-600'}`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Feedback */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Feedback Técnico</label>
                            <textarea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                rows={4}
                                placeholder="Mejoras en técnica, fuerza..."
                                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-xl dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-brand-primary focus:outline-none resize-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Recomendaciones</label>
                            <textarea
                                value={recommendations}
                                onChange={(e) => setRecommendations(e.target.value)}
                                rows={4}
                                placeholder="Nutrición, descanso, hábitos..."
                                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-xl dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-brand-primary focus:outline-none resize-none"
                            />
                        </div>
                    </div>

                    {/* Observations & Valuation */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Observaciones Generales</label>
                            <textarea
                                value={observations}
                                onChange={(e) => setObservations(e.target.value)}
                                rows={3}
                                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-xl dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-brand-primary focus:outline-none resize-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Valoración Global</label>
                            <select
                                value={generalValuation}
                                onChange={(e) => setGeneralValuation(e.target.value)}
                                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-xl dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-brand-primary focus:outline-none"
                            >
                                <option>Excelente Progreso</option>
                                <option>Buen Progreso</option>
                                <option>Estancado</option>
                                <option>Requiere Atención</option>
                                <option>En Progreso</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="p-6 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3 bg-slate-50 dark:bg-slate-700/30 rounded-b-2xl">
                    <button onClick={onClose} className="px-4 py-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-medium">Cancelar</button>
                    <button
                        onClick={handleSave}
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-secondary font-bold shadow-lg shadow-brand-primary/20 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Guardando...' : 'Guardar Evaluación'}
                    </button>
                </div>
            </div>
        </div>
    );
};


export const MyClients: React.FC = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { showToast } = useFeedback();

    useEffect(() => {
        loadClients();
    }, []);

    const loadClients = async () => {
        setIsLoading(true);
        try {
            const data = await coachService.fetchMyClients();
            setClients(data);
        } catch (error) {
            console.error("Error fetching clients:", error);
            showToast("Error al cargar clientes", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) return <div className="p-10 text-center">Cargando tus clientes...</div>;

    return (
        <div className="container mx-auto px-4 py-8 animate-fade-in space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Mis Clientes</h1>
                    <p className="text-slate-500 dark:text-slate-400">Expedientes y seguimiento detallado</p>
                </div>
                <div className="mt-4 md:mt-0 relative w-full md:w-64">
                    <input
                        type="text"
                        placeholder="Buscar cliente..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary dark:text-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Lista de Clientes */}
                <div className="lg:col-span-1 space-y-4">
                    {filteredClients.length === 0 ? (
                        <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-xl">
                            <p className="text-slate-500">No se encontraron clientes.</p>
                        </div>
                    ) : (
                        filteredClients.map(client => (
                            <div
                                key={client.id}
                                onClick={() => setSelectedClient(client)}
                                className={`p-4 rounded-xl cursor-pointer transition-all border ${selectedClient?.id === client.id ? 'bg-brand-primary/10 border-brand-primary ring-1 ring-brand-primary' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-brand-primary/50'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                        {client.avatar ? <img src={client.avatar} alt={client.name} className="w-full h-full object-cover" /> : <span className="flex items-center justify-center h-full text-xl">👤</span>}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-slate-800 dark:text-white">{client.name}</h3>
                                            {client.source && (
                                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${client.source === 'class' ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300' :
                                                    client.source === 'both' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                                                        'bg-brand-secondary/10 text-brand-secondary'
                                                    }`}>
                                                    {client.source === 'class' ? 'Clase' : client.source === 'both' ? 'Ambos' : 'Privado'}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-brand-secondary mt-0.5">{client.goal}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Detalle del Cliente */}
                <div className="lg:col-span-2">
                    {selectedClient ? (
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-100 dark:border-slate-700 animate-slide-up">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden text-3xl flex items-center justify-center">
                                        {selectedClient.avatar ? <img src={selectedClient.avatar} alt={selectedClient.name} className="w-full h-full object-cover" /> : "👤"}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedClient.name}</h2>
                                        <p className="text-slate-500">Miembro desde {selectedClient.joinDate ? new Date(selectedClient.joinDate).toLocaleDateString() : 'N/A'}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsEvaluationModalOpen(true)}
                                    className="bg-brand-secondary text-white px-4 py-2 rounded-lg hover:brightness-110 flex items-center gap-2 text-sm font-bold shadow-md hover:shadow-lg transition-all"
                                >
                                    <span>⭐</span> Evaluar Progreso
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl">
                                    <span className="block text-xs font-bold text-slate-400 uppercase">Teléfono</span>
                                    <span className="text-slate-800 dark:text-slate-200 font-medium">{selectedClient.phone || 'No registrado'}</span>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl">
                                    <span className="block text-xs font-bold text-slate-400 uppercase">Objetivo</span>
                                    <span className="text-slate-800 dark:text-slate-200 font-medium">{selectedClient.goal || 'General'}</span>
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 border-b border-slate-100 pb-2">Expediente & Notas</h3>
                            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                                {selectedClient.notes && selectedClient.notes.length > 0 ? (
                                    selectedClient.notes.map((note: string, idx: number) => (
                                        <div key={idx} className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-100 dark:border-amber-800/30">
                                            <p className="text-slate-700 dark:text-slate-300 text-sm whitespace-pre-wrap">{note}</p>
                                            <span className="text-[10px] text-slate-400 mt-2 block text-right">Registrado por Entrenador</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-slate-400 italic text-center py-4">No hay notas registradas para este cliente.</p>
                                )}
                            </div>

                            {isEvaluationModalOpen && selectedClient && (
                                <EvaluationModal client={selectedClient} onClose={() => setIsEvaluationModalOpen(false)} />
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 h-full text-center">
                            <span className="text-4xl mb-4">👈</span>
                            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">Selecciona un cliente</h3>
                            <p className="text-slate-500 max-w-xs mx-auto mt-2">Haz clic en un cliente de la lista para ver su expediente completo y gestionar notas.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
