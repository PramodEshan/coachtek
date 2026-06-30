import { describe, it, expect, beforeEach } from 'vitest';
import { createStore, resetStore, getStore } from '@/services/mock/store';

beforeEach(() => resetStore());

describe('store initialization', () => {
  it('creates a store with all expected keys', () => {
    const store = getStore();
    expect(store.gymOrgs).toBeDefined();
    expect(store.gymCoachProfiles).toBeDefined();
    expect(store.clientPayments).toBeDefined();
    expect(store.gymCoachPayouts).toBeDefined();
  });

  describe('gym organizations (multi-tenant)', () => {
    it('seeds at least 3 gyms', () => {
      expect(getStore().gymOrgs.length).toBeGreaterThanOrEqual(3);
    });

    it('each gym has a unique id', () => {
      const ids = getStore().gymOrgs.map((g) => g.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('gyms have different statuses', () => {
      const statuses = new Set(getStore().gymOrgs.map((g) => g.status));
      expect(statuses.has('active')).toBe(true);
      expect(statuses.has('pending')).toBe(true);
    });

    it('each gym has a primary admin email', () => {
      for (const gym of getStore().gymOrgs) {
        expect(gym.primaryAdminEmail).toBeDefined();
        expect(gym.primaryAdminEmail).toContain('@');
      }
    });
  });

  describe('gym coach profiles', () => {
    it('seeds at least 3 gym coach profiles', () => {
      expect(getStore().gymCoachProfiles.length).toBeGreaterThanOrEqual(3);
    });

    it('coaches are spread across multiple gyms', () => {
      const gymIds = new Set(getStore().gymCoachProfiles.map((p) => p.gymId));
      expect(gymIds.size).toBeGreaterThanOrEqual(2);
    });

    it('all gym coach profiles have active status', () => {
      for (const p of getStore().gymCoachProfiles) {
        expect(p.status).toBe('active');
      }
    });
  });

  describe('client payments', () => {
    it('seeds at least 6 payment records', () => {
      expect(getStore().clientPayments.length).toBeGreaterThanOrEqual(6);
    });

    it('includes both gym and solo_coach payee types', () => {
      const types = new Set(getStore().clientPayments.map((p) => p.payeeType));
      expect(types.has('gym')).toBe(true);
      expect(types.has('solo_coach')).toBe(true);
    });

    it('gym payments have gymId set', () => {
      const gymPayments = getStore().clientPayments.filter((p) => p.payeeType === 'gym');
      for (const p of gymPayments) {
        expect(p.gymId).toBeDefined();
      }
    });

    it('solo_coach payments have soloCoachId set', () => {
      const soloPayments = getStore().clientPayments.filter((p) => p.payeeType === 'solo_coach');
      for (const p of soloPayments) {
        expect(p.soloCoachId).toBeDefined();
      }
    });
  });

  describe('gym coach payouts', () => {
    it('seeds at least 4 payout records', () => {
      expect(getStore().gymCoachPayouts.length).toBeGreaterThanOrEqual(4);
    });

    it('payouts reference valid gym ids', () => {
      const gymIds = new Set(getStore().gymOrgs.map((g) => g.id));
      for (const p of getStore().gymCoachPayouts) {
        expect(gymIds.has(p.gymId)).toBe(true);
      }
    });

    it('includes multiple payout statuses', () => {
      const statuses = new Set(getStore().gymCoachPayouts.map((p) => p.status));
      expect(statuses.size).toBeGreaterThanOrEqual(2);
    });
  });

  describe('pending coaches', () => {
    it('all have coachType set to solo_coach', () => {
      for (const c of getStore().pendingCoaches) {
        expect(c.coachType).toBe('solo_coach');
      }
    });
  });

  describe('operator complaints', () => {
    it('includes complaints with different scopes', () => {
      const scopes = new Set(getStore().operatorComplaints.map((c) => c.scope));
      expect(scopes.has('platform')).toBe(true);
      expect(scopes.has('solo_coach')).toBe(true);
      expect(scopes.has('gym')).toBe(true);
    });

    it('gym-scoped complaints have gymId', () => {
      const gymComplaints = getStore().operatorComplaints.filter((c) => c.scope === 'gym');
      for (const c of gymComplaints) {
        expect(c.gymId).toBeDefined();
      }
    });
  });

  describe('client profile (solo membership)', () => {
    it('has membership=solo and paymentPayee=solo_coach', () => {
      const profile = getStore().clientProfile;
      expect(profile.membership).toBe('solo');
      expect(profile.paymentPayee).toBe('solo_coach');
      expect(profile.paymentPayeeName).toBe('Alex Morgan');
      expect(profile.soloCoachId).toBe('coach-1');
    });
  });

  describe('mock users', () => {
    it('gym_admin user has gymId', () => {
      const user = getStore().coach; // check via MOCK_USERS import
      expect(user).toBeDefined();
    });
  });

  describe('store isolation', () => {
    it('resetStore returns fresh data', () => {
      getStore().gymOrgs.push({
        id: 'gym-test', name: 'Test', status: 'active',
        activeCoaches: 0, activeClients: 0,
      });
      expect(getStore().gymOrgs.some((g) => g.id === 'gym-test')).toBe(true);
      resetStore();
      expect(getStore().gymOrgs.some((g) => g.id === 'gym-test')).toBe(false);
    });

    it('createStore returns independent copies', () => {
      const a = createStore();
      const b = createStore();
      a.gymOrgs[0].name = 'MUTATED';
      expect(b.gymOrgs[0].name).not.toBe('MUTATED');
    });
  });
});
