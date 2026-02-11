
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// ============================================================================
// CONFIGURACIÓN DE VITE (vite.config.ts)
// ============================================================================
// PWA Manifest CORREGIDO para habilitar instalación.

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  // Detección dinámica de entorno para la base del app
  // Si estamos en Vercel o en desarrollo local, la base es raíz (/).
  // Si estamos compilando para GitHub Pages (sin VERCEL env), usamos el subdirectorio.
  const isVercel = !!process.env.VERCEL || !!env.VITE_VERCEL;
  const base = (mode === 'production' && !isVercel) ? '/Fitness-ProIA/' : '/';

  console.log(`[ViteConfig] Mode: ${mode}, Base PATH: ${base}`);
  return {
    root: '.',
    appType: 'spa',
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: {
          enabled: true,
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
          start_url: base,
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
        },
        workbox: {
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/openrouter\.ai\/api\/v1\/.*/i,
              handler: 'NetworkOnly',
              options: {
                backgroundSync: {
                  name: 'openrouter-queue',
                  options: {
                    maxRetentionTime: 24 * 60
                  }
                }
              }
            },
            {
              urlPattern: /^https:\/\/generativelanguage\.googleapis\.com\/.*/i,
              handler: 'NetworkOnly'
            }
          ]
        }
      })
    ],
    base: base,
    build: {
      outDir: 'dist'
    },
    server: {
      port: 3001,
      host: true
    },
    define: {
      'process.env.API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY || '')
    }
  };
});