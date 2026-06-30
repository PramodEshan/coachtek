import { useEffect, useState } from 'react';
import { clientsService } from '@/services/api';
import type { Client, Program } from '@/services/types';

interface AssignProgramModalProps {
  open: boolean;
  program: Program | null;
  onClose: () => void;
  onAssign: (clientIds: string[]) => Promise<void>;
}

export function AssignProgramModal({ open, program, onClose, onAssign }: AssignProgramModalProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    clientsService.list({ status: 'active' }).then(setClients);
    setSelected(new Set());
  }, [open]);

  if (!open || !program) return null;

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleAssign() {
    setSaving(true);
    try {
      await onAssign([...selected]);
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="ct-modal-backdrop" role="dialog" aria-modal="true">
      <div className="ct-modal ct-modal-md">
        <h2 style={{ fontWeight: 700, marginBottom: 8 }}>Assign program</h2>
        <p style={{ fontSize: 13, color: 'var(--ct-text-muted)', marginBottom: 16 }}>{program.name}</p>
        <div style={{ maxHeight: 280, overflow: 'auto', marginBottom: 16 }}>
          {clients.map((c) => (
            <label key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', cursor: 'pointer' }}>
              <input type="checkbox" checked={selected.has(c.id)} onChange={() => toggle(c.id)} />
              <span>{c.name}</span>
              <span style={{ fontSize: 12, color: 'var(--ct-text-muted)' }}>{c.program}</span>
            </label>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button type="button" className="ct-btn-secondary ct-press" onClick={onClose}>Cancel</button>
          <button type="button" className="ct-btn-primary ct-press" disabled={saving || selected.size === 0} onClick={handleAssign}>
            {saving ? 'Assigning…' : `Assign to ${selected.size} client(s)`}
          </button>
        </div>
      </div>
    </div>
  );
}
