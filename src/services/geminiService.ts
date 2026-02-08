import { GoogleGenerativeAI } from "@google/generative-ai";
import { type UserProfile, type WorkoutPlan, type DailyCheckin, type AIInsight } from '../types';
import { openRouterService } from './openRouterService';

// ============================================================================
// SERVICIO GEMINI (Standard Web SDK)
// Usando @google/generative-ai para mayor compatibilidad y estabilidad.
// ============================================================================

let genAI: GoogleGenerativeAI | null = null;
try {
    // @ts-ignore
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (apiKey && typeof apiKey === 'string' && apiKey.length > 0) {
        genAI = new GoogleGenerativeAI(apiKey);
    }
} catch (e) {
    console.warn("Gemini API client could not be initialized:", e);
}

const generatePrompt = (profile: UserProfile, dailyStatus?: DailyCheckin): string => {
    const goalMap: any = {
        build_muscle: 'ganar músculo y aumentar la fuerza (hipertrofia)',
        lose_fat: 'perder grasa y mejorar la salud cardiovascular (pérdida de peso)',
        improve_endurance: 'mejorar la resistencia muscular y cardiovascular',
        general_fitness: 'mantener un estado físico general y bienestar'
    };
    const levelMap: any = {
        beginner: 'un principiante',
        intermediate: 'un intermedio',
        advanced: 'un atleta avanzado'
    };

    let context = "";
    if (dailyStatus) {
        context = `STATUS: Energy ${dailyStatus.energyLevel}/10, Sleep ${dailyStatus.sleepQuality}, Soreness ${dailyStatus.soreness}. Adapt intensity accordingly.`;
    }

    const schemaExample = {
        weeklyPlan: [
            {
                day: "Lunes",
                focus: "Pecho y Tríceps",
                warmUp: "5 min cardio suave + rotaciones de hombro",
                exercises: [
                    { name: "Press de Banca", sets: 3, reps: "10-12", rest: 60, description: "Barra a la altura del pecho...", imageSearchQuery: "bench press form" }
                ],
                coolDown: "Estiramiento estático 5 min"
            }
        ]
    };

    return `
    Create a personalized workout plan for ${profile.daysPerWeek} days a week.
    User Goal: ${goalMap[profile.goal || 'general_fitness']}.
    Level: ${levelMap[profile.level || 'beginner']}.
    Days/Week: ${profile.daysPerWeek}.
    Equipment: ${profile.equipment.join(', ')}.
    ${context}
    
    IMPORTANT: You must return a VALID JSON object matching exactly this structure:
    ${JSON.stringify(schemaExample, null, 2)}
    
    Requirements:
    - The 'weeklyPlan' array MUST have exactly ${profile.daysPerWeek} entries.
    - All text in Spanish.
    - 'imageSearchQuery' must be in English for better results.
    - Do NOT wrap the JSON in markdown code blocks. Just return the raw JSON string.
    `;
};

// ----------------------------------------------------------------------------
// MODEL FALLBACK SYSTEM
// ----------------------------------------------------------------------------
const MODEL_CANDIDATES = [
    "gemini-1.5-flash-001",   // Stable Flash version
    "gemini-1.5-flash-002",   // Newer Flash version (if available)
    "gemini-1.5-pro-001",     // Stable Pro version
    "gemini-1.5-flash"        // Generic alias (last resort)
];

async function safeModelExecute(
    callback: (model: string) => Promise<any>,
    options: { systemInstruction?: string; jsonMode?: boolean; prompt?: string } = {}
): Promise<any> {
    let lastError: any = null;

    // Phase 1: Try Direct Gemini Models
    for (const modelName of MODEL_CANDIDATES) {
        try {
            console.log(`[Gemini] Attempting with model: ${modelName}`);
            return await callback(modelName);
        } catch (error: any) {
            lastError = error;
            console.warn(`[Gemini] Failed with ${modelName}:`, error.message || error);

            // Should we retry? 
            // If it's a 404 (Model not found) or 503 (Overloaded), we try the next candidate.
            // If it's a 400 (Bad Request), it might be the prompt, but we usually try next model anyway just in case specific model param is wrong.
        }
    }

    console.warn("[Gemini] All direct models failed. Switching to OpenRouter...");

    // Phase 2: Ultimate Fallback - OpenRouter (if API key available)
    try {
        const orKey = import.meta.env.VITE_OPENROUTER_API_KEY;
        if (orKey && options.prompt) {
            console.log("Switching to OpenRouter Fallback...");
            const result = await openRouterService.generateContent(
                options.prompt,
                options.systemInstruction || "",
                options.jsonMode || false
            );

            if (options.jsonMode) {
                return JSON.parse(result.text.replace(/```json|```/g, '').trim());
            }
            return result.text;
        }
    } catch (orError: any) {
        if (orError.message.includes("User not found")) {
            console.error("OpenRouter Critical Error: API Key invalid or User not found.");
        } else {
            console.error("OpenRouter Fallback failed:", orError);
        }
    }

    throw lastError; // If everything fails
}


