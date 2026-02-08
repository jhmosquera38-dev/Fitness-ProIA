import React from 'react';
import { SocialActivity } from '../types';

interface SocialFeedProps {
    activities: SocialActivity[];
    onComment: (activityId: string, content: string) => Promise<void>;
}

export const SocialFeed: React.FC<SocialFeedProps> = ({ activities, onComment }) => {
    const [commentingId, setCommentingId] = React.useState<string | null>(null);
    const [commentText, setCommentText] = React.useState("");

    const getIcon = (type: SocialActivity['type']) => {
        switch (type) {
            case 'workout': return '🏋️‍♂️';
            case 'level_up': return '🆙';
            case 'achievement': return '🏅';
            default: return '📢';
        }
    };

    const handleCommentSubmit = async (activityId: string) => {
        if (!commentText.trim()) return;
        await onComment(activityId, commentText);
        setCommentingId(null);
        setCommentText("");
    };

    return (
        <div className="glass-panel p-6 rounded-2xl border border-slate-700/50 h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-white flex items-center gap-2">
                    <span className="text-xl">🌍</span> Comunidad
                </h3>
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            </div>

            <div className="space-y-4 relative">
                {/* Timeline Line */}
                <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-800 z-0"></div>

                {activities.map((activity) => (
                    <div key={activity.id} className="relative z-10 flex gap-4 items-start">
                        <div className="w-10 h-10 rounded-full bg-slate-800 border-4 border-slate-900 flex items-center justify-center text-lg shrink-0 shadow-lg">
                            {getIcon(activity.type)}
                        </div>
                        <div className="flex-grow bg-slate-800/50 rounded-xl p-3 border border-white/5 hover:border-white/10 transition-colors">
                            <div className="flex justify-between items-start">
                                <p className="text-xs text-slate-300">
                                    <span className="font-bold text-white hover:text-brand-primary cursor-pointer transition-colors">{activity.user}</span> {activity.action}
                                </p>
                                <span className="text-[9px] text-slate-500 font-mono">{activity.timeAgo}</span>
                            </div>

                            {/* Like & Comment Action */}
                            <div className="mt-2 flex items-center gap-4">
                                <button className="flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-red-400 transition-colors group">
                                    <span className="group-hover:scale-110 transition-transform">❤️</span> {activity.likes}
                                </button>
                                <button
                                    onClick={() => setCommentingId(commentingId === activity.id ? null : activity.id)}
                                    className="flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-white transition-colors"
                                >
                                    💬 Comentar
                                </button>
                            </div>

                            {/* Comment Input */}
                            {commentingId === activity.id && (
                                <div className="mt-3 flex gap-2 animate-fade-in">
                                    <input
                                        type="text"
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        placeholder="Escribe un comentario..."
                                        className="w-full bg-slate-900 text-xs text-white p-2 rounded-lg border border-slate-700 focus:border-brand-primary outline-none"
                                        onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit(activity.id)}
                                    />
                                    <button
                                        onClick={() => handleCommentSubmit(activity.id)}
                                        className="text-[10px] bg-brand-primary text-slate-900 font-bold px-3 rounded-lg hover:bg-brand-light transition-colors"
                                    >
                                        Enviar
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
