import { useState } from 'react';
import type { CalSession, OutOfOfficeReason } from '@/services/types';
import { formatSessionDate, type RescheduleStrategy } from '@/features/coach/calendar/calendarUtils';

type AffectedSession = { session: CalSession; fromIso: string };

type CalendarBlockConfirmDialogProps = {
  open: boolean;
  reason: OutOfOfficeReason;
  dates: string[];
  affectedSessions: AffectedSession[];
  onClose: () => void;
  onConfirm: (strategy: RescheduleStrategy, informClients: boolean) => void;
};

export function CalendarBlockConfirmDialog({
  open,
  reason,
  dates,
  affectedSessions,
  onClose,
  onConfirm,
}: CalendarBlockConfirmDialogProps) {
  const [strategy, setStrategy] = useState<RescheduleStrategy>('within-week');
  const [informClients, setInformClients] = useState(true);

  if (!open) return null;

  return (
    <div className="ct-calendar-dialog-backdrop" onClick={onClose}>
      <div
        className="ct-calendar-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="calendar-block-dialog-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="calendar-block-dialog-title" className="ct-calendar-dialog-title">
          Block {dates.length} day{dates.length === 1 ? '' : 's'} · {reason}
        </h2>
        <p className="ct-calendar-dialog-copy">
          {affectedSessions.length > 0
            ? `${affectedSessions.length} session${affectedSessions.length === 1 ? '' : 's'} fall on these dates. Choose how to reschedule and whether to notify clients.`
            : 'These days will be marked unavailable for new bookings.'}
        </p>

        {affectedSessions.length > 0 ? (
          <>
            <div className="ct-calendar-dialog-options">
              <label className="ct-calendar-dialog-option">
                <input
                  type="radio"
                  name="reschedule-strategy"
                  checked={strategy === 'within-week'}
                  onChange={() => setStrategy('within-week')}
                />
                <span>
                  <strong>Reschedule within this week</strong>
                  <span>Move sessions to the next open day in the same week.</span>
                </span>
              </label>
              <label className="ct-calendar-dialog-option">
                <input
                  type="radio"
                  name="reschedule-strategy"
                  checked={strategy === 'next-week'}
                  onChange={() => setStrategy('next-week')}
                />
                <span>
                  <strong>Reschedule to next week</strong>
                  <span>Keep the same weekday one week later.</span>
                </span>
              </label>
            </div>

            <label className="ct-calendar-dialog-check">
              <input
                type="checkbox"
                checked={informClients}
                onChange={(event) => setInformClients(event.target.checked)}
              />
              Inform affected clients by message
            </label>

            <ul className="ct-calendar-dialog-session-list">
              {affectedSessions.map(({ session, fromIso }) => (
                <li key={`${fromIso}-${session.id}`}>
                  {fromIso} · {session.time} · {session.title} · {session.who}
                </li>
              ))}
            </ul>
          </>
        ) : null}

        <div className="ct-calendar-dialog-actions">
          <button type="button" className="ct-press ct-calendar-dialog-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="ct-press ct-calendar-dialog-btn is-primary"
            onClick={() => onConfirm(strategy, informClients)}
          >
            {affectedSessions.length > 0 ? 'Block & reschedule' : 'Block dates'}
          </button>
        </div>
      </div>
    </div>
  );
}

type SessionPostponeDialogProps = {
  open: boolean;
  session: CalSession | null;
  fromIso: string;
  toIso: string;
  onClose: () => void;
  onConfirm: (informClient: boolean) => void;
};

export function SessionPostponeDialog({
  open,
  session,
  fromIso,
  toIso,
  onClose,
  onConfirm,
}: SessionPostponeDialogProps) {
  const [informClient, setInformClient] = useState(true);

  if (!open || !session) return null;

  return (
    <div className="ct-calendar-dialog-backdrop" onClick={onClose}>
      <div
        className="ct-calendar-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="calendar-postpone-dialog-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="calendar-postpone-dialog-title" className="ct-calendar-dialog-title">
          Postpone session
        </h2>
        <p className="ct-calendar-dialog-copy">
          Move <strong>{session.title}</strong> with {session.who} from {formatSessionDate(fromIso)} to{' '}
          {formatSessionDate(toIso)} at {session.time}.
        </p>
        <label className="ct-calendar-dialog-check">
          <input
            type="checkbox"
            checked={informClient}
            onChange={(event) => setInformClient(event.target.checked)}
          />
          Send client a message about the change
        </label>
        <div className="ct-calendar-dialog-actions">
          <button type="button" className="ct-press ct-calendar-dialog-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="ct-press ct-calendar-dialog-btn is-primary"
            onClick={() => onConfirm(informClient)}
          >
            Postpone & inform
          </button>
        </div>
      </div>
    </div>
  );
}