const getFallbackWorkoutPlan = (days: number, goal: string): WorkoutPlan => {
    return {
        weeklyPlan: Array.from({ length: Math.max(1, days || 3) }).map((_, i) => ({
            day: `Día ${i + 1} (Modo Offline)`,
            focus: i % 2 === 0 ? `Fuerza - ${goal === 'build_muscle' ? 'Hipertrofia' : 'General'}` : "Cardio y Recuperación",
            warmUp: "5-10 min de movilidad articular y cardio ligero.",
            exercises: [
                {
                    name: "Sentadillas con Peso Corporal",
                    sets: 4,
                    reps: "12-15",
                    rest: 60,
                    description: "Mantén la espalda recta y baja hasta romper el paralelo.",
                    imageSearchQuery: "squats exercise stock"
                },
                {
                    name: "Flexiones (Push-ups)",
                    sets: 3,
                    reps: "Al fallo",
                    rest: 60,
                    description: "Cuerpo alineado, baja el pecho hasta el suelo.",
                    imageSearchQuery: "pushups exercise"
                },
                {
                    name: "Plancha Abdominal",
                    sets: 3,
                    reps: "45 seg",
                    rest: 45,
                    description: "Contrae el abdomen y mantén la posición.",
                    imageSearchQuery: "plank exercise"
                }
            ],
            coolDown: "5 min de estiramientos estáticos y respiración."
        }))
    };
};

export const generateWorkoutPlan = async (profile: UserProfile, dailyStatus?: DailyCheckin): Promise<WorkoutPlan> => {
    if (!genAI) {
        console.warn("API Key missing, using fallback.");
        return getFallbackWorkoutPlan(profile.daysPerWeek, profile.goal);
    }

    const aiPrompt = generatePrompt(profile, dailyStatus) + "\n\nIMPORTANT: Return ONLY valid JSON.";
    try {
        return await safeModelExecute(async (modelName) => {
            const model = genAI!.getGenerativeModel({
                model: modelName,
                generationConfig: { responseMimeType: "application/json" }
            });

            const result = await model.generateContent(aiPrompt);
            const response = await result.response;
            const text = response.text();

            const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(cleanedText);
        }, { prompt: aiPrompt, jsonMode: true });
    } catch (error) {
        return getFallbackWorkoutPlan(profile.daysPerWeek, profile.goal);
    }
};

export const generateContextualInsight = async (status: DailyCheckin, userName: string): Promise<AIInsight> => {
    if (!genAI) {
        return {
            type: 'performance',
            title: 'Listo para entrenar',
            message: 'Todo se ve bien. ¡A darle!',
            actionLabel: 'Entrenar',
            suggestedActivity: 'Entrenamiento'
        };
    }

    const aiPrompt = `
            Analiza estado: Energía ${status.energyLevel}/10, Sueño ${status.sleepQuality}, Dolor ${status.soreness}, Ánimo ${status.mood}.
            Usuario: ${userName}.
            Genera un insight corto y motivador en formato JSON válido con las propiedades: type, title, message, actionLabel, suggestedActivity.
            Response must be pure JSON.
            `;
    try {
        return await safeModelExecute(async (modelName) => {
            const model = genAI!.getGenerativeModel({
                model: modelName,
                generationConfig: { responseMimeType: "application/json" }
            });

            const result = await model.generateContent(aiPrompt);
            const text = result.response.text().replace(/```json|```/g, '').trim();
            return JSON.parse(text) as AIInsight;
        }, { prompt: aiPrompt, jsonMode: true });
    } catch (error) {
        console.error("Error generating insight:", error);
        return { type: 'motivation', title: `Vamos ${userName}`, message: 'Haz lo mejor que puedas hoy.', actionLabel: 'Entrenar' };
    }
};

export const getAICoachResponse = async (prompt: string, userName: string = 'Usuario'): Promise<{ text: string; sources: { uri: string; title: string; }[] }> => {
    if (!genAI) {
        return { text: "Error: API Key no configurada.", sources: [] };
    }

    const systemInstruction = `
            Eres el AI Coach de FitnessFlow Pro.
            Estás hablando con ${userName}.
            Responde en español, sé motivador, amigable y experto.
            Usa emojis. Sé conciso. No des consejos médicos.
            `;

    const fullPrompt = `${systemInstruction}\n\nUser: ${prompt}`;

    try {
        const response = await safeModelExecute(async (modelName) => {
            // Note: System instructions are supported in newer models, but we bake it into prompt for safety
            const model = genAI!.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(fullPrompt);
            return { text: result.response.text(), sources: [] };
        }, { prompt: fullPrompt, systemInstruction });

        return typeof response === 'string' ? { text: response, sources: [] } : response;

    } catch (error: any) {
        console.error("AI Chat Error:", error);

        let msg = `Lo siento, hubo un error técnico. Por favor verifica tu conexión.`;
        if (error.message?.includes('429') || error.status === 429) {
            msg = `⏳ Estoy recibiendo demasiadas solicitudes. Por favor, intenta de nuevo en unos segundos.`;
        } else if (error.message?.includes('404') || error.status === 404) {
            msg = `🔧 Estamos actualizando los modelos de IA. Intenta de nuevo en un momento.`;
        } else if (error.message?.includes('API key') || error.toString().includes('API key')) {
            msg = `🔑 Error de configuración de API Key. Por favor verifica tu archivo .env.local.`;
        }
        return { text: msg, sources: [] };
    }
};

