import React from 'react';
import { LeaderboardEntry } from '../types';

interface LeaderboardWidgetProps {
    data: LeaderboardEntry[];
    currentUserId: string; // To highlight the current user
}

export const LeaderboardWidget: React.FC<LeaderboardWidgetProps> = ({ data, currentUserId }) => {
    return (
        <div className="glass-panel p-6 rounded-2xl border border-slate-700/50 h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-white flex items-center gap-2">
                    <span className="text-xl">🏆</span> Ranking Global
                </h3>
                <span className="text-xs bg-brand-primary/20 text-brand-primary px-2 py-1 rounded font-bold uppercase tracking-wider">Top 5</span>
            </div>

            <div className="space-y-4">
                {data.map((entry, index) => {
                    const isCurrentUser = entry.userName === currentUserId;
                    const isTop3 = index < 3;

                    return (
                        <div
                            key={index}
                            className={`flex items-center justify-between p-3 rounded-xl transition-all ${isCurrentUser ? 'bg-brand-primary/10 border border-brand-primary/50' : 'hover:bg-white/5 border border-transparent'}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 flex items-center justify-center font-black rounded-lg ${isTop3 ? 'bg-gradient-to-br from-yellow-400 to-orange-600 text-white shadow-lg' : 'bg-slate-800 text-slate-500'}`}>
                                    {entry.rank}
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-lg shadow-inner">
                                        {entry.avatar || '👤'}
                                    </div>
                                    <div>
                                        <p className={`font-bold text-sm ${isCurrentUser ? 'text-brand-primary' : 'text-slate-200'}`}>
                                            {entry.userName} {isCurrentUser && '(Tú)'}
                                        </p>
                                        <p className="text-[10px] text-slate-400 flex items-center gap-1">
                                            {entry.trend === 'up' && <span className="text-green-400">▲ Subiendo</span>}
                                            {entry.trend === 'down' && <span className="text-red-400">▼ Bajando</span>}
                                            {entry.trend === 'same' && <span className="text-slate-500">- Estable</span>}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-mono font-bold text-white text-sm">{entry.xp.toLocaleString()}</p>
                                <p className="text-[10px] text-slate-500 uppercase font-bold">XP Total</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
