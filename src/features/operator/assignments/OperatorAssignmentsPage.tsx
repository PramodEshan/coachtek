import { useEffect, useState } from 'react';
import { Panel } from '@/components/ui';
import { StatusChip } from '@/components/ui/StatusChip';
import { useRolePageLoading } from '@/context/PageLoadingContext';
import { operatorService } from '@/services/api';
import type { CoachClientAssignment, ReassignReason } from '@/services/types';

const REASSIGN_REASONS: ReassignReason[] = [
  'workload balance',
  'coach unavailability',
  'client issue',
  'other',
];

export function OperatorAssignmentsPage() {
  const [rows, setRows] = useState<CoachClientAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState<ReassignReason>('workload balance');
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [newCoachName, setNewCoachName] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'ended'>('all');

  useRolePageLoading('operator-main', loading);

  useEffect(() => {
    operatorService.assignments().then(setRows).finally(() => setLoading(false));
  }, []);

  const filtered = rows.filter((row) => (filter === 'all' ? true : row.status === filter));

  async function handleReassign(row: CoachClientAssignment) {
    if (!newCoachName.trim()) return;
    await operatorService.reassign(row.id, `coach-alt-${Date.now()}`, newCoachName.trim(), reason);
    const updated = await operatorService.assignments();
    setRows(updated);
    setConfirmId(null);
    setNewCoachName('');
    setSuccessMsg(`${row.clientName} reassigned to ${newCoachName.trim()} — ${reason} (audit logged)`);
    setTimeout(() => setSuccessMsg(null), 3500);
  }

  return (
    <div className="ct-page">
      {successMsg ? <div className="ct-toast ct-toast-success">{successMsg}</div> : null}

      <div className="ct-client-feeling-row" style={{ marginBottom: 14 }}>
        {(['all', 'active', 'ended'] as const).map((value) => (
          <button
            key={value}
            type="button"
            className={`ct-filter-pill ct-press${filter === value ? ' active' : ''}`}
            onClick={() => setFilter(value)}
          >
            {value === 'all' ? 'All' : value.charAt(0).toUpperCase() + value.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p style={{ fontSize: 14, color: 'var(--ct-text-muted)' }}>No assignments match this filter.</p>
      ) : null}

      <Panel style={{ overflow: 'hidden' }}>
        <div className="ct-table-head ct-clients-table-head">
          <span>Coach</span>
          <span>Client</span>
          <span>Assigned</span>
          <span>Status</span>
          <span />
        </div>
        {filtered.map((row) => (
          <div key={row.id} className="ct-row ct-table-row ct-clients-row">
            <span>{row.coachName}</span>
            <span>{row.clientName}</span>
            <span>{row.assignedDate}</span>
            <StatusChip label={row.status} tone={row.status === 'active' ? 'active' : 'archived'} />
            {confirmId === row.id ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 180 }}>
                <input
                  placeholder="New coach name"
                  value={newCoachName}
                  onChange={(e) => setNewCoachName(e.target.value)}
                  style={{ fontSize: 12 }}
                />
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    type="button"
                    className="ct-btn-primary ct-press"
                    style={{ fontSize: 12, padding: '6px 10px' }}
                    onClick={() => void handleReassign(row)}
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    className="ct-btn-secondary ct-press"
                    style={{ fontSize: 12, padding: '6px 10px' }}
                    onClick={() => setConfirmId(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className="ct-btn-secondary ct-press"
                style={{ fontSize: 12, padding: '6px 10px' }}
                onClick={() => setConfirmId(row.id)}
              >
                Reassign
              </button>
            )}
          </div>
        ))}
      </Panel>
      <Panel>
        <div className="ct-panel-body ct-field">
          <label>Reassign reason</label>
          <select value={reason} onChange={(e) => setReason(e.target.value as ReassignReason)}>
            {REASSIGN_REASONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </Panel>
    </div>
  );
}
