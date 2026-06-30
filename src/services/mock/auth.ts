import { delay, getStore } from '@/services/mock/store';
import { DEMO_PASSWORD, MOCK_USERS } from '@/data/roleSeed';
import { MOCK_COACH, MOCK_PASSWORD } from '@/data/seed';
import type { CoachUser, LoginInput, RegisterInput, RoleKey } from '@/services/types';

const AUTH_KEY = 'coachtek_auth';

export interface AuthSession {
  user: CoachUser;
  token: string;
  clientOnboardingComplete?: boolean;
}

export function readSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as AuthSession;
    const legacyRole = session.user?.role as string | undefined;
    if (legacyRole === 'coach') {
      session.user.role = 'solo_coach';
      writeSession(session);
    }
    return session;
  } catch {
    return null;
  }
}

export function writeSession(session: AuthSession | null): void {
  if (session) localStorage.setItem(AUTH_KEY, JSON.stringify(session));
  else localStorage.removeItem(AUTH_KEY);
}

function passwordForEmail(email: string, password: string): boolean {
  const normalized = email.trim().toLowerCase();
  if (normalized === MOCK_COACH.email.toLowerCase()) {
    return password === MOCK_PASSWORD;
  }
  if (normalized === 'gymcoach@gym.demo') {
    return password === DEMO_PASSWORD;
  }
  return password === DEMO_PASSWORD;
}

export const authService = {
  async login(input: LoginInput): Promise<AuthSession> {
    await delay();
    const email = input.email.trim().toLowerCase();
    const user = MOCK_USERS[email];
    if (!user || !passwordForEmail(email, input.password)) {
      throw new Error('Invalid email or password');
    }
    const session: AuthSession = {
      user,
      token: 'mock-token',
      clientOnboardingComplete: user.role === 'client' ? getStore().clientProfile.onboardingComplete : undefined,
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
    await delay();
    if (input.password !== input.confirmPassword) {
      throw new Error('Passwords do not match');
    }
    getStore().pendingRegistration = true;
    return { pending: true };
  },

  async completeClientOnboarding(): Promise<void> {
    await delay(50);
    getStore().clientProfile.onboardingComplete = true;
    const session = readSession();
    if (session?.user.role === 'client') {
      writeSession({ ...session, clientOnboardingComplete: true });
    }
  },

  async logout(): Promise<void> {
    await delay(50);
    writeSession(null);
  },

  async me(): Promise<CoachUser | null> {
    await delay(50);
    const session = readSession();
    return session?.user ?? null;
  },
};
