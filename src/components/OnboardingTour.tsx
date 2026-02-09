
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface Step {
    targetId: string | string[]; // Updated to support multiple possible targets
    title: string;
    content: string;
    position: 'right' | 'bottom' | 'left' | 'top';
}

interface CompletionContent {
    title: string;
    message: string;
    primaryAction?: { label: string; action: () => void };
    secondaryAction?: { label: string; action: () => void };
}

interface OnboardingTourProps {
    steps: Step[];
    onComplete: () => void;
    completionContent?: CompletionContent;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ steps, onComplete, completionContent }) => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const [showCompletionModal, setShowCompletionModal] = useState(false);
    const [retryCount, setRetryCount] = useState(0);

    // Helper to find the first visible target from a list of IDs
    const findVisibleTarget = (ids: string | string[]): HTMLElement | null => {
        const idList = Array.isArray(ids) ? ids : [ids];
        for (const id of idList) {
            const el = document.getElementById(id);
            // Check if element exists and has dimensions (is visible)
            if (el) {
                const rect = el.getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0) {
                    return el;
                }
            }
        }
        return null;
    };

    useEffect(() => {
        let isMounted = true;
        const findTarget = () => {
            if (!isMounted) return;

            const target = findVisibleTarget(steps[currentStepIndex].targetId);

            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // Small delay to allow scroll to finish adjustment
                setTimeout(() => {
                    if (isMounted) setTargetRect(target.getBoundingClientRect());
                }, 100);
                setRetryCount(0); // Reset retry on success
            } else {
                if (retryCount < 20) { // Retry for ~10 seconds
                    const timer = setTimeout(() => {
                        setRetryCount(prev => prev + 1);
                    }, 500);
                    return () => clearTimeout(timer);
                } else {
                    // Skip step if not found after retries
                    console.warn(`OnboardingTour: Target ${steps[currentStepIndex].targetId} not found or not visible.`);
                    handleNext();
                }
            }
        };

        const timerCleanup = findTarget();

        const handleResize = () => {
            const target = findVisibleTarget(steps[currentStepIndex].targetId);
            if (target) setTargetRect(target.getBoundingClientRect());
        };
        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleResize, true); // Capture scroll events too

        return () => {
            isMounted = false;
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleResize, true);
            if (typeof timerCleanup === 'function') timerCleanup();
        };
    }, [currentStepIndex, steps, retryCount]);

    const handleNext = () => {
        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
            setRetryCount(0); // Reset retry count for next step
        } else {
            console.log("OnboardingTour: Tour completed. Showing modal or finishing.");
            if (completionContent) {
                setShowCompletionModal(true);
            } else {
                onComplete();
            }
        }
    };

    if (showCompletionModal && completionContent) {
        return createPortal(
            <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in p-4">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-md w-full mx-auto shadow-2xl relative border border-slate-200 dark:border-slate-700">
                    <div className="text-center mb-6">
                        <div className="text-6xl mb-4">🚀</div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{completionContent.title}</h2>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{completionContent.message}</p>
                    </div>

                    <div className="space-y-3">
                        {completionContent.primaryAction && (
                            <button
                                onClick={() => {
                                    completionContent.primaryAction?.action();
                                    onComplete();
                                }}
                                className="w-full bg-brand-primary text-white font-bold py-3.5 px-4 rounded-xl hover:bg-brand-secondary transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
                            >
                                {completionContent.primaryAction.label}
                            </button>
                        )}

                        {completionContent.secondaryAction ? (
                            <button
                                onClick={() => {
                                    completionContent.secondaryAction?.action();
                                    onComplete();
                                }}
                                className="w-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold py-3.5 px-4 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                            >
                                {completionContent.secondaryAction.label}
                            </button>
                        ) : (
                            <button
                                onClick={onComplete}
                                className="w-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold py-3.5 px-4 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                            >
                                Ir al Dashboard
                            </button>
                        )}
                    </div>
                </div>
            </div>,
            document.body
        );
    }

    if (!targetRect) return null;

    const currentStep = steps[currentStepIndex];

    // Tooltip positioning logic
    let tooltipStyle: React.CSSProperties = {};
    let arrowStyle: React.CSSProperties = {};
    const gap = 16;
    const arrowSize = 8;
    const tooltipWidth = 288; // Equivalent to w-72

    // Safety check for 0,0 dimensions
    if (targetRect.width === 0 || targetRect.height === 0) return null;

    const isMobileOrTablet = window.innerWidth < 1024;

    if (isMobileOrTablet) {
        // Modal-like centered positioning for mobile/tablet to guarantee visibility
        tooltipStyle = {
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)', // Fully centered to avoid bottom nav/cutoffs
            width: 'calc(100% - 32px)',
            maxWidth: '380px',
            maxHeight: '80vh',
            overflowY: 'auto',
            position: 'fixed' // Ensure it stays centered regardless of scroll
        };
        arrowStyle = { display: 'none' };
    } else {
        // Smart Desktop positioning with flipping
        const padding = 20;
        const tooltipHeight = 250; // Estimated max height
        let bestPos = currentStep.position;

        // Auto-flip vertical positions
        if (bestPos === 'bottom' && targetRect.bottom + gap + tooltipHeight > window.innerHeight) {
            bestPos = 'top';
        } else if (bestPos === 'top' && targetRect.top - gap - tooltipHeight < 0) {
            bestPos = 'bottom';
        }

        // Auto-flip horizontal positions
        if (bestPos === 'right' && targetRect.right + gap + tooltipWidth > window.innerWidth) {
            bestPos = 'left';
        } else if (bestPos === 'left' && targetRect.left - gap - tooltipWidth < 0) {
            bestPos = 'right';
        }

        if (bestPos === 'right') {
            tooltipStyle = {
                top: Math.max(padding, Math.min(window.innerHeight - tooltipHeight, targetRect.top + targetRect.height / 2 - 100)),
                left: targetRect.right + gap,
            };
            arrowStyle = {
                left: -arrowSize,
                top: '40px',
                borderRightColor: 'currentColor',
                borderWidth: `${arrowSize}px ${arrowSize}px ${arrowSize}px 0`,
                borderColor: `transparent currentColor transparent transparent`
            };
        } else if (bestPos === 'bottom') {
            tooltipStyle = {
                top: targetRect.bottom + gap,
                left: Math.max(padding, Math.min(window.innerWidth - tooltipWidth - padding, targetRect.left + targetRect.width / 2 - tooltipWidth / 2)),
            };
            arrowStyle = {
                top: -arrowSize,
                left: '50%',
                marginLeft: -arrowSize,
                borderBottomColor: 'currentColor',
                borderWidth: `0 ${arrowSize}px ${arrowSize}px ${arrowSize}px`,
                borderColor: `transparent transparent currentColor transparent`
            };
        } else if (bestPos === 'left') {
            tooltipStyle = {
                top: Math.max(padding, Math.min(window.innerHeight - tooltipHeight, targetRect.top)),
                right: window.innerWidth - targetRect.left + gap,
            };
            arrowStyle = {
                right: -arrowSize,
                top: '40px',
                borderLeftColor: 'currentColor',
                borderWidth: `${arrowSize}px 0 ${arrowSize}px ${arrowSize}px`,
                borderColor: `transparent transparent transparent currentColor`
            };
        } else if (bestPos === 'top') {
            tooltipStyle = {
                bottom: window.innerHeight - targetRect.top + gap,
                left: Math.max(padding, Math.min(window.innerWidth - tooltipWidth - padding, targetRect.left + targetRect.width / 2 - tooltipWidth / 2)),
            };
            arrowStyle = {
                bottom: -arrowSize,
                left: '50%',
                marginLeft: -arrowSize,
                borderTopColor: 'currentColor',
                borderWidth: `${arrowSize}px ${arrowSize}px 0 ${arrowSize}px`,
                borderColor: `currentColor transparent transparent transparent`
            };
        }
    }

    // Determine arrow color based on dark mode (naive check, better to pass theme prop or use CSS var)
    // CSS-only arrow handling in the className below is safer for dark mode

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

            {/* Highlight Border/Pulse */}
            <div
                className="absolute border-2 border-brand-primary rounded-lg animate-pulse-slow pointer-events-none shadow-[0_0_15px_rgba(0,224,198,0.5)]"
                style={{
                    top: targetRect.top - 4,
                    left: targetRect.left - 4,
                    width: targetRect.width + 8,
                    height: targetRect.height + 8,
                }}
            />

            {/* Tooltip Card */}
            <div
                className="absolute w-[calc(100%-32px)] sm:w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-6 animate-scale-in border border-slate-100 dark:border-slate-700 pointer-events-auto"
                style={tooltipStyle}
            >
                {/* Visual Arrow (Only on Desktop) */}
                {!isMobileOrTablet && (
                    <div
                        className="absolute w-0 h-0 border-solid"
                        style={arrowStyle}
                    />
                )}

                <div className="flex justify-between items-start mb-4">
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-xl leading-tight pr-4">{currentStep.title}</h3>
                    <span className="shrink-0 text-[10px] font-black tracking-widest text-brand-primary bg-brand-primary/10 dark:bg-brand-primary/20 px-2.5 py-1 rounded-full uppercase border border-brand-primary/20">
                        {currentStepIndex + 1}/{steps.length}
                    </span>
                </div>

                <p className="text-slate-600 dark:text-slate-300 text-base mb-6 leading-relaxed">
                    {currentStep.content}
                </p>

                <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-700">
                    <button
                        onClick={onComplete}
                        className="text-xs text-slate-400 hover:text-red-500 dark:hover:text-red-400 font-bold uppercase tracking-wide transition-colors"
                    >
                        Saltar Tour
                    </button>
                    <button
                        onClick={handleNext}
                        className="bg-brand-primary text-brand-dark px-5 py-2 rounded-lg text-sm font-bold hover:bg-brand-secondary transition-all shadow-lg hover:shadow-brand-primary/30 active:scale-95 flex items-center gap-1"
                    >
                        {currentStepIndex === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};
