import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Panel } from '@/components/ui';
import { RoleDashboardWidget } from '@/components/dashboard/RoleDashboardWidget';
import { useRolePageLoading } from '@/context/PageLoadingContext';
import { gymService } from '@/services/api';
import type { Client, ClientPaymentRecord, GymStaffDashboardSummary } from '@/services/types';

export function GymStaffTodayPage() {
  const [dashboard, setDashboard] = useState<GymStaffDashboardSummary | null>(null);
  const [sessions, setSessions] = useState<Awaited<ReturnType<typeof gymService.todaySessions>>>([]);
  const [loading, setLoading] = useState(true);
  const [assistedIds, setAssistedIds] = useState<Set<string>>(new Set());

  useRolePageLoading('gym-staff-main', loading);

  useEffect(() => {
    Promise.all([gymService.staffDashboard(), gymService.todaySessions()])
      .then(([summary, rows]) => {
        setDashboard(summary);
        setSessions(rows);
      })
      .finally(() => setLoading(false));
  }, []);

  if (!dashboard) return null;

  return (
    <div className="ct-page ct-dashboard-page">
      <RoleDashboardWidget
        kicker={dashboard.gymName}
        title={`${dashboard.attendedToday} attended today`}
        ringValue={dashboard.attendanceRate}
        ringCaption="Checked in"
        stats={[
          { value: String(dashboard.inGymNow), label: 'In gym now' },
          { value: String(dashboard.checkInsPending), label: 'Pending check-in' },
          { value: String(dashboard.expectedToday), label: 'Sessions today' },
          { value: String(dashboard.unpaidPayments), label: 'Unpaid bills' },
        ]}
        chartTitle="Weekly gym attendance"
        chartPoints={dashboard.weeklyAttendance}
        linkTo="/gym/staff/clients"
        linkLabel="View all clients"
      />

      <Panel>
        <div className="ct-panel-body">
          <div style={{ fontWeight: 700 }}>Today&apos;s gym schedule</div>
          <p style={{ fontSize: 13, color: 'var(--ct-text-muted)', marginTop: 4 }}>Read-only view for front desk</p>
        </div>
      </Panel>

      {sessions.map((s) => (
        <Panel key={s.id}>
          <div className="ct-panel-body" style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ fontWeight: 600 }}>{s.who}</div>
              <div style={{ fontSize: 12, color: 'var(--ct-text-muted)' }}>{s.time} · {s.title}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className={`ct-pill ${s.state === 'done' || s.state === 'ended' ? 'ct-pill-done' : s.state === 'ongoing' ? 'ct-pill-pending' : ''}`}>
                {s.state === 'done' || s.state === 'ended' ? 'Attended' : s.state === 'ongoing' ? 'In gym' : 'Expected'}
              </span>
              {assistedIds.has(s.id) ? (
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ct-success)' }}>Assisted</span>
              ) : (
                <button type="button" className="ct-btn-secondary ct-press" style={{ fontSize: 12 }} onClick={() => setAssistedIds((prev) => new Set(prev).add(s.id))}>
                  Assist
                </button>
              )}
            </div>
          </div>
        </Panel>
      ))}

      <Link to="/gym/staff/payments" className="ct-btn-secondary ct-press" style={{ width: 'fit-content' }}>
        View payment status
      </Link>
    </div>
  );
}

export function GymStaffClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useRolePageLoading('gym-staff-main', loading);

  useEffect(() => {
    gymService.clients().then(setClients).finally(() => setLoading(false));
  }, []);

  return (
    <div className="ct-page">
      {clients.map((c) => (
        <Panel key={c.id}>
          <div className="ct-panel-body" style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ fontWeight: 600 }}>{c.name}</div>
              <div style={{ fontSize: 12, color: 'var(--ct-text-muted)' }}>Streak {c.streak} · {c.program}</div>
            </div>
            <span className="ct-pill ct-pill-done">{c.status}</span>
          </div>
        </Panel>
      ))}
    </div>
  );
}

export function GymStaffMessagesPage() {
  useRolePageLoading('gym-staff-main');

  return (
    <div className="ct-page ct-page-messages">
      <Panel className="ct-messages-thread-panel ct-messages-thread">
        <div className="ct-messages-thread-head">
          <div className="ct-messages-thread-head-name">Gym support</div>
          <div className="ct-messages-thread-head-detail">Front desk channel</div>
        </div>
        <div className="ct-messages-thread-body ct-scroll">
          <div className="ct-messages-bubble-wrap">
            <div className="ct-messages-bubble">Welcome to Iron District — how can we help today?</div>
          </div>
        </div>
        <form className="ct-messages-compose" onSubmit={(e) => e.preventDefault()}>
          <div className="ct-messages-compose-inner">
            <input placeholder="Message client…" />
            <button type="submit" className="ct-press ct-messages-send" aria-label="Send">→</button>
          </div>
        </form>
      </Panel>
    </div>
  );
}

export function GymStaffPaymentsPage() {
  const [payments, setPayments] = useState<ClientPaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useRolePageLoading('gym-staff-main', loading);

  useEffect(() => {
    gymService.clientPayments().then(setPayments).finally(() => setLoading(false));
  }, []);

  return (
    <div className="ct-page" style={{ maxWidth: 860 }}>
      <Panel style={{ marginBottom: 12 }}>
        <div className="ct-panel-body">
          <p style={{ fontSize: 13, color: 'var(--ct-text-muted)' }}>Read-only view of client payment status. Contact gym admin for billing actions.</p>
        </div>
      </Panel>
      <Panel style={{ overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '10px 18px', fontSize: 12, fontWeight: 600 }}>
          <span>Client</span><span>Date</span><span>Amount</span><span>Status</span>
        </div>
        {payments.map((p, i) => (
          <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '12px 18px', borderTop: i ? '1px solid var(--ct-divider)' : undefined, fontSize: 13 }}>
            <span style={{ fontWeight: 600 }}>{p.clientName}</span>
            <span>{p.date}</span>
            <span>£{p.amount}</span>
            <span style={{
              display: 'inline-block', padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600, width: 'fit-content',
              background: p.status === 'paid' ? 'var(--ct-accent-soft)' : '#fff3cd',
              color: p.status === 'paid' ? 'var(--ct-neon-dark)' : '#664d03',
            }}>{p.status}</span>
          </div>
        ))}
      </Panel>
    </div>
  );
}

export function GymStaffHelpPage() {
  useRolePageLoading('gym-staff-main');

  return (
    <div className="ct-page" style={{ maxWidth: 560 }}>
      <Panel>
        <div className="ct-panel-body">
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Staff resources</div>
          <ul style={{ paddingLeft: 18, lineHeight: 1.7, fontSize: 14, color: 'var(--ct-text-body)' }}>
            <li>View today&apos;s schedule and client check-in status</li>
            <li>Message clients via gym support thread</li>
            <li>Cannot approve coaches, reassign clients, or manage billing</li>
          </ul>
        </div>
      </Panel>
    </div>
  );
}
