
import React, { useState, useRef, useEffect } from 'react';
import { getAICoachResponse, getDailyWellnessTip } from '../services/geminiService';
import { type ChatMessage } from '../types';
import { User } from '../types';
import { GoogleGenAI, LiveServerMessage, Modality, type Blob as GenAIBlob } from "@google/genai";

// ============================================================================
// AI WELLNESS HUB (AIWellnessHub.tsx)
// ============================================================================
// Este es el componente central de las funcionalidades de IA de la aplicación.
// Incluye:
// 1. Chat de Texto con el Coach: Usando geminiService para RAG y respuestas.
// 2. Consejo Diario: Generado al cargar.
// 3. Live Coach (Voz): Implementación avanzada de WebSocket con Google GenAI
//    para conversación en tiempo real (audio-to-audio).
// ============================================================================

// ----------------------------------------------------------------------------
// Funciones de utilidad para el procesamiento de Audio (Blob/PCM)
// ----------------------------------------------------------------------------

// Convierte un array de bytes a cadena Base64
function encode(bytes: Uint8Array): string {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

// Decodifica una cadena Base64 a array de bytes
function decode(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

// Convierte datos de audio PCM sin procesar (raw) a un AudioBuffer reproducible por el navegador
async function decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }
    return buffer;
}


// ----------------------------------------------------------------------------
// Componentes UI Auxiliares
// ----------------------------------------------------------------------------

const AiIcon = () => (
    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
        AI
    </div>
);

const UserIcon: React.FC<{ name: string }> = ({ name }) => (
    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-sm flex-shrink-0">
        {name.substring(0, 1).toUpperCase()}
    </div>
);

const LinkIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>);

const MicIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-14 0m7 6v4m0 0H9m4 0h-4m-1-11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1h-2a1 1 0 01-1-1v-5z" /> </svg>);
const StopIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> <path strokeLinecap="round" strokeLinejoin="round" d="M9 10h6v4H9z" /> </svg>);


