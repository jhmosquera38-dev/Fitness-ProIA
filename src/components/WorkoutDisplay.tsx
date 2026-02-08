
import React, { useState } from 'react';
import { type WorkoutPlan, type DailyWorkout } from '../types';
import { ExerciseRow } from './ExerciseRow';

interface WorkoutDisplayProps {
  plan: WorkoutPlan;
  onReset: () => void;
}

import { userService } from '../services/userService';

const DailyWorkoutCard: React.FC<{ dailyWorkout: DailyWorkout, index: number }> = ({ dailyWorkout, index }) => {
  const [isOpen, setIsOpen] = useState(index === 0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLogging, setIsLogging] = useState(false);

  const handleComplete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCompleted) return;

    setIsLogging(true);
    try {
      await userService.logWorkoutSession({
        plan_name: `${dailyWorkout.day} - ${dailyWorkout.focus}`,
        duration_minutes: 60, // Estimación base
        calories_burned: 400, // Estimación base
        focus: dailyWorkout.focus
      });
      setIsCompleted(true);
      // Opcional: Notificar al usuario de manera más elegante
    } catch (error) {
      console.error("Error logging workout", error);
      alert("Hubo un error al guardar tu progreso. Inténtalo de nuevo.");
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <div className={`rounded-lg overflow-hidden border transition-all duration-300 ${isCompleted ? 'bg-green-900/20 border-green-500/50' : 'bg-gray-800 border-gray-700'}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex justify-between items-center bg-gray-700/50 hover:bg-gray-700 transition-colors duration-200"
      >
        <div className="text-left">
          <div className="flex items-center gap-3">
            <h3 className="text-lg sm:text-xl font-bold text-brand-secondary">{dailyWorkout.day}</h3>
            {isCompleted && (
              <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">COMPLETADO</span>
            )}
          </div>
          <p className="text-sm text-gray-300">{dailyWorkout.focus}</p>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-brand-accent transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`transition-all duration-500 ease-in-out grid ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="p-4 md:p-6 space-y-6">
            <div>
              <h4 className="font-semibold text-brand-accent mb-2">Calentamiento</h4>
              <p className="text-gray-300 text-sm">{dailyWorkout.warmUp}</p>
            </div>

            <div>
              <h4 className="font-semibold text-brand-accent mb-2 border-b border-brand-accent/20 pb-1">Rutina Principal</h4>
              <div className="hidden sm:grid grid-cols-4 gap-2 items-center text-left px-4 py-2">
                <div className="col-span-2">
                  <p className="text-sm font-semibold text-gray-400">Ejercicio</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-400">Series</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-400">Reps</p>
                </div>
              </div>
              <div className="border border-gray-700 rounded-lg overflow-hidden">
                {dailyWorkout.exercises.map((exercise, i) => (
                  <ExerciseRow key={i} exercise={exercise} />
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-brand-accent mb-2">Enfriamiento</h4>
              <p className="text-gray-300 text-sm">{dailyWorkout.coolDown}</p>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={handleComplete}
                disabled={isCompleted || isLogging}
                className={`px-6 py-2 rounded-lg font-bold transition-all ${isCompleted
                  ? 'bg-green-600 text-white cursor-default'
                  : 'bg-brand-primary text-brand-dark hover:bg-yellow-400'
                  }`}
              >
                {isLogging ? 'Guardando...' : isCompleted ? '¡Entrenamiento Registrado!' : '✅ Marcar Sesión como Completada'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export const WorkoutDisplay: React.FC<WorkoutDisplayProps> = ({ plan, onReset }) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-brand-secondary">Tu Plan de Entrenamiento Personalizado</h2>
        <p className="mt-2 text-gray-300">Aquí está el plan semanal creado por tu Entrenador con IA. ¡Empecemos!</p>
      </div>

      <div className="space-y-4">
        {plan.weeklyPlan && plan.weeklyPlan.length > 0 ? (
          plan.weeklyPlan.map((dailyWorkout, index) => (
            <DailyWorkoutCard key={index} dailyWorkout={dailyWorkout} index={index} />
          ))
        ) : (
          <p className="text-gray-400 text-center">No se pudo cargar el plan semanal. Intenta generar uno nuevo.</p>
        )}
      </div>

      <div className="text-center mt-10">
        <button
          onClick={onReset}
          className="bg-brand-accent text-brand-dark font-bold py-3 px-8 rounded-lg hover:bg-yellow-400 transition-colors duration-300 text-lg"
        >
          Crear un Nuevo Plan
        </button>
      </div>
    </div>
  );
};
