import { useEffect, useState } from 'react';
import { Panel } from '@/components/ui';
import { useRolePageLoading } from '@/context/PageLoadingContext';
import { operatorService } from '@/services/api';
import type { GymOrganization, PendingCoach } from '@/services/types';

export function OperatorGymsRegistryPage() {
  const [gyms, setGyms] = useState<GymOrganization[]>([]);
  const [loading, setLoading] = useState(true);
  const [suspendId, setSuspendId] = useState<string | null>(null);
  const [reason, setReason] = useState('');

  useRolePageLoading('operator-main', loading);

  useEffect(() => {
    operatorService.gymOrgs().then(setGyms).finally(() => setLoading(false));
  }, []);

  const handleSuspend = async (id: string) => {
    if (!reason.trim()) return;
    await operatorService.suspendGym(id, reason);
    setGyms((prev) => prev.map((g) => g.id === id ? { ...g, status: 'suspended' as const } : g));
    setSuspendId(null);
    setReason('');
  };

  const handleReactivate = async (id: string) => {
    await operatorService.reactivateGym(id);
    setGyms((prev) => prev.map((g) => g.id === id ? { ...g, status: 'active' as const } : g));
  };

  return (
    <div className="ct-page" style={{ maxWidth: 860 }}>
      <Panel style={{ overflow: 'hidden' }}>
        <div className="ct-table-head" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 120px', padding: '10px 18px', fontSize: 12, fontWeight: 600 }}>
          <span>Gym</span><span>Location</span><span>Plan</span><span>Status</span><span>Action</span>
        </div>
        {gyms.map((g, i) => (
          <div key={g.id}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 120px', padding: '12px 18px', borderTop: i ? '1px solid var(--ct-divider)' : undefined, fontSize: 13, alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{g.name}</div>
                <div style={{ fontSize: 11, color: 'var(--ct-text-muted)' }}>{g.primaryAdminEmail}</div>
              </div>
              <span>{g.location ?? '—'}</span>
              <span>{g.subscriptionPlan}</span>
              <span style={{
                display: 'inline-block', padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600, width: 'fit-content',
                background: g.status === 'active' ? 'var(--ct-accent-soft)' : g.status === 'suspended' ? '#fff3cd' : g.status === 'pending' ? 'var(--ct-surface-soft)' : '#fde8e8',
                color: g.status === 'active' ? 'var(--ct-neon-dark)' : g.status === 'suspended' ? '#664d03' : g.status === 'pending' ? 'var(--ct-text-muted)' : '#9b1c1c',
              }}>{g.status}</span>
              <div>
                {g.status === 'active' && <button type="button" className="ct-btn-secondary ct-press" style={{ fontSize: 11 }} onClick={() => setSuspendId(g.id)}>Suspend</button>}
                {g.status === 'suspended' && <button type="button" className="ct-btn-secondary ct-press" style={{ fontSize: 11, color: 'var(--ct-neon-dark)' }} onClick={() => void handleReactivate(g.id)}>Reactivate</button>}
              </div>
            </div>
            {suspendId === g.id && (
              <div style={{ padding: '8px 18px 14px', display: 'flex', gap: 8, alignItems: 'center' }}>
                <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Suspension reason" style={{ flex: 1, padding: '6px 10px', borderRadius: 6, border: '1px solid var(--ct-outline-variant)', fontSize: 13 }} />
                <button type="button" className="ct-btn-primary ct-press" style={{ fontSize: 12 }} onClick={() => void handleSuspend(g.id)}>Confirm</button>
                <button type="button" className="ct-btn-secondary ct-press" style={{ fontSize: 12 }} onClick={() => { setSuspendId(null); setReason(''); }}>Cancel</button>
              </div>
            )}
          </div>
        ))}
      </Panel>
    </div>
  );
}

export function OperatorSoloCoachesRegistryPage() {
  const [coaches, setCoaches] = useState<PendingCoach[]>([]);
  const [loading, setLoading] = useState(true);
  const [suspendId, setSuspendId] = useState<string | null>(null);
  const [reason, setReason] = useState('');

  useRolePageLoading('operator-main', loading);

  useEffect(() => {
    operatorService.soloCoachRegistry().then(setCoaches).finally(() => setLoading(false));
  }, []);

  const handleSuspend = async (id: string) => {
    if (!reason.trim()) return;
    await operatorService.suspendSoloCoach(id, reason);
    setCoaches((prev) => prev.map((c) => c.id === id ? { ...c, vettingStatus: 'rejected' as const } : c));
    setSuspendId(null);
    setReason('');
  };

  return (
    <div className="ct-page" style={{ maxWidth: 860 }}>
      <Panel style={{ overflow: 'hidden' }}>
        <div className="ct-table-head" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 120px', padding: '10px 18px', fontSize: 12, fontWeight: 600 }}>
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
                {c.vettingStatus === 'approved' && <button type="button" className="ct-btn-secondary ct-press" style={{ fontSize: 11 }} onClick={() => setSuspendId(c.id)}>Suspend</button>}
              </div>
            </div>
            {suspendId === c.id && (
              <div style={{ padding: '8px 18px 14px', display: 'flex', gap: 8, alignItems: 'center' }}>
                <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Suspension reason" style={{ flex: 1, padding: '6px 10px', borderRadius: 6, border: '1px solid var(--ct-outline-variant)', fontSize: 13 }} />
                <button type="button" className="ct-btn-primary ct-press" style={{ fontSize: 12 }} onClick={() => void handleSuspend(c.id)}>Confirm</button>
                <button type="button" className="ct-btn-secondary ct-press" style={{ fontSize: 12 }} onClick={() => { setSuspendId(null); setReason(''); }}>Cancel</button>
              </div>
            )}
          </div>
        ))}
      </Panel>
    </div>
  );
}
