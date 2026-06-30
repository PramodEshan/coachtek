import {
  CALENDAR_DOW,
  CALENDAR_MONTH_SHORT,
  OOO_REASONS,
  oooShortLabel,
} from '@/features/coach/calendar/calendarUtils';
import type { CalSession, OutOfOfficeBlock, OutOfOfficeReason } from '@/services/types';

type BlockGridCell =
  | { type: 'pad' }
  | {
      type: 'day';
      iso: string;
      day: number;
      sessions: CalSession[];
      block?: OutOfOfficeBlock;
      kind: 'past' | 'today' | 'future';
    };

type CalendarBlockDatesModalProps = {
  open: boolean;
  reason: OutOfOfficeReason;
  pickedDates: string[];
  gridCells: BlockGridCell[];
  canContinue: boolean;
  onReasonChange: (reason: OutOfOfficeReason) => void;
  onToggleDate: (iso: string, kind: 'past' | 'today' | 'future') => void;
  onClose: () => void;
  onContinue: () => void;
};

export function CalendarBlockDatesModal({
  open,
  reason,
  pickedDates,
  gridCells,
  canContinue,
  onReasonChange,
  onToggleDate,
  onClose,
  onContinue,
}: CalendarBlockDatesModalProps) {
  if (!open) return null;

  const pickedSet = new Set(pickedDates);

  return (
    <div className="ct-calendar-dialog-backdrop" onClick={onClose}>
      <div
        className="ct-calendar-dialog ct-calendar-block-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="calendar-block-picker-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="ct-calendar-block-modal-head">
          <div>
            <h2 id="calendar-block-picker-title" className="ct-calendar-dialog-title">
              Block dates
            </h2>
            <p className="ct-calendar-dialog-copy">
              Tap days to block or unblock. Existing blocks start selected — change the reason, add more days, or tap again to clear them.
            </p>
          </div>
          <button type="button" className="ct-press ct-calendar-block-modal-close" onClick={onClose}>
            Cancel
          </button>
        </div>

        <div className="ct-calendar-ooo-chips" role="group" aria-label="Out of office reason">
          {OOO_REASONS.map((item) => (
            <button
              key={item}
              type="button"
              className={`ct-press ct-calendar-ooo-chip${reason === item ? ' is-active' : ''}`}
              onClick={() => onReasonChange(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="ct-calendar-block-modal-grid-wrap">
          <div className="ct-calendar-dow">
            {CALENDAR_DOW.map((label) => (
              <div key={label} className="ct-calendar-dow-label">
                {label}
              </div>
            ))}
          </div>
          <div className="ct-calendar-grid">
            {gridCells.map((cell, index) => {
              if (cell.type === 'pad') {
                return <div key={`pad-${index}`} className="ct-calendar-cell is-pad" />;
              }

              const isPicked = pickedSet.has(cell.iso);
              const isPast = cell.kind === 'past';
              const isBlocked = !!cell.block;
              const sessionCount = cell.sessions.length;

              return (
                <button
                  key={cell.iso}
                  type="button"
                  disabled={isPast}
                  className={`ct-press ct-calendar-cell${isPast ? ' is-past' : ''}${cell.kind === 'today' ? ' is-today' : ''}${!isPast && cell.kind === 'future' ? ' is-future' : ''}${isBlocked ? ' is-blocked' : ''}${isPicked ? ' is-picked' : ''}${!isPast ? ' is-pickable' : ''}${sessionCount > 0 ? ' has-session' : ''}`}
                  onClick={() => onToggleDate(cell.iso, cell.kind)}
                >
                  <div className="ct-calendar-cell-head">
                    {isPicked ? (
                      <span className="ct-calendar-cell-pick-mark">{oooShortLabel(reason)}</span>
                    ) : isBlocked ? (
                      <span className="ct-calendar-cell-existing-mark">{oooShortLabel(cell.block!.reason)}</span>
                    ) : null}
                    <div className="ct-calendar-month-label">{CALENDAR_MONTH_SHORT}</div>
                    <div className="ct-calendar-day-num">{cell.day}</div>
                  </div>
                  {sessionCount > 0 ? (
                    <div className="ct-calendar-cell-sessions">
                      <div
                        className="ct-calendar-session-dots"
                        aria-label={`${sessionCount} session${sessionCount === 1 ? '' : 's'}`}
                      >
                        {cell.sessions.map((item) => (
                          <span key={item.id} className="ct-calendar-session-dot" aria-hidden />
                        ))}
                      </div>
                    </div>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="ct-calendar-dialog-actions">
          <button type="button" className="ct-press ct-calendar-dialog-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="ct-press ct-calendar-dialog-btn is-primary"
            disabled={!canContinue}
            onClick={onContinue}
          >
            Continue · {pickedDates.length} day{pickedDates.length === 1 ? '' : 's'}
          </button>
        </div>
      </div>
    </div>
  );
}

export type { BlockGridCell };
