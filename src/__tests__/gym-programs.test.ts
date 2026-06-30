import { describe, it, expect, beforeEach, vi } from 'vitest';
import { gymService } from '@/services/mock/gym';
import { writeSession } from '@/services/mock/auth';
import { resetStore } from '@/services/mock/store';
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
  writeSession({ user: MOCK_USERS['gym-admin@gym.demo'], token: 'mock-token' });
});

describe('gym service programs', () => {
  const input = {
    name: 'Gym Test Package',
    tag: 'Strength',
    weeks: 6,
    days: 3,
    price: '£99',
    priceLabel: 'per month',
    desc: 'A gym test package',
    structure: [{ day: 'Day 1', label: 'Full', exercises: [{ id: 'gtest-1', name: 'Squat', sets: 4, reps: '6', rest: '120s' }] }],
  };

  it('creates a gym program', async () => {
    const before = (await gymService.programs()).length;
    const program = await gymService.createProgram(input);
    expect(program.name).toBe('Gym Test Package');
    expect(program.source).toBe('gym');
    expect(program.gymId).toBe('gym-1');
    expect((await gymService.programs()).length).toBe(before + 1);
  });

  it('updates a gym program', async () => {
    const created = await gymService.createProgram(input);
    const updated = await gymService.updateProgram(created.id, { name: 'Renamed Package', weeks: 8 });
    expect(updated.name).toBe('Renamed Package');
    expect(updated.weeks).toBe(8);
  });

  it('retrieves a gym program by id', async () => {
    const created = await gymService.createProgram(input);
    const fetched = await gymService.getProgram(created.id);
    expect(fetched).not.toBeNull();
    expect(fetched!.id).toBe(created.id);
    expect(fetched!.name).toBe('Gym Test Package');
  });

  it('returns null for non-existent program', async () => {
    const fetched = await gymService.getProgram('nonexistent');
    expect(fetched).toBeNull();
  });

  it('lists existing gym programs from seed', async () => {
    const programs = await gymService.programs();
    expect(programs.length).toBeGreaterThanOrEqual(3);
    expect(programs.every((p) => p.source === 'gym')).toBe(true);
  });
});
