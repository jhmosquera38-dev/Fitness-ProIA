
import React, { useState, useMemo } from 'react';
import { EXERCISE_DATA, CATEGORIES, DIFFICULTIES } from '../data/exercises';
import { ExerciseCard } from '../components/ExerciseCard';
import { type LibraryExercise } from '../types';
import { ExerciseModal } from '../components/ExerciseModal';

// ============================================================================
// BIBLIOTECA DE EJERCICIOS (ExerciseLibrary.tsx)
// ============================================================================
// Catálogo completo de ejercicios disponibles en la plataforma.
// Permite buscar, filtrar por categoría/dificultad y ver detalles.
// ============================================================================

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

// Componente simple para tooltips informativos
const InfoTooltip: React.FC<{ text: string }> = ({ text }) => {
    return (
        <div className="relative flex items-center group ml-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 bg-slate-800 text-white text-sm rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 shadow-lg">
                {text}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-slate-800"></div>
            </div>
        </div>
    );
};

export const ExerciseLibrary: React.FC<{ onNavigate?: (page: string) => void }> = ({ onNavigate }) => {
    // Estados para filtrado
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todas');
    const [selectedDifficulty, setSelectedDifficulty] = useState('Todas');
    const [selectedExercise, setSelectedExercise] = useState<LibraryExercise | null>(null);

    // Lógica de filtrado en tiempo real
    const filteredExercises = useMemo(() => {
        return EXERCISE_DATA.filter(exercise => {
            const nameMatch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
            const categoryMatch = selectedCategory === 'Todas' || exercise.tags.map(t => t.toLowerCase()).includes(selectedCategory.toLowerCase());
            const difficultyMatch = selectedDifficulty === 'Todas' || exercise.difficulty === selectedDifficulty;
            return nameMatch && categoryMatch && difficultyMatch;
        });
    }, [searchTerm, selectedCategory, selectedDifficulty]);

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 animate-fade-in">
            {/* Encabezado */}
            <div className="text-center mb-8 md:mb-12">
                <div className="flex justify-center items-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">Biblioteca de Ejercicios</h1>
                    <InfoTooltip text="Busca ejercicios por nombre, filtra por categoría o dificultad y haz clic en una tarjeta para ver instrucciones detalladas." />
                </div>
                <p className="mt-2 text-lg text-slate-600 max-w-2xl mx-auto">Explora nuestra amplia colección de ejercicios con instrucciones detalladas</p>
            </div>

            {/* Barra de Herramientas de Filtrado */}
            <div className="bg-white p-4 rounded-xl shadow-md border border-slate-200 mb-8 sticky top-[65px] z-40">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Búsqueda por texto */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar ejercicios..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon />
                        </div>
                    </div>

                    {/* Filtro de Categoría */}
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none bg-white"
                    >
                        <option value="Todas">Todas las categorías</option>
                        {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>

                    {/* Filtro de Dificultad */}
                    <select
                        value={selectedDifficulty}
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none bg-white"
                    >
                        <option value="Todas">Todas las dificultades</option>
                        {DIFFICULTIES.map(diff => <option key={diff} value={diff}>{diff}</option>)}
                    </select>
                </div>
            </div>

            {/* Contador de Resultados */}
            <div className="mb-6">
                <p className="text-slate-600 font-semibold">{filteredExercises.length} ejercicios encontrados</p>
            </div>


            {/* Grid de Ejercicios */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredExercises.map(exercise => (
                    <ExerciseCard
                        key={exercise.id}
                        exercise={exercise}
                        onCardClick={() => setSelectedExercise(exercise)}
                    />
                ))}
            </div>

            {/* Mensaje si no hay resultados */}
            {filteredExercises.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-slate-500 text-lg">No se encontraron ejercicios con los filtros actuales.</p>
                    <button
                        onClick={() => { setSearchTerm(''); setSelectedCategory('Todas'); setSelectedDifficulty('Todas'); }}
                        className="mt-4 text-brand-primary font-semibold hover:underline"
                    >
                        Limpiar filtros
                    </button>
                </div>
            )}

            {/* Modal de Detalles */}
            {selectedExercise && (
                <ExerciseModal
                    exercise={selectedExercise}
                    onClose={() => setSelectedExercise(null)}
                    onStartExercise={() => {
                        setSelectedExercise(null);
                        if (onNavigate) onNavigate('Mis Rutinas');
                    }}
                />
            )}
        </div>
    );
};