import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { IconClients, IconClock, IconMessage, IconCheck } from '@/components/icons';
import { useCoachConsole, useCoachConsoleLoading } from '@/context/CoachConsoleContext';
import { coachDashboardQuickActions } from '@/config/coachConsoleConfig';
import { TodaySessionsPanel } from '@/features/coach/dashboard/TodaySessionsPanel';
import { calendarService, clientsService } from '@/services/api';
import { COACH_DAILY_SLOT_CAPACITY } from '@/data/seed';

export function CoachDashboardPage() {
  const config = useCoachConsole();
  const base = config.basePath;
  const [sessions, setSessions] = useState<Awaited<ReturnType<typeof calendarService.today>>>([]);
  const [activeClients, setActiveClients] = useState(0);
  const [unpaidThisMonth, setUnpaidThisMonth] = useState(0);
  const [loading, setLoading] = useState(true);

  useCoachConsoleLoading(loading);

  useEffect(() => {
    Promise.all([calendarService.today(), clientsService.list({ status: 'active' })])
      .then(([todaySessions, clients]) => {
        setSessions(todaySessions);
        setActiveClients(clients.length);
        setUnpaidThisMonth(clients.filter((c) => c.monthlyPayment === 'unpaid').length);
      })
      .finally(() => setLoading(false));
  }, []);

  const done = sessions.filter((s) => s.state === 'done').length;

  const stats = useMemo(
    () => [
      {
        v: `${done}/${sessions.length || 0}`,
        k: 'Sessions complete',
        icon: IconClock,
        to: `${base}/today`,
      },
      {
        v: String(activeClients).padStart(2, '0'),
        k: 'Active clients',
        icon: IconClients,
        to: `${base}/clients`,
      },
      {
        v: String(unpaidThisMonth).padStart(2, '0'),
        k: 'Unpaid this month',
        icon: IconCheck,
        to: `${base}/clients`,
      },
      {
        v: 'WA',
        k: 'WhatsApp contact',
        icon: IconMessage,
        to: `${base}/messages`,
      },
    ],
    [base, done, sessions.length, unpaidThisMonth, activeClients],
  );

  const weekRows = useMemo(() => {
    const completed = sessions.filter((s) => s.state === 'done').length;
    const notEnded = sessions.filter((s) => s.state === 'ongoing' || s.state === 'upcoming').length;
    const ended = sessions.filter((s) => s.state === 'done' || s.state === 'ended').length;
    const freeSlots = Math.max(0, COACH_DAILY_SLOT_CAPACITY - sessions.length);
    const todayPath = `${base}/today`;
    const calendarPath = config.features.calendar ? `${base}/calendar` : todayPath;

    return [
      {
        key: 'Completed sessions',
        value: String(completed),
        sub: 'Successfully finished',
        primary: true,
        to: todayPath,
      },
      {
        key: 'Ongoing sessions',
        value: String(notEnded),
        sub: 'Scheduled & in progress',
        primary: true,
        to: todayPath,
      },
      {
        key: 'Ended sessions',
        value: String(ended),
        sub: 'Closed today',
        primary: false,
        to: todayPath,
      },
      {
        key: config.features.calendar ? 'Available free slots' : 'Scheduled sessions',
        value: config.features.calendar ? String(freeSlots) : String(sessions.length),
        sub: config.features.calendar ? 'Open today' : 'Today\'s roster',
        primary: false,
        to: calendarPath,
      },
    ];
  }, [base, config.features.calendar, sessions]);

  const quickActions = coachDashboardQuickActions(config);

  return (
    <div className="ct-dashboard-page">
      <section>
        <div className="ct-dashboard-hero">
          <div className="ct-dashboard-sessions">
            <TodaySessionsPanel sessions={sessions} todayPath={`${base}/today`} calendarPath={config.features.calendar ? `${base}/calendar` : undefined} />
          </div>
          <div className="ct-dashboard-stats">
            {stats.map((s) => (
              <Link
                key={s.k}
                to={s.to}
                className="ct-press ct-coach-week-card ct-dashboard-stat-card"
              >
                <span className="ct-dashboard-stat-label">{s.k}</span>
                <div className="ct-dashboard-stat-body">
                  <span className="ct-dashboard-stat-icon">
                    <s.icon size={18} />
                  </span>
                  <span className="ct-dashboard-stat-value">{s.v}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="ct-dashboard-status-row">
        <div className="ct-dashboard-status-main">
          <div className="ct-section-divider">
            <h2>This week</h2>
            <div className="ct-section-divider-line" />
          </div>
          <div className="ct-dashboard-week-table">
            <div className="ct-dashboard-week-head">
              <span>Status</span>
              <span>Count</span>
              <span>Detail</span>
            </div>
            {weekRows.map((row, i) => (
              <Link
                key={row.key}
                to={row.to}
                className={`ct-press ct-dashboard-week-row${row.primary ? ' is-primary' : ''}${i === weekRows.length - 1 ? ' is-last' : ''}`}
              >
                <span className="ct-dashboard-week-metric">{row.key}</span>
                <span className="ct-dashboard-week-value">{row.value}</span>
                <span className="ct-dashboard-week-detail">{row.sub}</span>
              </Link>
            ))}
          </div>
        </div>

        <aside className="ct-dashboard-quick-panel">
          <div className="ct-section-divider">
            <h2>Quick actions</h2>
            <div className="ct-section-divider-line" />
          </div>
          <div className="ct-dashboard-quick-actions">
            {quickActions.map((action) => (
              <Link key={action.k} to={action.to} className="ct-press ct-coach-action ct-dashboard-quick-action">
                <div className="ct-dashboard-quick-action-media">
                  <img src={action.image} alt="" loading="lazy" decoding="async" />
                </div>
                <div className="ct-dashboard-quick-action-body">
                  <span className="ct-dashboard-quick-action-icon" aria-hidden>
                    <action.icon size={18} />
                  </span>
                  <div className="ct-dashboard-quick-action-copy">
                    <span className="ct-dashboard-quick-action-title">{action.k}</span>
                    <span className="ct-dashboard-quick-action-desc">{action.description}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
}
