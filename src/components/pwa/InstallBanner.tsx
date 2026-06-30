import { useEffect, useState } from 'react';
import { isStandalone } from '@/pwa';

const DISMISS_KEY = 'coachtek-install-dismissed';
const DISMISS_DAYS = 7;

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function isIosSafari(): boolean {
  const ua = navigator.userAgent;
  return /iP(hone|od|ad)/.test(ua) && /WebKit/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
}

function isDismissed(): boolean {
  const ts = localStorage.getItem(DISMISS_KEY);
  if (!ts) return false;
  return Date.now() - Number(ts) < DISMISS_DAYS * 86400000;
}

export function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHint, setShowIosHint] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    if (isStandalone() || isDismissed()) return;

    setDismissed(false);

    if (isIosSafari()) {
      setShowIosHint(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setDismissed(true);
    setDeferredPrompt(null);
    setShowIosHint(false);
  };

  const install = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') dismiss();
    setDeferredPrompt(null);
  };

  if (dismissed) return null;

  if (showIosHint) {
    return (
      <div className="ct-pwa-banner">
        <div className="ct-pwa-banner-text">
          Install CoachTek: tap{' '}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'text-bottom' }}>
            <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" />
          </svg>{' '}
          then "Add to Home Screen"
        </div>
        <button type="button" className="ct-pwa-banner-close" onClick={dismiss} aria-label="Dismiss">
          ×
        </button>
      </div>
    );
  }

  if (!deferredPrompt) return null;

  return (
    <div className="ct-pwa-banner">
      <div className="ct-pwa-banner-text">Install CoachTek for the best experience</div>
      <button type="button" className="ct-pwa-banner-action" onClick={install}>
        Install
      </button>
      <button type="button" className="ct-pwa-banner-close" onClick={dismiss} aria-label="Dismiss">
        ×
      </button>
    </div>
  );
}
