import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Panel } from '@/components/ui';
import { IconClock, IconMessage } from '@/components/icons';
import { ClientProgressWidget } from '@/features/client/dashboard/ClientProgressWidget';
import { useRolePageLoading } from '@/context/PageLoadingContext';
import { clientService } from '@/services/api';
import type { ClientProfile, ClientProgressSummary } from '@/services/types';

export function ClientDashboardPage() {
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [progress, setProgress] = useState<ClientProgressSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useRolePageLoading('client-main', loading);

  useEffect(() => {
    Promise.all([clientService.profile(), clientService.progressSummary()])
      .then(([p, summary]) => {
        setProfile(p);
        setProgress(summary);
      })
      .finally(() => setLoading(false));
  }, []);

  if (!profile || !progress) return null;

  return (
    <div className="ct-page ct-dashboard-page">
      <ClientProgressWidget summary={progress} />

      <div className="ct-dashboard-stats">
        {[
          {
            v: `${progress.sessionsCompleted}/${progress.sessionsScheduled}`,
            k: 'Participation',
            icon: IconClock,
            to: '/client/progress',
          },
          {
            v: `${progress.participationRate}%`,
            k: 'Completion rate',
            icon: IconClock,
            to: '/client/progress',
          },
          {
            v: profile.todayWorkoutStatus === 'complete' ? 'Done' : 'Pending',
            k: "Today's workout",
            icon: IconClock,
            to: '/client/today',
          },
          { v: 'WA', k: 'WhatsApp coach', icon: IconMessage, to: '/client/messages' },
        ].map((stat) => (
          <Link key={stat.k} to={stat.to} className="ct-dashboard-stat-card ct-press">
            <div className="ct-dashboard-stat-body">
              <div className="ct-dashboard-stat-icon"><stat.icon size={20} /></div>
              <div>
                <div className="ct-dashboard-stat-value">{stat.v}</div>
                <div className="ct-dashboard-stat-label">{stat.k}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Panel>
        <div className="ct-panel-body">
          <div style={{ fontWeight: 600, fontSize: 15 }}>Coach: {profile.coachName}</div>
          <p style={{ marginTop: 6, color: 'var(--ct-text-muted)', fontSize: 14 }}>Program: {profile.program}</p>
          <p style={{ marginTop: 8, fontSize: 13, color: 'var(--ct-text-muted)', lineHeight: 1.45 }}>
            Log calories, weight, time, and how you felt after each session to track your progress.
          </p>
          <Link to="/client/today" className="ct-btn-primary ct-press" style={{ marginTop: 14, display: 'inline-flex' }}>
            {profile.todayWorkoutStatus === 'complete' ? 'View workout' : 'Start today\'s workout'}
          </Link>
        </div>
      </Panel>
    </div>
  );
}
