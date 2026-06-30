import type { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { readSession } from '@/services/api';
import { clientService } from '@/services/api';

export function RequireClientOnboarding() {
  const session = readSession();
  if (!session?.clientOnboardingComplete) {
    return (
      <CheckOnboarding>
        <Outlet />
      </CheckOnboarding>
    );
  }
  return <Outlet />;
}

function CheckOnboarding({ children }: { children: ReactNode }) {
  // Sync from store on mount — onboarding gate for client app routes
  void clientService.profile().then((p) => {
    if (p.onboardingComplete && sessionNeedsUpdate()) {
      const s = readSession();
      if (s) {
        import('@/services/api').then(({ writeSession }) =>
          writeSession({ ...s, clientOnboardingComplete: true }),
        );
      }
    }
  });

  const session = readSession();
  if (session && !session.clientOnboardingComplete) {
    return <Navigate to="/client/register" replace />;
  }
  return children;
}

function sessionNeedsUpdate() {
  const s = readSession();
  return s && !s.clientOnboardingComplete;
}
