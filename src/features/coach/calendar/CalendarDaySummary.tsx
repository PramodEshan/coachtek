import {
  dayKind,
  formatMonthLong,
  parseIso,
  sortSessions,
} from '@/features/coach/calendar/calendarUtils';
import type { CalSession, OutOfOfficeBlock } from '@/services/types';

type CalendarDaySummaryProps = {
  iso: string;
  sessions: CalSession[];
  className?: string;
  onClick?: () => void;
  onPrevDay?: () => void;
  onNextDay?: () => void;
  block?: OutOfOfficeBlock | null;
  onUnblock?: () => void;
  onGoToday?: () => void;
};

export function CalendarDaySummary({
  iso,
  sessions,
  className,
  onClick,
  onPrevDay,
  onNextDay,
  block,
  onUnblock,
  onGoToday,
}: CalendarDaySummaryProps) {
  const { day } = parseIso(iso);
  const kind = dayKind(iso);
  const sorted = sortSessions(sessions);
  const hasNav = Boolean(onPrevDay || onNextDay);
  const isBlocked = Boolean(block);
  const isToday = kind === 'today';

  const classes = [
    'ct-calendar-day-summary',
    isToday && 'is-today',
    hasNav && 'has-nav',
    isBlocked && 'is-blocked',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const leftContent = (
    <div className="ct-calendar-day-summary-left">
      <div className="ct-calendar-day-summary-nav-row">
        {hasNav && onPrevDay ? (
          <button
            type="button"
            className="ct-press ct-calendar-nav-arrow"
            onClick={onPrevDay}
            aria-label="Previous day"
          >
            ←
          </button>
        ) : null}
        <span className="ct-calendar-day-summary-title">
          {formatMonthLong(iso)} {String(day).padStart(2, '0')}
        </span>
        {hasNav && onNextDay ? (
          <button
            type="button"
            className="ct-press ct-calendar-nav-arrow"
            onClick={onNextDay}
            aria-label="Next day"
          >
            →
          </button>
        ) : null}
        {!isToday && onGoToday ? (
          <button type="button" className="ct-press ct-calendar-today-btn" onClick={onGoToday}>
            Today
          </button>
        ) : null}
      </div>
    </div>
  );

  const rightContent = (
    <div className="ct-calendar-day-summary-right">
      {block ? (
        <div className="ct-calendar-day-summary-ooo-row">
          <span className="ct-calendar-day-ooo-tag">OOO · {block.reason}</span>
          {onUnblock ? (
            <button type="button" className="ct-press ct-calendar-day-ooo-clear-btn" onClick={onUnblock}>
              Mark available
            </button>
          ) : null}
        </div>
      ) : (
        <div className="ct-calendar-day-summary-stats">
          <div className="ct-calendar-day-summary-stat">
            <span className="ct-calendar-day-summary-stat-count">{sorted.length}</span>
            <span className="ct-calendar-day-summary-stat-label">Sessions</span>
          </div>
        </div>
      )}
    </div>
  );

  if (onClick) {
    return (
      <button type="button" className={`ct-press ${classes}`} onClick={onClick}>
        {leftContent}
        {rightContent}
      </button>
    );
  }

  return (
    <div className={classes}>
      {leftContent}
      {rightContent}
    </div>
  );
}
