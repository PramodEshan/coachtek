import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Panel } from '@/components/ui';
import { IconAlert, IconLayers, IconUser, IconWallet } from '@/components/icons';
import { RoleDashboardWidget } from '@/components/dashboard/RoleDashboardWidget';
import { feedbackPillClass } from '@/utils/coachUi';
import { useRolePageLoading } from '@/context/PageLoadingContext';
import { operatorService, superadminService } from '@/services/api';
import type { AuditLogEntry, GymOrganization, OperatorComplaint, PendingCoach, SubscriptionTier } from '@/services/types';

export function SuperAdminDashboardPage() {
  const [stats, setStats] = useState<Awaited<ReturnType<typeof superadminService.stats>> | null>(null);
  const [dashboard, setDashboard] = useState<Awaited<ReturnType<typeof superadminService.dashboardSummary>> | null>(null);
  const [loading, setLoading] = useState(true);

  useRolePageLoading('superadmin-main', loading);

  useEffect(() => {
    Promise.all([superadminService.stats(), superadminService.dashboardSummary()])
      .then(([s, summary]) => {
        setStats(s);
        setDashboard(summary);
      })
      .finally(() => setLoading(false));
  }, []);

  if (!stats || !dashboard) return null;

  return (
    <div className="ct-page ct-dashboard-page">
      <RoleDashboardWidget
        kicker="Platform overview"
        title={`£${dashboard.platformRevenue.toLocaleString()} platform revenue`}
        ringValue={dashboard.revenueGrowthPct}
        ringCaption="Revenue growth"
        stats={[
          { value: String(dashboard.soloCoachCount), label: `+${dashboard.soloCoachGrowthPct}% solo coaches` },
          { value: String(dashboard.gymCount), label: `+${dashboard.gymGrowthPct}% gyms` },
          { value: String(dashboard.clientCount), label: `+${dashboard.clientGrowthPct}% clients` },
          { value: `${dashboard.revenueGrowthPct}%`, label: 'Payment growth' },
        ]}
        chartTitle="Client growth"
        chartPoints={dashboard.clientTrend}
        sideRows={[
          { title: 'Solo coach growth', meta: `${dashboard.soloCoachCount} active solo coaches`, badge: `+${dashboard.soloCoachGrowthPct}%` },
          { title: 'Gym growth', meta: `${dashboard.gymCount} active gyms`, badge: `+${dashboard.gymGrowthPct}%` },
          { title: 'Platform payments', meta: `£${dashboard.platformRevenue.toLocaleString()} collected`, badge: `+${dashboard.revenueGrowthPct}%` },
        ]}
        linkTo="/superadmin/gyms"
        linkLabel="View gym registry"
      />

      <div className="ct-dashboard-stats">
        {[
          { v: String(stats.escalatedComplaints), k: 'Escalated', icon: IconAlert, to: '/superadmin/escalations' },
          { v: String(stats.operators), k: 'Operators', icon: IconUser, to: '/superadmin/operators' },
          { v: String(dashboard.gymCount), k: 'Active gyms', icon: IconLayers, to: '/superadmin/gyms' },
          { v: String(stats.tierChanges30d), k: 'Tier changes (30d)', icon: IconWallet, to: '/superadmin/tiers' },
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

      <Panel>
        <div className="ct-panel-body">
          <div style={{ fontWeight: 600, marginBottom: 12 }}>Growth breakdown</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
            {[
              { label: 'Solo coaches', trend: dashboard.soloCoachTrend, pct: dashboard.soloCoachGrowthPct },
              { label: 'Gyms', trend: dashboard.gymTrend, pct: dashboard.gymGrowthPct },
              { label: 'Payments', trend: dashboard.revenueTrend, pct: dashboard.revenueGrowthPct },
            ].map((block) => (
              <div key={block.label} style={{ padding: 12, borderRadius: 'var(--ct-radius)', background: 'var(--ct-surface-soft)' }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{block.label}</div>
                <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>+{block.pct}%</div>
                <div className="ct-activity-chart" style={{ height: 72, marginTop: 8 }}>
                  {block.trend.map((point) => (
                    <div key={point.label} className="ct-activity-bar-wrap">
                      <div className="ct-activity-bar-area">
                        <div
                          className="ct-activity-bar"
                          style={{
                            height: `${Math.max((point.value / Math.max(...block.trend.map((p) => p.value), 1)) * 56, 6)}px`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Panel>
    </div>
  );
}

export function SuperAdminEscalationsPage() {
  const [items, setItems] = useState<OperatorComplaint[]>([]);
  const [loading, setLoading] = useState(true);

  useRolePageLoading('superadmin-main', loading);

  useEffect(() => {
    superadminService.escalations().then(setItems).finally(() => setLoading(false));
  }, []);

  return (
    <div className="ct-page">
      {items.length === 0 ? (
        <Panel><div className="ct-panel-body" style={{ color: 'var(--ct-text-muted)' }}>No escalated complaints.</div></Panel>
      ) : (
        items.map((item) => (
          <Panel key={item.id}>
            <div className="ct-panel-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{item.subject}</div>
                  <div style={{ fontSize: 12, color: 'var(--ct-text-muted)', marginTop: 4 }}>{item.submitterName} · {item.date}</div>
                </div>
                <span className={feedbackPillClass('open')}>escalated</span>
              </div>
              <p style={{ marginTop: 12, lineHeight: 1.5 }}>{item.body}</p>
              <button type="button" className="ct-btn-primary ct-press" style={{ marginTop: 12 }} onClick={() => void operatorService.updateComplaint(item.id, 'resolved', 'Resolved by super admin').then(() => superadminService.escalations().then(setItems))}>Resolve escalation</button>
            </div>
          </Panel>
        ))
      )}
    </div>
  );
}

export function SuperAdminOperatorsPage() {
  useRolePageLoading('superadmin-main');

  const operators = [
    { id: 'op1', name: 'Sam Operator', email: 'ops@coachtek.app', status: 'active' },
    { id: 'op2', name: 'Jordan Ops', email: 'jordan.ops@coachtek.app', status: 'active' },
  ];

  return (
    <div className="ct-page">
      <Panel style={{ overflow: 'hidden' }}>
        {operators.map((op, i) => (
          <div key={op.id} className="ct-row ct-clients-row" style={{ display: 'flex', padding: '14px 18px', borderTop: i ? '1px solid var(--ct-divider)' : undefined }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{op.name}</div>
              <div style={{ fontSize: 12, color: 'var(--ct-text-muted)' }}>{op.email}</div>
            </div>
            <span className="ct-pill ct-pill-done">{op.status}</span>
          </div>
        ))}
      </Panel>
    </div>
  );
}

export function SuperAdminTiersPage() {
  const [tiers, setTiers] = useState<SubscriptionTier[]>([]);
  const [loading, setLoading] = useState(true);

  useRolePageLoading('superadmin-main', loading);

  useEffect(() => {
    superadminService.tiers().then(setTiers).finally(() => setLoading(false));
  }, []);

  return (
    <div className="ct-page">
      <Panel><div className="ct-panel-body"><p style={{ fontSize: 14, color: 'var(--ct-text-muted)' }}>Global tier config with registration fee overrides and audit history (mock).</p></div></Panel>
      <Panel style={{ overflow: 'hidden' }}>
        {tiers.map((tier) => (
          <div key={tier.id} className="ct-row ct-table-row ct-clients-row">
            <span style={{ fontWeight: 600 }}>{tier.name}</span>
            <span>{tier.clientLimit >= 999 ? 'Custom' : tier.clientLimit}</span>
            <span>${tier.registrationFee || 'Custom'}</span>
            <span>${tier.monthlyFee}/mo</span>
          </div>
        ))}
      </Panel>
    </div>
  );
}

export function SuperAdminGymsPage() {
  const [gyms, setGyms] = useState<GymOrganization[]>([]);
  const [loading, setLoading] = useState(true);
  const [deactivateId, setDeactivateId] = useState<string | null>(null);
  const [reason, setReason] = useState('');

  useRolePageLoading('superadmin-main', loading);

  useEffect(() => {
    superadminService.gymOrgs().then(setGyms).finally(() => setLoading(false));
  }, []);

  const handleDeactivate = async (id: string) => {
    if (!reason.trim()) return;
    await superadminService.deactivateGym(id, reason);
    setGyms((prev) => prev.map((g) => g.id === id ? { ...g, status: 'deactivated' as const } : g));
    setDeactivateId(null);
    setReason('');
  };

  const handleOverride = async (id: string, status: 'active' | 'suspended') => {
    await superadminService.overrideGymStatus(id, status);
    setGyms((prev) => prev.map((g) => g.id === id ? { ...g, status } : g));
  };

  return (
    <div className="ct-page" style={{ maxWidth: 920 }}>
      <Panel style={{ overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 160px', padding: '10px 18px', fontSize: 12, fontWeight: 600 }}>
          <span>Gym</span><span>Location</span><span>Coaches</span><span>Status</span><span>Action</span>
        </div>
        {gyms.map((g, i) => (
          <div key={g.id}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 160px', padding: '12px 18px', borderTop: i ? '1px solid var(--ct-divider)' : undefined, fontSize: 13, alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{g.name}</div>
                <div style={{ fontSize: 11, color: 'var(--ct-text-muted)' }}>{g.primaryAdminEmail}</div>
              </div>
              <span>{g.location ?? '—'}</span>
              <span>{g.activeCoaches}</span>
              <span style={{
                display: 'inline-block', padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600, width: 'fit-content',
                background: g.status === 'active' ? 'var(--ct-accent-soft)' : g.status === 'suspended' ? '#fff3cd' : g.status === 'deactivated' ? '#fde8e8' : 'var(--ct-surface-soft)',
                color: g.status === 'active' ? 'var(--ct-neon-dark)' : g.status === 'suspended' ? '#664d03' : g.status === 'deactivated' ? '#9b1c1c' : 'var(--ct-text-muted)',
              }}>{g.status}</span>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {g.status !== 'deactivated' && <button type="button" className="ct-btn-secondary ct-press" style={{ fontSize: 11, color: '#c53030' }} onClick={() => setDeactivateId(g.id)}>Deactivate</button>}
                {g.status === 'suspended' && <button type="button" className="ct-btn-secondary ct-press" style={{ fontSize: 11 }} onClick={() => void handleOverride(g.id, 'active')}>Override → Active</button>}
              </div>
            </div>
            {deactivateId === g.id && (
              <div style={{ padding: '8px 18px 14px', display: 'flex', gap: 8, alignItems: 'center' }}>
                <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Deactivation reason (audit)" style={{ flex: 1, padding: '6px 10px', borderRadius: 6, border: '1px solid var(--ct-outline-variant)', fontSize: 13 }} />
                <button type="button" className="ct-btn-primary ct-press" style={{ fontSize: 12, background: '#c53030' }} onClick={() => void handleDeactivate(g.id)}>Confirm</button>
                <button type="button" className="ct-btn-secondary ct-press" style={{ fontSize: 12 }} onClick={() => { setDeactivateId(null); setReason(''); }}>Cancel</button>
              </div>
            )}
          </div>
        ))}
      </Panel>
    </div>
  );
}

export function SuperAdminSoloCoachesPage() {
  const [coaches, setCoaches] = useState<PendingCoach[]>([]);
  const [loading, setLoading] = useState(true);
  const [deactivateId, setDeactivateId] = useState<string | null>(null);
  const [reason, setReason] = useState('');

  useRolePageLoading('superadmin-main', loading);

  useEffect(() => {
    superadminService.soloCoachRegistry().then(setCoaches).finally(() => setLoading(false));
  }, []);

  const handleDeactivate = async (id: string) => {
    if (!reason.trim()) return;
    await superadminService.deactivateSoloCoach(id, reason);
    setCoaches((prev) => prev.map((c) => c.id === id ? { ...c, vettingStatus: 'rejected' as const } : c));
    setDeactivateId(null);
    setReason('');
  };

  return (
    <div className="ct-page" style={{ maxWidth: 860 }}>
      <Panel style={{ overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 120px', padding: '10px 18px', fontSize: 12, fontWeight: 600 }}>
          <span>Coach</span><span>Specialty</span><span>Status</span><span>Action</span>
        </div>
        {coaches.map((c, i) => (
          <div key={c.id}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 120px', padding: '12px 18px', borderTop: i ? '1px solid var(--ct-divider)' : undefined, fontSize: 13, alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{c.name}</div>
                <div style={{ fontSize: 11, color: 'var(--ct-text-muted)' }}>{c.email}</div>
              </div>
              <span>{c.specialty}</span>
              <span className={`ct-pill ${c.vettingStatus === 'approved' ? 'ct-pill-done' : c.vettingStatus === 'pending' ? 'ct-pill-pending' : 'ct-pill-overdue'}`}>{c.vettingStatus}</span>
              <div>
                {c.vettingStatus !== 'rejected' && <button type="button" className="ct-btn-secondary ct-press" style={{ fontSize: 11, color: '#c53030' }} onClick={() => setDeactivateId(c.id)}>Deactivate</button>}
              </div>
            </div>
            {deactivateId === c.id && (
              <div style={{ padding: '8px 18px 14px', display: 'flex', gap: 8, alignItems: 'center' }}>
                <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Deactivation reason (audit)" style={{ flex: 1, padding: '6px 10px', borderRadius: 6, border: '1px solid var(--ct-outline-variant)', fontSize: 13 }} />
                <button type="button" className="ct-btn-primary ct-press" style={{ fontSize: 12, background: '#c53030' }} onClick={() => void handleDeactivate(c.id)}>Confirm</button>
                <button type="button" className="ct-btn-secondary ct-press" style={{ fontSize: 12 }} onClick={() => { setDeactivateId(null); setReason(''); }}>Cancel</button>
              </div>
            )}
          </div>
        ))}
      </Panel>
    </div>
  );
}

export function SuperAdminAuditPage() {
  const [entries, setEntries] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useRolePageLoading('superadmin-main', loading);

  useEffect(() => {
    superadminService.auditLog().then(setEntries).finally(() => setLoading(false));
  }, []);

  return (
    <div className="ct-page">
      {entries.map((e) => (
        <Panel key={e.id}>
          <div className="ct-panel-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ fontWeight: 600 }}>{e.action}</div>
              <div style={{ fontSize: 12, color: 'var(--ct-text-muted)' }}>{e.at}</div>
            </div>
            <div style={{ fontSize: 13, color: 'var(--ct-text-muted)', marginTop: 4 }}>{e.actor}</div>
            <p style={{ marginTop: 8, fontSize: 14 }}>{e.detail}</p>
          </div>
        </Panel>
      ))}
    </div>
  );
}
