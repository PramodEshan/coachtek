import { useCallback, useEffect, useMemo, useState } from 'react';
import { CalendarDayDetail, shiftIsoDay } from '@/features/coach/calendar/CalendarDayDetail';
import {
  CalendarBlockConfirmDialog,
  SessionPostponeDialog,
} from '@/features/coach/calendar/CalendarBlockConfirmDialog';
import { CalendarBlockDatesModal } from '@/features/coach/calendar/CalendarBlockDatesModal';
import { CalendarWeekSummary } from '@/features/coach/calendar/CalendarWeekSummary';
import { SessionFormModal } from '@/features/coach/calendar/SessionFormModal';
import {
  CALENDAR_DOW,
  CALENDAR_MONTH,
  CALENDAR_TODAY,
  CALENDAR_YEAR,
  dayKind,
  formatSessionDate,
  getWeekDays,
  getWeekStartIso,
  monthLongLabel,
  monthShortLabel,
  oooShortLabel,
  type RescheduleStrategy,
} from '@/features/coach/calendar/calendarUtils';
import { useCoachConsoleLoading } from '@/context/CoachConsoleContext';
import { usePwaPause } from '@/hooks/usePwaPause';
import { calendarService } from '@/services/api';
import type { CalSession, OutOfOfficeBlock, OutOfOfficeReason } from '@/services/types';

type View = 'Month' | 'Week' | 'Day';

type GridCell =
  | { type: 'pad' }
  | {
      type: 'day';
      iso: string;
      day: number;
      sessions: CalSession[];
      block?: OutOfOfficeBlock;
      kind: 'past' | 'today' | 'future';
    };

const MAX_MONTH_OFFSET = 3;

