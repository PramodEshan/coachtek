import { useState } from 'react';
import type { ArchiveReason } from '@/services/types';

const REASONS: { value: ArchiveReason; label: string }[] = [
  { value: 'left_platform', label: 'Left platform' },
  { value: 'injury', label: 'Injury / health' },
  { value: 'non_payment', label: 'Non-payment' },
  { value: 'completed', label: 'Program completed' },
  { value: 'other', label: 'Other' },
];

interface ArchiveClientDialogProps {
  open: boolean;
  clientName: string;
  onClose: () => void;
  onConfirm: (reason: ArchiveReason) => Promise<void>;
}

export function ArchiveClientDialog({ open, clientName, onClose, onConfirm }: ArchiveClientDialogProps) {
  const [reason, setReason] = useState<ArchiveReason>('other');
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  async function handleConfirm() {
    setSaving(true);
    try {
      await onConfirm(reason);
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="ct-modal-backdrop" role="dialog" aria-modal="true">
      <div className="ct-modal ct-modal-sm">
        <h2 style={{ fontWeight: 700, marginBottom: 8 }}>Archive client</h2>
        <p style={{ fontSize: 14, color: 'var(--ct-text-body)', lineHeight: 1.5, marginBottom: 16 }}>
          Archive <strong>{clientName}</strong>? Training history, payments, and notes are retained.
        </p>
        <div className="ct-field" style={{ marginBottom: 16 }}>
          <label>Reason</label>
          <select value={reason} onChange={(e) => setReason(e.target.value as ArchiveReason)}>
            {REASONS.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button type="button" className="ct-btn-secondary ct-press" onClick={onClose}>Cancel</button>
          <button type="button" className="ct-btn-primary ct-press" disabled={saving} onClick={handleConfirm}>
            {saving ? 'Archiving…' : 'Confirm archive'}
          </button>
        </div>
      </div>
    </div>
  );
}
