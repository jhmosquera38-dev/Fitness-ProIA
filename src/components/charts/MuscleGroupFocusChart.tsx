
import React from 'react';

// ============================================================================
// GRÁFICO DE ENFOQUE MUSCULAR (MuscleGroupFocusChart.tsx)
// ============================================================================
// Visualización tipo Donut Chart personalizada usando SVG.
// Muestra la distribución del entrenamiento por grupos musculares.
// ============================================================================

interface ChartData {
    name: string;
    value: number;
}

interface MuscleGroupFocusChartProps {
    data: ChartData[];
}

const COLORS = ['#00A896', '#02C39A', '#48D2B4', '#7CE0CF', '#AEEFE9']; // Paleta monocromática teal

export const MuscleGroupFocusChart: React.FC<MuscleGroupFocusChartProps> = ({ data }) => {
    // Dimensiones y cálculos geométricos
    const width = 300;
    const height = 250;
    const radius = Math.min(width, height) / 2 - 20;
    const innerRadius = radius * 0.6;

    // Cálculo del total para porcentajes
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let startAngle = -Math.PI / 2; // Iniciar desde arriba

    // Generar arcos SVG manualmente
    const arcs = data.map((item, index) => {
        const angle = (item.value / total) * 2 * Math.PI;
        const endAngle = startAngle + angle;

        // Coordenadas polares a cartesianas
        const x1 = width / 2 + radius * Math.cos(startAngle);
        const y1 = height / 2 + radius * Math.sin(startAngle);
        const x2 = width / 2 + radius * Math.cos(endAngle);
        const y2 = height / 2 + radius * Math.sin(endAngle);

        const ix1 = width / 2 + innerRadius * Math.cos(startAngle);
        const iy1 = height / 2 + innerRadius * Math.sin(startAngle);
        const ix2 = width / 2 + innerRadius * Math.cos(endAngle);
        const iy2 = height / 2 + innerRadius * Math.sin(endAngle);

        const largeArcFlag = angle > Math.PI ? 1 : 0;

        // Definición del path del arco
        const path = [
            `M ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            `L ${ix2} ${iy2}`,
            `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${ix1} ${iy1}`,
            'Z'
        ].join(' ');

        startAngle = endAngle;

        return { path, color: COLORS[index % COLORS.length] };
    });

    return (
        <div className="flex flex-col md:flex-row items-center justify-center h-full">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full max-w-[300px]">
                <g transform={`translate(${width / 2}, ${height / 2})`}>
                    {arcs.map((arc, index) => (
                        <path key={index} d={arc.path} fill={arc.color} />
                    ))}
                </g>
                {/* Texto Central */}
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="font-bold text-3xl fill-slate-800">
                    {total}%
                </text>
                <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" className="text-sm fill-slate-500">
                    Total Focus
                </text>
            </svg>
            {/* Leyenda */}
            <div className="mt-4 md:mt-0 md:ml-6 space-y-2">
                {data.map((item, index) => (
                    <div key={item.name} className="flex items-center text-sm">
                        <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                        <span className="text-slate-600">{item.name}</span>
                        <span className="ml-auto font-semibold text-slate-800">{item.value}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};