export function CoachCalendarPage() {
  const [viewYear, setViewYear] = useState(CALENDAR_YEAR);
  const [viewMonth, setViewMonth] = useState(CALENDAR_MONTH);
  const [sessionsByDay, setSessionsByDay] = useState<Record<string, CalSession[]>>({});
  const [blocksByDay, setBlocksByDay] = useState<Record<string, OutOfOfficeBlock>>({});
  const [view, setView] = useState<View>('Month');
  const [selectedDate, setSelectedDate] = useState(CALENDAR_TODAY);
  const [loading, setLoading] = useState(true);
  const [actionNote, setActionNote] = useState<string | null>(null);
  const [blockPickerOpen, setBlockPickerOpen] = useState(false);
  const [blockReason, setBlockReason] = useState<OutOfOfficeReason>('Personal');
  const [pickedDates, setPickedDates] = useState<string[]>([]);
  const [initialBlockedDates, setInitialBlockedDates] = useState<string[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [postponeTarget, setPostponeTarget] = useState<CalSession | null>(null);
  const [sessionFormOpen, setSessionFormOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<CalSession | null>(null);

  const monthOffset = useMemo(() => {
    return (viewYear - CALENDAR_YEAR) * 12 + (viewMonth - CALENDAR_MONTH);
  }, [viewYear, viewMonth]);

  const canGoBack = monthOffset > -MAX_MONTH_OFFSET;
  const canGoForward = monthOffset < MAX_MONTH_OFFSET;

  const goToPrevMonth = useCallback(() => {
    if (!canGoBack) return;
    setViewMonth((m) => {
      if (m === 1) {
        setViewYear((y) => y - 1);
        return 12;
      }
      return m - 1;
    });
    setActionNote(null);
  }, [canGoBack]);

  const goToNextMonth = useCallback(() => {
    if (!canGoForward) return;
    setViewMonth((m) => {
      if (m === 12) {
        setViewYear((y) => y + 1);
        return 1;
      }
      return m + 1;
    });
    setActionNote(null);
  }, [canGoForward]);

  useEffect(() => {
    if (view !== 'Month') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrevMonth();
      else if (e.key === 'ArrowRight') goToNextMonth();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [view, goToPrevMonth, goToNextMonth]);

  useCoachConsoleLoading(loading);

  const reloadCalendar = useCallback(async () => {
    const [sessions, blocks] = await Promise.all([
      calendarService.month(viewYear, viewMonth),
      calendarService.blocks(viewYear, viewMonth),
    ]);
    setSessionsByDay(sessions);
    setBlocksByDay(blocks);
  }, [viewYear, viewMonth]);

  useEffect(() => {
    reloadCalendar().finally(() => setLoading(false));
  }, [reloadCalendar]);

  useEffect(() => {
    if (!blockPickerOpen && !confirmOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [blockPickerOpen, confirmOpen]);

  const closeCalendarOverlays = useCallback(() => {
    setBlockPickerOpen(false);
    setConfirmOpen(false);
    setPostponeTarget(null);
  }, []);

  usePwaPause(closeCalendarOverlays);

  const gridCells = useMemo(() => {
    const daysInMonth = new Date(viewYear, viewMonth, 0).getDate();
    const monOffset = (new Date(viewYear, viewMonth - 1, 1).getDay() + 6) % 7;
    const cells: GridCell[] = Array.from({ length: monOffset }, () => ({ type: 'pad' as const }));

    for (let day = 1; day <= daysInMonth; day++) {
      const iso = `${viewYear}-${String(viewMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      cells.push({
        type: 'day',
        iso,
        day,
        sessions: sessionsByDay[iso] ?? [],
        block: blocksByDay[iso],
        kind: dayKind(iso),
      });
    }

    while (cells.length % 7 !== 0) {
      cells.push({ type: 'pad' });
    }

    return cells;
  }, [viewYear, viewMonth, sessionsByDay, blocksByDay]);

  const monthStats = useMemo(() => {
    const allSessions = Object.values(sessionsByDay).flat();
    const total = allSessions.length;
    const completed = 0;
    const upcoming = total;
    const blocked = Object.keys(blocksByDay).length;
    return { total, completed, upcoming, blocked };
  }, [sessionsByDay, blocksByDay]);

  const blockPickerCells = useMemo(
    () =>
      gridCells.map((cell) =>
        cell.type === 'pad'
          ? cell
          : {
              type: 'day' as const,
              iso: cell.iso,
              day: cell.day,
              sessions: cell.sessions,
              block: cell.block,
              kind: cell.kind,
            },
      ),
    [gridCells],
  );

  const weekDays = useMemo(() => getWeekDays(getWeekStartIso(selectedDate)), [selectedDate]);

  const newPickedDates = useMemo(
    () => pickedDates.filter((iso) => !initialBlockedDates.includes(iso)),
    [initialBlockedDates, pickedDates],
  );

  const datesToUnblock = useMemo(
    () => initialBlockedDates.filter((iso) => !pickedDates.includes(iso)),
    [initialBlockedDates, pickedDates],
  );

  const hasBlockChanges = useMemo(() => {
    const pickedSet = new Set(pickedDates);
    const initialSet = new Set(initialBlockedDates);

    if (pickedDates.length !== initialBlockedDates.length) return true;

    for (const iso of pickedDates) {
      if (!initialSet.has(iso)) return true;
      if (blocksByDay[iso]?.reason !== blockReason) return true;
    }

    for (const iso of initialBlockedDates) {
      if (!pickedSet.has(iso)) return true;
    }

    return false;
  }, [blockReason, blocksByDay, initialBlockedDates, pickedDates]);

  const affectedSessions = useMemo(
    () =>
      newPickedDates.flatMap((iso) =>
        (sessionsByDay[iso] ?? []).map((session) => ({ session, fromIso: iso })),
      ),
    [newPickedDates, sessionsByDay],
  );

  const selectedSessions = sessionsByDay[selectedDate] ?? [];
  const selectedBlock = blocksByDay[selectedDate] ?? null;

  const closeBlockFlow = useCallback(() => {
    setBlockPickerOpen(false);
    setPickedDates([]);
    setInitialBlockedDates([]);
    setConfirmOpen(false);
  }, []);

  const openDay = useCallback((iso: string) => {
    setSelectedDate(iso);
    setView('Day');
    setActionNote(null);
  }, []);

  const handleViewChange = useCallback((tab: View) => {
    setView(tab);
    setActionNote(null);
    if (tab === 'Day') setSelectedDate(CALENDAR_TODAY);
    if (tab === 'Week') setSelectedDate((current) => current || CALENDAR_TODAY);
  }, []);

  const togglePickedDate = useCallback((iso: string, kind: 'past' | 'today' | 'future') => {
    if (kind === 'past') return;
    setPickedDates((prev) => (prev.includes(iso) ? prev.filter((item) => item !== iso) : [...prev, iso].sort()));
  }, []);

  const startBlockFlow = useCallback(() => {
    const existing = Object.keys(blocksByDay).sort();
    setInitialBlockedDates(existing);
    setPickedDates(existing);
    setBlockReason(existing.length > 0 ? blocksByDay[existing[0]!]!.reason : 'Personal');
    setConfirmOpen(false);
    setBlockPickerOpen(true);
  }, [blocksByDay]);

  const applyBlockChanges = useCallback(async () => {
    for (const iso of datesToUnblock) {
      await calendarService.unblockDay(iso);
    }

    if (pickedDates.length > 0) {
      await calendarService.blockDays(pickedDates, blockReason);
    }

    await reloadCalendar();

    const clearedCount = datesToUnblock.length;
    const blockedCount = pickedDates.length;
    const updatedCount = pickedDates.filter((iso) => initialBlockedDates.includes(iso)).length;
    const addedCount = newPickedDates.length;

    if (addedCount > 0 && clearedCount > 0) {
      setActionNote(
        `Updated blocks: added ${addedCount} day${addedCount === 1 ? '' : 's'}, cleared ${clearedCount} day${clearedCount === 1 ? '' : 's'} (${blockReason}).`,
      );
    } else if (addedCount > 0) {
      setActionNote(`Blocked ${addedCount} day${addedCount === 1 ? '' : 's'} (${blockReason}).`);
    } else if (clearedCount > 0 && blockedCount === 0) {
      setActionNote(`Cleared ${clearedCount} blocked day${clearedCount === 1 ? '' : 's'}.`);
    } else if (clearedCount > 0) {
      setActionNote(
        `Updated blocks: ${blockedCount} day${blockedCount === 1 ? '' : 's'} kept, ${clearedCount} day${clearedCount === 1 ? '' : 's'} cleared (${blockReason}).`,
      );
    } else if (updatedCount > 0) {
      setActionNote(`Updated ${updatedCount} blocked day${updatedCount === 1 ? '' : 's'} (${blockReason}).`);
    }

    closeBlockFlow();
  }, [
    blockReason,
    closeBlockFlow,
    datesToUnblock,
    initialBlockedDates,
    newPickedDates.length,
    pickedDates,
    reloadCalendar,
  ]);

  const handleBlockContinue = useCallback(() => {
    if (!hasBlockChanges) return;
    setBlockPickerOpen(false);
    if (affectedSessions.length > 0) {
      setConfirmOpen(true);
      return;
    }
    void applyBlockChanges();
  }, [affectedSessions.length, applyBlockChanges, hasBlockChanges]);

  const handleBlockConfirm = useCallback(
    async (strategy: RescheduleStrategy, informClients: boolean) => {
      for (const iso of datesToUnblock) {
        await calendarService.unblockDay(iso);
      }

      const result =
        pickedDates.length > 0
          ? await calendarService.blockDays(pickedDates, blockReason, {
              reschedule: strategy,
              informClients,
              rescheduleDates: newPickedDates,
            })
          : { rescheduled: 0, messagesSent: 0 };

      await reloadCalendar();

      if (pickedDates.length > 0) {
        setActionNote(
          `Blocked ${newPickedDates.length} day${newPickedDates.length === 1 ? '' : 's'}. Rescheduled ${result.rescheduled} session${result.rescheduled === 1 ? '' : 's'}${informClients ? ` and sent ${result.messagesSent} message${result.messagesSent === 1 ? '' : 's'}` : ''}.`,
        );
      } else {
        setActionNote(`Cleared ${datesToUnblock.length} blocked day${datesToUnblock.length === 1 ? '' : 's'}.`);
      }

      closeBlockFlow();
    },
    [blockReason, closeBlockFlow, datesToUnblock, newPickedDates.length, pickedDates, reloadCalendar],
  );

  const handleCancel = useCallback(
    (session: CalSession) => {
      setSessionsByDay((prev) => {
        const daySessions = prev[selectedDate] ?? [];
        return {
          ...prev,
          [selectedDate]: daySessions.filter((s) => s.id !== session.id),
        };
      });
      setActionNote(`Cancelled "${session.title}" with ${session.who}.`);
    },
    [selectedDate],
  );

  const handlePostponeRequest = useCallback((session: CalSession) => {
    setPostponeTarget(session);
  }, []);

  const handlePostponeConfirm = useCallback(
    async (informClient: boolean) => {
      if (!postponeTarget) return;
      try {
        const { toIso, messageSent } = await calendarService.postponeSession(
          selectedDate,
          postponeTarget.id,
          informClient,
        );
        await reloadCalendar();
        setActionNote(
          messageSent
            ? `Postponed "${postponeTarget.title}" to ${formatSessionDate(toIso)} and notified ${postponeTarget.who}.`
            : `Postponed "${postponeTarget.title}" to ${formatSessionDate(toIso)}.`,
        );
      } catch {
        setActionNote(`Could not postpone "${postponeTarget.title}".`);
      } finally {
        setPostponeTarget(null);
      }
    },
    [postponeTarget, reloadCalendar, selectedDate],
  );

  const handleEdit = useCallback((session: CalSession) => {
    setEditingSession(session);
    setSessionFormOpen(true);
  }, []);

  const handleAddSession = useCallback(() => {
    setEditingSession(null);
    setSessionFormOpen(true);
  }, []);

  const handleUnblock = useCallback(async () => {
    await calendarService.unblockDay(selectedDate);
    setBlocksByDay((prev) => {
      const next = { ...prev };
      delete next[selectedDate];
      return next;
    });
    setActionNote(`Cleared out-of-office mark for ${selectedDate}.`);
  }, [selectedDate]);

  return (
    <div className="ct-page-wide ct-calendar-page">
      <div className="ct-calendar-toolbar">
        <div className="ct-calendar-view-tabs">
          {(['Month', 'Week', 'Day'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              className={`ct-press ct-calendar-view-tab${view === tab ? ' is-active' : ''}`}
              onClick={() => handleViewChange(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="ct-calendar-toolbar-actions">
          {view === 'Day' ? (
            <button type="button" className="ct-press ct-calendar-block-entry" onClick={handleAddSession}>
              Add session
            </button>
          ) : null}
          <button type="button" className="ct-press ct-calendar-block-entry" onClick={startBlockFlow}>
            Block dates
          </button>
        </div>
      </div>

      {actionNote ? <div className="ct-calendar-action-note">{actionNote}</div> : null}

      {view === 'Month' ? (
        <>
          <div className="ct-calendar-month-summary-card">
            <div className="ct-calendar-month-summary-left">
              <div className="ct-calendar-month-nav">
                <button
                  type="button"
                  className="ct-press ct-calendar-nav-arrow"
                  disabled={!canGoBack}
                  aria-label="Previous month"
                  onClick={goToPrevMonth}
                >
                  ←
                </button>
                <span className="ct-calendar-month-summary-title">{monthLongLabel(viewYear, viewMonth)}</span>
                <button
                  type="button"
                  className="ct-press ct-calendar-nav-arrow"
                  disabled={!canGoForward}
                  aria-label="Next month"
                  onClick={goToNextMonth}
                >
                  →
                </button>
                {monthOffset !== 0 ? (
                  <button
                    type="button"
                    className="ct-press ct-calendar-today-btn"
                    onClick={() => { setViewYear(CALENDAR_YEAR); setViewMonth(CALENDAR_MONTH); }}
                  >
                    Today
                  </button>
                ) : null}
              </div>
            </div>
            <div className="ct-calendar-month-summary-stats">
              <div className="ct-calendar-month-summary-stat">
                <span className="ct-calendar-month-summary-stat-count">{monthStats.total}</span>
                <span className="ct-calendar-month-summary-stat-label">Sessions</span>
              </div>
              <div className="ct-calendar-month-summary-stat">
                <span className="ct-calendar-month-summary-stat-count">{monthStats.completed}</span>
                <span className="ct-calendar-month-summary-stat-label">Completed</span>
              </div>
              <div className="ct-calendar-month-summary-stat">
                <span className="ct-calendar-month-summary-stat-count">{monthStats.upcoming}</span>
                <span className="ct-calendar-month-summary-stat-label">Upcoming</span>
              </div>
              <div className="ct-calendar-month-summary-stat">
                <span className="ct-calendar-month-summary-stat-count">{monthStats.blocked}</span>
                <span className="ct-calendar-month-summary-stat-label">Blocked days</span>
              </div>
            </div>
          </div>

          <div className="ct-calendar-month-shell">
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

              const sessions = cell.sessions;
              const sessionCount = sessions.length;
              const isPast = cell.kind === 'past';
              const isToday = cell.kind === 'today';
              const isBlocked = !!cell.block;

              return (
                <button
                  key={cell.iso}
                  type="button"
                  className={`ct-press ct-calendar-cell${isPast ? ' is-past' : ''}${isToday ? ' is-today' : ''}${!isPast && !isToday ? ' is-future' : ''}${sessionCount > 0 ? ' has-session' : ''}${isBlocked ? ' is-blocked' : ''}${selectedDate === cell.iso ? ' is-selected' : ''}`}
                  onClick={() => openDay(cell.iso)}
                >
                  <div className="ct-calendar-cell-head">
                    <div className="ct-calendar-month-label">{monthShortLabel(viewYear, viewMonth)}</div>
                    <div className="ct-calendar-day-num">{cell.day}</div>
                  </div>
                  {isBlocked ? (
                    <div className="ct-calendar-cell-ooo">
                      <span className="ct-calendar-cell-ooo-label">{oooShortLabel(cell.block!.reason)}</span>
                      <span className="ct-calendar-cell-ooo-reason">{cell.block!.reason}</span>
                    </div>
                  ) : null}
                  {!isBlocked && sessionCount > 0 ? (
                    <div className="ct-calendar-cell-sessions">
                      <div className="ct-calendar-session-summary">{sessions[0].title}</div>
                      <div
                        className="ct-calendar-session-dots"
                        aria-label={`${sessionCount} session${sessionCount === 1 ? '' : 's'}`}
                      >
                        {sessions.map((item) => (
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
        </>
      ) : null}

      {view === 'Week' ? (
        <CalendarWeekSummary
          weekDays={weekDays}
          sessionsByDay={sessionsByDay}
          blocksByDay={blocksByDay}
          onOpenDay={openDay}
          onPrevWeek={() => setSelectedDate((d) => shiftIsoDay(d, -7))}
          onNextWeek={() => setSelectedDate((d) => shiftIsoDay(d, 7))}
          onGoThisWeek={() => setSelectedDate(CALENDAR_TODAY)}
        />
      ) : null}

      {view === 'Day' ? (
        <CalendarDayDetail
          iso={selectedDate}
          sessions={selectedSessions}
          block={selectedBlock}
          onPrevDay={() => {
            setSelectedDate((d) => shiftIsoDay(d, -1));
            setActionNote(null);
          }}
          onNextDay={() => {
            setSelectedDate((d) => shiftIsoDay(d, 1));
            setActionNote(null);
          }}
          onPostpone={handlePostponeRequest}
          onCancel={handleCancel}
          onEdit={handleEdit}
          onUnblock={handleUnblock}
          onGoToday={() => { setSelectedDate(CALENDAR_TODAY); setActionNote(null); }}
        />
      ) : null}

      <CalendarBlockDatesModal
        open={blockPickerOpen}
        reason={blockReason}
        pickedDates={pickedDates}
        gridCells={blockPickerCells}
        canContinue={hasBlockChanges}
        onReasonChange={setBlockReason}
        onToggleDate={togglePickedDate}
        onClose={closeBlockFlow}
        onContinue={handleBlockContinue}
      />

      <CalendarBlockConfirmDialog
        open={confirmOpen}
        reason={blockReason}
        dates={pickedDates}
        affectedSessions={affectedSessions}
        onClose={() => {
          setConfirmOpen(false);
          setBlockPickerOpen(true);
        }}
        onConfirm={handleBlockConfirm}
      />

      <SessionPostponeDialog
        open={!!postponeTarget}
        session={postponeTarget}
        fromIso={selectedDate}
        toIso={shiftIsoDay(selectedDate, 1)}
        onClose={() => setPostponeTarget(null)}
        onConfirm={handlePostponeConfirm}
      />

      <SessionFormModal
        open={sessionFormOpen}
        iso={selectedDate}
        session={editingSession}
        onClose={() => {
          setSessionFormOpen(false);
          setEditingSession(null);
        }}
        onSave={async (iso, data) => {
          const saved = await calendarService.upsertSession(iso, data);
          await reloadCalendar();
          setActionNote(
            editingSession
              ? `Updated "${saved.title}" on ${formatSessionDate(iso)}.`
              : `Created "${saved.title}" on ${formatSessionDate(iso)}.`,
          );
        }}
      />
    </div>
  );
}
