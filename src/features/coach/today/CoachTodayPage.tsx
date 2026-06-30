import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Avatar } from '@/components/ui';
import { useCoachConsoleLoading } from '@/context/CoachConsoleContext';
import type { CoachOutletContext } from '@/layouts/coachOutletContext';
import { calendarService } from '@/services/api';
import { MOCK_CLIENTS } from '@/data/seed';
import type { TodaySession } from '@/services/types';

function sessionStatus(session: TodaySession, isNext: boolean): { label: string; tone: string } {
  if (session.state === 'ongoing') return { label: 'Live', tone: 'ongoing' };
  if (session.state === 'done') return { label: 'Complete', tone: 'done' };
  if (session.state === 'ended') return { label: 'Ended', tone: 'ended' };
  if (isNext) return { label: 'Next', tone: 'next' };
  return { label: 'Scheduled', tone: 'scheduled' };
}

export function CoachTodayPage() {
  const { setTitleExtra } = useOutletContext<CoachOutletContext>();
  const [sessions, setSessions] = useState<TodaySession[]>([]);
  const [loading, setLoading] = useState(true);

  useCoachConsoleLoading(loading);

  useEffect(() => {
    calendarService
      .today()
      .then(setSessions)
      .finally(() => setLoading(false));
  }, []);

  const done = sessions.filter((s) => s.state === 'done').length;
  const active =
    sessions.find((s) => s.state === 'ongoing') ?? sessions.find((s) => s.state === 'upcoming');

  useEffect(() => {
    if (loading) return;
    setTitleExtra(`${done}/${sessions.length} complete`);
    return () => setTitleExtra(null);
  }, [done, loading, sessions.length, setTitleExtra]);

  return (
    <div className="ct-today-list">
      <div className="ct-today-table">
        <div className="ct-today-head">
          <span>Time</span>
          <span>Program</span>
          <span>Client</span>
          <span>Status</span>
        </div>

        {sessions.map((s) => {
          const client = MOCK_CLIENTS.find((c) => c.id === s.clientId);
          const isActive = active?.id === s.id;
          const isMuted = s.state === 'done' || s.state === 'ended';
          const status = sessionStatus(s, isActive && s.state === 'upcoming');

          return (
            <div
              key={s.id}
              className={`ct-today-row ct-row${isActive ? ' is-next' : ''}${isMuted ? ' is-done' : ''}`}
            >
              <div className="ct-today-time">
                <span className="ct-today-time-range">
                  {s.time}
                  <span className="ct-today-time-sep">to</span>
                  {s.endTime}
                </span>
              </div>

              <div className="ct-today-program">{s.title}</div>

              <div className="ct-today-client-cell">
                <Avatar
                  initials={client?.initials ?? '??'}
                  tint={client?.tint ?? 'stone'}
                  size={40}
                  shape="round"
                />
                <span className="ct-today-client-name">{s.who}</span>
              </div>

              <div className="ct-today-status-cell">
                <span className={`ct-today-status ct-today-status-${status.tone}`}>{status.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
