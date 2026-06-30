import type { CalSession } from '@/services/types';

function todayIso(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export const CALENDAR_TODAY = todayIso();
export const CALENDAR_YEAR = new Date().getFullYear();
export const CALENDAR_MONTH = new Date().getMonth() + 1;
export const CALENDAR_MONTH_SHORT = new Date().toLocaleString('en-US', { month: 'short' }).toUpperCase();
export const CALENDAR_DOW = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'] as const;

export function monthShortLabel(year: number, month: number): string {
  return new Date(year, month - 1, 1).toLocaleString('en-US', { month: 'short' }).toUpperCase();
}

export function monthLongLabel(year: number, month: number): string {
  return new Date(year, month - 1, 1).toLocaleString('en-US', { month: 'long', year: 'numeric' });
}

export function dayKind(iso: string): 'past' | 'today' | 'future' {
  if (iso < CALENDAR_TODAY) return 'past';
  if (iso > CALENDAR_TODAY) return 'future';
  return 'today';
}

export function toIso(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function parseIso(iso: string) {
  const [year, month, day] = iso.split('-').map(Number);
  return { year, month, day };
}

export function formatMonthLong(iso: string): string {
  const { year, month } = parseIso(iso);
  return new Date(year, month - 1, 1).toLocaleString('en-US', { month: 'long' }).toUpperCase();
}

export function formatWeekdayShort(iso: string): string {
  const { year, month, day } = parseIso(iso);
  return new Date(year, month - 1, day).toLocaleString('en-US', { weekday: 'short' }).toUpperCase();
}

export function getWeekStartIso(iso: string): string {
  const { year, month, day } = parseIso(iso);
  const date = new Date(year, month - 1, day);
  const monOffset = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - monOffset);
  return toIso(date);
}

export function getWeekDays(weekStartIso: string): string[] {
  const { year, month, day } = parseIso(weekStartIso);
  const start = new Date(year, month - 1, day);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return toIso(d);
  });
}

export function shiftIsoDay(iso: string, delta: number): string {
  const { year, month, day } = parseIso(iso);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + delta);
  return toIso(date);
}

export function sortSessions(sessions: CalSession[]): CalSession[] {
  return [...sessions].sort((a, b) => a.time.localeCompare(b.time));
}

export function sessionSummaryLines(sessions: CalSession[]): { label: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const session of sessions) {
    const label = session.mode.toUpperCase();
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  if (sessions.length === 0) {
    return [{ label: 'SESSIONS', count: 0 }];
  }
  return Array.from(counts.entries()).map(([label, count]) => ({ label, count }));
}

export const OOO_REASONS = ['Personal', 'Sick', 'Holiday', 'Other'] as const;

export function formatSessionDate(iso: string): string {
  const { year, month, day } = parseIso(iso);
  return new Date(year, month - 1, day).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function oooShortLabel(reason: string): string {
  switch (reason) {
    case 'Personal':
      return 'OOO';
    case 'Sick':
      return 'SICK';
    case 'Holiday':
      return 'HOL';
    default:
      return 'OOO';
  }
}

export function formatDayHeading(iso: string): string {
  const { year, month, day } = parseIso(iso);
  const date = new Date(year, month - 1, day);
  return date.toLocaleString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

export type RescheduleStrategy = 'within-week' | 'next-week';

export function rescheduleTargetIso(
  fromIso: string,
  pendingBlockIsos: Set<string>,
  strategy: RescheduleStrategy,
  existingBlocks: Set<string>,
): string {
  if (strategy === 'next-week') {
    return shiftIsoDay(fromIso, 7);
  }

  const weekStart = getWeekStartIso(fromIso);
  const weekEnd = shiftIsoDay(weekStart, 6);
  let cursor = shiftIsoDay(fromIso, 1);

  while (cursor <= weekEnd) {
    if (!pendingBlockIsos.has(cursor) && !existingBlocks.has(cursor)) {
      return cursor;
    }
    cursor = shiftIsoDay(cursor, 1);
  }

  return shiftIsoDay(fromIso, 7);
}
