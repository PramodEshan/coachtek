import { describe, it, expect, beforeEach, vi } from 'vitest';
import { superadminService } from '@/services/mock/operator';
import { resetStore, getStore } from '@/services/mock/store';

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

describe('superadmin service', () => {
  describe('stats', () => {
    it('returns escalation and gym counts', async () => {
      const stats = await superadminService.stats();
      expect(stats.escalatedComplaints).toBeDefined();
      expect(stats.gyms).toBeDefined();
      expect(stats.operators).toBeDefined();
    });
  });

  describe('escalations', () => {
    it('returns only escalated complaints', async () => {
      const items = await superadminService.escalations();
      for (const item of items) {
        expect(item.status).toBe('escalated');
      }
    });
  });

  describe('gym deactivation', () => {
    it('deactivates a gym', async () => {
      await superadminService.deactivateGym('gym-1', 'Permanent closure');
      const gym = getStore().gymOrgs.find((g) => g.id === 'gym-1');
      expect(gym?.status).toBe('deactivated');
    });

    it('adds audit entry with Super Admin actor', async () => {
      await superadminService.deactivateGym('gym-1', 'test reason');
      const entry = getStore().auditLog[0];
      expect(entry.action).toBe('Deactivated gym');
      expect(entry.actor).toBe('Taylor Admin');
      expect(entry.detail).toContain('test reason');
    });
  });

  describe('gym status override', () => {
    it('overrides gym status to any TenantStatus', async () => {
      await superadminService.overrideGymStatus('gym-1', 'suspended');
      expect(getStore().gymOrgs.find((g) => g.id === 'gym-1')?.status).toBe('suspended');

      await superadminService.overrideGymStatus('gym-1', 'active');
      expect(getStore().gymOrgs.find((g) => g.id === 'gym-1')?.status).toBe('active');
    });

    it('creates audit trail for override', async () => {
      await superadminService.overrideGymStatus('gym-1', 'suspended');
      const entry = getStore().auditLog[0];
      expect(entry.action).toBe('Override gym status');
      expect(entry.detail).toContain('→ suspended');
    });
  });

  describe('solo coach deactivation', () => {
    it('deactivates a solo coach', async () => {
      await superadminService.deactivateSoloCoach('pc1', 'Misconduct');
      const coach = getStore().pendingCoaches.find((c) => c.id === 'pc1');
      expect(coach?.vettingStatus).toBe('rejected');
    });

    it('adds audit entry with Super Admin actor', async () => {
      await superadminService.deactivateSoloCoach('pc1', 'Misconduct');
      const entry = getStore().auditLog[0];
      expect(entry.action).toBe('Deactivated solo coach');
      expect(entry.actor).toBe('Taylor Admin');
    });
  });

  describe('gym orgs', () => {
    it('returns all gym organizations', async () => {
      const gyms = await superadminService.gymOrgs();
      expect(gyms.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('solo coach registry', () => {
    it('returns all solo coaches (delegates to operator)', async () => {
      const coaches = await superadminService.soloCoachRegistry();
      expect(coaches.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('audit log', () => {
    it('returns audit entries', async () => {
      const log = await superadminService.auditLog();
      expect(log.length).toBeGreaterThan(0);
    });

    it('deactivation actions appear in audit log', async () => {
      await superadminService.deactivateGym('gym-1', 'test');
      await superadminService.deactivateSoloCoach('pc1', 'test');
      const log = await superadminService.auditLog();
      const actions = log.map((e) => e.action);
      expect(actions).toContain('Deactivated gym');
      expect(actions).toContain('Deactivated solo coach');
    });
  });
});
