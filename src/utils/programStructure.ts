import type { ProgramDay, ProgramExercise } from '@/services/types';

let _counter = 0;
function nextId(): string {
  return `pex-${Date.now()}-${++_counter}`;
}

/**
 * Parse legacy string items (e.g. "Squat 4×5") into structured ProgramExercise objects.
 */
export function legacyItemsToExercises(items: string[]): ProgramExercise[] {
  return items.map((raw) => {
    const match = raw.match(/^(.+?)\s+(\d+)\s*[×x]\s*(.+)$/i);
    if (match) {
      return {
        id: nextId(),
        name: match[1].trim(),
        sets: Number(match[2]),
        reps: match[3].trim(),
        rest: '60s',
      };
    }
    return { id: nextId(), name: raw.trim(), sets: 3, reps: '10', rest: '60s' };
  });
}

/**
 * Normalize a program structure array that might contain legacy `items` or new `exercises`.
 */
export function normalizeProgramDays(
  structure: Array<{ day: string; label: string; items?: string[]; exercises?: ProgramExercise[] }>,
): ProgramDay[] {
  return structure.map((entry) => ({
    day: entry.day,
    label: entry.label,
    exercises: entry.exercises ?? legacyItemsToExercises(entry.items ?? []),
  }));
}

/**
 * Create default empty days from a count.
 */
export function buildDefaultDays(count: number): ProgramDay[] {
  return Array.from({ length: count }, (_, i) => ({
    day: `Day ${i + 1}`,
    label: '',
    exercises: [],
  }));
}