export const getDailyWellnessTip = async (): Promise<string> => {
    if (!genAI) return "¡Mantente activo y bebe agua!";
    const tipPrompt = "Genera un consejo de fitness corto y motivador para hoy en español.";
    try {
        return await safeModelExecute(async (modelName) => {
            const model = genAI!.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(tipPrompt);
            return result.response.text();
        }, { prompt: tipPrompt });
    } catch (e) {
        return "El descanso es clave para el progreso.";
    }
};

// ... keep video stubs ...
export const generateFitnessVideoPreview = async (_prompt: string) => null;
// @ts-ignore
export const analyzeVideoContent = async (video: string, prompt: string) => "Análisis de video temporalmente no disponible.";

export const findGymsWithGemini = async (prompt: string, location: { latitude: number; longitude: number }): Promise<{ text: string; sources: { uri: string; title: string; }[] }> => {
    const searchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(prompt + ' gym')}&query_place_id=${location.latitude},${location.longitude}`;
    return {
        text: `He encontrado opciones para "${prompt}" cerca de tu ubicación. Puedes ver los resultados detallados directamente en Google Maps.`,
        sources: [
            { uri: searchUrl, title: `Ver resultados para "${prompt}" en Google Maps` },
            { uri: "https://maps.google.com/?q=Gimnasios+Cercanos", title: "Explorar todos los gimnasios cercanos" }
        ]
    };
};


export const getGymAdminAdvice = async (prompt: string): Promise<{ text: string; sources: { uri: string; title: string; }[] }> => {
    if (!genAI) {
        return { text: "⚠️ API Key no configurada. Verifica tu archivo .env.local", sources: [] };
    }

    const systemInstruction = `
            Eres un Consultor Experto en Gestión de Gimnasios y Negocios Fitness.
            Tu objetivo es ayudar al administrador del gimnasio "El Templo" a optimizar su negocio.
            
            Tus áreas de expertise incluyen:
            - Retención de clientes y reducción de tasa de abandono (churn).
            - Marketing fitness y ventas.
            - Gestión financiera y operativa.
            - Planes de contingencia y resolución de crisis.
            - Mantenimiento y gestión de inventario.

            Reglas:
            1. Responde siempre en Español profesional pero accesible.
            2. Sé práctico y directo. Da consejos accionables (paso a paso).
            3. Si preguntan por temas legales o médicos específicos, sugiere consultar a un especialista local.
            4. Usa formato Markdown (negritas, listas) para facilitar la lectura.
            `;

    const fullPrompt = `${systemInstruction}\n\nPregunta del Administrador: ${prompt}`;

    try {
        const response = await safeModelExecute(async (modelName) => {
            const model = genAI!.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(fullPrompt);
            return { text: result.response.text(), sources: [] };
        }, { prompt: fullPrompt, systemInstruction });

        return typeof response === 'string' ? { text: response, sources: [] } : response;

    } catch (error: any) {
        console.error("AI Admin Chat Error:", error);
        return { text: "Lo siento, hubo un error al consultar al asistente. Por favor intenta de nuevo.", sources: [] };
    }
};

export const generateServiceImageMetadata = async (name: string, description: string): Promise<{ keyword: string }> => {
    if (!genAI) return { keyword: 'fitness' };

    const aiPrompt = `
            Act as a Search Engine Optimization expert for stock images.
            Service Name: "${name}"
            Description: "${description}"
            
            Task: Provide a SINGLE English keyword or short 2-word phrase that best helps find a high-quality relevant image on Unsplash for this fitness service.
            Example inputs -> outputs:
            "Yoga at Sunrise" -> "yoga sunrise"
            "High Intensity Interval Training" -> "crossfit gym"
            "Nutritional Coaching" -> "healthy food"
            
            Return ONLY the keyword. No json, no quotes.
            `;
    try {
        return await safeModelExecute(async (modelName) => {
            const model = genAI!.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(aiPrompt);
            const keyword = (result.response.text() || "fitness").trim().replace(/"/g, '');
            return { keyword };
        }, { prompt: aiPrompt });
    } catch (error) {
        console.error("Image Gen Error:", error);
        return { keyword: 'fitness' };
    }
};
