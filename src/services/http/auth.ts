import { post, get } from './client';
import { setAccessToken, clearAccessToken } from './token-store';
import type { CoachUser, LoginInput, RegisterInput, RoleKey } from '@/services/types';

export interface AuthSession {
  user: CoachUser;
  token: string;
  clientOnboardingComplete?: boolean;
}

const AUTH_KEY = 'coachtek_auth';

export function readSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function writeSession(session: AuthSession | null): void {
  if (session) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(session));
    setAccessToken(session.token);
  } else {
    localStorage.removeItem(AUTH_KEY);
    clearAccessToken();
  }
}

export const authService = {
  async login(input: LoginInput): Promise<AuthSession> {
    const data = await post<{ user: CoachUser; accessToken: string; clientOnboardingComplete?: boolean }>(
      '/auth/login',
      input,
    );
    const session: AuthSession = {
      user: data.user,
      token: data.accessToken,
      clientOnboardingComplete: data.clientOnboardingComplete,
    };
    writeSession(session);
    return session;
  },

  async loginAsRole(role: RoleKey, input: LoginInput): Promise<AuthSession> {
    const session = await this.login(input);
    if (session.user.role !== role) {
      writeSession(null);
      throw new Error('Account is not authorized for this console');
    }
    return session;
  },

  async register(input: RegisterInput): Promise<{ pending: true }> {
    return post('/auth/register', input);
  },

  async completeClientOnboarding(): Promise<void> {
    await post('/auth/complete-client-onboarding');
    const session = readSession();
    if (session?.user.role === 'client') {
      writeSession({ ...session, clientOnboardingComplete: true });
    }
  },

  async logout(): Promise<void> {
    await post('/auth/logout').catch(() => {});
    writeSession(null);
  },

  async me(): Promise<CoachUser | null> {
    try {
      return await get<CoachUser>('/auth/me');
    } catch {
      return null;
    }
  },
};
