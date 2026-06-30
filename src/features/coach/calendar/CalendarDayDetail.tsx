import { sortSessions } from '@/features/coach/calendar/calendarUtils';
import { CalendarDaySummary } from '@/features/coach/calendar/CalendarDaySummary';
import type { CalSession, OutOfOfficeBlock } from '@/services/types';

type CalendarDayDetailProps = {
  iso: string;
  sessions: CalSession[];
  block?: OutOfOfficeBlock | null;
  onPrevDay?: () => void;
  onNextDay?: () => void;
  onPostpone: (session: CalSession) => void;
  onCancel: (session: CalSession) => void;
  onEdit: (session: CalSession) => void;
  onUnblock: () => void;
  onGoToday?: () => void;
};

export function CalendarDayDetail({
  iso,
  sessions,
  block,
  onPrevDay,
  onNextDay,
  onPostpone,
  onCancel,
  onEdit,
  onUnblock,
  onGoToday,
}: CalendarDayDetailProps) {
  const sorted = sortSessions(sessions);

  return (
    <div className="ct-calendar-day-view">
      <CalendarDaySummary
        iso={iso}
        sessions={sessions}
        onPrevDay={onPrevDay}
        onNextDay={onNextDay}
        block={block}
        onUnblock={onUnblock}
        onGoToday={onGoToday}
      />

      <div className="ct-calendar-day-events">
        {sorted.length === 0 ? (
          <div className="ct-calendar-day-empty">No sessions planned for this day.</div>
        ) : (
          sorted.map((session) => (
            <article key={session.id} className="ct-calendar-day-event">
              <div className="ct-calendar-day-event-time-col">
                <span className="ct-calendar-day-event-time">{session.time}</span>
              </div>
              <div className="ct-calendar-day-event-body">
                <div className="ct-calendar-day-event-head">
                  <span className="ct-calendar-day-event-mode">{session.mode}</span>
                </div>
                <h3 className="ct-calendar-day-event-title">{session.title}</h3>
                <p className="ct-calendar-day-event-who">{session.who}</p>
              </div>
              <div className="ct-calendar-day-event-actions">
                <button
                  type="button"
                  className="ct-press ct-calendar-day-action is-primary"
                  onClick={() => onPostpone(session)}
                >
                  Postpone +1 day
                </button>
                <button type="button" className="ct-press ct-calendar-day-action" onClick={() => onEdit(session)}>
                  Edit
                </button>
                <button
                  type="button"
                  className="ct-press ct-calendar-day-action is-danger"
                  onClick={() => onCancel(session)}
                >
                  Cancel
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

export { shiftIsoDay } from '@/features/coach/calendar/calendarUtils';
