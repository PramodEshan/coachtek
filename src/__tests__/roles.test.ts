import { describe, it, expect } from 'vitest';
import {
  ROLE_LABELS,
  ROLE_PATHS,
  ROLE_LOGIN_PATHS,
  ROLE_DEMO_CREDENTIALS,
  roleFromPath,
} from '@/config/roles';
import type { RoleKey } from '@/services/types';

const ALL_ROLES: RoleKey[] = [
  'solo_coach', 'gym_coach', 'client', 'gym_admin', 'gym_staff', 'operator', 'superadmin',
];

describe('roles config', () => {
  describe('ROLE_LABELS', () => {
    it('has a label for every role', () => {
      for (const role of ALL_ROLES) {
        expect(ROLE_LABELS[role]).toBeDefined();
        expect(typeof ROLE_LABELS[role]).toBe('string');
        expect(ROLE_LABELS[role].length).toBeGreaterThan(0);
      }
    });

    it('includes gym_coach label', () => {
      expect(ROLE_LABELS.gym_coach).toBe('Gym coach');
    });
  });

  describe('ROLE_PATHS', () => {
    it('has a dashboard path for every role', () => {
      for (const role of ALL_ROLES) {
        expect(ROLE_PATHS[role]).toBeDefined();
        expect(ROLE_PATHS[role]).toMatch(/^\//);
      }
    });

    it('gym_coach path starts with /gym/coach', () => {
      expect(ROLE_PATHS.gym_coach).toBe('/gym/coach/dashboard');
    });
  });

  describe('ROLE_LOGIN_PATHS', () => {
    it('has a login path for every role', () => {
      for (const role of ALL_ROLES) {
        expect(ROLE_LOGIN_PATHS[role]).toBeDefined();
        expect(ROLE_LOGIN_PATHS[role]).toContain('login');
      }
    });
  });

  describe('ROLE_DEMO_CREDENTIALS', () => {
    it('has credentials for every role', () => {
      for (const role of ALL_ROLES) {
        const creds = ROLE_DEMO_CREDENTIALS[role];
        expect(creds).toBeDefined();
        expect(creds.email).toContain('@');
        expect(creds.password.length).toBeGreaterThan(0);
      }
    });

    it('gym_coach uses gymcoach@gym.demo', () => {
      expect(ROLE_DEMO_CREDENTIALS.gym_coach.email).toBe('gymcoach@gym.demo');
    });
  });

  describe('roleFromPath', () => {
    it('returns solo_coach for /solo-coach/*', () => {
      expect(roleFromPath('/solo-coach/dashboard')).toBe('solo_coach');
      expect(roleFromPath('/solo-coach/clients')).toBe('solo_coach');
    });

    it('returns solo_coach for legacy /coach/* paths', () => {
      expect(roleFromPath('/coach/dashboard')).toBe('solo_coach');
    });

    it('returns gym_coach for /gym/coach/*', () => {
      expect(roleFromPath('/gym/coach/dashboard')).toBe('gym_coach');
      expect(roleFromPath('/gym/coach/payroll')).toBe('gym_coach');
    });

    it('returns gym_admin for /gym/admin/*', () => {
      expect(roleFromPath('/gym/admin/dashboard')).toBe('gym_admin');
      expect(roleFromPath('/gym/admin/payments')).toBe('gym_admin');
    });

    it('returns gym_staff for /gym/staff/*', () => {
      expect(roleFromPath('/gym/staff/today')).toBe('gym_staff');
      expect(roleFromPath('/gym/staff/payments')).toBe('gym_staff');
    });

    it('returns client for /client/*', () => {
      expect(roleFromPath('/client/dashboard')).toBe('client');
    });

    it('returns operator for /operator/*', () => {
      expect(roleFromPath('/operator/dashboard')).toBe('operator');
      expect(roleFromPath('/operator/onboarding')).toBe('operator');
      expect(roleFromPath('/operator/registries/gyms')).toBe('operator');
    });

    it('returns superadmin for /superadmin/*', () => {
      expect(roleFromPath('/superadmin/dashboard')).toBe('superadmin');
      expect(roleFromPath('/superadmin/solo-coaches')).toBe('superadmin');
    });

    it('defaults to solo_coach for unknown paths', () => {
      expect(roleFromPath('/')).toBe('solo_coach');
      expect(roleFromPath('/unknown')).toBe('solo_coach');
    });

    it('gym/coach matches before gym/admin (prefix overlap)', () => {
      expect(roleFromPath('/gym/coach/clients')).toBe('gym_coach');
      expect(roleFromPath('/gym/admin/clients')).toBe('gym_admin');
    });
  });
});
