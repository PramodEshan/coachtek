import { useEffect, useState } from 'react';
import { PWA_UPDATE_EVENT } from '@/pwa';

export function UpdateBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(true);
    window.addEventListener(PWA_UPDATE_EVENT, handler);
    return () => window.removeEventListener(PWA_UPDATE_EVENT, handler);
  }, []);

  const restart = () => {
    navigator.serviceWorker?.ready.then((reg) => {
      reg.waiting?.postMessage({ type: 'SKIP_WAITING' });
    });

    let reloaded = false;
    navigator.serviceWorker?.addEventListener('controllerchange', () => {
      if (reloaded) return;
      reloaded = true;
      window.location.reload();
    });
  };

  if (!visible) return null;

  return (
    <div className="ct-pwa-update-banner">
      <span>A new version is ready</span>
      <button type="button" className="ct-pwa-banner-action" onClick={restart}>
        Restart
      </button>
      <button type="button" className="ct-pwa-banner-close" onClick={() => setVisible(false)} aria-label="Later">
        ×
      </button>
    </div>
  );
}
