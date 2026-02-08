import React, { useState, useEffect } from 'react';
import { OnboardingForm } from '../components/OnboardingForm';
import { WorkoutDisplay } from '../components/WorkoutDisplay';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { generateWorkoutPlan } from '../services/geminiService';
import { workoutService, type SavedWorkoutPlan } from '../services/workoutService';
import { type UserProfile, type WorkoutPlan } from '../types';
import { useFeedback } from '../components/FeedbackSystem';

export const MyRoutines: React.FC = () => {
    const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
    const [savedPlans, setSavedPlans] = useState<SavedWorkoutPlan[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [viewMode, setViewMode] = useState<'list' | 'create' | 'view'>('list');
    const [editingProfile, setEditingProfile] = useState<UserProfile | null>(null);
    const { showToast } = useFeedback();

    const fetchSavedPlans = async () => {
        try {
            const plans = await workoutService.getWorkoutPlans();
            setSavedPlans(plans);
            if (plans.length === 0) setViewMode('create');
        } catch (error) {
            console.error('Error fetching plans:', error);
        }
    };

    useEffect(() => {
        fetchSavedPlans();
    }, []);

    const handleFormSubmit = async (profile: UserProfile) => {
        setIsLoading(true);
        try {
            const plan = await generateWorkoutPlan(profile);
            setWorkoutPlan(plan);

            // Auto-save with criteria
            await workoutService.saveWorkoutPlan(plan, profile);
            showToast("¡Rutina creada y guardada!", "success");

            setEditingProfile(null); // Reset editing state
            await fetchSavedPlans(); // Refresh list
            setViewMode('view');
        } catch (err) {
            console.error(err);
            showToast('Hubo un error al generar tu plan.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeletePlan = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm('¿Estás seguro de que quieres eliminar esta rutina?')) return;

        try {
            await workoutService.deleteWorkoutPlan(id);
            showToast("Rutina eliminada", "success");
            fetchSavedPlans();
            if (viewMode === 'view') setViewMode('list');
        } catch (error) {
            showToast("Error al eliminar", "error");
        }
    };

    const handleEditPlan = (plan: SavedWorkoutPlan, e: React.MouseEvent) => {
        e.stopPropagation();
        if (plan.criteria) {
            setEditingProfile(plan.criteria);
            setViewMode('create');
        } else {
            showToast("Esta rutina antigua no tiene criterios guardados.", "info");
        }
    };

    const handleSelectPlan = (plan: SavedWorkoutPlan) => {
        setWorkoutPlan(plan.plan_data);
        setViewMode('view');
    };

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 animate-fade-in space-y-8">
            {/* Header / Navigation */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <h1 className="text-2xl font-bold text-slate-800">Mis Rutinas</h1>
                {(viewMode === 'view' || viewMode === 'create') && savedPlans.length > 0 && (
                    <button
                        onClick={() => { setViewMode('list'); setEditingProfile(null); }}
                        className="text-brand-primary hover:underline font-medium flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
                        Ver Historial
                    </button>
                )}
                {viewMode === 'list' && (
                    <button
                        onClick={() => { setViewMode('create'); setEditingProfile(null); }}
                        className="bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-secondary transition-colors font-semibold shadow-md"
                    >
                        + Nueva Rutina
                    </button>
                )}
            </div>

            {isLoading ? (
                <div className="text-center py-20 bg-white rounded-xl shadow-lg border border-slate-100">
                    <LoadingSpinner />
                    <p className="mt-6 text-slate-700 font-bold text-xl animate-pulse">Tu AI Coach está diseñando tu plan...</p>
                    <p className="text-slate-500 mt-2">Analizando tus objetivos y nivel 🧠💪</p>
                </div>
            ) : (
                <>
                    {viewMode === 'list' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {savedPlans.map(plan => (
                                <div
                                    key={plan.id}
                                    onClick={() => handleSelectPlan(plan)}
                                    className="bg-white p-6 rounded-xl shadow-md border border-slate-200 hover:shadow-xl hover:border-brand-primary/30 transition-all cursor-pointer group relative overflow-hidden flex flex-col justify-between"
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-2">
                                        {plan.criteria && (
                                            <button
                                                onClick={(e) => handleEditPlan(plan, e)}
                                                className="text-blue-500 hover:text-blue-700 bg-white rounded-full p-2 shadow-sm hover:bg-blue-50"
                                                title="Editar criterios y regenerar"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
                                            </button>
                                        )}
                                        <button
                                            onClick={(e) => handleDeletePlan(plan.id, e)}
                                            className="text-red-400 hover:text-red-600 bg-white rounded-full p-2 shadow-sm hover:bg-red-50"
                                            title="Eliminar rutina"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                        </button>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="bg-brand-primary/10 p-3 rounded-lg text-brand-primary">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2h2" /></svg>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-slate-800 line-clamp-1">{plan.name}</h3>
                                                <p className="text-sm text-slate-500">{new Date(plan.created_at).toLocaleDateString()} • {plan.plan_data.weeklyPlan?.length || 0} Días</p>
                                            </div>
                                        </div>

                                        {plan.criteria && (
                                            <div className="mb-4 text-xs text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                                <p><strong>Meta:</strong> {plan.criteria.goal}</p>
                                                <p><strong>Nivel:</strong> {plan.criteria.level}</p>
                                                <p><strong>Equipo:</strong> {plan.criteria.equipment.slice(0, 2).join(', ')}{plan.criteria.equipment.length > 2 && '...'}</p>
                                            </div>
                                        )}

                                        <div className="space-y-2">
                                            {plan.plan_data.weeklyPlan?.slice(0, 3).map((day, idx) => (
                                                <div key={idx} className="text-sm text-slate-600 flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
                                                    <span className="font-semibold">{day.day}:</span> {day.focus}
                                                </div>
                                            ))}
                                            {plan.plan_data.weeklyPlan?.length > 3 && (
                                                <div className="text-xs text-slate-400 pl-4">+ {plan.plan_data.weeklyPlan.length - 3} días más</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {savedPlans.length === 0 && (
                                <div className="col-span-full text-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                                    No tienes rutinas guardadas. ¡Crea la primera ahora!
                                </div>
                            )}
                        </div>
                    )}

                    {viewMode === 'create' && (
                        <div className="max-w-3xl mx-auto">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-extrabold text-slate-900">
                                    {editingProfile ? 'Editar y Regenerar Plan' : 'Diseña tu Nuevo Plan'}
                                </h2>
                                <p className="mt-2 text-slate-600">Completa el formulario y la IA generará tu rutina ideal.</p>
                            </div>
                            <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-slate-200">
                                <OnboardingForm onSubmit={handleFormSubmit} initialData={editingProfile || undefined} />
                            </div>
                        </div>
                    )}

                    {viewMode === 'view' && workoutPlan && (
                        <div className="bg-gray-900 text-white p-4 sm:p-6 md:p-8 rounded-xl shadow-lg animate-fade-in">
                            <WorkoutDisplay plan={workoutPlan} onReset={() => setViewMode('create')} />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
