import { registerSW } from 'virtual:pwa-register';
import { cleanupDevCaches } from './cacheMigration';

export const PWA_UPDATE_EVENT = 'coachtek:pwa-update-available';

export function registerPwa(): void {
  if (!import.meta.env.PROD) {
    cleanupDevCaches();
    return;
  }

  registerSW({
    immediate: true,
    onRegistered(registration) {
      if (!registration) return;
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          void registration.update();
        }
      });
    },
    onNeedRefresh() {
      window.dispatchEvent(new CustomEvent(PWA_UPDATE_EVENT));
    },
    onOfflineReady() {
      // Cache ready — nothing to surface.
    },
  });
}
