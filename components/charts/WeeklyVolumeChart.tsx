
import React from 'react';
import { type WeeklyVolumeData } from '../../types';

// ============================================================================
// GRÁFICO DE VOLUMEN SEMANAL (WeeklyVolumeChart.tsx)
// ============================================================================
// Visualización de área/línea SVG para mostrar la carga progresiva de entrenamiento.
// Incluye relleno degradado para mejor estética.
// ============================================================================

interface ChartProps {
    data: WeeklyVolumeData[];
}

export const WeeklyVolumeChart: React.FC<ChartProps> = ({ data }) => {
    // Configuración
    const width = 500;
    const height = 250;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    const maxVolume = data.length > 0 ? Math.max(...data.map(d => d.volume), 0) : 0;
    const minVolume = 0;

    // Escalas
    const xScale = (index: number) => margin.left + (index / (data.length - 1)) * (width - margin.left - margin.right);
    const yScale = (volume: number) => height - margin.bottom - ((volume - minVolume) / (maxVolume - minVolume)) * (height - margin.top - margin.bottom);

    // Generar path de la línea (SVG "d" attribute)
    const pathData = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(d.volume)}`).join(' ');

    const yAxisLabels = Array.from({ length: 5 }, (_, i) => {
        const value = minVolume + (i / 4) * (maxVolume - minVolume);
        return { value: Math.round(value), y: yScale(value) };
    });

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            {/* Eje Y: Líneas guía */}
            {yAxisLabels.map(({ y }, i) => (
                <line
                    key={i}
                    x1={margin.left}
                    x2={width - margin.right}
                    y1={y}
                    y2={y}
                    stroke="#e2e8f0"
                    strokeWidth="1"
                />
            ))}

            {/* Eje Y: Texto */}
            {yAxisLabels.map(({ value, y }, i) => (
                <text key={i} x={margin.left - 8} y={y} dy="0.32em" textAnchor="end" className="text-xs fill-current text-slate-500">
                    {value}
                </text>
            ))}

            {/* Eje X: Semanas */}
            {data.map((d, i) => (
                <text key={i} x={xScale(i)} y={height - margin.bottom + 15} textAnchor="middle" className="text-xs fill-current text-slate-500">
                    {d.week}
                </text>
            ))}

            {/* Línea Principal del Gráfico */}
            <path d={pathData} fill="none" stroke="#00A896" strokeWidth="2" />

            {/* Área Sombreada (Gradiente) */}
            <path d={`${pathData} L ${xScale(data.length - 1)} ${height - margin.bottom} L ${margin.left} ${height - margin.bottom} Z`} fill="url(#gradient)" />
            <defs>
                <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#02C39A" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#02C39A" stopOpacity="0" />
                </linearGradient>
            </defs>

            {/* Puntos (Círculos) en cada dato */}
            {data.map((d, i) => (
                <circle
                    key={i}
                    cx={xScale(i)}
                    cy={yScale(d.volume)}
                    r="4"
                    fill="#fff"
                    stroke="#00A896"
                    strokeWidth="2"
                />
            ))}
        </svg>
    );
};