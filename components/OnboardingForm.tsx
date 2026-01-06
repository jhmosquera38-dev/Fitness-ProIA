import React, { useState } from 'react';
import { type UserProfile } from '../types';

interface OnboardingFormProps {
  onSubmit: (profile: UserProfile) => void;
  initialData?: UserProfile;
}

const equipmentOptions = [
  'Peso Corporal',
  'Mancuernas',
  'Barra',
  'Pesas Rusas',
  'Bandas de Resistencia',
  'Barra de Dominadas',
  'Caminadora',
  'Bicicleta Estática',
];

export const OnboardingForm: React.FC<OnboardingFormProps> = ({ onSubmit, initialData }) => {
  const [goal, setGoal] = useState<UserProfile['goal']>(initialData?.goal || 'build_muscle');
  const [level, setLevel] = useState<UserProfile['level']>(initialData?.level || 'beginner');
  const [daysPerWeek, setDaysPerWeek] = useState(initialData?.daysPerWeek || 3);
  const [equipment, setEquipment] = useState<string[]>(initialData?.equipment || ['Peso Corporal']);
  const [restPreference, setRestPreference] = useState(initialData?.restPreference || 'Medio (60-90s)');
  const [exercisesToAvoid, setExercisesToAvoid] = useState(initialData?.exercisesToAvoid || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleEquipmentChange = (item: string) => {
    setEquipment((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    onSubmit({ goal, level, daysPerWeek, equipment, notes, restPreference, exercisesToAvoid });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-2 text-slate-800">Completa tu Perfil</h2>
      <p className="text-center text-slate-500 mb-8">Esta información nos ayudará a crear el plan perfecto para ti.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Goal */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">¿Cuál es tu objetivo principal?</label>
          <select value={goal} onChange={(e) => setGoal(e.target.value as UserProfile['goal'])} className="w-full p-3 bg-slate-50 border border-slate-300 text-slate-900 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none">
            <option value="build_muscle">Ganar Músculo</option>
            <option value="lose_fat">Perder Grasa</option>
            <option value="improve_endurance">Mejorar Resistencia</option>
            <option value="general_fitness">Fitness General</option>
          </select>
        </div>

        {/* Level */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">¿Cuál es tu nivel de experiencia?</label>
          <select value={level} onChange={(e) => setLevel(e.target.value as UserProfile['level'])} className="w-full p-3 bg-slate-50 border border-slate-300 text-slate-900 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none">
            <option value="beginner">Principiante</option>
            <option value="intermediate">Intermedio</option>
            <option value="advanced">Avanzado</option>
          </select>
        </div>

        {/* Days Per Week */}
        <div>
          <label htmlFor="days" className="block text-sm font-medium text-slate-700 mb-1">¿Cuántos días a la semana puedes entrenar?</label>
          <div className="flex items-center gap-4">
            <input type="range" id="days" min="1" max="7" value={daysPerWeek} onChange={(e) => setDaysPerWeek(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-primary" />
            <span className="bg-brand-primary text-white font-bold text-lg rounded-full h-10 w-10 flex items-center justify-center">{daysPerWeek}</span>
          </div>
        </div>

        {/* Rest Preference */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Preferencia de descanso entre series</label>
          <select value={restPreference} onChange={(e) => setRestPreference(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-300 text-slate-900 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none">
            <option value="Corto (30-60s)">Corto (30-60s)</option>
            <option value="Medio (60-90s)">Medio (60-90s)</option>
            <option value="Largo (90-180s)">Largo (90-180s)</option>
          </select>
        </div>

        {/* Equipment */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">¿A qué equipo tienes acceso?</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {equipmentOptions.map((item) => (
              <label key={item} className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 text-center text-sm ${equipment.includes(item) ? 'bg-green-100 border-brand-primary text-brand-primary font-semibold' : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'}`}>
                <input type="checkbox" checked={equipment.includes(item)} onChange={() => handleEquipmentChange(item)} className="hidden" />
                {item}
              </label>
            ))}
          </div>
        </div>

        {/* Exercises to avoid */}
        <div>
          <label htmlFor="exercisesToAvoid" className="block text-sm font-medium text-slate-700 mb-1">Ejercicios a evitar (opcional)</label>
          <textarea id="exercisesToAvoid" value={exercisesToAvoid} onChange={(e) => setExercisesToAvoid(e.target.value)} rows={2} placeholder="Ej: sentadillas con barra, saltos en caja..." className="w-full p-3 bg-slate-50 border border-slate-300 text-slate-900 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none"></textarea>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-1">¿Alguna nota o limitación específica? (Opcional)</label>
          <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Ej: enfocar en piernas, evitar alto impacto en rodillas..." className="w-full p-3 bg-slate-50 border border-slate-300 text-slate-900 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none"></textarea>
        </div>

        <button type="submit" disabled={isLoading} className="w-full bg-brand-primary text-white font-bold text-lg py-3 px-6 rounded-lg hover:bg-brand-secondary transition-transform duration-300 transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:scale-100">
          {isLoading ? 'Generando...' : 'Generar Mi Plan'}
        </button>
      </form>
    </div>
  );
};