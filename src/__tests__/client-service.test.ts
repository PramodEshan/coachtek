import { describe, it, expect, beforeEach, vi } from 'vitest';
import { clientService } from '@/services/mock/client';
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

beforeEach(() => {
  for (const k in mockStorage) delete mockStorage[k];
  resetStore();
});

describe('client service', () => {
  describe('profile', () => {
    it('returns client profile with membership and payee info', async () => {
      const profile = await clientService.profile();
      expect(profile.membership).toBe('solo');
      expect(profile.paymentPayee).toBe('solo_coach');
      expect(profile.paymentPayeeName).toBe('Alex Morgan');
      expect(profile.soloCoachId).toBe('coach-1');
    });
  });

  describe('paymentHistory', () => {
    it('returns payments for the logged-in client', async () => {
      writeSession({ user: MOCK_USERS['jordan@client.demo'], token: 'mock-token' });
      const payments = await clientService.paymentHistory();
      for (const p of payments) {
        expect(p.clientId).toBe('client-user-1');
      }
      expect(payments.length).toBeGreaterThan(0);
    });

    it('returns empty for a client with no payments', async () => {
      writeSession({
        user: { id: 'client-none', name: 'No Pay', email: 'np@test.com', initials: 'NP', role: 'client' },
        token: 'mock-token',
      });
      const payments = await clientService.paymentHistory();
      expect(payments.length).toBe(0);
    });

    it('payment records have correct payee info', async () => {
      writeSession({ user: MOCK_USERS['jordan@client.demo'], token: 'mock-token' });
      const payments = await clientService.paymentHistory();
      for (const p of payments) {
        expect(p.payeeType).toBe('solo_coach');
        expect(p.payeeName).toBe('Alex Morgan');
      }
    });
  });

  describe('pauseSubscription', () => {
    it('sets subscription status to paused', async () => {
      await clientService.pauseSubscription();
      const profile = await clientService.profile();
      expect(profile.subscriptionStatus).toBe('paused');
    });
  });

  describe('progressSummary', () => {
    it('returns participation and progress metrics from session logs', async () => {
      writeSession({ user: MOCK_USERS['jordan@client.demo'], token: 'mock-token' });
      const summary = await clientService.progressSummary();
      expect(summary.sessionsCompleted).toBe(10);
      expect(summary.sessionsScheduled).toBe(16);
      expect(summary.participationRate).toBe(63);
      expect(summary.totalCaloriesBurned).toBeGreaterThan(0);
      expect(summary.recentSessions.length).toBeGreaterThan(0);
    });
  });

  describe('completeWorkout', () => {
    it('logs session data and updates progress', async () => {
      writeSession({ user: MOCK_USERS['jordan@client.demo'], token: 'mock-token' });
      await clientService.completeWorkout({
        durationMinutes: 54,
        caloriesBurned: 360,
        weightKg: 77.8,
        feeling: 'good',
        comment: 'Solid session',
      });

      const profile = await clientService.profile();
      expect(profile.todayWorkoutStatus).toBe('complete');
      expect(profile.weight).toBe(77.8);

      const logs = await clientService.sessionLogs();
      expect(logs[0].caloriesBurned).toBe(360);
      expect(logs[0].durationMinutes).toBe(54);
      expect(logs[0].feeling).toBe('good');
      expect(logs[0].comment).toBe('Solid session');

      const summary = await clientService.progressSummary();
      expect(summary.sessionsCompleted).toBe(11);
    });

    it('stores exercise logs on completion', async () => {
      writeSession({ user: MOCK_USERS['jordan@client.demo'], token: 'mock-token' });
      await clientService.completeWorkout({
        durationMinutes: 50,
        caloriesBurned: 320,
        weightKg: 77.5,
        feeling: 'great',
        exerciseLogs: [
          { exerciseId: 'ex-1', name: 'Squat', reps: '5', weightKg: '100', time: '—' },
        ],
      });
      const logs = await clientService.sessionLogs();
      expect(logs[0].exerciseLogs?.[0].name).toBe('Squat');
      expect(logs[0].exerciseLogs?.[0].reps).toBe('5');
    });
  });

  describe('sessionById', () => {
    it('returns a session log by id', async () => {
      writeSession({ user: MOCK_USERS['jordan@client.demo'], token: 'mock-token' });
      const logs = await clientService.sessionLogs();
      const found = await clientService.sessionById(logs[0].id);
      expect(found?.id).toBe(logs[0].id);
    });
  });

  describe('saveBodyMetric', () => {
    it('appends a new body metric entry', async () => {
      const before = (await clientService.bodyMetrics()).length;
      await clientService.saveBodyMetric({ date: '2099-01-15', weight: 76, waist: 80 });
      const after = await clientService.bodyMetrics();
      expect(after.length).toBe(before + 1);
      expect(after.find((m) => m.date === '2099-01-15')?.weight).toBe(76);
    });
  });

  describe('progressPhotos', () => {
    it('uploads and lists progress photos for client', async () => {
      writeSession({ user: MOCK_USERS['jordan@client.demo'], token: 'mock-token' });
      const before = (await clientService.progressPhotos()).length;
      await clientService.uploadProgressPhoto('data:image/png;base64,abc', 'Week 4');
      const after = await clientService.progressPhotos();
      expect(after.length).toBe(before + 1);
      expect(after[0].note).toBe('Week 4');
    });
  });

  describe('submitFeedback', () => {
    it('routes coach feedback to coach feedback store', async () => {
      const before = getStore().feedback.length;
      await clientService.submitFeedback({ category: 'coach', description: 'Great sessions' });
      expect(getStore().feedback.length).toBe(before + 1);
    });

    it('routes platform feedback to operator complaints', async () => {
      const before = getStore().operatorComplaints.length;
      await clientService.submitFeedback({ category: 'platform', description: 'App bug' });
      expect(getStore().operatorComplaints.length).toBe(before + 1);
    });
  });

  describe('updateProfile', () => {
    it('persists WhatsApp and goals fields', async () => {
      const updated = await clientService.updateProfile({
        goals: 'Run a 5K',
        whatsappNumber: '+1555010999',
        whatsappOptIn: true,
      });
      expect(updated.goals).toBe('Run a 5K');
      expect(updated.whatsappNumber).toBe('+1555010999');
      expect(updated.whatsappOptIn).toBe(true);
    });
  });
});
