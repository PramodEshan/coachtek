import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Panel } from '@/components/ui';
import { IconCalendar, IconClients, IconDashboard, IconUser } from '@/components/icons';
import { RoleDashboardWidget } from '@/components/dashboard/RoleDashboardWidget';
import { useRolePageLoading } from '@/context/PageLoadingContext';
import { gymService } from '@/services/api';
import type { Client, ClientPaymentRecord, GymAdminDashboardSummary, GymCoachPayout, GymCoachProfile, GymStaffMember, GymSummary } from '@/services/types';

function growthLabel(pct: number): string {
  if (pct > 0) return `+${pct}% vs last month`;
  if (pct < 0) return `${pct}% vs last month`;
  return 'Flat vs last month';
}

export function GymAdminDashboardPage() {
  const [gym, setGym] = useState<GymSummary | null>(null);
  const [dashboard, setDashboard] = useState<GymAdminDashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useRolePageLoading('gym-admin-main', loading);

  useEffect(() => {
    Promise.all([gymService.summary(), gymService.adminDashboard()])
      .then(([summary, widget]) => {
        setGym(summary);
        setDashboard(widget);
      })
      .finally(() => setLoading(false));
  }, []);

  if (!gym || !dashboard) return null;

  return (
    <div className="ct-page ct-dashboard-page">
      <RoleDashboardWidget
        kicker={dashboard.gymName}
        title={`£${dashboard.revenueThisMonth.toLocaleString()} collected this month`}
        ringValue={dashboard.paymentGrowthPct}
        ringCaption="Payment growth"
        stats={[
          { value: String(dashboard.activeClients), label: `${growthLabel(dashboard.clientGrowthPct)} clients` },
          { value: String(dashboard.activeCoaches), label: `${growthLabel(dashboard.coachGrowthPct)} coaches` },
          { value: `£${dashboard.revenueLastMonth}`, label: 'Last month' },
          { value: `${dashboard.paymentGrowthPct}%`, label: 'Payment growth' },
        ]}
        chartTitle="Client growth"
        chartPoints={dashboard.clientTrend}
        sideRows={[
          { title: 'Coach headcount', meta: `${dashboard.activeCoaches} active coaches`, badge: `+${dashboard.coachGrowthPct}%` },
          { title: 'Payment trend', meta: `£${dashboard.revenueThisMonth} this month vs £${dashboard.revenueLastMonth} last month`, badge: `+${dashboard.paymentGrowthPct}%` },
        ]}
        linkTo="/gym/admin/payments"
        linkLabel="View client payments"
      />

      <div className="ct-dashboard-stats">
        {[
          { v: String(gym.activeCoaches), k: 'Active coaches', icon: IconUser, to: '/gym/admin/coaches' },
          { v: String(gym.activeClients), k: 'Active clients', icon: IconClients, to: '/gym/admin/clients' },
          { v: String(gym.sessionsThisWeek), k: 'Sessions this week', icon: IconCalendar, to: '/gym/admin/schedule' },
          { v: gym.revenueSnapshot, k: 'Revenue snapshot', icon: IconDashboard, to: '/gym/admin/reports' },
        ].map((s) => (
          <Link key={s.k} to={s.to} className="ct-dashboard-stat-card ct-press">
            <div className="ct-dashboard-stat-body">
              <div className="ct-dashboard-stat-icon"><s.icon size={20} /></div>
              <div>
                <div className="ct-dashboard-stat-value">{s.v}</div>
                <div className="ct-dashboard-stat-label">{s.k}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function GymAdminCoachesPage() {
  const [coaches, setCoaches] = useState<Awaited<ReturnType<typeof gymService.coaches>>>([]);
  const [loading, setLoading] = useState(true);

  useRolePageLoading('gym-admin-main', loading);

  useEffect(() => {
    gymService.coaches().then(setCoaches).finally(() => setLoading(false));
  }, []);

  return (
    <div className="ct-page">
      <Panel style={{ overflow: 'hidden' }}>
        {coaches.map((c, i) => (
          <div key={c.id} className="ct-row ct-clients-row" style={{ display: 'flex', padding: '14px 18px', gap: 12, borderTop: i ? '1px solid var(--ct-divider)' : undefined }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{c.name}</div>
              <div style={{ fontSize: 12, color: 'var(--ct-text-muted)' }}>{c.clients} clients</div>
            </div>
            <span className={`ct-pill ${c.status === 'active' ? 'ct-pill-done' : 'ct-pill-pending'}`}>{c.status}</span>
          </div>
        ))}
      </Panel>
    </div>
  );
}

export function GymAdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useRolePageLoading('gym-admin-main', loading);

  useEffect(() => {
    gymService.clients().then(setClients).finally(() => setLoading(false));
  }, []);

  return (
    <div className="ct-page">
      <Panel style={{ overflow: 'hidden' }}>
        <div className="ct-table-head ct-clients-table-head"><span>Client</span><span>Program</span><span>Status</span><span>Streak</span></div>
        {clients.map((c) => (
          <div key={c.id} className="ct-row ct-table-row ct-clients-row">
            <span style={{ fontWeight: 600 }}>{c.name}</span>
            <span>{c.program}</span>
            <span className="ct-pill ct-pill-done">{c.status}</span>
            <span>{c.streak}</span>
          </div>
        ))}
      </Panel>
    </div>
  );
}

export function GymAdminProgramsPage() {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState<Awaited<ReturnType<typeof gymService.programs>>>([]);
  const [coaches, setCoaches] = useState<GymCoachProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useRolePageLoading('gym-admin-main', loading);

  useEffect(() => {
    Promise.all([gymService.programs(), gymService.coachProfiles()])
      .then(([programList, coachProfiles]) => {
        setPrograms(programList);
        setCoaches(coachProfiles);
      })
      .finally(() => setLoading(false));
  }, []);

  function coachNames(program: (typeof programs)[number]): string {
    return (program.assignedCoachIds ?? [])
      .map((id) => coaches.find((c) => c.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  }

  return (
    <div className="ct-page">
      <Panel style={{ marginBottom: 16 }}>
        <div className="ct-panel-body">
          <div style={{ fontWeight: 700, fontSize: 15 }}>Monthly packages</div>
          <p style={{ fontSize: 13, color: 'var(--ct-text-muted)', marginTop: 8, lineHeight: 1.45 }}>
            Gym-owned program library. Assign packages to coaches — they deliver these templates to members but cannot create their own.
          </p>
          <button
            type="button"
            className="ct-btn-primary ct-press"
            style={{ marginTop: 14 }}
            onClick={() => navigate('/gym/admin/programs/new')}
          >
            New monthly package
          </button>
        </div>
      </Panel>

      <div className="ct-program-library">
        {programs.map((program) => (
          <article key={program.id} className="ct-program-card">
            <div className="ct-program-card-media">
              {program.coverUrl ? (
                <img src={program.coverUrl} alt="" className="ct-program-card-cover" />
              ) : (
                <div className="ct-program-card-cover ct-program-card-cover-empty" />
              )}
              <span className="ct-program-card-badge">{program.tag.toUpperCase()}</span>
            </div>
            <div className="ct-program-card-body">
              <div className="ct-program-card-headline">
                <h3 className="ct-program-card-title">{program.name}</h3>
                <span className="ct-program-card-meta">
                  {program.weeks} wks · {program.days}d/wk · {program.price} {program.priceLabel}
                </span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--ct-text-muted)', lineHeight: 1.45, margin: '8px 0 0' }}>
                {program.desc}
              </p>
              <div style={{ fontSize: 12.5, marginTop: 12, color: 'var(--ct-text-body)' }}>
                <span style={{ color: 'var(--ct-text-muted)' }}>Assigned coaches: </span>
                {coachNames(program) || 'None'}
              </div>
              <div style={{ fontSize: 12, color: 'var(--ct-text-muted)', marginTop: 6 }}>
                {program.assigned} active clients on this package
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                <button type="button" className="ct-program-card-action ct-press" onClick={() => navigate(`/gym/admin/programs/${program.id}/edit`)}>
                  Edit program
                </button>
                <button type="button" className="ct-btn-secondary ct-press" style={{ fontSize: 13 }}>
                  Manage assignments
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function GymAdminSchedulePage() {
  const [sessions, setSessions] = useState<Awaited<ReturnType<typeof gymService.todaySessions>>>([]);
  const [loading, setLoading] = useState(true);

  useRolePageLoading('gym-admin-main', loading);

  useEffect(() => {
    gymService.todaySessions().then(setSessions).finally(() => setLoading(false));
  }, []);

  return (
    <div className="ct-page">
      {sessions.map((s) => (
        <Panel key={s.id}>
          <div className="ct-panel-body" style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ fontWeight: 600 }}>{s.who}</div>
              <div style={{ fontSize: 12, color: 'var(--ct-text-muted)', marginTop: 4 }}>{s.time} · {s.title}</div>
            </div>
            <span className="ct-pill ct-pill-done">{s.state}</span>
          </div>
        </Panel>
      ))}
    </div>
  );
}

export function GymAdminStaffPage() {
  const [staff, setStaff] = useState<GymStaffMember[]>([]);
  const [loading, setLoading] = useState(true);

  useRolePageLoading('gym-admin-main', loading);

  useEffect(() => {
    gymService.staff().then(setStaff).finally(() => setLoading(false));
  }, []);

  return (
    <div className="ct-page">
      <Panel style={{ overflow: 'hidden' }}>
        {staff.map((m, i) => (
          <div key={m.id} className="ct-row ct-clients-row" style={{ display: 'flex', padding: '14px 18px', borderTop: i ? '1px solid var(--ct-divider)' : undefined }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{m.name}</div>
              <div style={{ fontSize: 12, color: 'var(--ct-text-muted)' }}>{m.email}</div>
            </div>
            <button type="button" className="ct-btn-secondary ct-press" style={{ fontSize: 12 }}>Manage</button>
          </div>
        ))}
      </Panel>
    </div>
  );
}

export function GymAdminReportsPage() {
  useRolePageLoading('gym-admin-main');
  const [exported, setExported] = useState(false);

  return (
    <div className="ct-page" style={{ maxWidth: 560 }}>
      <Panel>
        <div className="ct-panel-body">
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Activity summary</div>
          <p style={{ color: 'var(--ct-text-muted)', fontSize: 14, lineHeight: 1.5 }}>Export gym activity for the last 30 days. Read-only aggregate view — no platform reassignment.</p>
          {exported ? (
            <p style={{ marginTop: 16, fontWeight: 600, color: 'var(--ct-success)' }}>Report exported successfully.</p>
          ) : (
            <button type="button" className="ct-btn-secondary ct-press" style={{ marginTop: 16 }} onClick={() => setExported(true)}>Export summary</button>
          )}
        </div>
      </Panel>
    </div>
  );
}

export function GymAdminBillingPage() {
  useRolePageLoading('gym-admin-main');

  return (
    <div className="ct-page" style={{ maxWidth: 560 }}>
      <Panel>
        <div className="ct-panel-body">
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Gym subscription</div>
          <p style={{ fontSize: 14 }}>Iron District Fitness · Active</p>
          <p style={{ color: 'var(--ct-text-muted)', fontSize: 14, marginTop: 8 }}>Next invoice: £299 · 1 Jul 2026</p>
        </div>
      </Panel>
    </div>
  );
}

/* ─── Client Payments ─── */

export function GymAdminPaymentsPage() {
  const [payments, setPayments] = useState<ClientPaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useRolePageLoading('gym-admin-main', loading);

  useEffect(() => {
    gymService.clientPayments().then(setPayments).finally(() => setLoading(false));
  }, []);

  const total = payments.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amount, 0);

  return (
    <div className="ct-page" style={{ maxWidth: 860 }}>
      <Panel style={{ marginBottom: 16 }}>
        <div className="ct-panel-body" style={{ textAlign: 'center', padding: 20 }}>
          <div style={{ fontSize: 12, color: 'var(--ct-text-muted)' }}>Total collected</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>£{total.toLocaleString()}</div>
        </div>
      </Panel>
      <Panel style={{ overflow: 'hidden' }}>
        <div className="ct-table-head" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '10px 18px', fontSize: 12, fontWeight: 600 }}>
          <span>Client</span><span>Date</span><span>Amount</span><span>Status</span>
        </div>
        {payments.map((p, i) => (
          <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '12px 18px', borderTop: i ? '1px solid var(--ct-divider)' : undefined, fontSize: 13 }}>
            <span style={{ fontWeight: 600 }}>{p.clientName}</span>
            <span>{p.date}</span>
            <span style={{ fontWeight: 700 }}>£{p.amount}</span>
            <span style={{
              display: 'inline-block',
              padding: '2px 8px',
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 600,
              background: p.status === 'paid' ? 'var(--ct-accent-soft)' : '#fff3cd',
              color: p.status === 'paid' ? 'var(--ct-neon-dark)' : '#664d03',
              width: 'fit-content',
            }}>
              {p.status}
            </span>
          </div>
        ))}
      </Panel>
    </div>
  );
}

/* ─── Coach Payouts ─── */

export function GymAdminCoachPayoutsPage() {
  const [payouts, setPayouts] = useState<GymCoachPayout[]>([]);
  const [loading, setLoading] = useState(true);

  useRolePageLoading('gym-admin-main', loading);

  useEffect(() => {
    gymService.coachPayouts().then(setPayouts).finally(() => setLoading(false));
  }, []);

  return (
    <div className="ct-page" style={{ maxWidth: 860 }}>
      <Panel style={{ overflow: 'hidden' }}>
        <div className="ct-table-head" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '10px 18px', fontSize: 12, fontWeight: 600 }}>
          <span>Coach</span><span>Period</span><span>Amount</span><span>Status</span>
        </div>
        {payouts.map((p, i) => (
          <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '12px 18px', borderTop: i ? '1px solid var(--ct-divider)' : undefined, fontSize: 13 }}>
            <span style={{ fontWeight: 600 }}>{p.gymCoachName}</span>
            <span>{p.period}</span>
            <span style={{ fontWeight: 700 }}>£{p.amount.toLocaleString()}</span>
            <span style={{
              display: 'inline-block',
              padding: '2px 8px',
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 600,
              background: p.status === 'paid' ? 'var(--ct-accent-soft)' : p.status === 'processing' ? '#fff3cd' : 'var(--ct-surface-soft)',
              color: p.status === 'paid' ? 'var(--ct-neon-dark)' : p.status === 'processing' ? '#664d03' : 'var(--ct-text-muted)',
              width: 'fit-content',
            }}>
              {p.status}
            </span>
          </div>
        ))}
      </Panel>
    </div>
  );
}

/* ─── Profile Reviews ─── */

export function GymAdminReviewsPage() {
  const [coachQueue, setCoachQueue] = useState<GymCoachProfile[]>([]);
  const [clientQueue, setClientQueue] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'coaches' | 'clients'>('coaches');

  useRolePageLoading('gym-admin-main', loading);

  useEffect(() => {
    Promise.all([
      gymService.pendingCoachReviews(),
      gymService.pendingClientReviews(),
    ]).then(([c, cl]) => {
      setCoachQueue(c);
      setClientQueue(cl);
    }).finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id: string) => {
    await gymService.approveCoach(id);
    setCoachQueue((q) => q.filter((c) => c.id !== id));
  };
  const handleReject = async (id: string) => {
    await gymService.rejectCoach(id);
    setCoachQueue((q) => q.filter((c) => c.id !== id));
  };

  return (
    <div className="ct-page" style={{ maxWidth: 860 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button type="button" className={`ct-btn-secondary ct-press${tab === 'coaches' ? ' is-active' : ''}`} style={{ fontWeight: tab === 'coaches' ? 700 : 400, background: tab === 'coaches' ? 'var(--ct-accent-soft)' : undefined }} onClick={() => setTab('coaches')}>
          Coach reviews ({coachQueue.length})
        </button>
        <button type="button" className={`ct-btn-secondary ct-press${tab === 'clients' ? ' is-active' : ''}`} style={{ fontWeight: tab === 'clients' ? 700 : 400, background: tab === 'clients' ? 'var(--ct-accent-soft)' : undefined }} onClick={() => setTab('clients')}>
          Client reviews ({clientQueue.length})
        </button>
      </div>

      {tab === 'coaches' && (
        <Panel style={{ overflow: 'hidden' }}>
          {coachQueue.length === 0 ? (
            <div className="ct-panel-body"><p style={{ color: 'var(--ct-text-muted)', fontSize: 13 }}>No pending coach reviews</p></div>
          ) : (
            coachQueue.map((c, i) => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderTop: i ? '1px solid var(--ct-divider)' : undefined }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--ct-text-muted)' }}>{c.specialty} · {c.email}</div>
                </div>
                <button type="button" className="ct-btn-secondary ct-press" style={{ fontSize: 12, color: 'var(--ct-neon-dark)' }} onClick={() => void handleApprove(c.id)}>Approve</button>
                <button type="button" className="ct-btn-secondary ct-press" style={{ fontSize: 12, color: '#c53030' }} onClick={() => void handleReject(c.id)}>Reject</button>
              </div>
            ))
          )}
        </Panel>
      )}

      {tab === 'clients' && (
        <Panel style={{ overflow: 'hidden' }}>
          {clientQueue.length === 0 ? (
            <div className="ct-panel-body"><p style={{ color: 'var(--ct-text-muted)', fontSize: 13 }}>No pending client reviews</p></div>
          ) : (
            clientQueue.map((c, i) => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderTop: i ? '1px solid var(--ct-divider)' : undefined }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--ct-text-muted)' }}>{c.program}</div>
                </div>
              </div>
            ))
          )}
        </Panel>
      )}
    </div>
  );
}
