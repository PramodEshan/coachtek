import { useEffect } from 'react';
import { PWA_PAUSE_EVENT } from '@/pwa';

export function usePwaPause(onPause: () => void) {
  useEffect(() => {
    const handler = () => onPause();
    window.addEventListener(PWA_PAUSE_EVENT, handler);
    return () => window.removeEventListener(PWA_PAUSE_EVENT, handler);
  }, [onPause]);
}