// Mensaje del AI en el chat de texto
const AIMessage: React.FC<{ message: ChatMessage }> = ({ message }) => (
    <div className="flex gap-3 my-4">
        <AiIcon />
        <div className="bg-white dark:bg-slate-700 p-3 rounded-lg rounded-tl-none shadow-sm border border-slate-200 dark:border-slate-600 max-w-lg animate-fade-in transition-colors">
            <p className="text-slate-700 dark:text-slate-200 whitespace-pre-wrap">{message.text}</p>
            {/* Renderizado de fuentes si existen (Grounding) */}
            {message.sources && message.sources.length > 0 && (
                <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-600/60">
                    <h5 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Fuentes:</h5>
                    <ul className="space-y-1">
                        {message.sources.map((source, index) => (
                            <li key={index} className="text-xs">
                                <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline truncate block">
                                    <LinkIcon />
                                    {source.title || source.uri}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    </div>
);

// Mensaje del Usuario en el chat de texto
const UserMessage: React.FC<{ text: string; name: string; }> = ({ text, name }) => (
    <div className="flex gap-3 my-4 justify-end">
        <div className="bg-brand-primary text-white p-3 rounded-lg rounded-br-none shadow-sm max-w-lg animate-fade-in">
            <p className="whitespace-pre-wrap">{text}</p>
        </div>
        <UserIcon name={name} />
    </div>
);

// Componente: Consejo Diario
const DailyTip: React.FC = () => {
    const [tip, setTip] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTip = async () => {
            try {
                const dailyTip = await getDailyWellnessTip();
                setTip(dailyTip);
            } catch (error) {
                setTip("Recuerda que cada pequeño paso cuenta en tu camino hacia el bienestar. ¡Sigue adelante!");
            } finally {
                setIsLoading(false);
            }
        };
        fetchTip();
    }, []);

    return (
        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/40 dark:to-orange-900/40 p-6 rounded-xl shadow-lg border border-yellow-200 dark:border-yellow-700/50 transition-colors">
            <h3 className="font-bold text-yellow-900 dark:text-yellow-100 mb-3 text-lg flex items-center gap-2">💡 Consejo de Bienestar del Día</h3>
            {isLoading ? (
                <p className="text-yellow-800 dark:text-yellow-200 text-sm animate-pulse">Generando tu consejo...</p>
            ) : (
                <p className="text-yellow-800 dark:text-yellow-200">{tip}</p>
            )}
        </div>
    );
};

// ============================================================================
// COMPONENTE: LIVE COACH (Voz en Tiempo Real)
// ============================================================================
// Utiliza la API Multimodal Live de Gemini para establecer una conexión WebSocket.
// Captura audio del micrófono, lo envía a Gemini, y reproduce la respuesta de audio.
// ============================================================================

const LiveCoach: React.FC = () => {
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [transcription, setTranscription] = useState<string[]>([]);
    const [currentInterim, setCurrentInterim] = useState(''); // Transcripción parcial en tiempo real

    // Referencias para manejar la sesión y el audio
    const sessionPromiseRef = useRef<Promise<any> | null>(null);
    const audioStreamRef = useRef<MediaStream | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);

    // Iniciar Sesión de Voz
    const startSession = async () => {
        // Validación de API Key
        // @ts-ignore
        if (!import.meta.env.VITE_GEMINI_API_KEY) {
            alert("La clave API no está configurada.");
            return;
        }

        try {
            // Acceder al micrófono
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioStreamRef.current = stream;

            // Inicializar Cliente GenAI
            // @ts-ignore
            const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

            // Configurar contextos de audio (Entrada 16kHz, Salida 24kHz)
            const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            inputAudioContextRef.current = inputAudioContext;
            const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            const outputNode = outputAudioContext.createGain();
            outputNode.connect(outputAudioContext.destination);

            let nextStartTime = 0;
            const sources = new Set<AudioBufferSourceNode>();

            // Conectar a la API Live
            const sessionPromise = ai.live.connect({
                model: 'gemini-2.0-flash', // Modelo actualizado a 2.0 estable para 2026
                callbacks: {
                    onopen: () => {
                        setIsSessionActive(true);
                        setTranscription(['AI: ¡Hola! Soy tu coach de voz. ¿En qué puedo ayudarte?']);

                        // Configurar procesador de audio para capturar y enviar blobs
                        const source = inputAudioContext.createMediaStreamSource(stream);
                        sourceNodeRef.current = source;
                        const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
                        scriptProcessorRef.current = scriptProcessor;

                        scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const l = inputData.length;
                            const int16 = new Int16Array(l);
                            for (let i = 0; i < l; i++) {
                                int16[i] = inputData[i] * 32768; // Convertir float32 a int16 PCM
                            }
                            const pcmBlob: GenAIBlob = {
                                data: encode(new Uint8Array(int16.buffer)),
                                mimeType: 'audio/pcm;rate=16000',
                            };

                            sessionPromise.then((session) => {
                                session.sendRealtimeInput({ media: pcmBlob });
                            });
                        };
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(inputAudioContext.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        // Manejar transcripción parcial del usuario
                        if (message.serverContent?.inputTranscription) {
                            setCurrentInterim(message.serverContent.inputTranscription.text || '');
                        }
                        // Turno completado (usuario dejó de hablar)
                        if (message.serverContent?.turnComplete) {
                            const userInput = currentInterim;
                            if (userInput) setTranscription(prev => [...prev, `Tú: ${userInput}`]);
                            setCurrentInterim('');
                        }
                        // Recibir audio de respuesta
                        const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                        if (base64Audio) {
                            // Mostrar texto de respuesta si está disponible
                            if (message.serverContent?.modelTurn?.parts?.[0]?.text) {
                                setTranscription(prev => [...prev, `AI: ${message.serverContent?.modelTurn?.parts?.[0]?.text}`]);
                            }
                            // Reproducir audio
                            nextStartTime = Math.max(nextStartTime, outputAudioContext.currentTime);
                            const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContext, 24000, 1);
                            const source = outputAudioContext.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(outputNode);
                            source.addEventListener('ended', () => sources.delete(source));
                            source.start(nextStartTime);
                            nextStartTime += audioBuffer.duration;
                            sources.add(source);
                        }
                    },
                    onerror: (e) => {
                        console.error('Live session error:', e);
                        setTranscription(prev => [...prev, 'Error: Hubo un problema con la conexión.']);
                        stopSession();
                    },
                    onclose: () => {
                        stopSession();
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO], // Pedimos respuesta en audio
                    inputAudioTranscription: {}, // Habilitamos transcripción del input
                },
            });
            sessionPromiseRef.current = sessionPromise;

        } catch (error) {
            console.error('Failed to start session:', error);
            alert('No se pudo acceder al micrófono. Por favor, verifica los permisos.');
        }
    };

    // Detener sesión y limpiar recursos
    const stopSession = () => {
        sessionPromiseRef.current?.then((session: any) => session.close());
        sessionPromiseRef.current = null;

        audioStreamRef.current?.getTracks().forEach(track => track.stop());
        audioStreamRef.current = null;

        scriptProcessorRef.current?.disconnect();
        scriptProcessorRef.current = null;
        sourceNodeRef.current?.disconnect();
        sourceNodeRef.current = null;

        inputAudioContextRef.current?.close();
        inputAudioContextRef.current = null;

        setIsSessionActive(false);
        setCurrentInterim('');
    };

    // Limpieza al desmontar
    useEffect(() => {
        return () => {
            if (isSessionActive) {
                stopSession();
            }
        };
    }, [isSessionActive]);

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 transition-colors">
            <h3 className="font-bold text-slate-800 dark:text-white mb-2 text-lg">🎙️ AI Live Coach</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Habla directamente con tu coach para obtener respuestas y motivación al instante.</p>

            <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg min-h-[150px] max-h-[300px] overflow-y-auto text-sm text-slate-700 dark:text-slate-200 space-y-2 border border-slate-200 dark:border-slate-700">
                {transcription.map((line, index) => <p key={index}>{line}</p>)}
                {currentInterim && <p className="text-slate-500 dark:text-slate-400 italic">Tú: {currentInterim}...</p>}
            </div>

            <div className="mt-4">
                {!isSessionActive ? (
                    <button onClick={startSession} className="w-full flex items-center justify-center gap-2 bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors shadow-lg hover:shadow-green-500/20">
                        <MicIcon /> Iniciar Conversación
                    </button>
                ) : (
                    <button onClick={stopSession} className="w-full flex items-center justify-center gap-2 bg-red-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-600 transition-colors shadow-lg hover:shadow-red-500/20">
                        <StopIcon /> Detener Conversación
                    </button>
                )}
            </div>
        </div>
    );
}

