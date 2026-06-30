import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { IconCheck, IconChevRight } from '@/components/icons';
import { COACH_DAILY_SLOT_CAPACITY } from '@/data/seed';
import type { TodaySession } from '@/services/types';

/** Match dashboard sessions column (~583px): hide schedule side panel below this width. */
const TODAY_PANEL_COMPACT_WIDTH = 583;

function useTodayPanelCompact() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const update = () => {
      const { width } = el.getBoundingClientRect();
      setCompact(width < TODAY_PANEL_COMPACT_WIDTH);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { wrapRef, compact };
}

function parseMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function formatTimeParts(time: string): { clock: string; period: string } {
  const [hours24, minutes] = time.split(':').map(Number);
  const period = hours24 >= 12 ? 'pm' : 'am';
  const hours12 = hours24 % 12 || 12;
  return { clock: `${hours12}:${String(minutes).padStart(2, '0')}`, period };
}

function isClosed(state: TodaySession['state']): boolean {
  return state === 'done' || state === 'ended';
}

function ProgressRing({ done, total }: { done: number; total: number }) {
  const size = 72;
  const strokeWidth = 7;
  const center = size / 2;
  // Inset radius so round stroke caps stay inside the viewBox when scaled down on mobile.
  const radius = center - strokeWidth / 2 - 2;
  const circumference = 2 * Math.PI * radius;
  const progress = total > 0 ? done / total : 0;
  const offset = circumference * (1 - progress);
  const remaining = Math.max(0, total - done);

  return (
    <div className="ct-today-panel-ring">
      <svg viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          className="ct-today-panel-ring-track"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          className="ct-today-panel-ring-progress"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.7s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </svg>
      <div className="ct-today-panel-ring-label">
        <div className="ct-today-panel-ring-value">{remaining}</div>
        <div className="ct-today-panel-ring-caption">Left</div>
      </div>
    </div>
  );
}

function SessionRow({
  session,
  variant,
  isNext = false,
  to = '/solo-coach/today',
}: {
  session: TodaySession;
  variant: 'featured' | 'compact';
  isNext?: boolean;
  to?: string;
}) {
  const closed = isClosed(session.state);
  const showNext = isNext && !closed;
  const { clock, period } = formatTimeParts(session.time);

  return (
    <Link
      to={to}
      className={`ct-press ct-today-panel-row${variant === 'featured' ? ' is-featured' : ''}${closed ? ' is-closed' : ''}${showNext && variant === 'compact' ? ' is-next' : ''}`}
    >
      {closed ? (
        <span className="ct-today-panel-row-check">
          <IconCheck size={11} color="currentColor" />
        </span>
      ) : (
        <span className={`ct-today-panel-row-bar${showNext ? ' is-active' : ''}`} />
      )}
      <div className="ct-today-panel-row-time">
        <div>{clock}</div>
        {variant === 'featured' ? (
          <div className="ct-today-panel-row-period">{period}</div>
        ) : (
          <span className="ct-today-panel-row-period-inline">{period}</span>
        )}
      </div>
      <div className="ct-today-panel-row-copy">
        <div className="ct-today-panel-row-title">{session.title}</div>
        <div className="ct-today-panel-row-client">{session.who}</div>
      </div>
      {showNext ? <span className="ct-today-panel-row-badge">Next</span> : null}
      {!closed && variant === 'compact' ? (
        <span className="ct-today-panel-row-chevron">
          <IconChevRight size={13} color="currentColor" />
        </span>
      ) : null}
    </Link>
  );
}

export function TodaySessionsPanel({
  sessions,
  todayPath = '/solo-coach/today',
  calendarPath,
}: {
  sessions: TodaySession[];
  todayPath?: string;
  calendarPath?: string;
}) {
  const sorted = useMemo(
    () => [...sessions].sort((a, b) => parseMinutes(a.time) - parseMinutes(b.time)),
    [sessions],
  );

  const done = sessions.filter((s) => s.state === 'done').length;
  const total = COACH_DAILY_SLOT_CAPACITY;
  const nextSession =
    sessions.find((s) => s.state === 'ongoing') ?? sessions.find((s) => s.state === 'upcoming');
  const { wrapRef, compact } = useTodayPanelCompact();

  return (
    <div ref={wrapRef} className={`ct-today-panel-wrap${compact ? ' is-compact' : ''}`}>
      <div className="ct-today-panel">
        <div className="ct-today-panel-glow ct-today-panel-glow-top" />
        <div className="ct-today-panel-glow ct-today-panel-glow-bottom" />

        <div className="ct-today-panel-main">
          <div className="ct-today-panel-header">
            <div className="ct-today-panel-heading">
              <div className="ct-today-panel-kicker">Today&apos;s sessions</div>
              <div className="ct-today-panel-progress">
                {done}/{total} complete
              </div>
            </div>
            <ProgressRing done={done} total={total} />
          </div>

          {nextSession ? <SessionRow session={nextSession} variant="featured" isNext to={todayPath} /> : null}

          {calendarPath ? (
            <Link
              to={calendarPath}
              className="ct-today-panel-calendar-link ct-today-panel-calendar-link-compact ct-press"
            >
              Open full calendar →
            </Link>
          ) : null}
        </div>

        <div className="ct-today-panel-schedule">
          <div className="ct-today-panel-schedule-inner">
            {sorted.map((session) => (
              <SessionRow
                key={session.id}
                session={session}
                variant="compact"
                isNext={nextSession?.id === session.id}
                to={todayPath}
              />
            ))}
            {calendarPath ? (
              <Link to={calendarPath} className="ct-today-panel-calendar-link ct-press">
                Open full calendar →
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
