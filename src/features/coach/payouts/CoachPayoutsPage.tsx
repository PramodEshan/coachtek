import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Panel } from '@/components/ui';
import { IconCheck, IconClients, IconSend, IconTrendDown, IconTrendUp, IconWallet } from '@/components/icons';
import { useCoachConsole, useCoachConsoleLoading } from '@/context/CoachConsoleContext';
import {
  countRemainingMonthSessions,
  lockedInIncome,
  monthOverMonthDelta,
  projectTargetIncome,
  sessionUpsideIncome,
} from '@/features/coach/payouts/payoutUtils';
import { clientsService, coachService, messagesService } from '@/services/api';
import { paymentReminderText } from '@/utils/coachUi';
import type { Earnings } from '@/services/types';

export function CoachPayoutsPage() {
  const { basePath } = useCoachConsole();
  const [earnings, setEarnings] = useState<Earnings | null>(null);
  const [remindingAll, setRemindingAll] = useState(false);
  const [remindNote, setRemindNote] = useState<string | null>(null);

  useCoachConsoleLoading(earnings === null);

  useEffect(() => {
    coachService.earnings().then(setEarnings);
  }, []);

  const remainingSessions = useMemo(() => countRemainingMonthSessions(), []);

  const outlook = useMemo(() => {
    if (!earnings) return null;
    const lockedIn = lockedInIncome(earnings);
    const sessionUpside = sessionUpsideIncome(earnings, remainingSessions);
    const targetIncome = projectTargetIncome(earnings, remainingSessions);
    const delta = monthOverMonthDelta(earnings);
    const progress = targetIncome > 0 ? Math.min(100, Math.round((lockedIn / targetIncome) * 100)) : 0;
    const chartMax = Math.max(earnings.thisMonth, ...earnings.history.map((row) => row.amount));
    const chartRows = [
      ...earnings.history.slice().reverse(),
      { month: earnings.monthLabel, amount: earnings.thisMonth, date: 'In progress', clients: 0 },
    ];

    return { lockedIn, sessionUpside, targetIncome, delta, progress, chartMax, chartRows };
  }, [earnings, remainingSessions]);

  const remindAllUnpaid = async () => {
    setRemindingAll(true);
    setRemindNote(null);
    try {
      const clients = await clientsService.list({ status: 'active' });
      const unpaid = clients.filter((client) => client.monthlyPayment === 'unpaid');
      if (unpaid.length === 0) {
        setRemindNote('No unpaid clients this month.');
        return;
      }

      let sent = 0;
      for (const client of unpaid) {
        const thread = await messagesService.threadForClient(client.id);
        if (!thread) continue;
        await messagesService.send(thread.id, paymentReminderText(client.name));
        sent += 1;
      }

      setRemindNote(
        sent > 0
          ? `Payment reminders sent to ${sent} client${sent === 1 ? '' : 's'}.`
          : 'No message threads found for unpaid clients.',
      );
    } finally {
      setRemindingAll(false);
    }
  };

  if (!earnings || !outlook) return null;

  const { sessionUpside, targetIncome, delta, progress, chartMax, chartRows } = outlook;
  const deltaPositive = delta >= 0;

  return (
    <div className="ct-page ct-payouts-page">
      <section className="ct-payouts-hero">
        <div className="ct-payouts-hero-main">
          <div className="ct-payouts-hero-kicker">Monthly income · {earnings.monthLabel}</div>
          <div className="ct-payouts-hero-headline">
            <span className="ct-payouts-hero-amount">
              {earnings.currency}
              {earnings.thisMonth.toLocaleString()}
            </span>
            <span className={`ct-payouts-hero-delta${deltaPositive ? ' is-up' : ' is-down'}`}>
              {deltaPositive ? <IconTrendUp size={18} /> : <IconTrendDown size={18} />}
              {deltaPositive ? '+' : ''}
              {delta}% vs last month
            </span>
          </div>
          <p className="ct-payouts-hero-sub">
            {earnings.currency}
            {earnings.collected.toLocaleString()} collected · {earnings.currency}
            {earnings.pending.toLocaleString()} pending this cycle
          </p>
        </div>

        <div className="ct-payouts-chart" aria-hidden>
          {chartRows.map((row, i) => (
            <div key={row.month} className="ct-payouts-chart-col">
              <div
                className={`ct-payouts-chart-bar${i === chartRows.length - 1 ? ' is-current' : ''}`}
                style={{ height: `${Math.max(14, Math.round((row.amount / chartMax) * 100))}%` }}
              />
              <span className="ct-payouts-chart-label">{row.month.split(' ')[0]}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="ct-payouts-metrics">
        <Panel className="ct-payouts-metric-panel">
          <div className="ct-panel-body ct-payouts-target">
            <div className="ct-payouts-target-top">
              <div>
                <div className="ct-payouts-metric-label">Target income</div>
                <div className="ct-payouts-metric-value">
                  {earnings.currency}
                  {targetIncome.toLocaleString()}
                </div>
                <p className="ct-payouts-metric-sub">
                  Based on {remainingSessions} ongoing session{remainingSessions === 1 ? '' : 's'} ·{' '}
                  {earnings.currency}
                  {sessionUpside.toLocaleString()} session upside
                </p>
              </div>
              <div className="ct-payouts-target-ring" aria-hidden>
                <span className="ct-payouts-target-pct">{progress}%</span>
              </div>
            </div>

            <div className="ct-payouts-progress-track">
              <div className="ct-payouts-progress-fill" style={{ width: `${progress}%` }} />
            </div>

            <div className="ct-payouts-target-stats">
              <div className="ct-payouts-target-stat">
                <span className="ct-payouts-target-stat-label">Collected</span>
                <span className="ct-payouts-target-stat-value">
                  {earnings.currency}
                  {earnings.collected.toLocaleString()}
                </span>
              </div>
              <div className="ct-payouts-target-stat">
                <span className="ct-payouts-target-stat-label">Pending</span>
                <span className="ct-payouts-target-stat-value is-pending">
                  {earnings.currency}
                  {earnings.pending.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </Panel>

        <Panel className="ct-payouts-metric-panel">
          <div className="ct-panel-body">
            <div className="ct-payouts-metric-label">Bank account</div>
            <div className="ct-payouts-metric-value">{earnings.bankAccount}</div>
            <p className="ct-payouts-metric-sub">Linked for payouts on the {earnings.payoutDate}</p>
          </div>
        </Panel>
      </div>

      <Panel className="ct-payouts-pending-panel">
        <div className="ct-panel-header ct-payouts-pending-header">
          <div className="ct-payouts-pending-header-main">
            <span className="ct-panel-header-title">Pending payouts</span>
            <span className="ct-payouts-pending-total">
              {earnings.currency}
              {earnings.pending.toLocaleString()}
            </span>
          </div>
          <div className="ct-payouts-pending-header-actions">
            <Link to={`${basePath}/clients?filter=unpaid`} className="ct-btn-secondary ct-press ct-payouts-header-btn">
              <IconClients size={15} />
              View clients
            </Link>
            <button
              type="button"
              className="ct-btn-secondary ct-press ct-payouts-header-btn is-remind"
              disabled={remindingAll || earnings.pending <= 0}
              onClick={() => void remindAllUnpaid()}
            >
              <IconSend size={15} />
              {remindingAll ? 'Sending…' : 'Remind all'}
            </button>
          </div>
        </div>
        {remindNote ? <div className="ct-payouts-remind-note">{remindNote}</div> : null}
        {earnings.pendingPayouts.map((payout, i) => (
          <div key={payout.id} className={`ct-payouts-pending-row ct-row${i ? ' has-border' : ''}`}>
            <div className="ct-payouts-pending-icon">
              <IconWallet size={18} />
            </div>
            <div className="ct-payouts-pending-copy">
              <div className="ct-payouts-pending-label">{payout.label}</div>
              <div className="ct-payouts-pending-meta">
                Scheduled {payout.scheduledDate} · {payout.status}
              </div>
            </div>
            <span className="ct-payouts-pending-amount">
              {earnings.currency}
              {payout.amount.toLocaleString()}
            </span>
          </div>
        ))}
      </Panel>

      <div className="ct-payouts-history-section">
        <div className="ct-payouts-history-heading">Your payout history</div>
        <Panel className="ct-payouts-history-panel">
          {earnings.history.map((row, i) => (
            <div key={row.month} className={`ct-payouts-history-item ct-row${i ? ' has-border' : ''}`}>
              <div className="ct-payouts-history-icon">
                <IconCheck size={18} />
              </div>
              <div className="ct-payouts-history-copy">
                <div className="ct-payouts-history-month">{row.month}</div>
                <div className="ct-payouts-history-meta">
                  {row.date} · {row.clients} clients
                </div>
              </div>
              <span className="ct-payouts-history-amount">
                {earnings.currency}
                {row.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </Panel>
      </div>
    </div>
  );
}
