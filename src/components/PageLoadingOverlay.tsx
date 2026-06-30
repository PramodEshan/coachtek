import { useEffect, useState } from 'react';

const FADE_OUT_MS = 280;

type OverlayPhase = 'hidden' | 'visible' | 'leave';

export function PageLoadingOverlay({ active }: { active: boolean }) {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<OverlayPhase>('hidden');

  useEffect(() => {
    if (active) {
      setMounted(true);
      setPhase('visible');
      return undefined;
    }

    if (!mounted) return undefined;

    setPhase('leave');
    return undefined;
  }, [active, mounted]);

  useEffect(() => {
    if (phase !== 'leave') return undefined;

    const timer = window.setTimeout(() => {
      setMounted(false);
      setPhase('hidden');
    }, FADE_OUT_MS);

    return () => window.clearTimeout(timer);
  }, [phase]);

  if (!mounted) return null;

  return (
    <div
      className={`ct-page-loading${phase === 'leave' ? ' is-leaving' : ' is-visible'}`}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="ct-page-loading-stage">
        <div className="ct-page-loading-spinner" aria-hidden="true" />
        <p className="ct-page-loading-caption">Loading your workspace…</p>
      </div>
    </div>
  );
}
