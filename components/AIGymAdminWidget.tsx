import React, { useState, useRef, useEffect } from 'react';
import { getGymAdminAdvice } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

export const AIGymAdminWidget: React.FC = () => {
    const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
        { sender: 'ai', text: 'Hola. Soy tu consultor de gestión. ¿En qué puedo ayudarte hoy para mejorar tu gimnasio?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        setIsLoading(true);

        try {
            const response = await getGymAdminAdvice(userMsg);
            setMessages(prev => [...prev, { sender: 'ai', text: response.text }]);
        } catch (error) {
            setMessages(prev => [...prev, { sender: 'ai', text: 'Lo siento, hubo un error de conexión. Intenta de nuevo.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 flex flex-col h-[500px]">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-t-2xl flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-2xl">
                        🤖
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 dark:text-white">IA Bienestar (Admin)</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Consultor de Negocios 24/7</p>
                    </div>
                </div>
            </div>

            <div className="flex-grow p-4 overflow-y-auto space-y-4 custom-scrollbar">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.sender === 'user'
                                ? 'bg-brand-primary text-white rounded-tr-none'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-tl-none'
                            }`}>
                            {msg.sender === 'ai' ? (
                                <ReactMarkdown
                                    components={{
                                        ul: ({ node, ...props }) => <ul className="list-disc ml-4 my-2" {...props} />,
                                        strong: ({ node, ...props }) => <strong className="font-bold text-slate-900 dark:text-white" {...props} />
                                    }}
                                >
                                    {msg.text}
                                </ReactMarkdown>
                            ) : (
                                msg.text
                            )}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-2xl rounded-tl-none flex gap-2 items-center">
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-700">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Pregunta sobre retención, marketing..."
                        className="flex-grow p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="bg-brand-primary text-white p-3 rounded-xl hover:bg-brand-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};
