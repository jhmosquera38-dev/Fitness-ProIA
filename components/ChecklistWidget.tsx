
import React, { useState } from 'react';

interface ChecklistItem {
    id: string;
    label: string;
    isCompleted: boolean;
    actionLabel?: string;
}

interface ChecklistWidgetProps {
    title: string;
    items: ChecklistItem[];
    onAction?: (item: ChecklistItem) => void;
}

export const ChecklistWidget: React.FC<ChecklistWidgetProps> = ({ title, items: initialItems, onAction }) => {
    const [items, setItems] = useState<ChecklistItem[]>(initialItems);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleItem = (id: string) => {
        setItems((prev: ChecklistItem[]) => prev.map(item => item.id === id ? { ...item, isCompleted: !item.isCompleted } : item));
    };

    const completedCount = items.filter(i => i.isCompleted).length;
    const progress = (completedCount / items.length) * 100;

    if (progress === 100 && !isCollapsed) {
        // Auto collapse after a moment if completed, for UX smoothness
        setTimeout(() => setIsCollapsed(true), 2000);
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-500">
            <div className="p-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <path className="text-slate-200" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                            <path className="text-brand-primary transition-all duration-1000 ease-out" strokeDasharray={`${progress}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                        </svg>
                        <span className="absolute text-xs font-bold text-brand-dark">{Math.round(progress)}%</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800">{title}</h3>
                        <p className="text-xs text-slate-500">{completedCount} de {items.length} completados</p>
                    </div>
                </div>
                <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-slate-400 hover:text-slate-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${isCollapsed ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
            </div>

            {!isCollapsed && (
                <div className="p-2">
                    {items.map(item => (
                        <div key={item.id} className={`flex items-center p-3 rounded-lg transition-colors ${item.isCompleted ? 'opacity-50' : 'hover:bg-slate-50'}`}>
                            <button
                                onClick={() => toggleItem(item.id)}
                                className={`w-5 h-5 rounded border flex items-center justify-center mr-3 transition-colors ${item.isCompleted ? 'bg-green-500 border-green-500' : 'border-slate-300 hover:border-brand-primary'}`}
                            >
                                {item.isCompleted && <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                            </button>
                            <span className={`flex-grow text-sm ${item.isCompleted ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{item.label}</span>
                            {!item.isCompleted && item.actionLabel && (
                                <button
                                    onClick={() => onAction && onAction(item)}
                                    className="text-xs text-brand-primary font-semibold hover:underline"
                                >
                                    {item.actionLabel}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
