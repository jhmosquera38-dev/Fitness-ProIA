import React from 'react';

// ============================================================================
// BANNER DE PRUEBA (TrialBanner.tsx)
// ============================================================================
// Banner informativo que muestra los días restantes del periodo de prueba.
// Anima al usuario a suscribirse antes de que expire la prueba.
// ============================================================================

interface TrialBannerProps {
    /**
     * La fecha de finalización del período de prueba.
     * The end date of the trial period.
     */
    trialEndDate: Date;
    /**
     * Función de callback que se ejecuta cuando el usuario hace clic en el botón "Suscríbete ahora".
     * Callback function executed when the user clicks the "Subscribe now" button.
     */
    onSubscribeClick: () => void;
}

/**
 * Componente `TrialBanner` que muestra un banner informativo con los días restantes del período de prueba.
 * Incluye un botón para que el usuario pueda suscribirse.
 *
 * @param {TrialBannerProps} props - Las propiedades del componente.
 * @returns {React.FC<TrialBannerProps>} Un componente React que renderiza el banner de prueba.
 */
export const TrialBanner: React.FC<TrialBannerProps> = ({ trialEndDate, onSubscribeClick }) => {
    /**
     * Calcula los días restantes hasta la fecha de finalización de la prueba.
     * @returns {number} El número de días restantes, o 0 si la fecha ya ha pasado.
     */
    const calculateDaysLeft = () => {
        const now = new Date();
        // Calcula la diferencia en milisegundos entre la fecha de finalización y la fecha actual.
        const differenceInTime = trialEndDate.getTime() - now.getTime();
        // Convierte la diferencia de milisegundos a días y redondea hacia arriba.
        const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
        // Asegura que el número de días no sea negativo.
        return differenceInDays > 0 ? differenceInDays : 0;
    };

    // Obtiene los días restantes.
    const daysLeft = calculateDaysLeft();

    return (
        <div className="bg-yellow-400 text-yellow-900 text-sm font-semibold p-2 text-center">
            <p>
                Te quedan {daysLeft} {daysLeft === 1 ? 'día' : 'días'} de prueba.
                <button onClick={onSubscribeClick} className="ml-2 underline font-bold hover:text-yellow-950">
                    Suscríbete ahora
                </button>
            </p>
        </div>
    );
};