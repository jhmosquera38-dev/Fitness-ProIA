import React from 'react';
import {
    AbsoluteFill,
    interpolate,
    useCurrentFrame,
    useVideoConfig,
    Img,
    staticFile,
    Sequence,
    Spring,
    Easing
} from 'remotion';

const brandPrimary = '#00e0c6';
const brandSecondary = '#01b8a3';
const brandDark = '#0f172a';

export const CoachTutorial: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps, width, height, durationInFrames } = useVideoConfig();

    return (
        <AbsoluteFill style={{ backgroundColor: brandDark, color: 'white', fontFamily: 'SF Pro Display, system-ui, sans-serif' }}>
            {/* Scene 1: Intro (0-150 frames / 5s) */}
            <Sequence from={0} durationInFrames={150}>
                <Intro />
            </Sequence>

            {/* Scene 2-4: Dashboard Walkthrough (151-1200 frames) */}
            <Sequence from={150} durationInFrames={1050}>
                <DashboardShowcase />
            </Sequence>

            {/* Scene 5: Outro (1201-1350 frames) */}
            <Sequence from={1200} durationInFrames={150}>
                <Outro />
            </Sequence>
        </AbsoluteFill>
    );
};

const Intro: React.FC = () => {
    const frame = useCurrentFrame();
    const opacity = interpolate(frame, [0, 20, 130, 150], [0, 1, 1, 0]);
    const scale = interpolate(frame, [0, 30], [0.8, 1], { extrapolateRight: 'clamp' });

    return (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', opacity }}>
            <div style={{ transform: `scale(${scale})`, textAlign: 'center' }}>
                <div style={{ fontSize: 120, fontWeight: 'bold', color: brandPrimary, marginBottom: 20 }}>
                    FitnessFlow <span style={{ color: 'white' }}>Pro</span>
                </div>
                <div style={{ fontSize: 60, color: 'white', opacity: 0.8 }}>
                    Panel de Entrenador
                </div>
            </div>
        </AbsoluteFill>
    );
};

const DashboardShowcase: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();

    // Smooth panning and zooming transitions
    const zoom = interpolate(frame, [0, 100, 300, 400, 600, 700, 900, 1000], [1, 1.2, 1.2, 1.5, 1.5, 1.3, 1.3, 1], {
        easing: Easing.bezier(0.4, 0, 0.2, 1)
    });

    const x = interpolate(frame, [300, 400, 600, 700, 900, 1000], [0, -400, -400, 200, 200, 0]);
    const y = interpolate(frame, [300, 400, 600, 700, 900, 1000], [0, 200, 200, -100, -100, 0]);

    return (
        <AbsoluteFill style={{ backgroundColor: '#f8fafc' }}>
            <div style={{
                transform: `scale(${zoom}) translate(${x}px, ${y}px)`,
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Img
                    src={staticFile('dashboard.png')}
                    style={{ width: '100%', borderRadius: 20, boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}
                />
            </div>

            {/* Labels overlay */}
            {frame > 100 && frame < 300 && (
                <Label x={200} y={200} text="Dashboard de Alto Impacto" />
            )}
            {frame > 400 && frame < 600 && (
                <Label x={800} y={300} text="Gestión de Clientes en tiempo real" />
            )}
            {frame > 700 && frame < 950 && (
                <Label x={400} y={600} text="Asistente con IA Generativa" />
            )}
        </AbsoluteFill>
    );
};

const Label: React.FC<{ x: number, y: number, text: string }> = ({ x, y, text }) => {
    return (
        <div style={{
            position: 'absolute',
            left: x,
            top: y,
            backgroundColor: brandPrimary,
            color: brandDark,
            padding: '20px 40px',
            borderRadius: 50,
            fontSize: 40,
            fontWeight: 'bold',
            boxShadow: '0 10px 30px rgba(0,224,198,0.3)',
            animation: 'fadeIn 0.5s ease-out'
        }}>
            {text}
        </div>
    );
};

const Outro: React.FC = () => {
    const frame = useCurrentFrame();
    const opacity = interpolate(frame, [0, 20], [0, 1]);

    return (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: brandDark, opacity }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 80, fontWeight: 'bold', color: brandPrimary, marginBottom: 40 }}>
                    ¿Listo para empezar?
                </div>
                <div style={{ fontSize: 40, color: 'white', opacity: 0.7 }}>
                    Optimiza tu centro de entrenamiento hoy mismo.
                </div>
            </div>
        </AbsoluteFill>
    );
};
