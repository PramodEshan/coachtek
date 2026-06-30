import { describe, it, expect, beforeEach, vi } from 'vitest';
import { clearDraft, loadDraft, saveDraft } from '@/utils/draftStorage';
import { whatsappContactLabel, whatsappDeepLink } from '@/utils/whatsapp';

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
});

describe('whatsapp utils', () => {
  it('builds wa.me link from phone digits', () => {
    expect(whatsappDeepLink('+44 7700 900123')).toBe('https://wa.me/447700900123');
  });

  it('appends encoded message when provided', () => {
    const url = whatsappDeepLink('+1555010142', 'Hi Jordan');
    expect(url).toContain('https://wa.me/1555010142');
    expect(url).toContain('text=Hi%20Jordan');
  });

  it('returns base wa.me when phone has no digits', () => {
    expect(whatsappDeepLink('')).toBe('https://wa.me/');
  });

  it('formats contact label with first name', () => {
    expect(whatsappContactLabel('Jordan Lee')).toBe('Hi Jordan, ');
  });
});

describe('draftStorage', () => {
  it('saves and loads a draft', () => {
    saveDraft('workout', { reps: '8', weight: '80' });
    expect(loadDraft<{ reps: string; weight: string }>('workout')).toEqual({ reps: '8', weight: '80' });
  });

  it('returns null for missing draft', () => {
    expect(loadDraft('missing')).toBeNull();
  });

  it('clears a draft', () => {
    saveDraft('feedback', { text: 'hello' });
    clearDraft('feedback');
    expect(loadDraft('feedback')).toBeNull();
  });
});
