/**
 * Service Worker Registration
 * Registers the PWA service worker for offline support.
 */

export function registerServiceWorker(): void {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[SW] Registered:', registration.scope);

          // Check for updates periodically
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (
                  newWorker.state === 'activated' &&
                  navigator.serviceWorker.controller
                ) {
                  console.log('[SW] New version available — refresh to update.');
                }
              });
            }
          });
        })
        .catch((error) => {
          console.warn('[SW] Registration failed:', error);
        });
    });
  }
}
