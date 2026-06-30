import type { RoleKey } from '@/services/types';

export const ROLE_LABELS: Record<RoleKey, string> = {
  solo_coach: 'Solo coach',
  gym_coach: 'Gym coach',
  client: 'Client',
  gym_admin: 'Gym admin',
  gym_staff: 'Gym staff',
  operator: 'Operator',
  superadmin: 'Super admin',
};

export const ROLE_PATHS: Record<RoleKey, string> = {
  solo_coach: '/solo-coach/dashboard',
  gym_coach: '/gym/coach/dashboard',
  client: '/client/dashboard',
  gym_admin: '/gym/admin/dashboard',
  gym_staff: '/gym/staff/today',
  operator: '/operator/dashboard',
  superadmin: '/superadmin/dashboard',
};

export const ROLE_LOGIN_PATHS: Record<RoleKey, string> = {
  solo_coach: '/solo-coach/login',
  gym_coach: '/gym/coach/login',
  client: '/client/login',
  gym_admin: '/gym/admin/login',
  gym_staff: '/gym/staff/login',
  operator: '/operator/login',
  superadmin: '/superadmin/login',
};

/** Demo credentials used when switching consoles from the role switcher. */
export const ROLE_DEMO_CREDENTIALS: Record<RoleKey, { email: string; password: string }> = {
  solo_coach: { email: 'alex@coachtek.app', password: 'coach123' },
  gym_coach: { email: 'gymcoach@gym.demo', password: 'demo123' },
  client: { email: 'jordan@client.demo', password: 'demo123' },
  operator: { email: 'ops@coachtek.app', password: 'demo123' },
  gym_admin: { email: 'gym@coachtek.app', password: 'demo123' },
  gym_staff: { email: 'staff@gym.demo', password: 'demo123' },
  superadmin: { email: 'admin@coachtek.app', password: 'demo123' },
};

export function roleFromPath(pathname: string): RoleKey {
  if (pathname.startsWith('/client')) return 'client';
  if (pathname.startsWith('/gym/coach')) return 'gym_coach';
  if (pathname.startsWith('/gym/admin')) return 'gym_admin';
  if (pathname.startsWith('/gym/staff')) return 'gym_staff';
  if (pathname.startsWith('/operator')) return 'operator';
  if (pathname.startsWith('/superadmin')) return 'superadmin';
  if (pathname.startsWith('/solo-coach') || pathname.startsWith('/coach')) return 'solo_coach';
  return 'solo_coach';
}
