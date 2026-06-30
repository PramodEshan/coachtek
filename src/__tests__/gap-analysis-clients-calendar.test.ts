import { describe, it, expect, beforeEach, vi } from 'vitest';
import { clientsService } from '@/services/mock/clients';
import { calendarService } from '@/services/mock/calendar';
import { getStore, resetStore } from '@/services/mock/store';

const mockStorage: Record<string, string> = {};
Object.defineProperty(globalThis, 'localStorage', {
  value: {
    getItem: vi.fn((k: string) => mockStorage[k] ?? null),
    setItem: vi.fn((k: string, v: string) => {
      mockStorage[k] = v;
    }),
    removeItem: vi.fn((k: string) => {
      delete mockStorage[k];
    }),
    clear: vi.fn(() => {
      for (const k in mockStorage) delete mockStorage[k];
    }),
    length: 0,
    key: vi.fn(() => null),
  },
  writable: true,
});

beforeEach(() => {
  for (const k in mockStorage) delete mockStorage[k];
  resetStore();
});

describe('clients service (gap analysis)', () => {
  it('archives client with reason', async () => {
    const archived = await clientsService.archive('c1', 'completed');
    expect(archived.status).toBe('archived');
    expect(archived.archiveReason).toBe('completed');
  });

  it('returns session logs for a client', async () => {
    const logs = await clientsService.clientSessionLogs('c1');
    expect(logs.length).toBeGreaterThan(0);
    expect(logs.every((l) => l.clientId === 'client-user-1' || l.clientId === 'c1')).toBe(true);
  });

  it('gets session log by id', async () => {
    const log = getStore().sessionLogs[0];
    const found = await clientsService.getSessionLog(log.id);
    expect(found?.id).toBe(log.id);
  });

  it('updates coach note on session log', async () => {
    const log = getStore().sessionLogs[0];
    const updated = await clientsService.updateSessionLogCoachNote(log.id, 'Great effort today');
    expect(updated.coachNote).toBe('Great effort today');
  });
});

describe('calendar service (gap analysis)', () => {
  const iso = '2026-06-30';

  it('creates a new session on a day', async () => {
    const session = await calendarService.upsertSession(iso, {
      time: '10:00',
      title: 'Upper body',
      who: 'Jordan Lee',
      clientId: 'c1',
      mode: 'In person',
    });
    expect(session.title).toBe('Upper body');
    expect(getStore().calendar[iso]?.some((s) => s.id === session.id)).toBe(true);
  });

  it('updates an existing session', async () => {
    const created = await calendarService.upsertSession(iso, {
      time: '11:00',
      title: 'Leg day',
      who: 'Jordan Lee',
      clientId: 'c1',
      mode: 'Video',
    });
    const updated = await calendarService.upsertSession(iso, {
      id: created.id,
      time: '12:00',
      title: 'Leg day — revised',
      who: 'Jordan Lee',
      clientId: 'c1',
      mode: 'Video',
    });
    expect(updated.title).toBe('Leg day — revised');
    expect(updated.time).toBe('12:00');
  });
});
