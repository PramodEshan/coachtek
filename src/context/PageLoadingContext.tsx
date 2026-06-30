import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { PWA_RESUME_EVENT } from '@/pwa';

interface PageLoadingContextValue {
  active: boolean;
  setPageLoading: (key: string, loading: boolean) => void;
}

const PageLoadingContext = createContext<PageLoadingContextValue | null>(null);

export function PageLoadingProvider({ children }: { children: ReactNode }) {
  const loadsRef = useRef(new Set<string>());
  const [pageLoading, setPageLoadingFlag] = useState(false);
  const loadingSinceRef = useRef<number | null>(null);

  const syncLoadingFlag = useCallback(() => {
    const active = loadsRef.current.size > 0;
    loadingSinceRef.current = active ? Date.now() : null;
    setPageLoadingFlag(active);
  }, []);

  const setPageLoading = useCallback((key: string, loading: boolean) => {
    if (loading) loadsRef.current.add(key);
    else loadsRef.current.delete(key);
    syncLoadingFlag();
  }, [syncLoadingFlag]);

  useEffect(() => {
    const STUCK_MS = 6000;

    const onVisible = () => {
      if (document.visibilityState !== 'visible') return;
      if (!loadingSinceRef.current) return;
      if (Date.now() - loadingSinceRef.current < STUCK_MS) return;

      loadsRef.current.clear();
      syncLoadingFlag();
    };

    const onPwaResume = (event: Event) => {
      const hiddenMs = (event as CustomEvent<{ hiddenMs: number }>).detail?.hiddenMs ?? 0;
      if (hiddenMs < 800 || !loadingSinceRef.current) return;

      loadsRef.current.clear();
      syncLoadingFlag();
    };

    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener(PWA_RESUME_EVENT, onPwaResume);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener(PWA_RESUME_EVENT, onPwaResume);
    };
  }, [syncLoadingFlag]);

  const value = useMemo(
    () => ({
      active: pageLoading,
      setPageLoading,
    }),
    [pageLoading, setPageLoading],
  );

  return <PageLoadingContext.Provider value={value}>{children}</PageLoadingContext.Provider>;
}

export function usePageLoadingController() {
  const ctx = useContext(PageLoadingContext);
  if (!ctx) throw new Error('usePageLoadingController must be used within PageLoadingProvider');
  return ctx;
}

const COACH_MAIN_LOADING_KEY = 'coach-main';

export function useCoachPageLoading(isLoading = false) {
  const { setPageLoading } = usePageLoadingController();

  useEffect(() => {
    if (isLoading) return undefined;

    const id = requestAnimationFrame(() => {
      setPageLoading(COACH_MAIN_LOADING_KEY, false);
    });

    return () => cancelAnimationFrame(id);
  }, [isLoading, setPageLoading]);
}

export { COACH_MAIN_LOADING_KEY };

export function useRolePageLoading(loadingKey: string, isLoading = false) {
  const { setPageLoading } = usePageLoadingController();

  useEffect(() => {
    if (isLoading) return undefined;
    const id = requestAnimationFrame(() => setPageLoading(loadingKey, false));
    return () => cancelAnimationFrame(id);
  }, [isLoading, loadingKey, setPageLoading]);
}

export function useRegisterPageLoading(loading: boolean, key = 'page') {
  const { setPageLoading } = usePageLoadingController();

  useEffect(() => {
    setPageLoading(key, loading);
    return () => setPageLoading(key, false);
  }, [key, loading, setPageLoading]);
}