// ----------------------------------------------------------------------------
// Componente Principal: AIWellnessHub
// ----------------------------------------------------------------------------

interface AIWellnessHubProps {
    user: User;
}

export const AIWellnessHub: React.FC<AIWellnessHubProps> = ({ user }) => {
    // Mensaje de bienvenida inicial
    const [messages, setMessages] = useState<ChatMessage[]>([
        { sender: 'ai', text: `¡Hola, ${user.name.split(' ')[0]}! 👋 Soy tu Coach de Bienestar de FitnessFlow.\n\nEstoy aquí para ayudarte con tus dudas sobre fitness, nutrición o para darte un empujón de motivación. ¿En qué te puedo ayudar hoy?`, }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll al final del chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Manejo de envío de mensajes de texto
    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;

        const userMessage: ChatMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        try {
            // Llamada al servicio Gemini
            const { text, sources } = await getAICoachResponse(currentInput, user.name);
            const aiMessage: ChatMessage = { sender: 'ai', text, sources };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage: ChatMessage = { sender: 'ai', text: 'Lo siento, hubo un error al procesar tu solicitud.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 animate-fade-in">
            <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white transition-colors">Centro de Bienestar AI</h1>
                <p className="mt-2 text-lg text-slate-600 dark:text-slate-300 transition-colors max-w-2xl">Tu espacio para el equilibrio entre mente y cuerpo.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Columna Principal: Chat */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 flex flex-col h-[70vh] lg:h-auto transition-colors">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                            <AiIcon />
                            <div>
                                <h2 className="font-bold text-slate-800 dark:text-white">Coach de Bienestar FitnessFlow ✨</h2>
                                <p className="text-sm text-green-600 dark:text-green-400 font-semibold">En línea</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-grow p-4 overflow-y-auto bg-slate-50 dark:bg-slate-900 h-96 transition-colors">
                        {messages.map((msg, index) => (
                            msg.sender === 'ai' ? <AIMessage key={index} message={msg} /> : <UserMessage key={index} text={msg.text} name={user.name} />
                        ))}
                        {/* Indicador de carga animado */}
                        {isLoading && (
                            <div className="flex gap-3 my-4">
                                <AiIcon />
                                <div className="bg-white dark:bg-slate-700 p-3 rounded-lg rounded-tl-none shadow-sm border border-slate-200 dark:border-slate-600">
                                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:0.1s]"></div>
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-b-xl transition-colors">
                        <div className="relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Escribe tu pregunta sobre bienestar..."
                                className="w-full pl-4 pr-12 py-3 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-full text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 focus:ring-2 focus:ring-brand-primary focus:outline-none transition-colors"
                                disabled={isLoading}
                            />
                            <button onClick={handleSend} disabled={isLoading} className="absolute inset-y-0 right-0 flex items-center justify-center w-12 h-full text-white bg-brand-primary rounded-full hover:bg-brand-secondary disabled:bg-slate-400 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Columna Sidebar: Widgets */}
                <div className="space-y-8">
                    <DailyTip />
                    <LiveCoach />
                </div>
            </div>
        </div>
    );
};
