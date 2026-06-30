import { MOCK_CALENDAR, MOCK_TODAY } from '@/data/seed';
import { CALENDAR_MONTH, CALENDAR_TODAY, parseIso } from '@/features/coach/calendar/calendarUtils';
import type { Earnings } from '@/services/types';

export function countRemainingMonthSessions(): number {
  let remaining = 0;

  for (const [iso, sessions] of Object.entries(MOCK_CALENDAR)) {
    const { month } = parseIso(iso);
    if (month !== CALENDAR_MONTH || sessions.length === 0) continue;

    if (iso > CALENDAR_TODAY) {
      remaining += sessions.length;
      continue;
    }

    if (iso === CALENDAR_TODAY) {
      remaining += MOCK_TODAY.filter((s) => s.state === 'ongoing' || s.state === 'upcoming').length;
    }
  }

  return remaining;
}

export function projectTargetIncome(earnings: Earnings, remainingSessions: number): number {
  const lockedIn = earnings.collected + earnings.pending;
  return lockedIn + remainingSessions * earnings.sessionRate;
}

export function lockedInIncome(earnings: Earnings): number {
  return earnings.collected + earnings.pending;
}

export function sessionUpsideIncome(earnings: Earnings, remainingSessions: number): number {
  return remainingSessions * earnings.sessionRate;
}

export function monthOverMonthDelta(earnings: Earnings): number {
  if (earnings.lastMonth <= 0) return 0;
  return Math.round(((earnings.thisMonth - earnings.lastMonth) / earnings.lastMonth) * 100);
}
