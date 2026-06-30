const VERSION_KEY = 'coachtek-app-version';
const RELOAD_FLAG = 'ct-cache-migrated';

function currentVersion(): string {
  try {
    return __APP_VERSION__;
  } catch {
    return 'unknown';
  }
}

async function purgeAllCaches(): Promise<void> {
  if ('serviceWorker' in navigator) {
    const regs = await navigator.serviceWorker.getRegistrations();
    await Promise.all(regs.map((r) => r.unregister()));
  }

  if ('caches' in window) {
    const names = await caches.keys();
    await Promise.all(names.map((n) => caches.delete(n)));
  }
}

export function runCacheMigration(): void {
  const version = currentVersion();
  const stored = localStorage.getItem(VERSION_KEY);

  if (stored === version) {
    return;
  }

  localStorage.setItem(VERSION_KEY, version);

  if (stored === null) {
    // First install — nothing to migrate, just stamp the version.
    return;
  }

  // Version mismatch — purge stale SW + caches, reload once.
  if (sessionStorage.getItem(RELOAD_FLAG)) {
    sessionStorage.removeItem(RELOAD_FLAG);
    return;
  }

  void purgeAllCaches().then(() => {
    sessionStorage.setItem(RELOAD_FLAG, '1');
    location.reload();
  });
}

export function cleanupDevCaches(): void {
  if (!('serviceWorker' in navigator)) return;

  navigator.serviceWorker.getRegistrations().then((regs) => {
    for (const r of regs) r.unregister();
  });

  if ('caches' in window) {
    caches.keys().then((names) => {
      for (const n of names) caches.delete(n);
    });
  }

  localStorage.removeItem(VERSION_KEY);
  sessionStorage.removeItem(RELOAD_FLAG);
}
