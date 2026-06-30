import { describe, it, expect } from 'vitest';
import { EXERCISE_CATALOG, EXERCISE_CATEGORIES } from '@/data/exerciseCatalog';
import { legacyItemsToExercises, normalizeProgramDays, buildDefaultDays } from '@/utils/programStructure';

describe('exercise catalog integrity', () => {
  it('has at least 50 exercises', () => {
    expect(EXERCISE_CATALOG.length).toBeGreaterThanOrEqual(50);
  });

  it('every exercise has a unique id', () => {
    const ids = EXERCISE_CATALOG.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every exercise belongs to a known category', () => {
    for (const ex of EXERCISE_CATALOG) {
      expect(EXERCISE_CATEGORIES).toContain(ex.category);
    }
  });

  it('every exercise has positive defaultSets and non-empty defaults', () => {
    for (const ex of EXERCISE_CATALOG) {
      expect(ex.defaultSets).toBeGreaterThan(0);
      expect(ex.defaultReps.length).toBeGreaterThan(0);
      expect(ex.defaultRest.length).toBeGreaterThan(0);
    }
  });
});

describe('legacyItemsToExercises', () => {
  it('parses "Name NxM" format', () => {
    const result = legacyItemsToExercises(['Squat 4×5', 'Bench 3x8']);
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Squat');
    expect(result[0].sets).toBe(4);
    expect(result[0].reps).toBe('5');
    expect(result[1].name).toBe('Bench');
    expect(result[1].sets).toBe(3);
    expect(result[1].reps).toBe('8');
  });

  it('handles unparseable strings as custom exercises', () => {
    const result = legacyItemsToExercises(['Some random exercise']);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Some random exercise');
    expect(result[0].sets).toBe(3);
    expect(result[0].reps).toBe('10');
  });

  it('returns unique IDs per exercise', () => {
    const result = legacyItemsToExercises(['A 1×1', 'B 2×2', 'C 3×3']);
    const ids = result.map((e) => e.id);
    expect(new Set(ids).size).toBe(3);
  });
});

describe('normalizeProgramDays', () => {
  it('passes through new-format exercises untouched', () => {
    const input = [
      { day: 'Day 1', label: 'Upper', exercises: [{ id: 'x', name: 'Press', sets: 3, reps: '8', rest: '60s' }] },
    ];
    const result = normalizeProgramDays(input);
    expect(result[0].exercises[0].name).toBe('Press');
  });

  it('converts legacy items to exercises', () => {
    const input = [
      { day: 'Day 1', label: 'Lower', items: ['Squat 4×6', 'RDL 3×10'] },
    ];
    const result = normalizeProgramDays(input);
    expect(result[0].exercises).toHaveLength(2);
    expect(result[0].exercises[0].name).toBe('Squat');
    expect(result[0].exercises[1].name).toBe('RDL');
  });

  it('handles mixed structures', () => {
    const input = [
      { day: 'Day 1', label: 'A', exercises: [{ id: 'e1', name: 'X', sets: 1, reps: '1', rest: '30s' }] },
      { day: 'Day 2', label: 'B', items: ['Y 2×3'] },
    ];
    const result = normalizeProgramDays(input);
    expect(result[0].exercises[0].name).toBe('X');
    expect(result[1].exercises[0].name).toBe('Y');
  });
});

describe('buildDefaultDays', () => {
  it('creates the right number of days', () => {
    const days = buildDefaultDays(5);
    expect(days).toHaveLength(5);
    expect(days[0].day).toBe('Day 1');
    expect(days[4].day).toBe('Day 5');
  });

  it('creates empty exercises for each day', () => {
    const days = buildDefaultDays(3);
    for (const day of days) {
      expect(day.exercises).toEqual([]);
      expect(day.label).toBe('');
    }
  });
});
