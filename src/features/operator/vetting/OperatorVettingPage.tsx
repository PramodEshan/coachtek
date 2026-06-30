import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Panel } from '@/components/ui';
import { useRolePageLoading } from '@/context/PageLoadingContext';
import { operatorService } from '@/services/api';
import type { PendingCoach } from '@/services/types';

export function OperatorVettingPage() {
  const [coaches, setCoaches] = useState<PendingCoach[]>([]);
  const [loading, setLoading] = useState(true);

  useRolePageLoading('operator-main', loading);

  useEffect(() => {
    operatorService.pendingCoaches().then(setCoaches).finally(() => setLoading(false));
  }, []);

  return (
    <div className="ct-page">
      <Panel style={{ overflow: 'hidden' }}>
        {coaches.map((c, i) => (
          <Link key={c.id} to={`/operator/vetting/${c.id}`} className={`ct-row ct-clients-row${i ? ' has-border' : ''}`} style={{ display: 'flex', padding: '14px 18px', gap: 12, borderTop: i ? '1px solid var(--ct-divider)' : undefined }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{c.name}</div>
              <div style={{ fontSize: 12, color: 'var(--ct-text-muted)' }}>{c.submitted} · {c.specialty}</div>
            </div>
            <span className={`ct-pill ${c.certStatus === 'submitted' ? 'ct-pill-pending' : 'ct-pill-overdue'}`}>{c.certStatus}</span>
          </Link>
        ))}
      </Panel>
    </div>
  );
}

export function OperatorVettingDetailPage() {
  const { coachId = '' } = useParams();
  const [coach, setCoach] = useState<PendingCoach | undefined>();
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState('');

  useRolePageLoading('operator-main', loading);

  useEffect(() => {
    operatorService.coach(coachId).then(setCoach).finally(() => setLoading(false));
  }, [coachId]);

  if (!coach) return null;

  return (
    <div className="ct-page" style={{ maxWidth: 640 }}>
      <Panel>
        <div className="ct-panel-body">
          <h2 style={{ fontWeight: 700 }}>{coach.name}</h2>
          <p style={{ color: 'var(--ct-text-muted)', marginTop: 4 }}>{coach.email}</p>
          <p style={{ marginTop: 12 }}>Certification: {coach.certStatus}</p>
          <div className="ct-field" style={{ marginTop: 16 }}>
            <label>Reject reason (if rejecting)</label>
            <input value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button type="button" className="ct-btn-primary ct-press" onClick={() => void operatorService.vetCoach(coach.id, 'approved')}>Approve</button>
            <button type="button" className="ct-btn-secondary ct-press" onClick={() => void operatorService.vetCoach(coach.id, 'rejected', reason)}>Reject</button>
          </div>
        </div>
      </Panel>
    </div>
  );
}
