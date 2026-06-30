import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Panel } from '@/components/ui';
import { useRolePageLoading } from '@/context/PageLoadingContext';
import { operatorService } from '@/services/api';
import type { GymOrganization, PendingCoach } from '@/services/types';

type Tab = 'register-gym' | 'solo-coaches';

export function OperatorOnboardingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState<Tab>((searchParams.get('tab') as Tab) || 'register-gym');
  const [coaches, setCoaches] = useState<PendingCoach[]>([]);
  const [gyms, setGyms] = useState<GymOrganization[]>([]);
  const [loading, setLoading] = useState(true);

  const [gymName, setGymName] = useState('');
  const [gymLocation, setGymLocation] = useState('');
  const [gymPlan, setGymPlan] = useState('1-on-1 Starter');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState<string | null>(null);

  useRolePageLoading('operator-main', loading);

  useEffect(() => {
    Promise.all([
      operatorService.pendingCoaches(),
      operatorService.gymOrgs(),
    ]).then(([c, g]) => {
      setCoaches(c);
      setGyms(g);
    }).finally(() => setLoading(false));
  }, []);

  const switchTab = (t: Tab) => {
    setTab(t);
    setSearchParams({ tab: t });
  };

  const handleRegisterGym = async () => {
    if (!gymName.trim() || !adminEmail.trim()) return;
    setRegistering(true);
    try {
      await operatorService.registerGym({ name: gymName, location: gymLocation || undefined, plan: gymPlan, adminName, adminEmail });
      setRegistered(gymName);
      setGymName('');
      setGymLocation('');
      setAdminName('');
      setAdminEmail('');
      const updated = await operatorService.gymOrgs();
      setGyms(updated);
    } finally {
      setRegistering(false);
    }
  };

  const pendingGyms = gyms.filter((g) => g.status === 'pending').length;

  return (
    <div className="ct-page" style={{ maxWidth: 860 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
        <span style={{ fontSize: 13, color: 'var(--ct-text-muted)' }}>
          {coaches.length} pending coaches · {pendingGyms} pending gyms
        </span>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button type="button" className="ct-btn-secondary ct-press" style={{ fontWeight: tab === 'register-gym' ? 700 : 400, background: tab === 'register-gym' ? 'var(--ct-accent-soft)' : undefined }} onClick={() => switchTab('register-gym')}>
          Register gym
        </button>
        <button type="button" className="ct-btn-secondary ct-press" style={{ fontWeight: tab === 'solo-coaches' ? 700 : 400, background: tab === 'solo-coaches' ? 'var(--ct-accent-soft)' : undefined }} onClick={() => switchTab('solo-coaches')}>
          Vet solo coaches ({coaches.length})
        </button>
      </div>

      {tab === 'register-gym' && (
        <>
          <Panel style={{ marginBottom: 16 }}>
            <div className="ct-panel-body">
              <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Register a new gym</h3>
              <div className="ct-field"><label>Gym name *</label><input value={gymName} onChange={(e) => setGymName(e.target.value)} placeholder="e.g. Harbor Wellness" /></div>
              <div className="ct-field"><label>Location</label><input value={gymLocation} onChange={(e) => setGymLocation(e.target.value)} placeholder="City, Country" /></div>
              <div className="ct-field"><label>Subscription plan</label>
                <select value={gymPlan} onChange={(e) => setGymPlan(e.target.value)} style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid var(--ct-outline-variant)', fontSize: 14 }}>
                  <option>1-on-1 Starter</option><option>1-on-1 Growth</option><option>1-on-1 Pro</option><option>1-on-1 Elite</option>
                </select>
              </div>
              <div className="ct-field"><label>Primary admin name</label><input value={adminName} onChange={(e) => setAdminName(e.target.value)} /></div>
              <div className="ct-field"><label>Primary admin email *</label><input value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} type="email" /></div>
              <button type="button" className="ct-btn-primary ct-press" disabled={registering || !gymName.trim() || !adminEmail.trim()} onClick={() => void handleRegisterGym()} style={{ marginTop: 12 }}>
                {registering ? 'Registering…' : 'Register gym'}
              </button>
              {registered && <p style={{ color: 'var(--ct-neon-dark)', marginTop: 8, fontSize: 13 }}>{registered} registered successfully.</p>}
            </div>
          </Panel>

          <Panel style={{ overflow: 'hidden' }}>
            <div className="ct-panel-body" style={{ paddingBottom: 0 }}>
              <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Registered gyms ({gyms.length})</h3>
            </div>
            {gyms.map((g, i) => (
              <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderTop: i ? '1px solid var(--ct-divider)' : undefined }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{g.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--ct-text-muted)' }}>{g.location} · {g.primaryAdminEmail}</div>
                </div>
                <span style={{
                  padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                  background: g.status === 'active' ? 'var(--ct-accent-soft)' : g.status === 'pending' ? '#fff3cd' : '#fde8e8',
                  color: g.status === 'active' ? 'var(--ct-neon-dark)' : g.status === 'pending' ? '#664d03' : '#9b1c1c',
                }}>{g.status}</span>
              </div>
            ))}
          </Panel>
        </>
      )}

      {tab === 'solo-coaches' && (
        <Panel style={{ overflow: 'hidden' }}>
          {coaches.length === 0 ? (
            <div className="ct-panel-body"><p style={{ color: 'var(--ct-text-muted)', fontSize: 13 }}>No pending solo coach applications</p></div>
          ) : (
            coaches.map((c, i) => (
              <Link key={c.id} to={`/operator/onboarding/solo-coaches/${c.id}`} className="ct-row ct-clients-row" style={{ display: 'flex', padding: '14px 18px', gap: 12, borderTop: i ? '1px solid var(--ct-divider)' : undefined, color: 'inherit', textDecoration: 'none' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--ct-text-muted)' }}>{c.submitted} · {c.specialty}</div>
                </div>
                <span className={`ct-pill ${c.certStatus === 'submitted' ? 'ct-pill-pending' : 'ct-pill-overdue'}`}>{c.certStatus}</span>
              </Link>
            ))
          )}
        </Panel>
      )}
    </div>
  );
}
