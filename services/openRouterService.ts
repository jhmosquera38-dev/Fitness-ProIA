
// openRouterService.ts
export const openRouterService = {
    async generateContent(prompt: string, systemInstruction: string = "", jsonMode: boolean = false) {
        const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
        if (!apiKey) {
            throw new Error("OpenRouter API Key is missing");
        }

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": window.location.origin, // Required by OpenRouter
                "X-Title": "FitnessFlow SaaS",
            },
            body: JSON.stringify({
                model: "google/gemini-2.0-flash-exp:free", // Reliable free fallback
                messages: [
                    ...(systemInstruction ? [{ role: "system", content: systemInstruction }] : []),
                    { role: "user", content: prompt }
                ],
                response_format: jsonMode ? { type: "json_object" } : undefined,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`OpenRouter Error: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        return {
            text: data.choices[0].message.content,
            usage: data.usage
        };
    }
};
