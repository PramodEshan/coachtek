import { useOnlineStatus } from '@/pwa';

export function OfflineNotice() {
  const online = useOnlineStatus();

  if (online) return null;

  return (
    <div className="ct-pwa-offline-banner">
      <span className="ct-pwa-banner-text">You're offline — showing saved data</span>
      <button type="button" className="ct-pwa-banner-action" onClick={() => window.location.reload()}>
        Retry
      </button>
    </div>
  );
}
