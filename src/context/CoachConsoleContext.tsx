import { createContext, useContext, useEffect, type ReactNode } from 'react';
import type { CoachConsoleConfig } from '@/config/coachConsoleConfig';
import { SOLO_COACH_CONSOLE } from '@/config/coachConsoleConfig';
import { usePageLoadingController } from '@/context/PageLoadingContext';

const CoachConsoleContext = createContext<CoachConsoleConfig>(SOLO_COACH_CONSOLE);

export function CoachConsoleProvider({
  config,
  children,
}: {
  config: CoachConsoleConfig;
  children: ReactNode;
}) {
  return <CoachConsoleContext.Provider value={config}>{children}</CoachConsoleContext.Provider>;
}

export function useCoachConsole() {
  return useContext(CoachConsoleContext);
}

export function useCoachConsoleLoading(isLoading = false) {
  const { loadingKey } = useCoachConsole();
  const { setPageLoading } = usePageLoadingController();

  useEffect(() => {
    if (isLoading) return undefined;
    const id = requestAnimationFrame(() => setPageLoading(loadingKey, false));
    return () => cancelAnimationFrame(id);
  }, [isLoading, loadingKey, setPageLoading]);
}

export function coachRoute(config: CoachConsoleConfig, segment: string) {
  return `${config.basePath}/${segment}`;
}
