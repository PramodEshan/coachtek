import { useEffect, useState } from 'react';
import { clientsService } from '@/services/api';
import type { CalSession, Client } from '@/services/types';

interface SessionFormModalProps {
  open: boolean;
  iso: string;
  session?: CalSession | null;
  onClose: () => void;
  onSave: (iso: string, data: Omit<CalSession, 'id'> & { id?: string }) => Promise<void>;
}

export function SessionFormModal({ open, iso, session, onClose, onSave }: SessionFormModalProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState('');
  const [time, setTime] = useState('09:00');
  const [title, setTitle] = useState('');
  const [mode, setMode] = useState('In person');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    clientsService.list({ status: 'active' }).then((rows) => {
      setClients(rows);
      const initial = session?.clientId ?? rows[0]?.id ?? '';
      setClientId(initial);
      setTime(session?.time ?? '09:00');
      setTitle(session?.title ?? '');
      setMode(session?.mode ?? 'In person');
    });
  }, [open, session]);

  if (!open) return null;

  const selectedClient = clients.find((c) => c.id === clientId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedClient) return;
    setSaving(true);
    try {
      await onSave(iso, {
        id: session?.id,
        time,
        title,
        who: selectedClient.name,
        clientId,
        mode,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="ct-modal-backdrop" role="dialog" aria-modal="true">
      <div className="ct-modal ct-modal-md">
        <form onSubmit={handleSubmit}>
          <h2 style={{ fontWeight: 700, marginBottom: 16 }}>{session ? 'Edit session' : 'New session'}</h2>
          <p style={{ fontSize: 13, color: 'var(--ct-text-muted)', marginBottom: 12 }}>Date: {iso}</p>
          <div className="ct-field" style={{ marginBottom: 12 }}>
            <label>Client</label>
            <select value={clientId} onChange={(e) => setClientId(e.target.value)} required>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="ct-field" style={{ marginBottom: 12 }}>
            <label>Time</label>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
          </div>
          <div className="ct-field" style={{ marginBottom: 12 }}>
            <label>Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Lower body strength" />
          </div>
          <div className="ct-field" style={{ marginBottom: 16 }}>
            <label>Mode</label>
            <select value={mode} onChange={(e) => setMode(e.target.value)}>
              <option>In person</option>
              <option>Video</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" className="ct-btn-secondary ct-press" onClick={onClose}>Cancel</button>
            <button type="submit" className="ct-btn-primary ct-press" disabled={saving}>
              {saving ? 'Saving…' : 'Save session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
