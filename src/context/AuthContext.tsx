import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { authService, readSession, writeSession, type AuthSession } from '@/services/api';
import { ROLE_DEMO_CREDENTIALS } from '@/config/roles';
import type { CoachUser, LoginInput, RegisterInput, RoleKey } from '@/services/types';

interface AuthContextValue {
  user: CoachUser | null;
  loading: boolean;
  login: (input: LoginInput) => Promise<AuthSession>;
  loginAsRole: (role: RoleKey, input: LoginInput) => Promise<void>;
  switchToRole: (role: RoleKey) => Promise<void>;
  register: (input: RegisterInput) => Promise<{ pending: true }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CoachUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = readSession();
    setUser(session?.user ?? null);
    setLoading(false);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      async login(input) {
        const session: AuthSession = await authService.login(input);
        writeSession(session);
        setUser(session.user);
        return session;
      },
      async loginAsRole(role, input) {
        const session = await authService.loginAsRole(role, input);
        writeSession(session);
        setUser(session.user);
      },
      async switchToRole(role) {
        const creds = ROLE_DEMO_CREDENTIALS[role];
        const session = await authService.loginAsRole(role, creds);
        writeSession(session);
        setUser(session.user);
      },
      async register(input) {
        return authService.register(input);
      },
      async logout() {
        await authService.logout();
        setUser(null);
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
