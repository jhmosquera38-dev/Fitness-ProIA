
/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

// ============================================================================
// CLIENTE DE SUPABASE (supabaseClient.ts)
// ============================================================================
// Inicializa la conexión con el backend de Supabase.
// Requiere las variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.
// ============================================================================

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
        '⚠️ Faltan las credenciales de Supabase en .env.local (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY). La autenticación real no funcionará.'
    );
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder-url.supabase.co',
    supabaseAnonKey || 'placeholder-key'
);
