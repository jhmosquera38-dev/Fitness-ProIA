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
        // URL de redirección 100% DINÁMICA
        // Esto permite que funcione en localhost, con tu IP local (192.168...) o en el repositorio GitHub.
        const origin = window.location.origin;
        const path = window.location.pathname;

        // Mantener la estructura limpia, asegurando que termine en / si es la raíz
        let redirectTo = `${origin}${path}`.replace(/\/$/, '') + '/';

        // Persistir el 'intent' (accountType) en la URL para recuperarlo tras el redirect
        if (accountType) {
            redirectTo += `?intent=${accountType}`;
        }

        console.log("DEBUG: origin =", origin);
        console.log("DEBUG: path =", path);
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
