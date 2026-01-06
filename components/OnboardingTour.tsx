
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface Step {
    targetId: string;
    title: string;
    content: string;
    position: 'right' | 'bottom' | 'left' | 'top';
}

interface OnboardingTourProps {
    steps: Step[];
    onComplete: () => void;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ steps, onComplete }) => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

    useEffect(() => {
        const target = document.getElementById(steps[currentStepIndex].targetId);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTargetRect(target.getBoundingClientRect());
            // Handle resize
            const handleResize = () => {
                 if (target) setTargetRect(target.getBoundingClientRect());
            };
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        } else {
            // If target not found, skip or finish
            if (currentStepIndex < steps.length - 1) {
                setCurrentStepIndex(prev => prev + 1);
            } else {
                onComplete();
            }
        }
    }, [currentStepIndex, steps, onComplete]);

    const handleNext = () => {
        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
        } else {
            onComplete();
        }
    };

    if (!targetRect) return null;

    const currentStep = steps[currentStepIndex];

    // Tooltip positioning logic
    let tooltipStyle: React.CSSProperties = {};
    const gap = 12;
    
    if (currentStep.position === 'right') {
        tooltipStyle = { top: targetRect.top + targetRect.height / 2 - 60, left: targetRect.right + gap };
    } else if (currentStep.position === 'bottom') {
        tooltipStyle = { top: targetRect.bottom + gap, left: targetRect.left };
    } else if (currentStep.position === 'left') {
        tooltipStyle = { top: targetRect.top, right: window.innerWidth - targetRect.left + gap };
    } else if (currentStep.position === 'top') {
         tooltipStyle = { bottom: window.innerHeight - targetRect.top + gap, left: targetRect.left };
    }


    return createPortal(
        <div className="fixed inset-0 z-[9999] overflow-hidden">
            {/* Dark Overlay with Cutout using SVG mask */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                    <mask id="tour-mask">
                        <rect x="0" y="0" width="100%" height="100%" fill="white" />
                        <rect 
                            x={targetRect.left - 4} 
                            y={targetRect.top - 4} 
                            width={targetRect.width + 8} 
                            height={targetRect.height + 8} 
                            fill="black" 
                            rx="8" 
                        />
                    </mask>
                </defs>
                <rect x="0" y="0" width="100%" height="100%" fill="rgba(0,0,0,0.7)" mask="url(#tour-mask)" />
            </svg>
            
            {/* Highlight Border */}
            <div 
                className="absolute border-2 border-white rounded-lg animate-pulse pointer-events-none"
                style={{
                    top: targetRect.top - 4,
                    left: targetRect.left - 4,
                    width: targetRect.width + 8,
                    height: targetRect.height + 8,
                }}
            />

            {/* Tooltip Card */}
            <div 
                className="absolute w-72 bg-white rounded-xl shadow-2xl p-4 animate-scale-in"
                style={tooltipStyle}
            >
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-800 text-lg">{currentStep.title}</h3>
                    <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                        {currentStepIndex + 1} / {steps.length}
                    </span>
                </div>
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">{currentStep.content}</p>
                <div className="flex justify-between items-center">
                    <button 
                        onClick={onComplete} 
                        className="text-xs text-slate-400 hover:text-slate-600 font-medium"
                    >
                        Saltar tour
                    </button>
                    <button 
                        onClick={handleNext}
                        className="bg-brand-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-brand-secondary transition-colors"
                    >
                        {currentStepIndex === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
                    </button>
                </div>
                {/* Arrow */}
                 {currentStep.position === 'right' && <div className="absolute top-16 -left-2 w-4 h-4 bg-white transform rotate-45"></div>}
                 {currentStep.position === 'bottom' && <div className="absolute -top-2 left-6 w-4 h-4 bg-white transform rotate-45"></div>}
                 {currentStep.position === 'top' && <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white transform rotate-45"></div>}

            </div>
        </div>,
        document.body
    );
};
