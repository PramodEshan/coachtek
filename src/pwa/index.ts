export { PWA_PAUSE_EVENT, PWA_RESUME_EVENT } from './lifecycle';
export { PWA_UPDATE_EVENT } from './register';
export { useOnlineStatus } from './networkStatus';
export { isStandalone } from './standalone';

import { applyStandaloneClass } from './standalone';
import { initLifecycle } from './lifecycle';
import { runCacheMigration } from './cacheMigration';
import { registerPwa } from './register';

export function initPwa(): void {
  applyStandaloneClass();
  initLifecycle();

  if (import.meta.env.PROD) {
    runCacheMigration();
  }

  registerPwa();
}
