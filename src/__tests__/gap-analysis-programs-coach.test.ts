import { describe, it, expect, beforeEach, vi } from 'vitest';
import { programsService } from '@/services/mock/programs';
import { coachService } from '@/services/mock/coach';
import { writeSession } from '@/services/mock/auth';
import { getStore, resetStore } from '@/services/mock/store';
import { MOCK_USERS } from '@/data/roleSeed';

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
  writeSession({ user: MOCK_USERS['alex@coachtek.app'], token: 'mock-token' });
});

describe('programs service (gap analysis)', () => {
  const input = {
    name: 'Test Program',
    tag: 'Strength',
    weeks: 6,
    days: 3,
    price: '£99',
    priceLabel: 'per month',
    desc: 'A test template',
    structure: [{ day: 'Day 1', label: 'Upper', exercises: [{ id: 'test-1', name: 'Bench press', sets: 3, reps: '8', rest: '90s' }] }],
  };

  it('creates a solo coach program', async () => {
    const before = (await programsService.list()).length;
    const program = await programsService.create(input);
    expect(program.name).toBe('Test Program');
    expect(program.source).toBe('solo_coach');
    expect(program.soloCoachId).toBe('coach-1');
    expect((await programsService.list()).length).toBe(before + 1);
  });

  it('updates program fields', async () => {
    const created = await programsService.create(input);
    const updated = await programsService.update(created.id, { name: 'Renamed', weeks: 10 });
    expect(updated.name).toBe('Renamed');
    expect(updated.weeks).toBe(10);
  });

  it('assigns program to clients', async () => {
    const created = await programsService.create(input);
    const client = getStore().clients.find((c) => c.id === 'c1')!;
    const assignedBefore = created.assigned;
    await programsService.assign(created.id, ['c1']);
    expect(client.program).toBe('Test Program');
    expect(getStore().programs.find((p) => p.id === created.id)?.assigned).toBe(assignedBefore + 1);
  });

  it('rejects create for non-solo-coach roles', async () => {
    writeSession({ user: MOCK_USERS['jordan@client.demo'], token: 'mock-token' });
    await expect(programsService.create(input)).rejects.toThrow('Only solo coaches can create programs');
  });
});

describe('coach service (gap analysis)', () => {
  it('generates an invite link', async () => {
    const before = (await coachService.invites()).length;
    const invite = await coachService.generateInvite('Strength 12', 'Instagram');
    expect(invite.program).toBe('Strength 12');
    expect(invite.label).toBe('Instagram');
    expect(invite.uses).toBe(0);
    expect((await coachService.invites()).length).toBe(before + 1);
  });

  it('updates profile including WhatsApp and email', async () => {
    const updated = await coachService.updateProfile({
      tagline: 'New tagline',
      whatsappBusinessNumber: '+447700900999',
      email: 'coach@test.com',
    });
    expect(updated.tagline).toBe('New tagline');
    expect(updated.whatsappBusinessNumber).toBe('+447700900999');
    expect(updated.email).toBe('coach@test.com');
  });
});
