import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Panel } from '@/components/ui';
import { IconAlert, IconCheck, IconClients, IconDashboard, IconLayers, IconWallet } from '@/components/icons';
import { RoleDashboardWidget } from '@/components/dashboard/RoleDashboardWidget';
import { useRolePageLoading } from '@/context/PageLoadingContext';
import { operatorService } from '@/services/api';
import type { OperatorDashboardSummary, OperatorFinancialOverview } from '@/services/types';

export function OperatorDashboardPage() {
  const [stats, setStats] = useState<Awaited<ReturnType<typeof operatorService.stats>> | null>(null);
  const [dashboard, setDashboard] = useState<OperatorDashboardSummary | null>(null);
  const [finance, setFinance] = useState<OperatorFinancialOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useRolePageLoading('operator-main', loading);

  useEffect(() => {
    Promise.all([operatorService.stats(), operatorService.dashboardSummary(), operatorService.financialOverview()])
      .then(([s, summary, fin]) => {
        setStats(s);
        setDashboard(summary);
        setFinance(fin);
      })
      .finally(() => setLoading(false));
  }, []);

  if (!stats || !dashboard || !finance) return null;

  return (
    <div className="ct-page ct-dashboard-page">
      <RoleDashboardWidget
        kicker="Platform operations"
        title={`${dashboard.pendingOnboarding} pending onboarding`}
        stats={[
          { value: String(dashboard.pendingSoloCoaches), label: 'Solo coaches waiting' },
          { value: String(dashboard.pendingGyms), label: 'Gyms waiting' },
          { value: String(dashboard.openComplaints), label: 'Open complaints' },
          { value: String(dashboard.newRegistrations7d), label: 'New this week' },
        ]}
        chartTitle="Pending onboarding (4 wks)"
        chartPoints={dashboard.onboardingTrend}
        sideRows={[
          { title: 'New registrations', meta: `${dashboard.newRegistrations7d} in the last 7 days`, badge: '7d' },
          { title: 'Active clients', meta: `${dashboard.activeClients} clients on platform`, badge: 'Live' },
        ]}
        linkTo="/operator/onboarding"
        linkLabel="Review onboarding queue"
      />

      <div className="ct-dashboard-stats">
        {[
          { v: String(stats.activeSoloCoaches), k: 'Solo coaches', icon: IconDashboard, to: '/operator/registries/solo-coaches' },
          { v: String(stats.registeredGyms), k: 'Registered gyms', icon: IconLayers, to: '/operator/registries/gyms' },
          { v: String(stats.pendingSoloCoaches), k: 'Pending onboarding', icon: IconCheck, to: '/operator/onboarding?tab=solo-coaches' },
          { v: String(stats.activeClients), k: 'Active clients', icon: IconClients, to: '/operator/assignments' },
          { v: String(stats.openComplaints), k: 'Open complaints', icon: IconAlert, to: '/operator/complaints' },
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

      <Panel style={{ marginTop: 14 }}>
        <div className="ct-panel-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <IconWallet size={18} />
            <div style={{ fontWeight: 600 }}>Financial oversight</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{finance.activeSubscriptions}</div>
              <div style={{ fontSize: 12, color: 'var(--ct-text-muted)' }}>Active subscriptions</div>
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{finance.expiringSoon}</div>
              <div style={{ fontSize: 12, color: 'var(--ct-text-muted)' }}>Expiring soon</div>
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{finance.failedPayments}</div>
              <div style={{ fontSize: 12, color: 'var(--ct-text-muted)' }}>Failed payments</div>
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>£{finance.revenueThisMonth}</div>
              <div style={{ fontSize: 12, color: 'var(--ct-text-muted)' }}>Revenue this month</div>
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>£{finance.revenueLastMonth}</div>
              <div style={{ fontSize: 12, color: 'var(--ct-text-muted)' }}>Revenue last month</div>
            </div>
          </div>
        </div>
      </Panel>

      <Panel>
        <div className="ct-panel-body">
          <div style={{ fontWeight: 600 }}>Registration trend</div>
          <div className="ct-activity-chart" style={{ marginTop: 12 }}>
            {dashboard.registrationTrend.map((point) => (
              <div key={point.label} className="ct-activity-bar-wrap">
                <div className="ct-activity-bar-area">
                  <div
                    className="ct-activity-bar"
                    style={{ height: `${Math.max((point.value / 6) * 80, 8)}px` }}
                  />
                </div>
                <div className="ct-activity-bar-label">{point.label}</div>
              </div>
            ))}
          </div>
        </div>
      </Panel>
    </div>
  );
}
