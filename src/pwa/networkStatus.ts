import { useSyncExternalStore } from 'react';

let online = typeof navigator !== 'undefined' ? navigator.onLine : true;
const listeners = new Set<() => void>();

function notify() {
  for (const fn of listeners) fn();
}

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => { online = true; notify(); });
  window.addEventListener('offline', () => { online = false; notify(); });
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot(): boolean {
  return online;
}

export function useOnlineStatus(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => true);
}
