import { describe, it, expect, beforeEach, vi } from 'vitest';
import { gymService } from '@/services/mock/gym';
import { gymCoachService } from '@/services/mock/gymCoach';
import { writeSession } from '@/services/mock/auth';
import { resetStore, getStore } from '@/services/mock/store';
import { MOCK_USERS } from '@/data/roleSeed';

const mockStorage: Record<string, string> = {};
Object.defineProperty(globalThis, 'localStorage', {
  value: {
    getItem: vi.fn((k: string) => mockStorage[k] ?? null),
    setItem: vi.fn((k: string, v: string) => { mockStorage[k] = v; }),
    removeItem: vi.fn((k: string) => { delete mockStorage[k]; }),
    clear: vi.fn(() => { for (const k in mockStorage) delete mockStorage[k]; }),
    length: 0,
    key: vi.fn(() => null),
  },
  writable: true,
});

function loginAs(email: string) {
  const user = MOCK_USERS[email];
  writeSession({ user, token: 'mock-token' });
}

beforeEach(() => {
  for (const k in mockStorage) delete mockStorage[k];
  resetStore();
});

describe('gym service', () => {
  describe('clientPayments', () => {
    it('filters payments by gym-1 when logged in as gym admin', async () => {
      loginAs('gym@coachtek.app'); // gymId: gym-1
      const payments = await gymService.clientPayments();
      for (const p of payments) {
        expect(p.gymId).toBe('gym-1');
      }
      expect(payments.length).toBeGreaterThan(0);
    });

    it('returns no payments for a gym with no records', async () => {
      writeSession({
        user: { id: 'admin-3', name: 'Test', email: 't@t.com', initials: 'T', role: 'gym_admin', gymId: 'gym-999' },
        token: 'mock-token',
      });
      const payments = await gymService.clientPayments();
      expect(payments.length).toBe(0);
    });
  });

  describe('coachPayouts', () => {
    it('filters payouts by gymId from session', async () => {
      loginAs('gym@coachtek.app');
      const payouts = await gymService.coachPayouts();
      for (const p of payouts) {
        expect(p.gymId).toBe('gym-1');
      }
      expect(payouts.length).toBeGreaterThan(0);
    });
  });

  describe('coachProfiles', () => {
    it('returns only coaches from the current gym', async () => {
      loginAs('gym@coachtek.app');
      const profiles = await gymService.coachProfiles();
      for (const p of profiles) {
        expect(p.gymId).toBe('gym-1');
      }
    });
  });

  describe('pendingCoachReviews', () => {
    it('returns empty when no coaches are pending at gym-1', async () => {
      loginAs('gym@coachtek.app');
      const pending = await gymService.pendingCoachReviews();
      expect(pending.length).toBe(0);
    });

    it('returns pending coaches after adding one', async () => {
      loginAs('gym@coachtek.app');
      getStore().gymCoachProfiles.push({
        id: 'gc-new', name: 'New Coach', email: 'new@gym.demo',
        gymId: 'gym-1', gymName: 'Iron District', specialty: 'Boxing',
        status: 'pending', clients: 0,
      });
      const pending = await gymService.pendingCoachReviews();
      expect(pending.length).toBe(1);
      expect(pending[0].id).toBe('gc-new');
    });
  });

  describe('approveCoach / rejectCoach', () => {
    it('approves a coach by setting status to active', async () => {
      getStore().gymCoachProfiles.push({
        id: 'gc-approve', name: 'Approve Me', email: 'a@gym.demo',
        gymId: 'gym-1', gymName: 'Iron District', specialty: 'Weights',
        status: 'pending', clients: 0,
      });
      await gymService.approveCoach('gc-approve');
      const profile = getStore().gymCoachProfiles.find((p) => p.id === 'gc-approve');
      expect(profile?.status).toBe('active');
    });

    it('rejects a coach by setting status to deactivated', async () => {
      getStore().gymCoachProfiles.push({
        id: 'gc-reject', name: 'Reject Me', email: 'r@gym.demo',
        gymId: 'gym-1', gymName: 'Iron District', specialty: 'Yoga',
        status: 'pending', clients: 0,
      });
      await gymService.rejectCoach('gc-reject');
      const profile = getStore().gymCoachProfiles.find((p) => p.id === 'gc-reject');
      expect(profile?.status).toBe('deactivated');
    });
  });
});

describe('gymCoach service', () => {
  describe('payroll', () => {
    it('returns payroll entries for the logged-in gym coach at their gym', async () => {
      loginAs('gymcoach@gym.demo'); // gym-coach-1, gym-1
      const payroll = await gymCoachService.payroll();
      for (const p of payroll) {
        expect(p.gymCoachId).toBe('gym-coach-1');
        expect(p.gymId).toBe('gym-1');
      }
      expect(payroll.length).toBeGreaterThan(0);
    });

    it('returns empty payroll for a coach with no entries', async () => {
      writeSession({
        user: { id: 'gc-none', name: 'No Payroll', email: 'np@gym.demo', initials: 'NP', role: 'gym_coach', gymId: 'gym-1', affiliation: 'gym' },
        token: 'mock-token',
      });
      const payroll = await gymCoachService.payroll();
      expect(payroll.length).toBe(0);
    });
  });

  describe('gymName', () => {
    it('returns the gym name from gymOrgs based on session gymId', async () => {
      loginAs('gymcoach@gym.demo');
      const name = await gymCoachService.gymName();
      expect(name).toBe('Iron District Fitness');
    });

    it('returns "My Gym" when gym org not found', async () => {
      writeSession({
        user: { id: 'gc-x', name: 'X', email: 'x@x.com', initials: 'X', role: 'gym_coach', gymId: 'gym-999' },
        token: 'mock-token',
      });
      const name = await gymCoachService.gymName();
      expect(name).toBe('My Gym');
    });
  });

  describe('clients', () => {
    it('returns active clients', async () => {
      loginAs('gymcoach@gym.demo');
      const clients = await gymCoachService.clients();
      for (const c of clients) {
        expect(c.status).toBe('active');
      }
    });
  });

  describe('threads', () => {
    it('returns threads', async () => {
      loginAs('gymcoach@gym.demo');
      const threads = await gymCoachService.threads();
      expect(threads.length).toBeGreaterThan(0);
    });
  });
});
