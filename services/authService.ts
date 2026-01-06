import { supabase } from '../src/lib/supabaseClient';

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
        let redirectTo = `${window.location.origin}/`;

        // Append intent to URL if provided to persist across redirect
        if (accountType) {
            redirectTo += `?intent=${accountType}`;
        }

        console.log("Iniciando OAuth con RedirectTo:", redirectTo);

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
