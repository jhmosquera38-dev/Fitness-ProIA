
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// ============================================================================
// CONFIGURACIÓN DE VITE (vite.config.ts)
// ============================================================================
// PWA Manifest CORREGIDO para habilitar instalación.

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    root: '.',
    appType: 'spa',
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: {
          enabled: true, // Reactivated for testing/development
          type: 'module',
        },
        includeAssets: ['favicon.svg', 'robots.txt'],
        manifest: {
          name: 'FitnessFlow Pro',
          short_name: 'FitnessFlow',
          description: 'Tu entrenador personal y coach de bienestar impulsado por IA.',
          theme_color: '#ffffff',
          background_color: '#ffffff',
          display: 'standalone',
          start_url: '/Fitness-ProIA/', // Updated to match base path
          orientation: 'portrait',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ]
        }
      })
    ],
    base: '/Fitness-ProIA/',
    define: {
      'process.env.API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY || '')
    }
  };
});