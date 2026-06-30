import { describe, it, expect, beforeEach, vi } from 'vitest';
import { operatorService } from '@/services/mock/operator';
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

describe('operator service', () => {
  describe('stats', () => {
    it('returns platform-wide stats with gym and solo counts', async () => {
      const stats = await operatorService.stats();
      expect(stats.activeSoloCoaches).toBeDefined();
      expect(stats.registeredGyms).toBeDefined();
      expect(stats.pendingSoloCoaches).toBeDefined();
      expect(stats.activeClients).toBeDefined();
      expect(stats.openComplaints).toBeDefined();
    });
  });

  describe('complaints scope filtering', () => {
    it('excludes gym-scoped complaints from operator view', async () => {
      const complaints = await operatorService.complaints();
      for (const c of complaints) {
        expect(c.scope).not.toBe('gym');
      }
    });

    it('includes platform and solo_coach scoped complaints', async () => {
      const complaints = await operatorService.complaints();
      const scopes = new Set(complaints.map((c) => c.scope));
      expect(scopes.has('platform')).toBe(true);
    });

    it('complaint() returns any complaint by id regardless of scope', async () => {
      const gymComplaint = getStore().operatorComplaints.find((c) => c.scope === 'gym');
      if (gymComplaint) {
        const result = await operatorService.complaint(gymComplaint.id);
        expect(result?.id).toBe(gymComplaint.id);
      }
    });
  });

  describe('gym registration', () => {
    it('creates a new gym org', async () => {
      const before = (await operatorService.gymOrgs()).length;
      const org = await operatorService.registerGym({
        name: 'Test Gym', location: 'London', plan: '1-on-1 Pro',
        adminName: 'Admin', adminEmail: 'admin@test.com',
      });
      expect(org.name).toBe('Test Gym');
      expect(org.status).toBe('active');
      expect(org.primaryAdminEmail).toBe('admin@test.com');
      const after = (await operatorService.gymOrgs()).length;
      expect(after).toBe(before + 1);
    });

    it('adds audit log entry on gym registration', async () => {
      const logBefore = getStore().auditLog.length;
      await operatorService.registerGym({
        name: 'Audit Gym', plan: '1-on-1 Starter',
        adminName: 'A', adminEmail: 'a@t.com',
      });
      expect(getStore().auditLog.length).toBe(logBefore + 1);
      expect(getStore().auditLog[0].action).toBe('Registered gym');
    });
  });

  describe('gym suspend / reactivate', () => {
    it('suspends an active gym', async () => {
      await operatorService.suspendGym('gym-1', 'policy violation');
      const gym = await operatorService.gymOrg('gym-1');
      expect(gym?.status).toBe('suspended');
    });

    it('reactivates a suspended gym', async () => {
      await operatorService.suspendGym('gym-1', 'test');
      await operatorService.reactivateGym('gym-1');
      const gym = await operatorService.gymOrg('gym-1');
      expect(gym?.status).toBe('active');
    });

    it('adds audit entries for suspend and reactivate', async () => {
      const logBefore = getStore().auditLog.length;
      await operatorService.suspendGym('gym-1', 'test');
      await operatorService.reactivateGym('gym-1');
      expect(getStore().auditLog.length).toBe(logBefore + 2);
    });
  });

  describe('solo coach vetting', () => {
    it('returns only pending coaches', async () => {
      const pending = await operatorService.pendingCoaches();
      for (const c of pending) {
        expect(c.vettingStatus).toBe('pending');
      }
    });

    it('approves a coach and removes from pending list', async () => {
      const pending = await operatorService.pendingCoaches();
      const id = pending[0].id;
      await operatorService.vetCoach(id, 'approved');
      const afterPending = await operatorService.pendingCoaches();
      expect(afterPending.find((c) => c.id === id)).toBeUndefined();
    });

    it('rejects a coach with reason', async () => {
      const pending = await operatorService.pendingCoaches();
      const id = pending[0].id;
      await operatorService.vetCoach(id, 'rejected', 'Missing cert');
      const coach = await operatorService.coach(id);
      expect(coach?.vettingStatus).toBe('rejected');
      expect(getStore().auditLog[0].detail).toContain('Missing cert');
    });
  });

  describe('solo coach suspend', () => {
    it('suspends a solo coach', async () => {
      await operatorService.suspendSoloCoach('pc1', 'fraud');
      const coach = await operatorService.coach('pc1');
      expect(coach?.vettingStatus).toBe('rejected');
      expect(getStore().auditLog[0].action).toBe('Suspended solo coach');
    });
  });

  describe('solo coach registry', () => {
    it('returns all coaches regardless of status', async () => {
      await operatorService.vetCoach('pc1', 'approved');
      const registry = await operatorService.soloCoachRegistry();
      expect(registry.some((c) => c.vettingStatus === 'approved')).toBe(true);
      expect(registry.some((c) => c.vettingStatus === 'pending')).toBe(true);
    });
  });

  describe('complaint lifecycle', () => {
    it('updates complaint status and adds note', async () => {
      const complaints = await operatorService.complaints();
      const id = complaints[0].id;
      await operatorService.updateComplaint(id, 'in_review', 'Investigating');
      const updated = await operatorService.complaint(id);
      expect(updated?.status).toBe('in_review');
      expect(updated?.internalNotes).toContain('Investigating');
    });

    it('escalates complaint', async () => {
      const complaints = await operatorService.complaints();
      const id = complaints[0].id;
      await operatorService.escalateComplaint(id, 'Needs SA review');
      const updated = await operatorService.complaint(id);
      expect(updated?.status).toBe('escalated');
    });
  });

  describe('reassign (gap analysis)', () => {
    it('reassigns client to a new coach and logs audit', async () => {
      const assignments = await operatorService.assignments();
      const row = assignments[0];
      const logBefore = getStore().auditLog.length;
      await operatorService.reassign(row.id, 'coach-99', 'New Coach', 'workload balance');
      const updated = (await operatorService.assignments()).find((a) => a.id === row.id);
      expect(updated?.coachName).toBe('New Coach');
      expect(getStore().auditLog.length).toBe(logBefore + 1);
      expect(getStore().auditLog[0].action).toBe('Reassigned client');
    });
  });

  describe('financialOverview (gap analysis)', () => {
    it('returns subscription and revenue metrics', async () => {
      const overview = await operatorService.financialOverview();
      expect(overview.activeSubscriptions).toBeGreaterThan(0);
      expect(overview.revenueThisMonth).toBeGreaterThanOrEqual(0);
      expect(overview.revenueLastMonth).toBeGreaterThanOrEqual(0);
    });
  });

  describe('updateTier (gap analysis)', () => {
    it('updates tier pricing fields', async () => {
      const tiers = await operatorService.tiers();
      const tier = tiers[0];
      const newFee = tier.monthlyFee + 10;
      await operatorService.updateTier(tier.id, { monthlyFee: newFee, clientLimit: 50 });
      const updated = (await operatorService.tiers()).find((t) => t.id === tier.id);
      expect(updated?.monthlyFee).toBe(newFee);
      expect(updated?.clientLimit).toBe(50);
    });
  });
});
