import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Panel } from '@/components/ui';
import { StatusChip } from '@/components/ui/StatusChip';
import { feedbackPillClass } from '@/utils/coachUi';
import { useRolePageLoading } from '@/context/PageLoadingContext';
import { operatorService } from '@/services/api';
import type { OperatorComplaint } from '@/services/types';
import { whatsappDeepLink } from '@/utils/whatsapp';

export function OperatorComplaintsPage() {
  const [items, setItems] = useState<OperatorComplaint[]>([]);
  const [loading, setLoading] = useState(true);

  useRolePageLoading('operator-main', loading);

  useEffect(() => {
    operatorService.complaints().then(setItems).finally(() => setLoading(false));
  }, []);

  return (
    <div className="ct-page">
      {items.map((item) => (
        <Panel key={item.id}>
          <Link to={`/operator/complaints/${item.id}`} className="ct-panel-body ct-press" style={{ display: 'block', color: 'inherit' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <div style={{ fontWeight: 700 }}>{item.subject}</div>
                <div style={{ fontSize: 12, color: 'var(--ct-text-muted)', marginTop: 4 }}>{item.submitterName} · {item.type} · {item.date}</div>
              </div>
              <span className={feedbackPillClass(item.status === 'new' ? 'open' : item.status === 'resolved' ? 'resolved' : 'replied')}>{item.status}</span>
            </div>
          </Link>
        </Panel>
      ))}
    </div>
  );
}

export function OperatorComplaintDetailPage() {
  const { complaintId = '' } = useParams();
  const [item, setItem] = useState<OperatorComplaint | undefined>();
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);

  useRolePageLoading('operator-main', loading);

  useEffect(() => {
    operatorService.complaint(complaintId).then(setItem).finally(() => setLoading(false));
  }, [complaintId]);

  if (!item) return null;

  return (
    <div className="ct-page" style={{ maxWidth: 720 }}>
      <Panel>
        <div className="ct-panel-body">
          <h2 style={{ fontWeight: 700 }}>{item.subject}</h2>
          <p style={{ fontSize: 13, color: 'var(--ct-text-muted)', marginTop: 6 }}>
            {item.submitterName} · {item.submitterRole} · {item.date}
          </p>
          <StatusChip
            label={item.status.replace('_', ' ')}
            tone={item.status === 'resolved' ? 'resolved' : item.status === 'new' ? 'pending' : 'neutral'}
          />
          <p style={{ marginTop: 12, lineHeight: 1.5 }}>{item.body}</p>
          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            <a
              href={whatsappDeepLink('+447700900456', `Re: ${item.subject} — `)}
              target="_blank"
              rel="noopener noreferrer"
              className="ct-btn-secondary ct-press"
            >
              Contact via WhatsApp
            </a>
            <a href={`mailto:${item.submitterRole}@demo.local`} className="ct-btn-secondary ct-press">
              Email submitter
            </a>
          </div>
          {item.internalNotes.map((n, i) => (
            <div key={i} style={{ marginTop: 10, padding: 10, background: 'var(--ct-surface-soft)', borderRadius: 8, fontSize: 13 }}>Note: {n}</div>
          ))}
          <div className="ct-field" style={{ marginTop: 16 }}>
            <label>Internal note</label>
            <textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            <button type="button" className="ct-btn-secondary ct-press" onClick={() => void operatorService.updateComplaint(item.id, 'in_review', note).then(() => operatorService.complaint(item.id).then(setItem))}>Mark in review</button>
            <button type="button" className="ct-btn-primary ct-press" onClick={() => void operatorService.updateComplaint(item.id, 'resolved', note).then(() => operatorService.complaint(item.id).then(setItem))}>Resolve</button>
            <button type="button" className="ct-btn-secondary ct-press is-remind" onClick={() => void operatorService.escalateComplaint(item.id, note || 'Escalated to super admin').then(() => operatorService.complaint(item.id).then(setItem))}>Escalate</button>
          </div>
        </div>
      </Panel>
    </div>
  );
}
