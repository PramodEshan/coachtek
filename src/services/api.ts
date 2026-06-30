const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== 'false';

/* ---------- auth ---------- */

const authMod = USE_MOCK
  ? await import('@/services/mock/auth')
  : await import('@/services/http/auth');

export const authService = authMod.authService;
export const readSession = authMod.readSession;
export const writeSession = authMod.writeSession;
export type { AuthSession } from '@/services/mock/auth';

/* ---------- clients (coach-managed) ---------- */

export const clientsService = USE_MOCK
  ? (await import('@/services/mock/clients')).clientsService
  : (await import('@/services/http/clients')).clientsService;

/* ---------- client (self-service) ---------- */

export const clientService = USE_MOCK
  ? (await import('@/services/mock/client')).clientService
  : (await import('@/services/http/client-self')).clientService;

/* ---------- calendar ---------- */

export const calendarService = USE_MOCK
  ? (await import('@/services/mock/calendar')).calendarService
  : (await import('@/services/http/calendar')).calendarService;

/* ---------- programs ---------- */

export const programsService = USE_MOCK
  ? (await import('@/services/mock/programs')).programsService
  : (await import('@/services/http/programs')).programsService;

/* ---------- messages (WhatsApp only — always mock) ---------- */

export { messagesService } from '@/services/mock/messages';

/* ---------- feedback ---------- */

export const feedbackService = USE_MOCK
  ? (await import('@/services/mock/feedback')).feedbackService
  : (await import('@/services/http/feedback')).feedbackService;

/* ---------- coach ---------- */

export const coachService = USE_MOCK
  ? (await import('@/services/mock/coach')).coachService
  : (await import('@/services/http/coach')).coachService;

/* ---------- operator & superadmin ---------- */

const operatorMod = USE_MOCK
  ? await import('@/services/mock/operator')
  : await import('@/services/http/operator');

export const operatorService = operatorMod.operatorService;
export const superadminService = operatorMod.superadminService;

/* ---------- gym ---------- */

export const gymService = USE_MOCK
  ? (await import('@/services/mock/gym')).gymService
  : (await import('@/services/http/gym')).gymService;

/* ---------- gym coach ---------- */

export const gymCoachService = USE_MOCK
  ? (await import('@/services/mock/gymCoach')).gymCoachService
  : (await import('@/services/http/gym-coach')).gymCoachService;
