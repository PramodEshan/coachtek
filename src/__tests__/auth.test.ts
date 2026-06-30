import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authService, readSession, writeSession } from '@/services/mock/auth';
import { resetStore } from '@/services/mock/store';
import { MOCK_USERS } from '@/data/roleSeed';

const mockStorage: Record<string, string> = {};
const localStorageMock = {
  getItem: vi.fn((key: string) => mockStorage[key] ?? null),
  setItem: vi.fn((key: string, val: string) => { mockStorage[key] = val; }),
  removeItem: vi.fn((key: string) => { delete mockStorage[key]; }),
  clear: vi.fn(() => { for (const k in mockStorage) delete mockStorage[k]; }),
  length: 0,
  key: vi.fn(() => null),
};

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock, writable: true });

beforeEach(() => {
  localStorageMock.clear();
  resetStore();
});

describe('auth service', () => {
  describe('login', () => {
    it('logs in solo coach with correct credentials', async () => {
      const session = await authService.login({ email: 'alex@coachtek.app', password: 'coach123' });
      expect(session.user.role).toBe('solo_coach');
      expect(session.user.name).toBe('Alex Morgan');
      expect(session.token).toBe('mock-token');
    });

    it('logs in gym coach with demo password', async () => {
      const session = await authService.login({ email: 'gymcoach@gym.demo', password: 'demo123' });
      expect(session.user.role).toBe('gym_coach');
      expect(session.user.name).toBe('Marcus Webb');
      expect(session.user.gymId).toBe('gym-1');
      expect(session.user.affiliation).toBe('gym');
    });

    it('logs in operator', async () => {
      const session = await authService.login({ email: 'ops@coachtek.app', password: 'demo123' });
      expect(session.user.role).toBe('operator');
    });

    it('logs in gym admin with gymId', async () => {
      const session = await authService.login({ email: 'gym@coachtek.app', password: 'demo123' });
      expect(session.user.role).toBe('gym_admin');
      expect(session.user.gymId).toBe('gym-1');
    });

    it('logs in gym staff with gymId', async () => {
      const session = await authService.login({ email: 'staff@gym.demo', password: 'demo123' });
      expect(session.user.role).toBe('gym_staff');
      expect(session.user.gymId).toBe('gym-1');
    });

    it('logs in superadmin', async () => {
      const session = await authService.login({ email: 'admin@coachtek.app', password: 'demo123' });
      expect(session.user.role).toBe('superadmin');
    });

    it('logs in client with onboarding state', async () => {
      const session = await authService.login({ email: 'jordan@client.demo', password: 'demo123' });
      expect(session.user.role).toBe('client');
      expect(session.clientOnboardingComplete).toBe(true);
    });

    it('rejects invalid email', async () => {
      await expect(authService.login({ email: 'nobody@test.com', password: 'demo123' }))
        .rejects.toThrow('Invalid email or password');
    });

    it('rejects wrong password for solo coach', async () => {
      await expect(authService.login({ email: 'alex@coachtek.app', password: 'wrong' }))
        .rejects.toThrow('Invalid email or password');
    });

    it('is case-insensitive for email', async () => {
      const session = await authService.login({ email: 'ALEX@COACHTEK.APP', password: 'coach123' });
      expect(session.user.role).toBe('solo_coach');
    });
  });

  describe('loginAsRole', () => {
    it('succeeds when role matches', async () => {
      const session = await authService.loginAsRole('gym_coach', { email: 'gymcoach@gym.demo', password: 'demo123' });
      expect(session.user.role).toBe('gym_coach');
    });

    it('rejects when role does not match', async () => {
      await expect(authService.loginAsRole('operator', { email: 'gymcoach@gym.demo', password: 'demo123' }))
        .rejects.toThrow('Account is not authorized for this console');
    });

    it('clears session on role mismatch', async () => {
      try {
        await authService.loginAsRole('operator', { email: 'gymcoach@gym.demo', password: 'demo123' });
      } catch { /* expected */ }
      expect(readSession()).toBeNull();
    });
  });

  describe('legacy session migration', () => {
    it('migrates role "coach" to "solo_coach" on readSession', () => {
      const legacy = {
        user: { id: 'coach-1', name: 'Test', email: 'test@test.com', initials: 'T', role: 'coach' },
        token: 'tok',
      };
      localStorageMock.setItem('coachtek_auth', JSON.stringify(legacy));
      const session = readSession();
      expect(session?.user.role).toBe('solo_coach');
    });
  });

  describe('session persistence', () => {
    it('writeSession stores and readSession retrieves', async () => {
      const session = await authService.login({ email: 'gymcoach@gym.demo', password: 'demo123' });
      const restored = readSession();
      expect(restored?.user.id).toBe(session.user.id);
      expect(restored?.user.gymId).toBe('gym-1');
    });

    it('writeSession(null) clears the session', () => {
      writeSession({ user: MOCK_USERS['ops@coachtek.app'], token: 't' });
      expect(readSession()).not.toBeNull();
      writeSession(null);
      expect(readSession()).toBeNull();
    });
  });

  describe('logout', () => {
    it('clears the session', async () => {
      await authService.login({ email: 'ops@coachtek.app', password: 'demo123' });
      expect(readSession()).not.toBeNull();
      await authService.logout();
      expect(readSession()).toBeNull();
    });
  });
});
