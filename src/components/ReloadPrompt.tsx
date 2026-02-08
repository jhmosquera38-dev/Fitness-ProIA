
import React, { useEffect, useState } from 'react';

export const ReloadPrompt: React.FC = () => {
  // Replaced virtual module hook with local state to prevent build/runtime errors
  // in environments that don't support virtual:pwa-register/react
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);

  useEffect(() => {
    // Manual Service Worker Registration fallback
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration()
        .then((reg) => {
          if (reg) {
            // Check for updates manually if needed
            reg.addEventListener('updatefound', () => {
              const newWorker = reg.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    setNeedRefresh(true);
                  }
                });
              }
            });
          }
        })
        .catch((err) => console.log('SW registration check failed', err));
    }
  }, []);

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  const updateServiceWorker = (reloadPage?: boolean) => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
        }
        if (reloadPage) {
          window.location.reload();
        }
      });
    }
  };

  if (!offlineReady && !needRefresh) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[10000] bg-slate-800 dark:bg-white text-white dark:text-slate-900 p-4 rounded-xl shadow-2xl border border-slate-700 flex flex-col gap-3 max-w-xs animate-slide-up">
      <div className="flex items-start gap-3">
        <div className="text-2xl">
          {offlineReady ? '✅' : '🚀'}
        </div>
        <div>
          <h4 className="font-bold text-sm">
            {offlineReady ? 'Lista para usar offline' : 'Nueva versión disponible'}
          </h4>
          <p className="text-xs opacity-80 mt-1">
            {offlineReady
              ? 'La aplicación ha sido guardada en tu dispositivo.'
              : 'Haz clic en actualizar para ver las últimas mejoras.'}
          </p>
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        {needRefresh && (
          <button
            onClick={() => updateServiceWorker(true)}
            className="bg-brand-primary text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity"
          >
            Actualizar
          </button>
        )}
        <button
          onClick={close}
          className="px-3 py-1.5 rounded-lg text-xs opacity-70 hover:opacity-100 hover:bg-slate-700/10 transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};