import { supabase } from '../lib/supabaseClient';

// ============================================================================
// SERVICIO DE AUTENTICACIÓN (authService.ts)
// ============================================================================
// Gestiona la autenticación con Supabase.
// ============================================================================

export const authService = {
    /**
     * Inicia el flujo de autenticación con Google (OAuth).
     * Redirige al usuario a la página de Google.
     * @param accountType - El tipo de cuenta (intent) para persistir tras el redirect.
     */
    /**
     * Inicia el flujo de autenticación con Google (OAuth).
     * Redirige al usuario a la página de Google.
     * @param accountType - El tipo de cuenta (intent) para persistir tras el redirect.
     */
    loginWithGoogle: async (accountType?: string) => {
        // Construir URL de redirección base
        // Detectar si estamos en localhost para forzar la raíz, ignorando el BASE_URL de producción si fuera necesario
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const baseUrl = isLocal ? '/' : (import.meta.env.BASE_URL || '/');

        // Asegurar que la URL sea limpia (sin barras triples)
        const origin = window.location.origin;
        const cleanBase = baseUrl.startsWith('/') ? baseUrl : `/${baseUrl}`;
        let redirectTo = `${origin}${cleanBase}`.replace(/\/+$/, '/');

        // Append intent to URL if provided to persist across redirect
        if (accountType) {
            redirectTo += (redirectTo.includes('?') ? '&' : '?') + `intent=${accountType}`;
        }

        console.log("DEBUG: origin =", origin);
        console.log("DEBUG: baseUrl =", baseUrl);
        console.log("DEBUG: Final redirectTo =", redirectTo);

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: redirectTo,
                // Inyectar el tipo de cuenta en los metadatos del usuario (Crucial para registro inicial)
                ...(accountType ? { data: { account_type: accountType } } : {}),
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
            },
        });

        if (error) {
            console.error("Error en login con Google:", error);
            throw error;
        }

        return data;
    },

    /**
     * Obtiene el usuario actual de la sesión de Supabase.
     */
    getCurrentUser: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    },

    /**
     * Cierra la sesión activa.
     */
    logout: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    }
};
