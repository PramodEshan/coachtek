import { useState } from 'react';
import { IconChevRight } from '@/components/icons';
import {
  dayKind,
  formatWeekdayShort,
  parseIso,
  sessionSummaryLines,
  sortSessions,
} from '@/features/coach/calendar/calendarUtils';
import type { CalSession, OutOfOfficeBlock } from '@/services/types';

type CalendarWeekSummaryProps = {
  weekDays: string[];
  sessionsByDay: Record<string, CalSession[]>;
  blocksByDay: Record<string, OutOfOfficeBlock>;
  onOpenDay: (iso: string) => void;
  onPrevWeek?: () => void;
  onNextWeek?: () => void;
  onGoThisWeek?: () => void;
};

function formatWeekRange(weekDays: string[]): string {
  const start = parseIso(weekDays[0]!);
  const end = parseIso(weekDays[6]!);
  const startDate = new Date(start.year, start.month - 1, start.day);
  const endDate = new Date(end.year, end.month - 1, end.day);
  const sameMonth = start.month === end.month;

  const startPart = startDate.toLocaleString('en-US', {
    day: 'numeric',
    month: sameMonth ? undefined : 'short',
  });
  const endPart = endDate.toLocaleString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return `${startPart} – ${endPart}`;
}

export function CalendarWeekSummary({ weekDays, sessionsByDay, blocksByDay, onOpenDay, onPrevWeek, onNextWeek, onGoThisWeek }: CalendarWeekSummaryProps) {
  const [hoveredIso, setHoveredIso] = useState<string | null>(null);
  const weekSessions = weekDays.flatMap((iso) => sessionsByDay[iso] ?? []);
  const summary = sessionSummaryLines(weekSessions);
  const daysWithSessions = weekDays.filter((iso) => (sessionsByDay[iso] ?? []).length > 0).length;
  const hasToday = weekDays.some((iso) => dayKind(iso) === 'today');

  return (
    <div className="ct-calendar-week-view">
      <div className="ct-calendar-week-summary">
        <div className={`ct-calendar-week-summary-card${hasToday ? ' is-current' : ''}`}>
          <div className="ct-calendar-week-summary-left">
            <div className="ct-calendar-week-summary-nav-row">
              {onPrevWeek ? (
                <button
                  type="button"
                  className="ct-press ct-calendar-nav-arrow"
                  aria-label="Previous week"
                  onClick={onPrevWeek}
                >
                  ←
                </button>
              ) : null}
              <span className="ct-calendar-week-summary-title">{formatWeekRange(weekDays)}</span>
              {onNextWeek ? (
                <button
                  type="button"
                  className="ct-press ct-calendar-nav-arrow"
                  aria-label="Next week"
                  onClick={onNextWeek}
                >
                  →
                </button>
              ) : null}
              {!hasToday && onGoThisWeek ? (
                <button type="button" className="ct-press ct-calendar-today-btn" onClick={onGoThisWeek}>
                  This week
                </button>
              ) : null}
            </div>
            <div className="ct-calendar-week-summary-kicker">{hasToday ? 'This week' : 'Week view'}</div>
          </div>
          <div className="ct-calendar-week-summary-stats">
            <div className="ct-calendar-week-summary-stat">
              <span className="ct-calendar-week-summary-stat-count">{weekSessions.length}</span>
              <span className="ct-calendar-week-summary-stat-label">Sessions</span>
            </div>
            <div className="ct-calendar-week-summary-stat">
              <span className="ct-calendar-week-summary-stat-count">{daysWithSessions}</span>
              <span className="ct-calendar-week-summary-stat-label">Active days</span>
            </div>
            {summary.map((line) => (
              <div key={line.label} className="ct-calendar-week-summary-stat">
                <span className="ct-calendar-week-summary-stat-count">{line.count}</span>
                <span className="ct-calendar-week-summary-stat-label">{line.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="ct-calendar-week-days ct-scroll">
          {weekDays.map((iso) => {
            const sessions = sortSessions(sessionsByDay[iso] ?? []);
            const kind = dayKind(iso);
            const { day } = parseIso(iso);
            const isHighlighted = hoveredIso === iso;
            const isBlocked = !!blocksByDay[iso];

            return (
              <button
                key={iso}
                type="button"
                className={`ct-press ct-calendar-week-day-row${kind === 'today' ? ' is-today' : ''}${kind === 'past' ? ' is-past' : ''}${isHighlighted ? ' is-highlighted' : ''}${isBlocked ? ' is-blocked' : ''}`}
                onClick={() => onOpenDay(iso)}
                onMouseEnter={() => setHoveredIso(iso)}
                onMouseLeave={() => setHoveredIso(null)}
              >
                <div className="ct-calendar-week-day-row-date">
                  <span className="ct-calendar-week-day-row-dow">{formatWeekdayShort(iso)}</span>
                  <span className="ct-calendar-week-day-row-num">{day}</span>
                </div>
                <div className="ct-calendar-week-day-row-copy">
                  {isBlocked ? (
                    <span className="ct-calendar-week-day-row-empty">
                      Out of office · {blocksByDay[iso]?.reason}
                    </span>
                  ) : sessions.length === 0 ? (
                    <span className="ct-calendar-week-day-row-empty">No sessions</span>
                  ) : (
                    <>
                      <span className="ct-calendar-week-day-row-count">
                        {sessions.length} session{sessions.length === 1 ? '' : 's'}
                      </span>
                      <div className="ct-calendar-week-day-row-sessions">
                        {sessions.map((session) => (
                          <span key={session.id} className="ct-calendar-week-session-chip">
                            {session.time} · {session.title}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <IconChevRight size={18} className="ct-calendar-week-day-row-chevron" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
